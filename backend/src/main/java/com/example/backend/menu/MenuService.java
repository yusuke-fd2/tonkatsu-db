package com.example.backend.menu;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.shop.Shop;
import com.example.backend.shop.ShopRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuService {

    private final MenuRepository menuRepository;
    private final ShopRepository shopRepository;

    @Transactional(readOnly = true)
    public List<MenuResponse> getMenus() {
        return menuRepository.findAll()
                .stream()
                .map(MenuResponse::new)
                .toList();
    }

    public MenuResponse createMenu(MenuRequest request) {
        Menu menu = new Menu();
        updateMenuFields(menu, request);

        return new MenuResponse(menuRepository.save(menu));
    }

    public MenuResponse updateMenu(Long id, MenuRequest request) {
        Menu menu = findMenu(id);
        updateMenuFields(menu, request);

        return new MenuResponse(menuRepository.save(menu));
    }

    public void deleteMenu(Long id) {
        Menu menu = findMenu(id);
        menuRepository.delete(menu);
    }

    private Menu findMenu(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "メニューが見つかりません"
                ));
    }

    private Shop findShop(Long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "店舗が見つかりません"
                ));
    }

    private void updateMenuFields(Menu menu, MenuRequest request) {
        menu.setShop(findShop(request.getShopId()));
        menu.setName(request.getName());
        menu.setPorkType(request.getPorkType());
        menu.setBrandPork(request.getBrandPork());
        menu.setPrice(request.getPrice());
        menu.setDescription(request.getDescription());
    }
}
