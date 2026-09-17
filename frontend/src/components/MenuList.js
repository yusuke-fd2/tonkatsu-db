import { useState } from "react";

function MenuList({ menus, onEdit, onDelete }) {
  const [openShops, setOpenShops] = useState({});

  const groupedMenus = menus.reduce((groups, menu) => {
    const shopId = menu.shop.id;

    if (!groups[shopId]) {
      groups[shopId] = {
        shop: menu.shop,
        menus: [],
      };
    }

    groups[shopId].menus.push(menu);

    return groups;
  }, {});

  const toggleShop = (shopId) => {
    setOpenShops((prev) => ({
      ...prev,
      [shopId]: !prev[shopId],
    }));
  };

  return (
    <div>
      {Object.values(groupedMenus).map(({ shop, menus }) => {
        const isOpen = openShops[shop.id];

        return (
          <div
            key={shop.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "20px",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => toggleShop(shop.id)}
              style={{
                padding: "20px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f5d7b2",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#5a3518",
                }}
              >
                {shop.name}
              </h2>

              <span
                style={{
                  color: "#5a3518",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {isOpen ? "▲" : "▼"}
              </span>
            </div>

            {isOpen && (
              <div
                style={{
                  padding: "0 20px 20px",
                  backgroundColor: "#fff",
                }}
              >
                {menus.map((menu) => (
                  <div
                    key={menu.id}
                    style={{
                      borderTop: "1px solid #ddd",
                      padding: "15px 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3>{menu.name}</h3>

                      <div>
                        <button
                          onClick={() => onEdit(menu)}
                          style={{ marginRight: "8px" }}
                        >
                          編集
                        </button>

                        <button
                          onClick={() => onDelete(menu)}
                        >
                          削除
                        </button>
                      </div>
                    </div>

                    <div>種類：{menu.porkType}</div>
                    <div>
                      ブランド豚：{menu.brandPork ?? "-"}
                    </div>
                    <div>
                      価格：{menu.price.toLocaleString()}円
                    </div>

                    <div style={{ marginTop: "8px" }}>
                      {menu.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MenuList;