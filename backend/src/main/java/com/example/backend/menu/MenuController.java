package com.example.backend.menu;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public List<MenuResponse> getMenus() {
        return menuService.getMenus();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MenuResponse createMenu(@RequestBody MenuRequest request) {
        return menuService.createMenu(request);
    }

    @PutMapping("/{id}")
    public MenuResponse updateMenu(
            @PathVariable Long id,
            @RequestBody MenuRequest request) {
        return menuService.updateMenu(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
    }
}
