import { lang } from './lang';

export const statusOptions = [
  { value: 'Aktiv', label: lang.treat.active, color: 'orange' },
  { value: 'Avslått', label: lang.treat.declined, color: 'red' },
  { value: 'Godkjent', label: lang.treat.approved, color: 'green' },
  { value: 'Utkast', label: lang.treat.draft, color: 'gray' },
];
