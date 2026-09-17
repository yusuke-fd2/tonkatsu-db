# Tonkatsu DB

とんかつ店とメニューを管理するWebアプリケーションです。

## Features

- 店舗ごとのメニュー一覧表示
- メニュー登録
- メニュー編集
- メニュー削除
- 店舗ごとの開閉表示

## Tech Stack

### Frontend

- React
- JavaScript

### Backend

- Java 17
- Spring Boot
- Spring Data JPA
- Lombok

### Database

- PostgreSQL
- Amazon RDS

## Architecture

React  
↓ REST API  
Spring Boot  
↓ JPA  
Amazon RDS for PostgreSQL

## API

- GET /api/shops
- GET /api/menus
- POST /api/menus
- PUT /api/menus/{id}
- DELETE /api/menus/{id}