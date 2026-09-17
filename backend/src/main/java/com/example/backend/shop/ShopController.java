package com.example.backend.shop;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopRepository shopRepository;

    @GetMapping
    public List<ShopResponse> getShops() {
        return shopRepository.findAll()
                .stream()
                .map(ShopResponse::new)
                .toList();
    }
}
