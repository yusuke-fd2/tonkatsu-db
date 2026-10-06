package menu

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRepository struct {
	db *pgxpool.Pool
}

func NewPostgresRepository(db *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{
		db: db,
	}
}

func (r *PostgresRepository) FindAll(ctx context.Context) ([]Menu, error) {
	rows, err := r.db.Query(ctx, `
		SELECT
			m.id,
			m.shop_id,
			s.name,
			m.name,
			m.pork_type,
			m.brand_pork,
			m.price,
			m.description,
			m.created_at,
			m.updated_at
		FROM menus m
		JOIN shops s ON s.id = m.shop_id
		ORDER BY m.id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	menus := make([]Menu, 0)

	for rows.Next() {
		var m Menu

		err := rows.Scan(
			&m.ID,
			&m.ShopID,
			&m.ShopName,
			&m.Name,
			&m.PorkType,
			&m.BrandPork,
			&m.Price,
			&m.Description,
			&m.CreatedAt,
			&m.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		menus = append(menus, m)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return menus, nil
}

func (r *PostgresRepository) FindByID(
	ctx context.Context,
	id int64,
) (Menu, error) {

	var m Menu

	err := r.db.QueryRow(ctx, `
		SELECT
			m.id,
			m.shop_id,
			s.name,
			m.name,
			m.pork_type,
			m.brand_pork,
			m.price,
			m.description,
			m.created_at,
			m.updated_at
		FROM menus m
		JOIN shops s ON s.id = m.shop_id
		WHERE m.id = $1
	`, id).Scan(
		&m.ID,
		&m.ShopID,
		&m.ShopName,
		&m.Name,
		&m.PorkType,
		&m.BrandPork,
		&m.Price,
		&m.Description,
		&m.CreatedAt,
		&m.UpdatedAt,
	)

	if errors.Is(err, pgx.ErrNoRows) {
		return Menu{}, ErrMenuNotFound
	}

	if err != nil {
		return Menu{}, err
	}

	return m, nil
}

func (r *PostgresRepository) ShopExists(
	ctx context.Context,
	id int64,
) (bool, error) {

	var exists bool

	err := r.db.QueryRow(
		ctx,
		`SELECT EXISTS (
			SELECT 1
			FROM shops
			WHERE id = $1
		)`,
		id,
	).Scan(&exists)

	return exists, err
}

func (r *PostgresRepository) Create(
	ctx context.Context,
	request MenuRequest,
) (int64, error) {

	var id int64

	err := r.db.QueryRow(ctx, `
		INSERT INTO menus (
			shop_id,
			name,
			pork_type,
			brand_pork,
			price,
			description
		)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`,
		request.ShopID,
		request.Name,
		request.PorkType,
		request.BrandPork,
		request.Price,
		request.Description,
	).Scan(&id)

	return id, err
}

func (r *PostgresRepository) Update(
	ctx context.Context,
	id int64,
	request MenuRequest,
) error {

	_, err := r.db.Exec(ctx, `
		UPDATE menus
		SET
			shop_id = $2,
			name = $3,
			pork_type = $4,
			brand_pork = $5,
			price = $6,
			description = $7,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`,
		id,
		request.ShopID,
		request.Name,
		request.PorkType,
		request.BrandPork,
		request.Price,
		request.Description,
	)

	return err
}

func (r *PostgresRepository) Delete(
	ctx context.Context,
	id int64,
) error {

	_, err := r.db.Exec(
		ctx,
		`DELETE FROM menus WHERE id = $1`,
		id,
	)

	return err
}
