import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHeaderScroll(isDrawerOpenRef) {
  const isHeaderVisible = ref(true);

  return {
    isHeaderVisible: ref(true)
  };
}
