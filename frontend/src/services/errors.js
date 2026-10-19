export function buildError(error, fallback) {
  const data = error.response?.data;
  let message = data?.message || fallback;

  // Laravel validation errors (422): ambil pesan pertama agar jelas ke pengguna.
  if (data?.errors && typeof data.errors === 'object') {
    const firstError = Object.values(data.errors).flat()[0];
    if (firstError) message = firstError;
  }

  const normalized = new Error(message);
  normalized.status = error.response?.status;
  return normalized;
}