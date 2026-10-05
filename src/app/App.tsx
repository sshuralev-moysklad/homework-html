import { useState } from 'react';
import logoUrl from './logo.svg';
import { ContragentsProvider, useContragents } from './contragents/api/ContragentsContext';
import { ContragentModal } from './contragents/modal/ContragentModal';
import { ContragentsTable } from './contragents/table/ContragentsTable';
import type { Contragent } from './contragents/types';

function AppContent() {
  const { contragents, isLoading, error } = useContragents();
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
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {isLoading ? (
          <p className="text-sm text-gray-500">Загрузка...</p>
        ) : (
          <ContragentsTable onEdit={handleEdit} />
        )}
      </main>

      <footer className="py-4 text-center text-sm text-gray-500">
        © 2007-2026 ООО &quot;МойСклад&quot;
      </footer>

      <ContragentModal
        isOpen={isModalOpen}
        initialValues={editingContragent}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export function App() {
  return (
    <ContragentsProvider>
      <AppContent />
    </ContragentsProvider>
  );
}
