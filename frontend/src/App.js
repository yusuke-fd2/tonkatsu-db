import React, { useEffect, useState } from "react";
import MenuList from "./components/MenuList";
import MenuForm from "./components/MenuForm";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

function App() {
  const [menus, setMenus] = useState([]);
  const [shops, setShops] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenus = async () => {
    const response = await fetch(`${API_BASE_URL}/api/menus`);

    if (!response.ok) {
      throw new Error("メニューの取得に失敗しました");
    }

    const data = await response.json();
    setMenus(data);
  };

  const fetchShops = async () => {
    const response = await fetch(`${API_BASE_URL}/api/shops`);

    if (!response.ok) {
      throw new Error("店舗の取得に失敗しました");
    }

    const data = await response.json();
    setShops(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([
          fetchMenus(),
          fetchShops(),
        ]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleCreate = () => {
    setEditingMenu(null);
    setShowForm(true);
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSaved = async () => {
    await fetchMenus();

    setShowForm(false);
    setEditingMenu(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMenu(null);
  };

  const handleDelete = async (menu) => {
    const confirmed = window.confirm(
      `「${menu.name}」を削除しますか？`
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/menus/${menu.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      alert("削除に失敗しました");
      return;
    }

    await fetchMenus();
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>とんかつデータベース</h1>

      {!showForm && (
        <button
          onClick={handleCreate}
          style={{
            marginBottom: "20px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          ＋ メニューを登録
        </button>
      )}

      {showForm && (
        <MenuForm
          key={editingMenu?.id ?? "new"}
          shops={shops}
          menu={editingMenu}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
      )}

      <MenuList
        menus={menus}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;