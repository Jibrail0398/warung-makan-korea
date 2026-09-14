import { ref, computed, onMounted } from 'vue';
import './SuperAdminAuditLogView.css';

export default {
  name: 'SuperAdminAuditLogView',
  setup() {
    const logs = ref([]);
    const searchQuery = ref('');
    const selectedActionFilter = ref('all');
    const selectedLog = ref(null);
    const loadLogs = () => { logs.value = []; };
    onMounted(() => { loadLogs(); });
    const filteredLogs = computed(() => { return logs.value.filter(log => { const am = selectedActionFilter.value === 'all' || log.action?.includes(selectedActionFilter.value); const q = searchQuery.value.trim().toLowerCase(); const sm = !q || (log.id + ' ' + log.actor + ' ' + log.action + ' ' + log.resource + ' ' + log.ip).toLowerCase().includes(q); return am && sm; }); });
    const inspectLog = (log) => { selectedLog.value = log; };
    return { logs, searchQuery, selectedActionFilter, selectedLog, filteredLogs, inspectLog };
  }
};
