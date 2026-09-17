import React, { useState } from "react";
import MenuList from "./components/MenuList";
import MenuForm from "./components/MenuForm";
import useMenuData from "./hooks/useMenuData";

function App() {
  const { menus, shops, loading, error, refreshMenus, removeMenu } =
    useMenuData();
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

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
    await refreshMenus();

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

    try {
      await removeMenu(menu.id);
    } catch (e) {
      alert(e.message);
    }
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
