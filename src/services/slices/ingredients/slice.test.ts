import reducer, { initialState } from './slice';
import { getIngredientsThunk } from './actions';
import { TIngredient } from '@utils-types';
import { expect } from '@jest/globals';

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
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
    }
  ];

  it('pending', () => {
    const action = { type: getIngredientsThunk.pending.type };
    const state = reducer(initialState, action);

    expect(state.isIngredientsLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  it('rejected', () => {
    const action = {
      type: getIngredientsThunk.rejected.type,
      error: { message: 'Ошибка!' }
    };
    const state = reducer(
      { ...initialState, isIngredientsLoading: true },
      action
    );

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.error).toBe('Ошибка!');
    expect(state.ingredients).toEqual([]);
  });
  it('fulfilled', () => {
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(
      { ...initialState, isIngredientsLoading: true },
      action
    );

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(mockIngredients);
  });
});
