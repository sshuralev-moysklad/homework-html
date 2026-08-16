import { useState } from 'react';
import logoUrl from './logo.svg';
import { ContragentModal } from './contragents/modal/ContragentModal';
import { ContragentsTable } from './contragents/table/ContragentsTable';
import type { Contragent, ContragentFormValues } from './types';

const initialContragents: Contragent[] = [
  {
    id: crypto.randomUUID(),
    name: 'ООО «Логнекс»',
    inn: '07736570901',
    address: '121205, г. Москва, территория Сколково Инновационного центра, бульвар Большой, дом 42, строение 1, помещение 1617',
    kpp: '773101001',
  },
];

export function App() {
  const [contragents, setContragents] = useState<Contragent[]>(initialContragents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContragent, setEditingContragent] = useState<Contragent | null>(null);

  function handleAddClick() {
    setEditingContragent(null);
    setIsModalOpen(true);
  }

  function handleEdit(id: string) {
    const contragent = contragents.find((item) => item.id === id);

    if (contragent) {
      setEditingContragent(contragent);
      setIsModalOpen(true);
    }
  }

  function handleDelete(id: string) {
    setContragents((current) => current.filter((item) => item.id !== id));
  }

  function handleSave(payload: ContragentFormValues) {
    if (payload.id) {
      setContragents((current) =>
        current.map((item) =>
          item.id === payload.id
            ? {
                id: item.id,
                name: payload.name,
                inn: payload.inn,
                address: payload.address,
                kpp: payload.kpp,
              }
            : item
        )
      );
    } else {
      setContragents((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          name: payload.name,
          inn: payload.inn,
          address: payload.address,
          kpp: payload.kpp,
        },
      ]);
    }

    setIsModalOpen(false);
    setEditingContragent(null);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingContragent(null);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200">
        <nav className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
          <div className="logo flex items-center">
            <img src={logoUrl} alt="МойСклад" width="152" height="46" />
          </div>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            onClick={handleAddClick}
          >
            Добавить
          </button>
        </nav>
      </header>

      <main className="flex-grow max-w-screen-xl w-full mx-auto px-4 py-8">
        <ContragentsTable
          items={contragents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <footer className="py-4 text-center text-sm text-gray-500">
        © 2007-2026 ООО &quot;МойСклад&quot;
      </footer>

      <ContragentModal
        isOpen={isModalOpen}
        initialValues={editingContragent}
        onSave={handleSave}
        onClose={handleCloseModal}
      />
    </div>
  );
}
