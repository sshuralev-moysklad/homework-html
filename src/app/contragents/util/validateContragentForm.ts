import type { ContragentFormValues } from '../types';

const INN_PATTERN = /^\d{11}$/;
const KPP_PATTERN = /^\d{9}$/;

export function validateInn(value: string): boolean {
  return INN_PATTERN.test(value);
}

export function validateKpp(value: string): boolean {
  return KPP_PATTERN.test(value);
}

export function validateContragentForm(values: Omit<ContragentFormValues, 'id'>): {
  isValid: boolean;
  errors: Partial<Record<keyof Omit<ContragentFormValues, 'id'>, boolean>>;
} {
  const errors: Partial<Record<keyof Omit<ContragentFormValues, 'id'>, boolean>> = {};

  if (!validateInn(values.inn)) {
    errors.inn = true;
  }

  if (!validateKpp(values.kpp)) {
    errors.kpp = true;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
