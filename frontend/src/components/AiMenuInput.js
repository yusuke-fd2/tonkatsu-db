import { useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

function AiMenuInput({ shops, onSaved }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleParse = async () => {
    if (!text.trim()) {
      setError("登録内容を入力してください。");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/parse-menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      if (!response.ok) {
        throw new Error("AI解析に失敗しました。");
      }

      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!result) {
      return;
    }

    const shop = shops.find(
      (shop) => shop.name === result.shopName
    );

    if (!shop) {
      setError(
        `店舗「${result.shopName}」がデータベースに存在しません。`
      );
      return;
    }

    setRegistering(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/menus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId: shop.id,
          name: result.name,
          porkType: result.porkType || "",
          brandPork: result.brandPork || "",
          price: result.price,
          description: result.description || "",
        }),
      });

      if (!response.ok) {
        throw new Error("メニューの登録に失敗しました。");
      }

      setText("");
      setResult(null);

      if (onSaved) {
        await onSaved();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "24px",
      }}
    >
      <h2>AIでメニュー登録</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="例：とんかつ野崎にカツカレー2000円を追加して"
        rows={4}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={handleParse}
        disabled={loading}
        style={{
          padding: "8px 16px",
          cursor: loading ? "default" : "pointer",
        }}
      >
        {loading ? "解析中..." : "AIで解析"}
      </button>

      {error && (
        <div
          style={{
            color: "red",
            marginTop: "12px",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: "#f7f7f7",
            borderRadius: "8px",
          }}
        >
          <h3>解析結果</h3>

          <p>店舗：{result.shopName}</p>
          <p>メニュー：{result.name}</p>
          <p>部位：{result.porkType}</p>
          <p>銘柄豚：{result.brandPork}</p>
          <p>価格：{result.price?.toLocaleString()}円</p>
          <p>説明：{result.description}</p>

          <button
            onClick={handleRegister}
            disabled={registering}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              cursor: registering ? "default" : "pointer",
            }}
          >
            {registering ? "登録中..." : "この内容で登録"}
          </button>
        </div>
      )}
    </div>
  );
}

export default AiMenuInput;