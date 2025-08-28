import { createSlice } from '@reduxjs/toolkit';

import { TOrder, TUser } from '@utils-types';
import {
  getOrdersThunk,
  getUserThunk,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  updateUserThunk
} from './actions';

export interface UserState {
  loginUserRequest: boolean;
  user: TUser | null;
  orders: TOrder[];
  orderRequest: boolean;
  error: string | null;
}

const initialState: UserState = {
  loginUserRequest: false,
  user: null,
  orders: [],
  orderRequest: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    isAuthCheckedSelector: (state) => state.user !== null,
    loginUserRequestSelector: (state) => state.loginUserRequest,
    userNameSelector: (state) => state.user?.name || '',
    userEmailSelector: (state) => state.user?.email || null,
    userSelector: (state) => state.user,
    userOrdersSelector: (state) => state.orders,
    ordersRequestSelector: (state) => state.orderRequest,
    errorSelector: (state) => state.error
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message ?? 'Ошибка авторизации';
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message ?? 'Ошибка выхода';
        // Состояние аутентификации не меняем, т.к. выход не удался
      })
      .addCase(logoutUserThunk.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.user = null;
        state.orders = []; // Очищаем заказы при выходе
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.user = null;
        state.error =
          action.error.message ?? 'Ошибка получения данных пользователя';
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.user = action.payload.user;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message ?? 'Ошибка авторизации';
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message ?? 'Ошибка обновления данных';
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.user = action.payload.user;
      })
      .addCase(getOrdersThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Ошибка получения заказов';
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orders = action.payload;
      });
  }
});

export const { clearErrors } = userSlice.actions;
export const {
  isAuthCheckedSelector,
  userNameSelector,
  userEmailSelector,
  userOrdersSelector,
  userSelector,
  loginUserRequestSelector,
  ordersRequestSelector,
  errorSelector
} = userSlice.selectors;

export default userSlice.reducer;
