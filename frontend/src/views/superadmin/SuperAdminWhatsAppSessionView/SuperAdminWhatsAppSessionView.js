import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { whatsappSessionService } from '../../../services/whatsappSessionService.js';
import './SuperAdminWhatsAppSessionView.css';

export default {
  name: 'SuperAdminWhatsAppSessionView',
  setup() {
    const defaultSession = { id: 'warung-korea', status: 'disconnected', qr: null };
    const session = ref({ ...defaultSession });
    const isLoading = ref(true);
    const isStarting = ref(false);
    const isDeleting = ref(false);
    const errorMessage = ref('');
    let pollTimer;
    const isReady = computed(() => ['ready', 'authenticated'].includes(session.value.status));
    const isQrState = computed(() => session.value.status === 'qr');
    const statusClass = computed(() => { if (isReady.value) return 'status-ready'; if (isQrState.value) return 'status-qr'; if (session.value.status === 'initializing') return 'status-loading'; return 'status-offline'; });
    const statusLabel = computed(() => ({ ready: 'Active', authenticated: 'Active', qr: 'Needs scan', initializing: 'Starting', disconnected: 'Disconnected', auth_failure: 'Auth failure', error: 'Error' }[session.value.status] || 'Offline'));
    const statusTitle = computed(() => { if (isReady.value) return 'WhatsApp is connected'; if (isQrState.value) return 'Scan to connect this number'; if (session.value.status === 'initializing') return 'Starting WhatsApp session'; return 'Session is not active'; });
    const statusDescription = computed(() => { if (isReady.value) return 'The application can now use this number for WhatsApp operations.'; if (isQrState.value) return 'The QR code will refresh automatically while the sidecar waits for pairing.'; if (session.value.status === 'initializing') return 'The sidecar is preparing the session. This can take a few seconds.'; return 'The saved session can be restored without deleting its authentication data.'; });
    const loadSession = async () => { isLoading.value = true; errorMessage.value = ''; try { session.value = { ...defaultSession, ...(await whatsappSessionService.get()) }; } catch (error) { errorMessage.value = error.response?.data?.message || error.message || 'Gagal membaca status session.'; } finally { isLoading.value = false; } };
    const startSession = async () => { isStarting.value = true; errorMessage.value = ''; try { session.value = { ...defaultSession, ...(await whatsappSessionService.start()) }; } catch (error) { errorMessage.value = error.response?.data?.message || error.message || 'Gagal mengaktifkan session.'; } finally { isStarting.value = false; } };
    const destroySession = async () => { if (!window.confirm('Hapus sesi WhatsApp dan data login tersimpan? QR baru akan diperlukan.')) return; isDeleting.value = true; errorMessage.value = ''; try { session.value = { ...defaultSession, ...(await whatsappSessionService.destroy()) }; } catch (error) { errorMessage.value = error.response?.data?.message || error.message || 'Gagal menghapus session.'; } finally { isDeleting.value = false; } };
    onMounted(async () => { await loadSession(); pollTimer = window.setInterval(loadSession, 4000); });
    onBeforeUnmount(() => { window.clearInterval(pollTimer); });
    return { session, isLoading, isStarting, isDeleting, errorMessage, isReady, isQrState, statusClass, statusLabel, statusTitle, statusDescription, startSession, destroySession };
  }
};
