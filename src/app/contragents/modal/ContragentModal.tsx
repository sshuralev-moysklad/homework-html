import { FormEvent, useEffect, useState } from 'react';
import type { Contragent, ContragentFormValues } from '../../types';
import { validateContragentForm } from '../../types';
import styles from './ContragentModal.module.css';

interface ContragentModalProps {
  isOpen: boolean;
  initialValues: Contragent | null;
  onSave: (values: ContragentFormValues) => void;
  onClose: () => void;
}

const emptyForm = {
  name: '',
  inn: '',
  address: '',
  kpp: '',
};

export function ContragentModal({ isOpen, initialValues, onSave, onClose }: ContragentModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, boolean>>>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialValues) {
      setForm({
        name: initialValues.name,
        inn: initialValues.inn,
        address: initialValues.address,
        kpp: initialValues.kpp,
      });
    } else {
      setForm(emptyForm);
    }

    setErrors({});
  }, [isOpen, initialValues]);

  function handleFieldChange(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = {
      name: form.name.trim(),
      inn: form.inn.trim(),
      address: form.address.trim(),
      kpp: form.kpp.trim(),
    };

    const validation = validateContragentForm(values);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave({
      id: initialValues?.id,
      ...values,
    });
  }

  if (!isOpen) {
    return null;
  }

  function inputClassName(field: keyof typeof emptyForm) {
    const base =
      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
    return errors[field] ? `${base} ${styles.inputInvalid}` : base;
  }

  return (
    <div
      id="contragent-modal"
      tabIndex={-1}
      aria-hidden="false"
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-900/50"
      onClick={onClose}
    >
      <div
        className="relative p-4 w-full max-w-md max-h-full"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">Контрагент</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={onClose}
            >
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Закрыть</span>
            </button>
          </div>
          <form className="p-4 md:p-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="contragent-name" className="block mb-2 text-sm font-medium text-gray-900">
                Наименование
              </label>
              <input
                type="text"
                id="contragent-name"
                name="name"
                value={form.name}
                className={inputClassName('name')}
                onChange={(event) => handleFieldChange('name', event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contragent-inn" className="block mb-2 text-sm font-medium text-gray-900">
                ИНН
              </label>
              <input
                type="text"
                id="contragent-inn"
                name="inn"
                maxLength={11}
                inputMode="numeric"
                value={form.inn}
                className={inputClassName('inn')}
                onChange={(event) => handleFieldChange('inn', event.target.value)}
              />
              {errors.inn && (
                <p className="mt-2 text-sm text-red-600">ИНН должен содержать 11 цифр</p>
              )}
            </div>
            <div>
              <label htmlFor="contragent-address" className="block mb-2 text-sm font-medium text-gray-900">
                Адрес
              </label>
              <input
                type="text"
                id="contragent-address"
                name="address"
                value={form.address}
                className={inputClassName('address')}
                onChange={(event) => handleFieldChange('address', event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contragent-kpp" className="block mb-2 text-sm font-medium text-gray-900">
                КПП
              </label>
              <input
                type="text"
                id="contragent-kpp"
                name="kpp"
                maxLength={9}
                inputMode="numeric"
                value={form.kpp}
                className={inputClassName('kpp')}
                onChange={(event) => handleFieldChange('kpp', event.target.value)}
              />
              {errors.kpp && (
                <p className="mt-2 text-sm text-red-600">КПП должен содержать 9 цифр</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Сохранить
              </button>
              <button
                type="button"
                className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={onClose}
              >
                Отменить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
