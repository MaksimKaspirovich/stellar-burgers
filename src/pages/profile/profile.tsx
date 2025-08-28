import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { userSelector } from '../../services/slices/user/slice';
import { updateUserThunk } from '../../services/slices/user/actions';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [initialValues, setInitialValues] = useState({
    name: '',
    email: ''
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Инициализируем форму только когда user загружен
  useEffect(() => {
    if (user && !isInitialized) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
      setInitialValues({
        name: user.name || '',
        email: user.email || ''
      });
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  // Проверяем, были ли изменены данные
  const isFormChanged =
    formValue.name !== initialValues.name ||
    formValue.email !== initialValues.email ||
    formValue.password !== '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserThunk(formValue))
      .unwrap()
      .then(() => {
        // Обновляем initialValues после успешного сохранения
        setInitialValues({
          name: formValue.name,
          email: formValue.email
        });
        setFormValue((prev) => ({ ...prev, password: '' }));
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: initialValues.name,
      email: initialValues.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  // Показываем прелоадер пока данные не загружены
  if (!user || !isInitialized) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
