import type { Contragent } from '../types';

const CONTRAGENTS_URL = '/api/contragents';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function toContragent(data: Contragent): Contragent {
  return {
    id: String(data.id),
    name: data.name,
    inn: data.inn,
    address: data.address,
    kpp: data.kpp,
  };
}

export async function getContragents(): Promise<Contragent[]> {
  const items = await request<Contragent[]>(CONTRAGENTS_URL);
  return items.map(toContragent);
}

export async function createContragent(
  values: Omit<Contragent, 'id'>
): Promise<Contragent> {
  const created = await request<Contragent>(CONTRAGENTS_URL, {
    method: 'POST',
    body: JSON.stringify({
      id: crypto.randomUUID(),
      ...values,
    }),
  });

  return toContragent(created);
}

export async function updateContragent(values: Contragent): Promise<Contragent> {
  const updated = await request<Contragent>(`${CONTRAGENTS_URL}/${values.id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  });

  return toContragent(updated);
}

export async function deleteContragent(id: string): Promise<void> {
  await request<unknown>(`${CONTRAGENTS_URL}/${id}`, {
    method: 'DELETE',
  });
}
