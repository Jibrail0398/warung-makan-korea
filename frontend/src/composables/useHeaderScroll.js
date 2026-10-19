import { ref } from 'vue';

export function useHeaderScroll() {
  return {
    isHeaderVisible: ref(true)
  };
}