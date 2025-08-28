import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { clearBurgerConstructor } from '../burger-constructor/slice';

export const orderBurgerThunk = createAsyncThunk(
  'orders/postOrderBurger',
  async (data: string[], { dispatch }) => {
    try {
      const response = await orderBurgerApi(data);
      dispatch(clearBurgerConstructor());
      return response;
    } catch (error) {
      throw error;
    }
  }
);
