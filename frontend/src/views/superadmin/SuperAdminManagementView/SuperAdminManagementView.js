import { ref, reactive, onMounted } from 'vue';
import './SuperAdminManagementView.css';

export default {
  name: 'SuperAdminManagementView',
  setup() {
    const admins = ref([]);
    const isModalOpen = ref(false);
    const isEdit = ref(false);
    const selectedAdmin = ref(null);
    const resetResult = ref(null);
    const adminToDelete = ref(null);
    const formData = reactive({ name: '', username: '', email: '', role: 'Kasir', phone: '+82 10 1234 5678', status: 'Active' });
    const loadAdmins = () => { admins.value = [{ id: 'ADM-001', name: 'Admin Utama', username: 'admin_utama', email: 'admin@warungnusantara.kr', role: 'Admin', phone: '+82 10 1234 5678', status: 'Active', lastLogin: '2025-01-01 09:00' }, { id: 'KSR-001', name: 'Siti Rahmawati', username: 'kasir_siti', email: 'siti@warungnusantara.kr', role: 'Kasir', phone: '+82 10 2345 6789', status: 'Active', lastLogin: '2025-01-01 08:45' }]; };
    onMounted(() => { loadAdmins(); });
    const openAddModal = () => { isEdit.value = false; selectedAdmin.value = null; formData.name = ''; formData.username = ''; formData.email = ''; formData.role = 'Kasir'; formData.phone = '+82 10 0000 0000'; formData.status = 'Active'; isModalOpen.value = true; };
    const openEditModal = (admin) => { isEdit.value = true; selectedAdmin.value = admin; formData.name = admin.name; formData.username = admin.username; formData.email = admin.email; formData.role = admin.role; formData.phone = admin.phone; formData.status = admin.status; isModalOpen.value = true; };
    const handleSaveAdmin = async () => { if (isEdit.value && selectedAdmin.value) { const idx = admins.value.findIndex(a => a.id === selectedAdmin.value.id); if (idx !== -1) admins.value[idx] = { ...admins.value[idx], ...formData }; } else { const newId = `ADM-${String(admins.value.length + 1).padStart(3, '0')}`; admins.value.push({ id: newId, ...formData, lastLogin: '-' }); } isModalOpen.value = false; };
    const handleResetPassword = async (admin) => { resetResult.value = { admin, temporaryPassword: 'TempPwd-' + Math.random().toString(36).substring(2, 10) }; };
    const confirmDelete = (admin) => { adminToDelete.value = admin; };
    const executeDelete = async () => { if (!adminToDelete.value) return; admins.value = admins.value.filter(a => a.id !== adminToDelete.value.id); adminToDelete.value = null; };
    return { admins, isModalOpen, isEdit, selectedAdmin, resetResult, adminToDelete, formData, openAddModal, openEditModal, handleSaveAdmin, handleResetPassword, confirmDelete, executeDelete };
  }
};
