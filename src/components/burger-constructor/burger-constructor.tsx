import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  BurgerConstructorSelector,
  clearBurgerConstructor
} from '../../services/slices/burger-constructor/slice';
import {
  clearOrder,
  isOrderLoadingSelector,
  orderSelector,
  setPendingOrderData
} from '../../services/slices/order/slice';
import { useNavigate } from 'react-router-dom';
import { isAuthCheckedSelector } from '../../services/slices/user/slice';
import { orderBurgerThunk } from '../../services/slices/order/actions';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(BurgerConstructorSelector);
  const orderRequest = useSelector(isOrderLoadingSelector);
  const orderModalData = useSelector(orderSelector);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthCheckedSelector);

  const onOrderClick = () => {
    const { bun, ingredients } = constructorItems;

    //Проверяем наличие булки и не идет ли уже запрос
    if (!bun || orderRequest) return;

    //Формируем массив ID ингредиентов для заказа
    const orderData: string[] = [
      bun?._id!,
      ...ingredients.map((ingredient) => ingredient._id),
      bun?._id!
    ];

    if (!isAuth) {
      //Сохраняем данные заказа и перенаправляем на логин
      dispatch(setPendingOrderData(orderData));
      navigate('/login');
      return; //Прерываем пвыполнение после навигации
    }
    //Если авторизован, отправляем заказ
    dispatch(orderBurgerThunk(orderData));
  };

  const closeOrderModal = () => {
    navigate('/', { replace: true });
    dispatch(clearOrder());
    dispatch(clearBurgerConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
