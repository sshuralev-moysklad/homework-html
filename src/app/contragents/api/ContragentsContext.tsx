import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createContragent,
  deleteContragent,
  getContragents,
  updateContragent,
} from './contragentsApi';
import type { Contragent } from '../types';

export interface ContragentsContextValue {
  contragents: Contragent[];
  isLoading: boolean;
  error: string | null;
  loadContragents: () => Promise<void>;
  addContragent: (values: Omit<Contragent, 'id'>) => Promise<void>;
  editContragent: (values: Contragent) => Promise<void>;
  removeContragent: (id: string) => Promise<void>;
}

export const ContragentsContext = createContext<ContragentsContextValue | null>(null);

export function ContragentsProvider({ children }: { children: ReactNode }) {
  const [contragents, setContragents] = useState<Contragent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContragents = useCallback(async () => {
    setIsLoading(true);

    try {
      const items = await getContragents();
      setContragents(items);
      setError(null);
    } catch {
      setError('Не удалось загрузить контрагентов');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addContragent = useCallback(async (values: Omit<Contragent, 'id'>) => {
    try {
      const created = await createContragent(values);
      setContragents((current) => [...current, created]);
      setError(null);
    } catch {
      setError('Не удалось сохранить контрагента');
      throw new Error('Не удалось сохранить контрагента');
    }
  }, []);

  const editContragent = useCallback(async (values: Contragent) => {
    try {
      const updated = await updateContragent(values);
      setContragents((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      setError(null);
    } catch {
      setError('Не удалось сохранить контрагента');
      throw new Error('Не удалось сохранить контрагента');
    }
  }, []);

  const removeContragent = useCallback(async (id: string) => {
    try {
      await deleteContragent(id);
      setContragents((current) => current.filter((item) => item.id !== id));
      setError(null);
    } catch {
      setError('Не удалось удалить контрагента');
    }
  }, []);

  useEffect(() => {
    void loadContragents();
  }, [loadContragents]);

  const value = useMemo(
    () => ({
      contragents,
      isLoading,
      error,
      loadContragents,
      addContragent,
      editContragent,
      removeContragent,
    }),
    [
      contragents,
      isLoading,
      error,
      loadContragents,
      addContragent,
      editContragent,
      removeContragent,
    ]
  );

  return (
    <ContragentsContext.Provider value={value}>
      {children}
    </ContragentsContext.Provider>
  );
}

export function useContragents() {
  const value = useContext(ContragentsContext);

  if (!value) {
    throw new Error('useContragents must be used within ContragentsProvider');
  }

  return value;
}
