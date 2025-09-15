import { rootReducer } from './store';
import { expect } from '@jest/globals';

// Импортируем начальные состояния из ваших слайсов
import { initialState as burgerConstructorInitialState } from './slices/burger-constructor/slice';
import { initialState as feedInitialState } from './slices/feed/slice';
import { initialState as orderInitialState } from './slices/order/slice';
import { initialState as ingredientsInitialState } from './slices/ingredients/slice';
import { initialState as userInitialState } from './slices/user/slice';

describe('rootReducer', () => {
  it('Проверка правильной инициализации', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    // Проверка наличия всех слайсов
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('user');

    // Проверка структуры каждого слайса с конкретными ожиданиями
    expect(state.burgerConstructor).toEqual(burgerConstructorInitialState);
    expect(state.feed).toEqual(feedInitialState);
    expect(state.order).toEqual(orderInitialState);
    expect(state.ingredients).toEqual(ingredientsInitialState);
    expect(state.user).toEqual(userInitialState);
  });

  it('Должен возвращать начальное состояние для неизвестного экшена', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);
    
    // Проверяем, что состояние корректно инициализировано
    expect(state).toEqual({
      burgerConstructor: burgerConstructorInitialState,
      feed: feedInitialState,
      order: orderInitialState,
      ingredients: ingredientsInitialState,
      user: userInitialState,
    });
  });

  it('Не должен изменять состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const unknownAction = { type: 'SOME_RANDOM_ACTION' };
    const newState = rootReducer(initialState, unknownAction);

    expect(newState).toBe(initialState);
    expect(newState).toEqual(initialState);
  });
});