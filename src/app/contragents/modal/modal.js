import html from './modal.html';
import './modal.css';
import { Modal } from 'flowbite';

const INN_PATTERN = /^\d{11}$/;
const KPP_PATTERN = /^\d{9}$/;

export function createModal(container, { onSave }) {
    container.innerHTML = html;

    const modalElement = container.querySelector('#contragent-modal');
    const form = container.querySelector('[data-contragent-form]');
    const modal = new Modal(modalElement, {
        placement: 'center',
        backdrop: 'dynamic',
        closable: true,
        onHide() {
            resetForm();
        },
    });

    let editingId = null;

    function resetForm() {
        form.reset();
        editingId = null;
        clearErrors();
    }

    function clearErrors() {
        form.querySelectorAll('[data-error]').forEach((element) => {
            element.classList.add('hidden');
        });
        form.querySelectorAll('.contragent-input').forEach((element) => {
            element.classList.remove('invalid');
        });
    }

    function setError(fieldName) {
        form.elements[fieldName].classList.add('invalid');
        const error = form.querySelector(`[data-error="${fieldName}"]`);
        if (error) {
            error.classList.remove('hidden');
        }
    }

    function validate(values) {
        clearErrors();
        let isValid = true;

        if (!INN_PATTERN.test(values.inn)) {
            setError('inn');
            isValid = false;
        }

        if (!KPP_PATTERN.test(values.kpp)) {
            setError('kpp');
            isValid = false;
        }

        return isValid;
    }

    function open(contragent) {
        resetForm();

        if (contragent) {
            editingId = contragent.id;
            form.elements.name.value = contragent.name;
            form.elements.inn.value = contragent.inn;
            form.elements.address.value = contragent.address;
            form.elements.kpp.value = contragent.kpp;
        }

        modal.show();
    }

    function close() {
        modal.hide();
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const values = {
            name: form.elements.name.value.trim(),
            inn: form.elements.inn.value.trim(),
            address: form.elements.address.value.trim(),
            kpp: form.elements.kpp.value.trim(),
        };

        if (!validate(values)) {
            return;
        }

        onSave({
            id: editingId,
            ...values,
        });
        close();
    });

    form.elements.inn.addEventListener('input', () => {
        form.elements.inn.classList.remove('invalid');
        form.querySelector('[data-error="inn"]').classList.add('hidden');
    });

    form.elements.kpp.addEventListener('input', () => {
        form.elements.kpp.classList.remove('invalid');
        form.querySelector('[data-error="kpp"]').classList.add('hidden');
    });

    container.querySelectorAll('[data-modal-cancel]').forEach((button) => {
        button.addEventListener('click', () => close());
    });

    return { open, close };
}
