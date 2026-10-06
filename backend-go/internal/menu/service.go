package menu

import "context"

type Service struct {
	repository Repository
}

func NewService(repository Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) GetMenus(
	ctx context.Context,
) ([]MenuResponse, error) {

	menus, err := s.repository.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	responses := make([]MenuResponse, 0, len(menus))

	for _, menu := range menus {
		responses = append(responses, NewMenuResponse(menu))
	}

	return responses, nil
}

func (s *Service) CreateMenu(
	ctx context.Context,
	request MenuRequest,
) (MenuResponse, error) {

	exists, err := s.repository.ShopExists(ctx, request.ShopID)
	if err != nil {
		return MenuResponse{}, err
	}

	if !exists {
		return MenuResponse{}, ErrShopNotFound
	}

	id, err := s.repository.Create(ctx, request)
	if err != nil {
		return MenuResponse{}, err
	}

	menu, err := s.repository.FindByID(ctx, id)
	if err != nil {
		return MenuResponse{}, err
	}

	return NewMenuResponse(menu), nil
}

func (s *Service) UpdateMenu(
	ctx context.Context,
	id int64,
	request MenuRequest,
) (MenuResponse, error) {

	_, err := s.repository.FindByID(ctx, id)
	if err != nil {
		return MenuResponse{}, err
	}

	exists, err := s.repository.ShopExists(ctx, request.ShopID)
	if err != nil {
		return MenuResponse{}, err
	}

	if !exists {
		return MenuResponse{}, ErrShopNotFound
	}

	if err := s.repository.Update(ctx, id, request); err != nil {
		return MenuResponse{}, err
	}

	menu, err := s.repository.FindByID(ctx, id)
	if err != nil {
		return MenuResponse{}, err
	}

	return NewMenuResponse(menu), nil
}

func (s *Service) DeleteMenu(
	ctx context.Context,
	id int64,
) error {

	_, err := s.repository.FindByID(ctx, id)
	if err != nil {
		return err
	}

	return s.repository.Delete(ctx, id)
}
