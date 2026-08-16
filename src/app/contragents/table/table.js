import html from './table.html';
import './table.css';

export function createTable(container, { onDelete, onEdit }) {
    container.innerHTML = html;

    const tableBody = container.querySelector('[data-contragents-body]');
    const rowTemplate = container.querySelector('#contragent-row-template');

    container.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('[data-delete]');
        if (!deleteButton) {
            return;
        }

        event.stopPropagation();
        const row = deleteButton.closest('tr[data-id]');
        if (row) {
            onDelete(row.dataset.id);
        }
    });

    container.addEventListener('dblclick', (event) => {
        if (event.target.closest('[data-delete]')) {
            return;
        }

        const row = event.target.closest('tr[data-id]');
        if (row) {
            onEdit(row.dataset.id);
        }
    });

    function render(items) {
        tableBody.replaceChildren();

        for (const item of items) {
            const row = rowTemplate.content.firstElementChild.cloneNode(true);
            row.dataset.id = item.id;
            row.querySelector('[data-field="name"]').textContent = item.name;
            row.querySelector('[data-field="inn"]').textContent = item.inn;
            row.querySelector('[data-field="address"]').textContent = item.address;
            row.querySelector('[data-field="kpp"]').textContent = item.kpp;
            tableBody.appendChild(row);
        }
    }

    return { render };
}
