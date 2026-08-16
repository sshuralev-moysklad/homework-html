import html from "./app.html";
import './app.css'
import { createTable } from './contragents/table/table';
import { createModal } from './contragents/modal/modal';

const rootElement = document.getElementById('root');
rootElement.innerHTML = html;

const contragents = [
    {
        id: crypto.randomUUID(),
        name: 'ООО «Логнекс»',
        inn: '07736570901',
        address: '121205, г. Москва, территория Сколково Инновационного центра, бульвар Большой, дом 42, строение 1, помещение 1617',
        kpp: '773101001',
    },
];

const table = createTable(rootElement.querySelector('[data-contragents-table]'), {
    onDelete(id) {
        const index = contragents.findIndex((item) => item.id === id);
        if (index !== -1) {
            contragents.splice(index, 1);
            table.render(contragents);
        }
    },
    onEdit(id) {
        const contragent = contragents.find((item) => item.id === id);
        if (contragent) {
            modal.open(contragent);
        }
    },
});

const modal = createModal(rootElement.querySelector('[data-contragents-modal]'), {
    onSave(payload) {
        if (payload.id) {
            const current = contragents.find((item) => item.id === payload.id);
            if (current) {
                current.name = payload.name;
                current.inn = payload.inn;
                current.address = payload.address;
                current.kpp = payload.kpp;
            }
        } else {
            contragents.push({
                id: crypto.randomUUID(),
                name: payload.name,
                inn: payload.inn,
                address: payload.address,
                kpp: payload.kpp,
            });
        }

        table.render(contragents);
    },
});

rootElement.querySelector('[data-add-contragent]').addEventListener('click', () => {
    modal.open();
});

table.render(contragents);
