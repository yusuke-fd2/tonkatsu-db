package menu

import "time"

type Menu struct {
	ID          int64
	ShopID      int64
	ShopName    string
	Name        string
	PorkType    *string
	BrandPork   *string
	Price       *int
	Description *string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type MenuResponse struct {
	ID          int64        `json:"id"`
	Name        string       `json:"name"`
	PorkType    *string      `json:"porkType"`
	BrandPork   *string      `json:"brandPork"`
	Price       *int         `json:"price"`
	Description *string      `json:"description"`
	Shop        ShopResponse `json:"shop"`
}

type ShopResponse struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

func NewMenuResponse(menu Menu) MenuResponse {
	return MenuResponse{
		ID:          menu.ID,
		Name:        menu.Name,
		PorkType:    menu.PorkType,
		BrandPork:   menu.BrandPork,
		Price:       menu.Price,
		Description: menu.Description,
		Shop: ShopResponse{
			ID:   menu.ShopID,
			Name: menu.ShopName,
		},
	}
}

type MenuRequest struct {
	ShopID      int64   `json:"shopId"`
	Name        string  `json:"name"`
	PorkType    *string `json:"porkType"`
	BrandPork   *string `json:"brandPork"`
	Price       *int    `json:"price"`
	Description *string `json:"description"`
}
