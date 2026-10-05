import { useContragents } from '../api/ContragentsContext';

interface ContragentsTableProps {
  onEdit: (id: string) => void;
}

export function ContragentsTable({ onEdit }: ContragentsTableProps) {
  const { contragents, removeContragent } = useContragents();

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Наименование</th>
            <th scope="col" className="px-6 py-3">ИНН</th>
            <th scope="col" className="px-6 py-3">Адрес</th>
            <th scope="col" className="px-6 py-3">КПП</th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {contragents.map((item) => (
            <tr
              key={item.id}
              className="bg-white border-b cursor-pointer hover:bg-gray-50"
              onDoubleClick={(event) => {
                if ((event.target as HTMLElement).closest('[data-delete]')) {
                  return;
                }
                onEdit(item.id);
              }}
            >
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {item.name}
              </th>
              <td className="px-6 py-4">{item.inn}</td>
              <td className="px-6 py-4">{item.address}</td>
              <td className="px-6 py-4">{item.kpp}</td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  data-delete
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                  onClick={(event) => {
                    event.stopPropagation();
                    void removeContragent(item.id);
                  }}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
