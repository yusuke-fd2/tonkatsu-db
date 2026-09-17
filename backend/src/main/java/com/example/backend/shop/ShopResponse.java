package com.example.backend.shop;

import lombok.Getter;

@Getter
public class ShopResponse {

    private Long id;
    private String name;
    private String prefecture;
    private String city;
    private String address;
    private String url;

    public ShopResponse(Shop shop) {
        this.id = shop.getId();
        this.name = shop.getName();
        this.prefecture = shop.getPrefecture();
        this.city = shop.getCity();
        this.address = shop.getAddress();
        this.url = shop.getUrl();
    }
}