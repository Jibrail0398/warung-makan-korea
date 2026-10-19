import { reactive } from 'vue';

export function createNotificationModal() {
  return reactive({
    isOpen: false,
    isSuccess: true,
    message: ''
  });
}