export interface Contragent {
  id: string;
  name: string;
  inn: string;
  address: string;
  kpp: string;
}

export type ContragentFormValues = Omit<Contragent, 'id'> & { id?: string };
