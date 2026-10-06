package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/yusuke-fd2/tonkatsu-db/backend-go/internal/menu"
)

func main() {
	ctx := context.Background()

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(ctx); err != nil {
		log.Fatal(err)
	}

	menuRepository := menu.NewPostgresRepository(db)
	menuService := menu.NewService(menuRepository)
	menuHandler := menu.NewHandler(menuService)

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	r.GET("/api/shops", func(c *gin.Context) {
		rows, err := db.Query(c.Request.Context(), `
			SELECT id, name
			FROM shops
			ORDER BY id
		`)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "店舗の取得に失敗しました",
			})
			return
		}
		defer rows.Close()

		type Shop struct {
			ID   int64  `json:"id"`
			Name string `json:"name"`
		}

		shops := make([]Shop, 0)

		for rows.Next() {
			var shop Shop

			if err := rows.Scan(&shop.ID, &shop.Name); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "店舗の取得に失敗しました",
				})
				return
			}

			shops = append(shops, shop)
		}

		c.JSON(http.StatusOK, shops)
	})

	menuHandler.RegisterRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
