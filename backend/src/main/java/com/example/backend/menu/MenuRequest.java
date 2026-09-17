package com.example.backend.menu;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MenuRequest {

    private Long shopId;
    private String name;
    private String porkType;
    private String brandPork;
    private Integer price;
    private String description;
}