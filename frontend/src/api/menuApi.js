import { API_URLS } from "../config/api";

const request = async (url, options, errorMessage) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response;
};

export const getMenus = async () => {
  const response = await request(
    API_URLS.menus,
    undefined,
    "メニューの取得に失敗しました"
  );

  return response.json();
};

export const getShops = async () => {
  const response = await request(
    API_URLS.shops,
    undefined,
    "店舗の取得に失敗しました"
  );

  return response.json();
};

export const saveMenu = (menu, form) =>
  request(
    menu ? API_URLS.menu(menu.id) : API_URLS.menus,
    {
      method: menu ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        shopId: Number(form.shopId),
        price: Number(form.price),
      }),
    },
    menu ? "更新に失敗しました" : "登録に失敗しました"
  );

export const deleteMenu = (id) =>
  request(
    API_URLS.menu(id),
    { method: "DELETE" },
    "削除に失敗しました"
  );
