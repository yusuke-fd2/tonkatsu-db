package menu

import (
	"context"
	"errors"
)

var (
	ErrMenuNotFound = errors.New("menu not found")
	ErrShopNotFound = errors.New("shop not found")
)

type Repository interface {
	FindAll(ctx context.Context) ([]Menu, error)
	FindByID(ctx context.Context, id int64) (Menu, error)
	ShopExists(ctx context.Context, id int64) (bool, error)

	Create(ctx context.Context, request MenuRequest) (int64, error)
	Update(ctx context.Context, id int64, request MenuRequest) error
	Delete(ctx context.Context, id int64) error
}
