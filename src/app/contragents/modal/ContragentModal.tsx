import { Field, Form } from 'react-final-form';
import { useContragents } from '../api/ContragentsContext';
import type { Contragent } from '../types';
import { validateInnField, validateKppField } from '../util/validateContragentForm';
import styles from './ContragentModal.module.css';

interface ContragentModalProps {
  isOpen: boolean;
  initialValues: Contragent | null;
  onClose: () => void;
}

type ContragentFormFields = {
  name: string;
  inn: string;
  address: string;
  kpp: string;
};

const emptyForm: ContragentFormFields = {
  name: '',
  inn: '',
  address: '',
  kpp: '',
};

const inputBaseClass =
  'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';

function inputClassName(invalid: boolean) {
  return invalid ? `${inputBaseClass} ${styles.inputInvalid}` : inputBaseClass;
}

function shouldShowError(meta: { error?: { message?: string }; touched?: boolean; submitFailed?: boolean }) {
  return Boolean(meta.error && (meta.touched || meta.submitFailed));
}

export function ContragentModal({ isOpen, initialValues, onClose }: ContragentModalProps) {
  const { addContragent, editContragent } = useContragents();

  if (!isOpen) {
    return null;
  }

  const formInitialValues: ContragentFormFields = initialValues
    ? {
        name: initialValues.name,
        inn: initialValues.inn,
        address: initialValues.address,
        kpp: initialValues.kpp,
      }
    : emptyForm;

  async function handleSubmit(values: ContragentFormFields) {
    const trimmed = {
      name: values.name.trim(),
      inn: values.inn.trim(),
      address: values.address.trim(),
      kpp: values.kpp.trim(),
    };

    try {
      if (initialValues) {
        await editContragent({
          id: initialValues.id,
          ...trimmed,
        });
      } else {
        await addContragent(trimmed);
      }

      onClose();
    } catch {
      return;
    }
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
          <Form<ContragentFormFields> initialValues={formInitialValues} onSubmit={handleSubmit}>
            {({ handleSubmit: onFormSubmit }) => (
              <form className="p-4 md:p-5 space-y-4" onSubmit={onFormSubmit}>
                <Field name="name">
                  {({ input }) => (
                    <div>
                      <label htmlFor="contragent-name" className="block mb-2 text-sm font-medium text-gray-900">
                        Наименование
                      </label>
                      <input
                        {...input}
                        type="text"
                        id="contragent-name"
                        className={inputClassName(false)}
                      />
                    </div>
                  )}
                </Field>
                <Field name="inn" validate={validateInnField}>
                  {({ input, meta }) => {
                    const invalid = shouldShowError(meta);
                    return (
                      <div>
                        <label htmlFor="contragent-inn" className="block mb-2 text-sm font-medium text-gray-900">
                          ИНН
                        </label>
                        <input
                          {...input}
                          type="text"
                          id="contragent-inn"
                          maxLength={11}
                          inputMode="numeric"
                          className={inputClassName(invalid)}
                        />
                        {invalid && (
                          <p className="mt-2 text-sm text-red-600">{meta.error.message}</p>
                        )}
                      </div>
                    );
                  }}
                </Field>
                <Field name="address">
                  {({ input }) => (
                    <div>
                      <label htmlFor="contragent-address" className="block mb-2 text-sm font-medium text-gray-900">
                        Адрес
                      </label>
                      <input
                        {...input}
                        type="text"
                        id="contragent-address"
                        className={inputClassName(false)}
                      />
                    </div>
                  )}
                </Field>
                <Field name="kpp" validate={validateKppField}>
                  {({ input, meta }) => {
                    const invalid = shouldShowError(meta);
                    return (
                      <div>
                        <label htmlFor="contragent-kpp" className="block mb-2 text-sm font-medium text-gray-900">
                          КПП
                        </label>
                        <input
                          {...input}
                          type="text"
                          id="contragent-kpp"
                          maxLength={9}
                          inputMode="numeric"
                          className={inputClassName(invalid)}
                        />
                        {invalid && (
                          <p className="mt-2 text-sm text-red-600">{meta.error.message}</p>
                        )}
                      </div>
                    );
                  }}
                </Field>
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
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}
