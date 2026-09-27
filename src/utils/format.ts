export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatNumber(value: number) {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

export function formatKm(value: number) {
  return `${formatNumber(value)} km`;
}

export function formatDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (!match) {
    return value;
  }

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export function formatDateTime(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);

  if (!match) {
    return formatDate(value);
  }

  const [, , month, day, hour, minute] = match;
  return `${day}/${month} às ${hour}:${minute}`;
}

export function formatRelativeTime(value: string, now = Date.now()) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return value;
  }

  const minutes = Math.max(0, Math.round((now - timestamp) / 60000));

  if (minutes < 1) {
    return 'agora';
  }

  if (minutes < 60) {
    return `há ${minutes} min`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `há ${hours} h`;
  }

  return `há ${Math.round(hours / 24)} d`;
}

export function firstName(fullName?: string | null) {
  return fullName?.trim().split(/\s+/)[0] ?? '';
}

export function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return value;
}
