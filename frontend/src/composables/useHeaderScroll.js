import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHeaderScroll(isDrawerOpenRef) {
  const isHeaderVisible = ref(true);
  let lastScrollY = 0;

  function handleScroll() {
    const currentScrollY = window.scrollY;

    // Selalu tampil ketika berada di paling atas
    if (currentScrollY <= 20) {
      isHeaderVisible.value = true;
      lastScrollY = currentScrollY;
      return;
    }

    // Jangan sembunyikan header ketika drawer mobile sedang terbuka
    if (isDrawerOpenRef && isDrawerOpenRef.value) {
      isHeaderVisible.value = true;
      lastScrollY = currentScrollY;
      return;
    }

    const scrollDifference = currentScrollY - lastScrollY;

    // Scroll ke bawah
    if (scrollDifference > 6) {
      isHeaderVisible.value = false;
    }

    // Scroll ke atas
    if (scrollDifference < -6) {
      isHeaderVisible.value = true;
    }

    lastScrollY = currentScrollY;
  }

  onMounted(() => {
    lastScrollY = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return {
    isHeaderVisible
  };
}
