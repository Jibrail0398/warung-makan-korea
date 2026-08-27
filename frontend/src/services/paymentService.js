import { orderService } from './orderService.js';

/**
 * Payment Service
 * Handles payment proof upload and payment verification.
 */
export const paymentService = {
  getBankDetails() {
    return {
      bankName: 'Hana Bank',
      accountNumber: '123-456-789',
      accountHolder: 'Warung Nusantara'
    };
  },

  async confirmPayment(file, orderPayload = {}) {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (!file && !orderPayload.paymentProof) {
      throw new Error('Upload bukti transfer terlebih dahulu');
    }

    const proofUrl = typeof file === 'string'
      ? file
      : (file ? URL.createObjectURL(file) : 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=900');

    const createdOrder = await orderService.createOrder({
      ...orderPayload,
      paymentProof: proofUrl
    });

    return {
      success: true,
      orderId: createdOrder.id || createdOrder.orderId,
      order: createdOrder,
      message: 'Pembayaran berhasil dikirim untuk verifikasi kasir'
    };
  }
};

