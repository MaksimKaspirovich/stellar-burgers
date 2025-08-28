import { useState, ChangeEvent, useCallback } from 'react';

export function useForm<T extends Record<string, string>>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);

  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prevForm) => ({
        ...prevForm,
        [target.name]: target.value
      }));
    },
    []
  );

  return {
    form,
    handleChange
  };
}
