import { TIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';
import reducer, {
  addIngredient,
  removeIngredient,
  clearBurgerConstructor,
  upIngredients,
  downIngredients
} from './slice';
import { expect } from '@jest/globals';

// Частичный мок - мокаем только nanoid
jest.mock('@reduxjs/toolkit', () => {
  const originalModule = jest.requireActual('@reduxjs/toolkit');

  return {
    ...originalModule,
    nanoid: jest.fn()
  };
});

// Тип для ингредиента с id (который добавляется в конструкторе)
type TIngredientWithId = TIngredient & { id: string };

describe('burgerConstructorSlice', () => {
  const mockIngredient: TIngredient = {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 1,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  beforeEach(() => {
    (nanoid as jest.Mock).mockReturnValue('test-id');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Добавление ингредиента', () => {
    const state = reducer(undefined, addIngredient(mockIngredient));

    expect(state.burgerConstructor.ingredients.length).toBe(1);
    expect(state.burgerConstructor.ingredients[0].id).toBe('test-id');
  });

  it('Добавление булки', () => {
    const bunIngredient: TIngredient = {
      ...mockIngredient,
      type: 'bun',
      name: 'Булка'
    };

    const state = reducer(undefined, addIngredient(bunIngredient));

    expect(state.burgerConstructor.bun).not.toBeNull();
    expect(state.burgerConstructor.bun?.id).toBe('test-id');
    expect(state.burgerConstructor.bun?.name).toBe('Булка');
    expect(state.burgerConstructor.ingredients.length).toBe(0); // Булки не должны попадать в ingredients
  });

  it('Удаление ингредиента', () => {
    const startState = reducer(undefined, addIngredient(mockIngredient));
    const onDelete = startState.burgerConstructor.ingredients[0];
    const state = reducer(startState, removeIngredient(onDelete));

    expect(state.burgerConstructor.ingredients.length).toBe(0);
  });

  it('Не должен удаляться ингредиент, если отсутствует id', () => {
    let state = reducer(undefined, addIngredient(mockIngredient));
    const initialIngredientCount = state.burgerConstructor.ingredients.length;

    // Создаем объект без id, используя тип утверждения для теста
    const ingredientWithoutId = {
      ...mockIngredient,
      id: undefined
    } as unknown as TIngredientWithId;
    
    state = reducer(state, removeIngredient(ingredientWithoutId));

    expect(state.burgerConstructor.ingredients.length).toBe(
      initialIngredientCount
    );
  });

  it('Перемещение ингредиента вверх', () => {
    let state = reducer(undefined, addIngredient(mockIngredient));
    (nanoid as jest.Mock)
      .mockReturnValueOnce('id-1')
      .mockReturnValueOnce('id-2');
    state = reducer(state, addIngredient(mockIngredient));
    const before = [...state.burgerConstructor.ingredients];
    state = reducer(state, upIngredients(1));

    expect(state.burgerConstructor.ingredients[0].id).toBe(before[1].id);
    expect(state.burgerConstructor.ingredients[1].id).toBe(before[0].id);
  });

  it('Перемещение ингредиента вниз', () => {
    let state = reducer(undefined, addIngredient(mockIngredient));
    (nanoid as jest.Mock)
      .mockReturnValueOnce('id-1')
      .mockReturnValueOnce('id-2');
    state = reducer(state, addIngredient(mockIngredient));
    const before = [...state.burgerConstructor.ingredients];
    state = reducer(state, downIngredients(0));

    expect(state.burgerConstructor.ingredients[1].id).toBe(before[0].id);
    expect(state.burgerConstructor.ingredients[0].id).toBe(before[1].id);
  });

  it('Очистка конструктора', () => {
    (nanoid as jest.Mock)
      .mockReturnValueOnce('id-1')
      .mockReturnValueOnce('id-2');

    let state = reducer(undefined, addIngredient(mockIngredient));
    state = reducer(state, clearBurgerConstructor());

    expect(state.burgerConstructor.ingredients.length).toBe(0);
    expect(state.burgerConstructor.bun).toBeNull();
  });
});