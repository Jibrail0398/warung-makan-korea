import { jsPDF } from 'jspdf';

export function formatPriceKRW(value) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatReceiptDateTime(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function drawDashedLine(doc, x1, y1, x2, y2) {
  doc.setDrawColor(160, 150, 140);
  doc.setLineWidth(0.25);
  if (typeof doc.setLineDashPattern === 'function') {
    doc.setLineDashPattern([1, 1], 0);
  } else if (typeof doc.setLineDash === 'function') {
    doc.setLineDash([1, 1], 0);
  }
  doc.line(x1, y1, x2, y2);
  if (typeof doc.setLineDashPattern === 'function') {
    doc.setLineDashPattern([], 0);
  } else if (typeof doc.setLineDash === 'function') {
    doc.setLineDash([], 0);
  }
}

export function generateReceiptPdf(order) {
  const pw = 80; // 80mm standard thermal receipt roll
  const l = 5;
  const r = pw - l;
  const items = order?.items || [];

  // Hitung tinggi kertas secara dinamis agar bagian Total langsung mengikuti daftar item tanpa ruang kosong
  const itemsCount = items.length > 0 ? items.length : 1;
  const contentHeight = Math.ceil(16 + 18 + 6 + (itemsCount * 6.5) + 9 + 14 + 10);
  const ph = Math.max(65, contentHeight);

  const doc = new jsPDF({
    unit: 'mm',
    format: [pw, ph],
    orientation: 'portrait',
  });

  let y = 6;

  // Header Struk
  doc.setTextColor(36, 25, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('ANEKARASA RESTO', pw / 2, y, { align: 'center' });
  y += 3.8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(109, 98, 91);
  doc.text('Struk Pesanan', pw / 2, y, { align: 'center' });
  y += 3;

  drawDashedLine(doc, l, y, r, y);
  y += 3.5;

  // Info Pesanan
  doc.setTextColor(36, 25, 18);
  doc.setFontSize(6.8);

  doc.setFont('helvetica', 'normal');
  doc.text('No. Pesanan:', l, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`#${order?.id || '-'}`, r, y, { align: 'right' });
  y += 3.2;

  doc.setFont('helvetica', 'normal');
  doc.text('Waktu:', l, y);
  doc.text(formatReceiptDateTime(order?.created_at), r, y, { align: 'right' });
  y += 3.2;

  doc.text('Pelanggan:', l, y);
  doc.text(String(order?.customer_name || '-').slice(0, 26), r, y, { align: 'right' });
  y += 3.2;

  doc.text('Telepon:', l, y);
  doc.text(String(order?.customer_phone || '-'), r, y, { align: 'right' });
  y += 3;

  drawDashedLine(doc, l, y, r, y);
  y += 3.5;

  // Header Kolom Item
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(36, 25, 18);
  doc.text('ITEM', l, y);
  doc.text('JUMLAH', r, y, { align: 'right' });
  y += 1.8;

  drawDashedLine(doc, l, y, r, y);
  y += 3.2;

  // Daftar Item
  if (items.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(109, 98, 91);
    doc.text('Tidak ada item', l, y);
    y += 4;
  } else {
    items.forEach((item) => {
      const name = item.product?.name || 'Produk';
      const qtyPrice = `${item.quantity} x ${formatPriceKRW(item.price).replace(/\u20a9/g, 'KRW ')}`;
      const subtotal = formatPriceKRW(item.sub_total || item.price * item.quantity).replace(/\u20a9/g, 'KRW ');

      // Nama produk & Subtotal di kanan
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(36, 25, 18);
      doc.setFontSize(6.8);
      doc.text(name.slice(0, 28), l, y);
      doc.text(subtotal, r, y, { align: 'right' });
      y += 2.8;

      // Kuantitas x harga di bawah nama produk
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.2);
      doc.setTextColor(109, 98, 91);
      doc.text(qtyPrice, l, y);
      y += 3.5;
    });
  }

  // Garis pemisah sebelum Total
  drawDashedLine(doc, l, y, r, y);
  y += 3.5;

  // Bagian Total (Langsung setelah daftar item)
  doc.setTextColor(36, 25, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('TOTAL', l, y);

  const totalStr = formatPriceKRW(order?.total_price || 0).replace(/\u20a9/g, 'KRW ');
  doc.text(totalStr, r, y, { align: 'right' });
  y += 2.5;

  drawDashedLine(doc, l, y, r, y);
  y += 4;

  // Bagian Footer Struk
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(109, 98, 91);
  doc.text('Terima Kasih Atas Kunjungan Anda!', pw / 2, y, { align: 'center' });
  y += 3.2;
  doc.text('감사합니다 / Selamat Menikmati', pw / 2, y, { align: 'center' });

  return doc;
}
