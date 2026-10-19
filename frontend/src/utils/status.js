export function statusToSlug(status) {
  return String(status || '').toLowerCase().replace(/\s+/g, '-');
}