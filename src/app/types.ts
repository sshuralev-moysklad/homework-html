export interface Contragent {
  id: string;
  name: string;
  inn: string;
  address: string;
  kpp: string;
}

export type ContragentFormValues = Omit<Contragent, 'id'> & { id?: string };

export const INN_PATTERN = /^\d{11}$/;
export const KPP_PATTERN = /^\d{9}$/;

export function validateContragentForm(values: Omit<ContragentFormValues, 'id'>): {
  isValid: boolean;
  errors: Partial<Record<keyof Omit<ContragentFormValues, 'id'>, boolean>>;
} {
  const errors: Partial<Record<keyof Omit<ContragentFormValues, 'id'>, boolean>> = {};

  if (!INN_PATTERN.test(values.inn)) {
    errors.inn = true;
  }

  if (!KPP_PATTERN.test(values.kpp)) {
    errors.kpp = true;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
