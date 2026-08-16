import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContragentsTable } from './ContragentsTable';
import type { Contragent } from '../../types';

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

describe('тесты ContragentsTable', () => {
  it('отображает строки контрагентов', () => {
    render(
      <ContragentsTable
        items={items}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('ООО «Логнекс»')).toBeInTheDocument();
    expect(screen.getByText('07736570901')).toBeInTheDocument();
    expect(screen.getByText('Москва')).toBeInTheDocument();
    expect(screen.getByText('773101001')).toBeInTheDocument();
    expect(screen.getByText('ООО «Тест»')).toBeInTheDocument();
  });

  it('вызывает onDelete с id элемента при нажатии «Удалить»', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <ContragentsTable
        items={items}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: 'Удалить' });
    await user.click(deleteButtons[1]);

    expect(onDelete).toHaveBeenCalledWith('id-2');
  });

  it('вызывает onEdit при двойном клике по строке', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();

    render(
      <ContragentsTable
        items={items}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );

    await user.dblClick(screen.getByText('ООО «Логнекс»'));

    expect(onEdit).toHaveBeenCalledWith('id-1');
  });
});
