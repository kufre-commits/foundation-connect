export interface Registrant {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  age: number;
  country: string;
  address: string;
  phone: string;
  registeredAt: string;
  formUploaded: boolean;
}

const STORAGE_KEY = "foundation_registrants";

export function getRegistrants(): Registrant[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addRegistrant(registrant: Registrant): void {
  const list = getRegistrants();
  list.push(registrant);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function markFormUploaded(id: string): void {
  const list = getRegistrants();
  const updated = list.map((r) =>
    r.id === id ? { ...r, formUploaded: true } : r
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
