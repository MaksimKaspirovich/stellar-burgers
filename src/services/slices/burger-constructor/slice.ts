import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

// Интерфейс бургера
export interface burgerConstructorState {
  burgerConstructor: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  error: string | null;
}

//Начальное положение бургера
const initialState: burgerConstructorState = {
  burgerConstructor: {
    bun: null,
    ingredients: []
  },
  error: null
};

// Создаем слайс
const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    BurgerConstructorSelector: (state) => state.burgerConstructor
  },
  reducers: {
    addIngredient: {
      //Добавить ингридиент
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const item = action.payload;
        if (item.type === 'bun') {
          state.burgerConstructor.bun = item;
        } else {
          state.burgerConstructor.ingredients.push(item);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    //Удалить ингридиент
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const id = action.payload.id;
      if (!id) return;
      state.burgerConstructor.ingredients =
        state.burgerConstructor.ingredients.filter(
          (ingredient) => ingredient.id !== id
        );
    },
    //Очистить конструктор бургера
    clearBurgerConstructor: (state) => {
      state.burgerConstructor.bun = null;
      state.burgerConstructor.ingredients = [];
    },
    //Поднять ингридиент
    upIngredients: (state, action: PayloadAction<number>) => {
      const ingredients = state.burgerConstructor.ingredients;
      const index = action.payload;

      if (index > 0 && index < ingredients.length) {
        const [moved] = ingredients.splice(index, 1);
        ingredients.splice(index - 1, 0, moved);
      }
    },
    //Спустить ингридиент
    downIngredients: (state, action: PayloadAction<number>) => {
      const ingredients = state.burgerConstructor.ingredients;
      const index = action.payload;

      if (index >= 0 && index < ingredients.length - 1) {
        const [moved] = ingredients.splice(index, 1);
        ingredients.splice(index + 1, 0, moved);
      }
    }
  }
});

export const { BurgerConstructorSelector } = burgerConstructorSlice.selectors;
export const {
  addIngredient,
  removeIngredient,
  clearBurgerConstructor,
  upIngredients,
  downIngredients
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
