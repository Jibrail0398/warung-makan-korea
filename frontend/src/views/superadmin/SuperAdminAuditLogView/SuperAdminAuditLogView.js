import { ref, reactive, computed, onMounted } from 'vue';
import NoticeModal from '../../../components/common/NoticeModal/NoticeModal.vue';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner.vue';
import { useNoticeModal } from '../../../composables/useNoticeModal.js';
import { activityLogService } from '../../../services/activityLogService.js';
import './SuperAdminAuditLogView.css';

const EVENT_OPTIONS = [
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'login_failed', label: 'Login Failed' },
  { value: 'otp_failed', label: 'OTP Failed' },
  { value: 'password_changed', label: 'Password Changed' },
];

const LOG_NAME_OPTIONS = [
  { value: 'auth', label: 'Auth' },
  { value: 'user_management', label: 'User Management' },
];

export default {
  name: 'SuperAdminAuditLogView',
  components: { NoticeModal, LoadingSpinner },
  setup() {
    const logs = ref([]);
    const isPageLoading = ref(false);
    const pagination = reactive({
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 0,
    });

    const filters = reactive({
      search: '',
      event: '',
      logName: '',
      startDate: '',
      endDate: '',
    });

    const selectedLog = ref(null);
    const isDetailLoading = ref(false);

    const { isNoticeVisible, noticeType, noticeTitle, noticeMessage, noticeDetail, noticeConfirmText, showFailed, hideNotice } = useNoticeModal();

    const buildQueryParams = (page = 1) => {
      const params = { page };
      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.event) params.event = filters.event;
      if (filters.logName) params.log_name = filters.logName;
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;
      return params;
    };

    const loadLogs = async (page = 1) => {
      isPageLoading.value = true;
      try {
        const result = await activityLogService.getActivityLogs(buildQueryParams(page));
        logs.value = result.logs;
        pagination.currentPage = result.pagination.currentPage;
        pagination.lastPage = result.pagination.lastPage;
        pagination.total = result.pagination.total;
        pagination.perPage = result.pagination.perPage;
      } catch (error) {
        logs.value = [];
        showFailed({ title: 'Gagal Memuat Log', message: error.message || 'Gagal mengambil daftar log aktivitas.', confirmText: 'Tutup' });
      } finally {
        isPageLoading.value = false;
      }
    };

    const getPageNumbers = computed(() => {
      const pages = [];
      const start = Math.max(1, pagination.currentPage - 2);
      const end = Math.min(pagination.lastPage, pagination.currentPage + 2);
      for (let i = start; i <= end; i += 1) pages.push(i);
      return pages;
    });

    const changePage = (page) => {
      if (page < 1 || page > pagination.lastPage || page === pagination.currentPage || isPageLoading.value) return;
      loadLogs(page);
    };

    const applyFilters = () => {
      loadLogs(1);
    };

    const resetFilters = () => {
      filters.search = '';
      filters.event = '';
      filters.logName = '';
      filters.startDate = '';
      filters.endDate = '';
      loadLogs(1);
    };

    onMounted(() => {
      loadLogs();
    });

    const eventLabel = (event) => EVENT_OPTIONS.find((option) => option.value === event)?.label || event || '-';
    const logNameLabel = (logName) => LOG_NAME_OPTIONS.find((option) => option.value === logName)?.label || logName || '-';

    const formatTimestamp = (value) => {
      if (!value) return '-';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '-';
      return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    };

    const getActorName = (log) => log.causer?.name || log.properties?.phone_number || 'Sistem';
    const getResource = (log) => {
      if (log.subject_type) {
        return `${log.subject_type}${log.subject_id ? ` #${log.subject_id}` : ''}`;
      }
      return log.properties?.phone_number || '-';
    };
    const getIpAddress = (log) => log.properties?.ip_address || '-';

    const inspectLog = async (log) => {
      selectedLog.value = log;
      isDetailLoading.value = true;
      try {
        const detail = await activityLogService.getActivityLog(log.id);
        if (detail) selectedLog.value = detail;
      } catch (error) {
        // Tetap pakai data baris tabel bila detail gagal dimuat.
      } finally {
        isDetailLoading.value = false;
      }
    };

    const closeDetailModal = () => {
      if (isDetailLoading.value) return;
      selectedLog.value = null;
    };

    return {
      logs,
      isPageLoading,
      pagination,
      getPageNumbers,
      changePage,
      filters,
      eventOptions: EVENT_OPTIONS,
      logNameOptions: LOG_NAME_OPTIONS,
      selectedLog,
      isDetailLoading,
      isNoticeVisible,
      noticeType,
      noticeTitle,
      noticeMessage,
      noticeDetail,
      noticeConfirmText,
      hideNotice,
      loadLogs,
      applyFilters,
      resetFilters,
      eventLabel,
      logNameLabel,
      formatTimestamp,
      getActorName,
      getResource,
      getIpAddress,
      inspectLog,
      closeDetailModal,
    };
  },
};
