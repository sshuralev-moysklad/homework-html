import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContragentsTable } from './ContragentsTable';
import {
  ContragentsContext,
  type ContragentsContextValue,
} from '../api/ContragentsContext';
import type { Contragent } from '../types';
import type { ReactElement } from 'react';

const items: Contragent[] = [
  {
    id: 'id-1',
    name: 'ООО «Логнекс»',
    inn: '07736570901',
    address: 'Москва',
    kpp: '773101001',
  },
  {
    id: 'id-2',
    name: 'ООО «Тест»',
    inn: '12345678901',
    address: 'Санкт-Петербург',
    kpp: '987654321',
  },
];

function renderTable(
  ui: ReactElement,
  value: Partial<ContragentsContextValue> = {}
) {
  const contextValue: ContragentsContextValue = {
    contragents: items,
    isLoading: false,
    error: null,
    loadContragents: jest.fn(),
    addContragent: jest.fn(),
    editContragent: jest.fn(),
    removeContragent: jest.fn(),
    ...value,
  };

  return {
    ...render(
      <ContragentsContext.Provider value={contextValue}>{ui}</ContragentsContext.Provider>
    ),
    contextValue,
  };
}

describe('тесты ContragentsTable', () => {
  it('отображает строки контрагентов', () => {
    renderTable(<ContragentsTable onEdit={jest.fn()} />);

    expect(screen.getByText('ООО «Логнекс»')).toBeInTheDocument();
    expect(screen.getByText('07736570901')).toBeInTheDocument();
    expect(screen.getByText('Москва')).toBeInTheDocument();
    expect(screen.getByText('773101001')).toBeInTheDocument();
    expect(screen.getByText('ООО «Тест»')).toBeInTheDocument();
  });

  it('вызывает removeContragent с id элемента при нажатии «Удалить»', async () => {
    const user = userEvent.setup();
    const removeContragent = jest.fn();

    renderTable(<ContragentsTable onEdit={jest.fn()} />, { removeContragent });

    const deleteButtons = screen.getAllByRole('button', { name: 'Удалить' });
    await user.click(deleteButtons[1]);

    expect(removeContragent).toHaveBeenCalledWith('id-2');
  });

  it('вызывает onEdit при двойном клике по строке', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();

    renderTable(<ContragentsTable onEdit={onEdit} />);

    await user.dblClick(screen.getByText('ООО «Логнекс»'));

    expect(onEdit).toHaveBeenCalledWith('id-1');
  });
});
