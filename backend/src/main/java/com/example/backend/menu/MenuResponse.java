package com.example.backend.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
public class MenuResponse {

    private Long id;
    private String name;
    private String porkType;
    private String brandPork;
    private Integer price;
    private String description;
    private ShopResponse shop;

    public MenuResponse(Menu menu) {
        this.id = menu.getId();
        this.name = menu.getName();
        this.porkType = menu.getPorkType();
        this.brandPork = menu.getBrandPork();
        this.price = menu.getPrice();
        this.description = menu.getDescription();

        this.shop = new ShopResponse(
                menu.getShop().getId(),
                menu.getShop().getName()
        );
    }

    @Getter
    @AllArgsConstructor
    public static class ShopResponse {
        private Long id;
        private String name;
    }
}