import { ref, onBeforeUnmount } from 'vue';

const isToastVisible = ref(false);
const toastMessage = ref('');
let toastTimer = null;

export function useToast() {
  function showToast(message, duration = 2200) {
    toastMessage.value = message;
    isToastVisible.value = true;

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      isToastVisible.value = false;
    }, duration);
  }

  function hideToast() {
    isToastVisible.value = false;
    if (toastTimer) clearTimeout(toastTimer);
  }

  onBeforeUnmount(() => {
    if (toastTimer) clearTimeout(toastTimer);
  });

  return {
    isToastVisible,
    toastMessage,
    showToast,
    hideToast
  };
}
