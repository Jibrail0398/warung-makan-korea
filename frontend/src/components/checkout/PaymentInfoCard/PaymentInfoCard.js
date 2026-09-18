import { ref, onMounted } from 'vue';
import { bankAccountService } from '../../../services/bankAccountService.js';
import './PaymentInfoCard.css';

// Fallback hanya dipakai bila API rekening bank tidak tersedia.
const FALLBACK_BANK_INFO = {
  bankName: 'Hana Bank',
  accountNumber: '123-456-789',
  accountHolder: 'Warung Nusantara'
};

export default {
  name: 'PaymentInfoCard',
  props: { formattedTotal: { type: String, default: '₩58,000' } },
  emits: ['showToast'],
  setup(props, { emit }) {
    const bankInfo = ref({ ...FALLBACK_BANK_INFO });
    const copied = ref(false);

    async function loadBankAccount() {
      try {
        const accounts = await bankAccountService.getBankAccounts();
        const active = accounts[0];
        if (active) {
          bankInfo.value = {
            bankName: active.bankName,
            accountNumber: active.accountNumber,
            accountHolder: active.accountName
          };
        }
      } catch (error) {
        // Fallback ke data statis bila rekening gagal dimuat.
      }
    }

    onMounted(() => {
      loadBankAccount();
    });

    function copyAccountNumber() { navigator.clipboard.writeText(bankInfo.value.accountNumber).then(() => { copied.value = true; emit('showToast', 'Nomor rekening berhasil disalin'); setTimeout(() => { copied.value = false; }, 1800); }).catch(() => { emit('showToast', 'Gagal menyalin nomor rekening'); }); }
    return { bankInfo, copied, copyAccountNumber };
  }
};
