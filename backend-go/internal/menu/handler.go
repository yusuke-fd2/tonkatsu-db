package menu

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) RegisterRoutes(r *gin.Engine) {
	group := r.Group("/api/menus")

	group.GET("", h.GetMenus)
	group.POST("", h.CreateMenu)
	group.PUT("/:id", h.UpdateMenu)
	group.DELETE("/:id", h.DeleteMenu)
}

func (h *Handler) GetMenus(c *gin.Context) {
	menus, err := h.service.GetMenus(c.Request.Context())
	if err != nil {
		handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, menus)
}

func (h *Handler) CreateMenu(c *gin.Context) {
	var request MenuRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "リクエストが不正です",
		})
		return
	}

	menu, err := h.service.CreateMenu(
		c.Request.Context(),
		request,
	)

	if err != nil {
		handleError(c, err)
		return
	}

	c.JSON(http.StatusCreated, menu)
}

func (h *Handler) UpdateMenu(c *gin.Context) {
	id, err := parseID(c)
	if err != nil {
		return
	}

	var request MenuRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "リクエストが不正です",
		})
		return
	}

	menu, err := h.service.UpdateMenu(
		c.Request.Context(),
		id,
		request,
	)

	if err != nil {
		handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, menu)
}

func (h *Handler) DeleteMenu(c *gin.Context) {
	id, err := parseID(c)
	if err != nil {
		return
	}

	err = h.service.DeleteMenu(
		c.Request.Context(),
		id,
	)

	if err != nil {
		handleError(c, err)
		return
	}

	c.Status(http.StatusNoContent)
}

func parseID(c *gin.Context) (int64, error) {
	id, err := strconv.ParseInt(
		c.Param("id"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "IDが不正です",
		})
	}

	return id, err
}

func handleError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, ErrMenuNotFound):
		c.JSON(http.StatusNotFound, gin.H{
			"error": "メニューが見つかりません",
		})

	case errors.Is(err, ErrShopNotFound):
		c.JSON(http.StatusNotFound, gin.H{
			"error": "店舗が見つかりません",
		})

	default:
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "内部エラーが発生しました",
		})
	}
}
