import React, { FC, memo } from 'react';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

import { OrderInfoUIProps } from './type';
import { OrderStatus } from '@components';

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(({ orderInfo }) => (
  <div className={styles.wrap} data-cy='order-info-modal'>
    <h3
      className={`text text_type_main-medium  pb-3 pt-10 ${styles.header}`}
      data-cy='order-name'
    >
      {orderInfo.name}
    </h3>
    <OrderStatus status={orderInfo.status} />
    <p
      className={`text text_type_main-medium pt-15 pb=6`}
      data-cy='order-composition-title'
    >
      Состав:
    </p>
    <ul className={`${styles.list} mb-8`} data-cy='order-ingredients-list'>
      {Object.values(orderInfo.ingredientsInfo).map((item, index) => (
        <li
          className={`pb-4 pr-6 ${styles.item}`}
          key={index}
          data-cy='order-ingredient-item'
        >
          <div className={styles.img_wrap}>
            <div className={styles.border}>
              <img
                className={styles.img}
                src={item.image_mobile}
                alt={item.name}
                data-cy='ingredient-image'
              />
            </div>
          </div>
          <span
            className='text text_type_main-default pl-4'
            data-cy='ingredient-name'
          >
            {item.name}
          </span>
          <span
            className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
            data-cy='ingredient-quantity-price'
          >
            {item.count} x {item.price}
          </span>
          <CurrencyIcon type={'primary'} />
        </li>
      ))}
    </ul>
    <div className={styles.bottom} data-cy='order-footer'>
      <p
        className='text text_type_main-default text_color_inactive'
        data-cy='order-date'
      >
        <FormattedDate date={orderInfo.date} />
      </p>
      <span
        className={`text text_type_digits-default pr-4 ${styles.total}`}
        data-cy='order-total'
      >
        {orderInfo.total}
      </span>
      <CurrencyIcon type={'primary'} />
    </div>
  </div>
));
