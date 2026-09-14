import { ref } from 'vue';
import { paymentService } from '../../../services/paymentService.js';
import './PaymentInfoCard.css';

export default {
  name: 'PaymentInfoCard',
  props: { formattedTotal: { type: String, default: '₩58,000' } },
  emits: ['showToast'],
  setup(props, { emit }) {
    const bankInfo = paymentService.getBankDetails();
    const copied = ref(false);
    function copyAccountNumber() { navigator.clipboard.writeText(bankInfo.accountNumber).then(() => { copied.value = true; emit('showToast', 'Nomor rekening berhasil disalin'); setTimeout(() => { copied.value = false; }, 1800); }).catch(() => { emit('showToast', 'Gagal menyalin nomor rekening'); }); }
    return { bankInfo, copied, copyAccountNumber };
  }
};
