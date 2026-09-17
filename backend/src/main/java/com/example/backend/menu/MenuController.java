package com.example.backend.menu;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.shop.Shop;
import com.example.backend.shop.ShopRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class MenuController {

    private final MenuRepository menuRepository;
    private final ShopRepository shopRepository;

    @GetMapping
    public List<MenuResponse> getMenus() {
        return menuRepository.findAll()
                .stream()
                .map(MenuResponse::new)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MenuResponse createMenu(@RequestBody MenuRequest request) {

        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "店舗が見つかりません"
                        )
                );

        Menu menu = new Menu();
        menu.setShop(shop);
        menu.setName(request.getName());
        menu.setPorkType(request.getPorkType());
        menu.setBrandPork(request.getBrandPork());
        menu.setPrice(request.getPrice());
        menu.setDescription(request.getDescription());

        Menu savedMenu = menuRepository.save(menu);

        return new MenuResponse(savedMenu);
    }

    @PutMapping("/{id}")
    public MenuResponse updateMenu(
            @PathVariable Long id,
            @RequestBody MenuRequest request) {

        Menu menu = menuRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "メニューが見つかりません"
                        )
                );

        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "店舗が見つかりません"
                        )
                );

        menu.setShop(shop);
        menu.setName(request.getName());
        menu.setPorkType(request.getPorkType());
        menu.setBrandPork(request.getBrandPork());
        menu.setPrice(request.getPrice());
        menu.setDescription(request.getDescription());

        Menu savedMenu = menuRepository.save(menu);

        return new MenuResponse(savedMenu);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenu(@PathVariable Long id) {

        if (!menuRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "メニューが見つかりません"
            );
        }

        menuRepository.deleteById(id);
    }
}