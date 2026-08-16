import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContragentModal } from './ContragentModal';
import type { Contragent } from '../../types';

const contragent: Contragent = {
  id: 'test-id',
  name: 'ООО «Логнекс»',
  inn: '07736570901',
  address: 'Москва',
  kpp: '773101001',
};

describe('тесты ContragentsModal', () => {
  it('не рендерится, когда закрыта', () => {
    render(
      <ContragentModal
        isOpen={false}
        initialValues={null}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByRole('heading', { name: 'Контрагент' })).not.toBeInTheDocument();
  });

  it('показывает пустую форму при открытии для создания', () => {
    render(
      <ContragentModal
        isOpen={true}
        initialValues={null}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Наименование')).toHaveValue('');
    expect(screen.getByLabelText('ИНН')).toHaveValue('');
    expect(screen.getByLabelText('Адрес')).toHaveValue('');
    expect(screen.getByLabelText('КПП')).toHaveValue('');
  });

  it('показывает заполненную форму при редактировании', () => {
    render(
      <ContragentModal
        isOpen={true}
        initialValues={contragent}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Наименование')).toHaveValue(contragent.name);
    expect(screen.getByLabelText('ИНН')).toHaveValue(contragent.inn);
    expect(screen.getByLabelText('Адрес')).toHaveValue(contragent.address);
    expect(screen.getByLabelText('КПП')).toHaveValue(contragent.kpp);
  });

  it('показывает ошибки валидации и не вызывает onSave при невалидном ИНН и КПП', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(
      <ContragentModal
        isOpen={true}
        initialValues={null}
        onSave={onSave}
        onClose={jest.fn()}
      />
    );

    await user.type(screen.getByLabelText('Наименование'), 'Test');
    await user.type(screen.getByLabelText('ИНН'), '123');
    await user.type(screen.getByLabelText('Адрес'), 'Address');
    await user.type(screen.getByLabelText('КПП'), '123');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('ИНН должен содержать 11 цифр')).toBeInTheDocument();
    expect(screen.getByText('КПП должен содержать 9 цифр')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('вызывает onSave с обрезанными значениями и id при валидной форме', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(
      <ContragentModal
        isOpen={true}
        initialValues={contragent}
        onSave={onSave}
        onClose={jest.fn()}
      />
    );

    await user.clear(screen.getByLabelText('Наименование'));
    await user.type(screen.getByLabelText('Наименование'), '  Новое название  ');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(onSave).toHaveBeenCalledWith({
      id: contragent.id,
      name: 'Новое название',
      inn: contragent.inn,
      address: contragent.address,
      kpp: contragent.kpp,
    });
  });

  it('вызывает onClose при нажатии «Отменить»', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <ContragentModal
        isOpen={true}
        initialValues={null}
        onSave={jest.fn()}
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Отменить' }));

    expect(onClose).toHaveBeenCalled();
  });
});
