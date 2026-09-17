import { useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

function MenuForm({ shops, menu, onSaved, onCancel }) {
  const isEdit = !!menu;

  const [form, setForm] = useState({
    shopId: menu?.shop?.id ?? (shops.length > 0 ? shops[0].id : ""),
    name: menu?.name ?? "",
    porkType: menu?.porkType ?? "",
    brandPork: menu?.brandPork ?? "",
    price: menu?.price ?? "",
    description: menu?.description ?? "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEdit
      ? `${API_BASE_URL}/api/menus/${menu.id}`
      : `${API_BASE_URL}/api/menus`;

    const response = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        shopId: Number(form.shopId),
        price: Number(form.price),
      }),
    });

    if (!response.ok) {
      alert(isEdit ? "更新に失敗しました" : "登録に失敗しました");
      return;
    }

    onSaved();
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px",
    marginTop: "4px",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "#fff8ef",
      }}
    >
      <h2>{isEdit ? "メニュー編集" : "メニュー登録"}</h2>

      <div style={{ marginBottom: "12px" }}>
        <label>店舗</label>

        <select
          name="shopId"
          value={form.shopId}
          onChange={handleChange}
          style={inputStyle}
        >
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>メニュー名</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>種類</label>
        <input
          name="porkType"
          value={form.porkType}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>ブランド豚</label>
        <input
          name="brandPork"
          value={form.brandPork}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>価格</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>説明</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <button type="submit">
        {isEdit ? "更新" : "登録"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        style={{ marginLeft: "10px" }}
      >
        キャンセル
      </button>
    </form>
  );
}

export default MenuForm;