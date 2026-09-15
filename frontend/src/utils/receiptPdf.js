import { jsPDF } from 'jspdf';

// Ukuran kertas A6 (105 x 148 mm, portrait)
export function formatPriceKRW(value) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Number(value) || 0);
}

export function formatReceiptDateTime(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function generateReceiptPdf(order) {
  const doc = new jsPDF({ unit: 'mm', format: 'a6', orientation: 'portrait' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const l = 10;
  const r = pw - l;
  const items = order?.items || [];
  const rowH = 4.5;
  const headerH = 26;
  const footerH = 18;
  const itemsPerPage = Math.floor((ph - headerH - footerH) / rowH);

  const drawHeader = () => {
    doc.setTextColor(36, 25, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Warung Makan Korea', l, 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(109, 98, 91);
    doc.text('Struk pesanan digital', l, 16);
    doc.setDrawColor(221, 211, 202);
    doc.line(l, 19, r, 19);
  };

  const drawInfo = () => {
    doc.setTextColor(36, 25, 18);
    doc.setFontSize(7);
    doc.text(`Pesanan: ${order.id}`, l, 24);
    doc.text(`Waktu: ${formatReceiptDateTime(order.created_at)}`, l, 28);
    doc.text(`Pelanggan: ${(order.customer_name || '-')}`.slice(0, 40), l, 32);
    doc.text(`Telepon: ${order.customer_phone || '-'}`, l, 36);
  };

  const drawItemsHeading = (y) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Item pesanan', l, y);
    doc.text('Jumlah', r, y, { align: 'right' });
    doc.line(l, y + 1.5, r, y + 1.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
  };

  const drawItems = (startY, slice) => {
    slice.forEach((item, i) => {
      const y = startY + i * rowH;
      const nm = `${item.product?.name || 'Produk'} x ${item.quantity}`;
      const pr = formatPriceKRW(item.sub_total || item.price * item.quantity).replace(/\u20a9/g, 'KRW ');
      doc.text(nm.slice(0, 38), l, y);
      doc.text(pr, r - 1, y, { align: 'right' });
    });
  };

  const drawTotal = () => {
    const ty = ph - 14;
    doc.setDrawColor(36, 25, 18);
    doc.setLineWidth(0.4);
    doc.line(l, ty - 4, r, ty - 4);
    doc.setLineWidth(0.2);
    doc.setTextColor(36, 25, 18);
    doc.setFont('helvetica', 'bold');

    // Label di kiri, angka di kanan — dipisah agar tidak pernah terpotong
    doc.setFontSize(9);
    doc.text('Total', l, ty);

    // Auto-fit: kecilkan ukuran font sampai angka muat di area kanan
    const amount = formatPriceKRW(order.total_price).replace(/\u20a9/g, 'KRW ');
    const maxW = (r - l) * 0.7;
    let fs = 10;
    doc.setFontSize(fs);
    while (doc.getTextWidth(amount) > maxW && fs > 6) {
      fs -= 0.5;
      doc.setFontSize(fs);
    }
    doc.text(amount, r - 1, ty, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(109, 98, 91);
    doc.text('Terima Kasih Atas Kunjungan Anda!', pw / 2, ty + 5, { align: 'center' });
    doc.text('감사합니다 / Selamat Menikmati', pw / 2, ty + 8.5, { align: 'center' });
  };

  drawHeader();
  drawInfo();

  if (items.length === 0) {
    drawItemsHeading(42);
    doc.setTextColor(109, 98, 91);
    doc.text('Tidak ada item', l, 48);
    drawTotal();
    return doc;
  }

  let page = 0;
  let itemIndex = 0;
  while (itemIndex < items.length) {
    if (page > 0) {
      doc.addPage();
      drawHeader();
      drawInfo();
    }
    const headY = page === 0 ? 42 : 42;
    drawItemsHeading(headY);
    const slice = items.slice(itemIndex, itemIndex + itemsPerPage);
    drawItems(48, slice);
    itemIndex += slice.length;
    page++;
  }

  drawTotal();
  return doc;
}
