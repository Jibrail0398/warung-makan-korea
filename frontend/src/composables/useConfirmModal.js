import { ref } from 'vue';

const isConfirmVisible = ref(false);
const confirmTitle = ref('Konfirmasi');
const confirmMessage = ref('');
const confirmDetail = ref('');
const confirmType = ref('danger');
const confirmIcon = ref('logout');
const confirmEyebrow = ref('');
const confirmButtonText = ref('Ya, Lanjutkan');
const cancelButtonText = ref('Batal');
const isConfirmLoading = ref(false);

let onConfirmCallback = null;
let onCancelCallback = null;

export function useConfirmModal() {
  function openConfirm({
    title = 'Konfirmasi',
    message = '',
    detail = '',
    type = 'danger',
    icon = '',
    eyebrow = '',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    onConfirm = null,
    onCancel = null
  } = {}) {
    confirmTitle.value = title;
    confirmMessage.value = message;
    confirmDetail.value = detail;
    confirmType.value = type;
    confirmIcon.value = icon;
    confirmEyebrow.value = eyebrow;
    confirmButtonText.value = confirmText;
    cancelButtonText.value = cancelText;
    isConfirmLoading.value = false;

    onConfirmCallback = onConfirm;
    onCancelCallback = onCancel;

    isConfirmVisible.value = true;
  }

  function hideConfirm() {
    isConfirmVisible.value = false;
    isConfirmLoading.value = false;
    onConfirmCallback = null;
    onCancelCallback = null;
  }

  function handleConfirm() {
    if (typeof onConfirmCallback === 'function') {
      onConfirmCallback();
    }
    hideConfirm();
  }

  function handleCancel() {
    if (typeof onCancelCallback === 'function') {
      onCancelCallback();
    }
    hideConfirm();
  }

  function setConfirmLoading(loading = true) {
    isConfirmLoading.value = loading;
  }

  return {
    isConfirmVisible,
    confirmTitle,
    confirmMessage,
    confirmDetail,
    confirmType,
    confirmIcon,
    confirmEyebrow,
    confirmButtonText,
    cancelButtonText,
    isConfirmLoading,
    openConfirm,
    hideConfirm,
    handleConfirm,
    handleCancel,
    setConfirmLoading
  };
}
