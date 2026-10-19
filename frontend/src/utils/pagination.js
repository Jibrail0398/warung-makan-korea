export function getPageWindow(currentPage, lastPage, radius = 2) {
  const pages = [];
  const start = Math.max(1, currentPage - radius);
  const end = Math.min(lastPage, currentPage + radius);
  for (let i = start; i <= end; i += 1) pages.push(i);
  return pages;
}
