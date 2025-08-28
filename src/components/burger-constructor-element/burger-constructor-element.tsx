import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  upIngredients,
  downIngredients,
  removeIngredient
} from '../../services/slices/burger-constructor/slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        // Проверяем, можно ли переместить вниз (не последний элемент)
        dispatch(downIngredients(index));
      }
    };

    const handleMoveUp = () => {
      // Проверяем, можно ли переместить вверх (не первый элемент)
      if (index > 0) {
        dispatch(upIngredients(index));
      }
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
