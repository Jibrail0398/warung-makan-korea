import { computed } from 'vue';
import './OrderTrackingProgress.css';

export default {
  name: 'OrderTrackingProgress',
  props: { status: { type: String, default: 'Payment Verification' } },
  setup(props) {
    const steps = [{ key: 'verification', label: 'Verifikasi' }, { key: 'progress', label: 'In Progress' }, { key: 'ready', label: 'Ready' }, { key: 'completed', label: 'Complete' }];
    const isCancelled = computed(() => (props.status || '').toLowerCase() === 'cancelled');
    const currentStepIndex = computed(() => { const s = (props.status || '').toLowerCase(); if (s.includes('completed') || s.includes('selesai')) return 3; if (s.includes('ready') || s.includes('siap')) return 2; if (s.includes('progress') || s.includes('preparing') || s.includes('disiapkan')) return 1; if (s.includes('cancelled') || s.includes('batal')) return 0; return 0; });
    const activeLineWidth = computed(() => { if (isCancelled.value) return '0%'; const idx = currentStepIndex.value; if (idx === 0) return '15%'; if (idx === 1) return '45%'; if (idx === 2) return '75%'; return '100%'; });
    return { steps, isCancelled, currentStepIndex, activeLineWidth };
  }
};
