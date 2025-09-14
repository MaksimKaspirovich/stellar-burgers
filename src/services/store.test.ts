import { rootReducer } from './store';
import { expect } from '@jest/globals';

describe('rootReducer', () => {
  it('Проверка правильной инициализации', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    //Проверка наличия всех слайсов
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('user');

    //Дополнительные проверки структуры каждого слайса
    expect(state.burgerConstructor).toEqual(expect.any(Object));
    expect(state.feed).toEqual(expect.any(Object));
    expect(state.order).toEqual(expect.any(Object));
    expect(state.ingredients).toEqual(expect.any(Object));
    expect(state.user).toEqual(expect.any(Object));
  });

  it('Должен возвращать начальное состояние для неизвестного экшена', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);
    
    //Проверяем, что состояние корректно инициализировано
    expect(state).toEqual({
      burgerConstructor: expect.any(Object),
      feed: expect.any(Object),
      order: expect.any(Object),
      ingredients: expect.any(Object),
      user: expect.any(Object),
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