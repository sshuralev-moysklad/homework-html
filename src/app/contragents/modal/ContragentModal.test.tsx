import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { ContragentModal } from './ContragentModal';
import {
  ContragentsContext,
  type ContragentsContextValue,
} from '../api/ContragentsContext';
import type { Contragent } from '../types';

const contragent: Contragent = {
  id: 'test-id',
  name: 'ООО «Логнекс»',
  inn: '07736570901',
  address: 'Москва',
  kpp: '773101001',
};

function renderModal(
  ui: ReactElement,
  value: Partial<ContragentsContextValue> = {}
) {
  const contextValue: ContragentsContextValue = {
    contragents: [],
    isLoading: false,
    error: null,
    loadContragents: jest.fn(),
    addContragent: jest.fn().mockResolvedValue(undefined),
    editContragent: jest.fn().mockResolvedValue(undefined),
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

describe('тесты ContragentsModal', () => {
  it('не рендерится, когда закрыта', () => {
    renderModal(
      <ContragentModal
        isOpen={false}
        initialValues={null}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByRole('heading', { name: 'Контрагент' })).not.toBeInTheDocument();
  });

  it('показывает пустую форму при открытии для создания', () => {
    renderModal(
      <ContragentModal
        isOpen={true}
        initialValues={null}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Наименование')).toHaveValue('');
    expect(screen.getByLabelText('ИНН')).toHaveValue('');
    expect(screen.getByLabelText('Адрес')).toHaveValue('');
    expect(screen.getByLabelText('КПП')).toHaveValue('');
  });

  it('показывает заполненную форму при редактировании', () => {
    renderModal(
      <ContragentModal
        isOpen={true}
        initialValues={contragent}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Наименование')).toHaveValue(contragent.name);
    expect(screen.getByLabelText('ИНН')).toHaveValue(contragent.inn);
    expect(screen.getByLabelText('Адрес')).toHaveValue(contragent.address);
    expect(screen.getByLabelText('КПП')).toHaveValue(contragent.kpp);
  });

  it('показывает ошибки валидации и не вызывает addContragent при невалидном ИНН и КПП', async () => {
    const user = userEvent.setup();
    const addContragent = jest.fn();

    renderModal(
      <ContragentModal
        isOpen={true}
        initialValues={null}
        onClose={jest.fn()}
      />,
      { addContragent }
    );

    await user.type(screen.getByLabelText('Наименование'), 'Test');
    await user.type(screen.getByLabelText('ИНН'), '123');
    await user.type(screen.getByLabelText('Адрес'), 'Address');
    await user.type(screen.getByLabelText('КПП'), '123');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('ИНН должен содержать 11 цифр')).toBeInTheDocument();
    expect(screen.getByText('КПП должен содержать 9 цифр')).toBeInTheDocument();
    expect(addContragent).not.toHaveBeenCalled();
  });

  it('вызывает editContragent с обрезанными значениями и id при валидной форме', async () => {
    const user = userEvent.setup();
    const editContragent = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    renderModal(
      <ContragentModal
        isOpen={true}
        initialValues={contragent}
        onClose={onClose}
      />,
      { editContragent }
    );

    await user.clear(screen.getByLabelText('Наименование'));
    await user.type(screen.getByLabelText('Наименование'), '  Новое название  ');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(editContragent).toHaveBeenCalledWith({
        id: contragent.id,
        name: 'Новое название',
        inn: contragent.inn,
        address: contragent.address,
        kpp: contragent.kpp,
      });
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('вызывает onClose при нажатии «Отменить»', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    renderModal(
      <ContragentModal
        isOpen={true}
        initialValues={null}
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Отменить' }));

    expect(onClose).toHaveBeenCalled();
  });
});
