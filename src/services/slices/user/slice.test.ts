import {
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  getUserThunk,
  updateUserThunk,
  getOrdersThunk
} from './actions';
import reducer, { initialState, clearErrors } from './slice';
import { expect } from '@jest/globals';

describe('userSlice', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com'
  };

  const mockOrders = [
    {
      _id: '1',
      ingredients: ['ingredient1', 'ingredient2'],
      status: 'done',
      name: 'Test Order 1',
      createdAt: '2025-01-09T00:00:00.000Z',
      updatedAt: '2025-01-09T00:00:00.000Z',
      number: 1
    },
    {
      _id: '2',
      ingredients: ['ingredient3', 'ingredient4'],
      status: 'pending',
      name: 'Test Order 2',
      createdAt: '2025-01-10T00:00:00.000Z',
      updatedAt: '2025-01-10T00:00:00.000Z',
      number: 2
    }
  ];

  // Тесты для синхронных actions
  describe('sync actions', () => {
    it('should handle clearErrors', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error message'
      };

      const state = reducer(stateWithError, clearErrors());

      expect(state.error).toBeNull();
    });
  });

  // Тесты для loginUserThunk
  describe('loginUserThunk', () => {
    it('pending', () => {
      const action = { type: loginUserThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.loginUserRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('rejected', () => {
      const action = {
        type: loginUserThunk.rejected.type,
        error: { message: 'Ошибка авторизации' }
      };
      const state = reducer(
        { ...initialState, loginUserRequest: true },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
      expect(state.user).toBeNull();
    });

    it('fulfilled', () => {
      const action = {
        type: loginUserThunk.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(
        { ...initialState, loginUserRequest: true },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(mockUser);
    });
  });

  // Тесты для logoutUserThunk
  describe('logoutUserThunk', () => {
    it('pending', () => {
      const action = { type: logoutUserThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.loginUserRequest).toBe(true);
    });

    it('rejected', () => {
      const action = {
        type: logoutUserThunk.rejected.type,
        error: { message: 'Ошибка выхода' }
      };
      const state = reducer(
        {
          ...initialState,
          loginUserRequest: true,
          user: mockUser,
          orders: mockOrders
        },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe('Ошибка выхода');
      expect(state.user).toEqual(mockUser);
      expect(state.orders).toEqual(mockOrders);
    });

    it('fulfilled', () => {
      const action = {
        type: logoutUserThunk.fulfilled.type
      };
      const state = reducer(
        {
          ...initialState,
          loginUserRequest: true,
          user: mockUser,
          orders: mockOrders
        },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.user).toBeNull();
      expect(state.orders).toEqual([]);
    });
  });

  // Тесты для registerUserThunk
  describe('registerUserThunk', () => {
    it('pending', () => {
      const action = { type: registerUserThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.loginUserRequest).toBe(true);
    });

    it('rejected', () => {
      const action = {
        type: registerUserThunk.rejected.type,
        error: { message: 'Ошибка авторизации' }
      };
      const state = reducer(
        { ...initialState, loginUserRequest: true },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
      expect(state.user).toBeNull();
    });

    it('rejected with default error message', () => {
      const action = {
        type: registerUserThunk.rejected.type,
        error: {}
      };
      const state = reducer(
        { ...initialState, loginUserRequest: true },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
    });

    it('fulfilled', () => {
      const action = {
        type: registerUserThunk.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(
        { ...initialState, loginUserRequest: true },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.user).toEqual(mockUser);
    });
  });

  // Тесты для getUserThunk
  describe('getUserThunk', () => {
    it('pending', () => {
      const action = { type: getUserThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.loginUserRequest).toBe(true);
    });

    it('rejected', () => {
      const action = {
        type: getUserThunk.rejected.type,
        error: { message: 'Ошибка получения данных пользователя' }
      };
      const state = reducer(
        {
          ...initialState,
          loginUserRequest: true,
          user: mockUser
        },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe('Ошибка получения данных пользователя');
      expect(state.user).toBeNull();
    });

    it('fulfilled', () => {
      const action = {
        type: getUserThunk.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = reducer(
        { ...initialState, loginUserRequest: true },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.user).toEqual(mockUser);
    });
  });

  // Тесты для updateUserThunk
  describe('updateUserThunk', () => {
    it('pending', () => {
      const action = { type: updateUserThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.loginUserRequest).toBe(true);
    });

    it('rejected', () => {
      const action = {
        type: updateUserThunk.rejected.type,
        error: { message: 'Ошибка обновления данных' }
      };
      const state = reducer(
        { ...initialState, loginUserRequest: true },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe('Ошибка обновления данных');
    });

    it('fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated User' };
      const action = {
        type: updateUserThunk.fulfilled.type,
        payload: { user: updatedUser }
      };
      const state = reducer(
        { ...initialState, loginUserRequest: true },
        action
      );

      expect(state.loginUserRequest).toBe(false);
      expect(state.user).toEqual(updatedUser);
    });
  });

  // Тесты для getOrdersThunk
  describe('getOrdersThunk', () => {
    it('pending', () => {
      const action = { type: getOrdersThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.orderRequest).toBe(true);
    });

    it('rejected', () => {
      const action = {
        type: getOrdersThunk.rejected.type,
        error: { message: 'Ошибка получения заказов' }
      };
      const state = reducer({ ...initialState, orderRequest: true }, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка получения заказов');
      expect(state.orders).toEqual([]);
    });

    it('fulfilled', () => {
      const action = {
        type: getOrdersThunk.fulfilled.type,
        payload: mockOrders
      };
      const state = reducer({ ...initialState, orderRequest: true }, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orders).toEqual(mockOrders);
    });
  });
});
