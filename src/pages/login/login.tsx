import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearErrors, errorSelector } from '../../services/slices/user/slice';
import { loginUserThunk } from '../../services/slices/user/actions';
import { useForm } from '../../hooks/useForm';
import { ChangeEvent } from 'react';

export const Login: FC = () => {
  const { form, handleChange } = useForm({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const error = useSelector(errorSelector);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await dispatch(loginUserThunk(form));
  };

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return (
    <LoginUI
      errorText={error || ''}
      email={form.email}
      setEmail={(value) =>
        handleChange({
          target: { name: 'email', value }
        } as ChangeEvent<HTMLInputElement>)
      }
      password={form.password}
      setPassword={(value) =>
        handleChange({
          target: { name: 'password', value }
        } as ChangeEvent<HTMLInputElement>)
      }
      handleSubmit={handleSubmit}
    />
  );
};
