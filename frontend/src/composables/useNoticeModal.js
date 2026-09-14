import { ref } from 'vue';

const isNoticeVisible = ref(false);
const noticeType = ref('success');
const noticeTitle = ref('');
const noticeMessage = ref('');
const noticeDetail = ref('');
const noticeConfirmText = ref('Tutup');

export function useNoticeModal() {
  function showNotice({
    type = 'success',
    title = '',
    message = '',
    detail = '',
    confirmText = 'Tutup'
  } = {}) {
    noticeType.value = type;
    noticeTitle.value = title;
    noticeMessage.value = message;
    noticeDetail.value = detail;
    noticeConfirmText.value = confirmText;
    isNoticeVisible.value = true;
  }

  function showSuccess(options = {}) {
    showNotice({ ...options, type: 'success' });
  }

  function showFailed(options = {}) {
    showNotice({ ...options, type: 'failed' });
  }

  function hideNotice() {
    isNoticeVisible.value = false;
  }

  return {
    isNoticeVisible,
    noticeType,
    noticeTitle,
    noticeMessage,
    noticeDetail,
    noticeConfirmText,
    showSuccess,
    showFailed,
    hideNotice
  };
}
