import { useCallback, useEffect, useState } from "react";
import { deleteMenu, getMenus, getShops } from "../api/menuApi";

const useMenuData = () => {
  const [menus, setMenus] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshMenus = useCallback(async () => {
    const data = await getMenus();
    setMenus(data);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [menuData, shopData] = await Promise.all([
          getMenus(),
          getShops(),
        ]);

        setMenus(menuData);
        setShops(shopData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const removeMenu = async (id) => {
    await deleteMenu(id);
    await refreshMenus();
  };

  return { menus, shops, loading, error, refreshMenus, removeMenu };
};

export default useMenuData;
