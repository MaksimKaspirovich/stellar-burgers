import { expect } from '@jest/globals';
import reducer, { initialState } from './slice';
import { TOrder } from '@utils-types';
import { getFeedsThunk, getOrderByNumberThunk } from './actions';

// Моки для API функций, которые используются в thunk'ах
jest.mock('@api', () => ({
  getFeedsApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'done',
    name: 'Test Orders',
    createdAt: '2025-01-09T00:00:00.000Z',
    updatedAt: '2025-01-09T00:00:00.000Z',
    number: 1
  }
];

describe('getFeedsThunk', () => {
  it('pending', () => {
    const action = { type: getFeedsThunk.pending.type };
    const state = reducer(initialState, action);

    expect(state.isFeedsLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('rejected', () => {
    const action = {
      type: getFeedsThunk.rejected.type,
      error: { message: 'Ошибка!' }
    };
    const state = reducer({ ...initialState, isFeedsLoading: true }, action);

    expect(state.isFeedsLoading).toBe(false);
    expect(state.error).toBe('Ошибка!');
    expect(state.orders).toEqual([]);
  });

  it('fulfilled', () => {
    const action = {
      type: getFeedsThunk.fulfilled.type,
      payload: { orders: mockOrders, total: 10, totalToday: 2 }
    };
    const state = reducer({ ...initialState, isFeedsLoading: true }, action);

    expect(state.isFeedsLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(2);
  });
});

describe('getOrderByNumberThunk', () => {
  it('pending', () => {
    const action = { type: getOrderByNumberThunk.pending.type };
    const state = reducer(initialState, action);

    expect(state.isOrderLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('rejected', () => {
    const action = {
      type: getOrderByNumberThunk.rejected.type,
      error: { message: 'Неизвестная ошибка' }
    };
    const state = reducer({ ...initialState, isOrderLoading: true }, action);

    expect(state.isOrderLoading).toBe(false);
    expect(state.error).toBe('Неизвестная ошибка');
    expect(state.order).toBe(null);
  });

  it('fulfilled', () => {
    const action = {
      type: getOrderByNumberThunk.fulfilled.type,
      payload: { orders: mockOrders }
    };
    const state = reducer({ ...initialState, isOrderLoading: true }, action);

    expect(state.isOrderLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.order).toEqual(mockOrders[0]);
  });
});
