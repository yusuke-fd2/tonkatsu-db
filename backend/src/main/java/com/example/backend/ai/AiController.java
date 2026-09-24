package com.example.backend.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://main.d7cgaeiwb3kth.amplifyapp.com"
})
public class AiController {

    private final JsonMapper objectMapper;

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    private final RestClient restClient = RestClient.create();

    @PostMapping("/parse-menu")
    public AiMenuResponse parseMenu(@RequestBody AiMenuRequest request) throws Exception {

        Map<String, Object> schema = Map.of(
                "type", "object",
                "properties", Map.of(
                        "shopName", Map.of("type", "string"),
                        "name", Map.of("type", "string"),
                        "porkType", Map.of("type", "string"),
                        "brandPork", Map.of("type", "string"),
                        "price", Map.of("type", "integer"),
                        "description", Map.of("type", "string")
                ),
                "required", new String[]{
                        "shopName",
                        "name",
                        "porkType",
                        "brandPork",
                        "price",
                        "description"
                }
        );

        String prompt = """
                次の文章から、とんかつメニュー登録用の情報を抽出してください。

                入力:
                %s

                不明な文字列項目は空文字、
                不明な価格は0にしてください。
                """.formatted(request.getText());

        Map<String, Object> body = Map.of(
                "model", "gemini-3.5-flash",
                "input", prompt,
                "response_format", Map.of(
                        "type", "text",
                        "mime_type", "application/json",
                        "schema", schema
                )
        );

        JsonNode response = restClient.post()
                .uri("https://generativelanguage.googleapis.com/v1beta/interactions")
                .header("x-goog-api-key", geminiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);

        JsonNode steps = response.path("steps");

        for (JsonNode step : steps) {
            if ("model_output".equals(step.path("type").asText())) {
                for (JsonNode content : step.path("content")) {
                    if ("text".equals(content.path("type").asText())) {
                        return objectMapper.readValue(
                                content.path("text").asText(),
                                AiMenuResponse.class
                        );
                    }
                }
            }
        }

        throw new IllegalStateException("GeminiからJSON応答を取得できませんでした");
    }
}