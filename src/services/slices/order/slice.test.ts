import exp from 'constants';
import { orderBurgerThunk } from './actions';
import reducer, {
  initialState,
  clearOrder,
  clearPendingOrderData,
  setPendingOrderData
} from './slice';
import { expect } from '@jest/globals';

describe('orderSlice', () => {
  const mockOrder = {
    _id: '1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'done',
    name: 'Test Order',
    createdAt: '2025-01-09T00:00:00.000Z',
    updatedAt: '2025-01-09T00:00:00.000Z'
  };

  

  describe('orderBurgerThunk', () => {
    it('pending', () => {
      const action = { type: orderBurgerThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.isOrderLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.order).toBeNull();
    });

    it('rejected', () => {
      const action = {
        type: orderBurgerThunk.rejected.type,
        error: { message: 'Ошибка!' }
      };
      const state = reducer({...initialState, isOrderLoading: true}, action);

      expect(state.isOrderLoading).toBe(false);
      expect(state.error).toBe('Ошибка!');
      expect(state.order).toBeNull();
    });

    it('fulfilled', () => {
      const action = {
        type: orderBurgerThunk.fulfilled.type,
        payload: {order: mockOrder},
      };
      const state = reducer({...initialState, isOrderLoading: true}, action);

      expect(state.isOrderLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.order).toEqual(mockOrder);
      expect(state.pendingOrderData).toBeNull();
    });
  });
});
