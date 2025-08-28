import { getIngredientsThunk } from './actions';
import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export interface ingredientsState {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: ingredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    isIngredientsLoadingSelector: (state) => state.isIngredientsLoading
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null; // Сбрасываем ошибку при новом запросе
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error =
          action.error.message ?? 'Не удалось загрузить ингредиенты';
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { ingredientsSelector, isIngredientsLoadingSelector } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
