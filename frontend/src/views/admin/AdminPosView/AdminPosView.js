import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth.js';
import PrintableReceipt from '../../../components/admin/PrintableReceipt/PrintableReceipt.vue';
import './AdminPosView.css';

export default {
  name: 'AdminPosView',
  components: { PrintableReceipt },
  setup() {
    const authStore = useAuthStore();
    const products = ref([]);
    const mainCategories = ref([]);
    const subcategories = ref([]);
    const searchQuery = ref('');
    const selectedMainCat = ref('all');
    const selectedSubcat = ref('all');
    const cart = ref([]);
    const orderType = ref('Dine In');
    const tableNumber = ref('Meja 01');
    const customerName = ref('');
    const paymentMethod = ref('Cash');
    const cashReceived = ref(0);
    const isProcessing = ref(false);
    const completedOrder = ref(null);

    const loadData = async () => {
      products.value = [];
      mainCategories.value = [
        { id: 1, name: 'Restaurant Menu', code: 'restaurant' },
        { id: 2, name: 'Raw Material', code: 'raw' }
      ];
      subcategories.value = [];
    };

    onMounted(() => { loadData(); });

    const setMainCategory = (cat) => { selectedMainCat.value = cat; selectedSubcat.value = 'all'; };

    const filteredSubcategories = computed(() => {
      if (selectedMainCat.value === 'all') return subcategories.value;
      const targetMainId = selectedMainCat.value === 'restaurant' ? 1 : 2;
      return subcategories.value.filter(sc => {
        if (sc.mainCategoryId) return Number(sc.mainCategoryId) === targetMainId;
        return selectedMainCat.value === 'restaurant' ? sc.type === 'restaurant' : sc.type === 'raw';
      });
    });

    const getSubcatName = (subcatId) => { const found = subcategories.value.find(s => Number(s.id) === Number(subcatId)); return found?.name || 'Menu'; };

    const filteredProducts = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      return products.value.filter(prod => {
        let matchMain = true;
        if (selectedMainCat.value === 'restaurant') matchMain = prod.category === 'restaurant' || prod.mainCategoryId === 1;
        else if (selectedMainCat.value === 'raw') matchMain = prod.category === 'raw' || prod.mainCategoryId === 2;
        let matchSub = true;
        if (selectedSubcat.value !== 'all') matchSub = String(prod.subcategoryId || prod.categoryId) === String(selectedSubcat.value);
        let matchQuery = true;
        if (query) matchQuery = (prod.name + ' ' + (prod.description || '')).toLowerCase().includes(query);
        return matchMain && matchSub && matchQuery;
      });
    });

    const getCartQty = (productId) => { const item = cart.value.find(i => i.id === productId); return item ? item.quantity : 0; };

    const addToCart = (product) => {
      const existing = cart.value.find(i => i.id === product.id);
      if (existing) { if (existing.quantity < product.stock) existing.quantity++; }
      else { cart.value.push({ id: product.id, name: product.name, price: product.numericPrice || 0, unit: product.unit || '1 porsi', stock: product.stock, quantity: 1, image: product.image }); }
    };

    const increaseQty = (productId) => { const item = cart.value.find(i => i.id === productId); if (item && item.quantity < item.stock) item.quantity++; };
    const decreaseQty = (productId) => { const item = cart.value.find(i => i.id === productId); if (item) { if (item.quantity > 1) item.quantity--; else removeFromCart(productId); } };
    const removeFromCart = (productId) => { cart.value = cart.value.filter(i => i.id !== productId); };
    const clearCart = () => { cart.value = []; cashReceived.value = 0; };

    const cartTotalItems = computed(() => cart.value.reduce((acc, item) => acc + item.quantity, 0));
    const subtotal = computed(() => cart.value.reduce((acc, item) => acc + (item.price * item.quantity), 0));
    const grandTotal = computed(() => subtotal.value);
    const cashChange = computed(() => (cashReceived.value || 0) - grandTotal.value);

    const handleProcessOrder = async () => {
      if (cart.value.length === 0) return;
      if (paymentMethod.value === 'Cash' && cashReceived.value < grandTotal.value) { alert('Jumlah uang tunai yang diterima kurang dari total pembayaran!'); return; }
      isProcessing.value = true;
      try {
        const cashierName = authStore.user?.name || authStore.user?.username || 'Kasir Warung';
        const orderData = {
          orderType: orderType.value, tableNumber: orderType.value === 'Dine In' ? tableNumber.value : null,
          customerName: customerName.value.trim() || (orderType.value === 'Dine In' ? `Tamu ${tableNumber.value}` : 'Pelanggan Kasir POS'),
          items: cart.value.map(item => ({ id: item.id, productId: item.id, name: item.name, price: item.price, quantity: item.quantity, subtotal: item.price * item.quantity })),
          totalAmount: grandTotal.value, paymentMethod: paymentMethod.value,
          cashReceived: paymentMethod.value === 'Cash' ? cashReceived.value : grandTotal.value,
          cashChange: paymentMethod.value === 'Cash' ? Math.max(0, cashChange.value) : 0, cashier: cashierName
        };
        const newOrder = { id: Date.now(), orderType: orderType.value, items: orderData.items, totalAmount: grandTotal.value, paymentMethod: paymentMethod.value, cashReceived: orderData.cashReceived, cashChange: orderData.cashChange, customerName: orderData.customerName, tableNumber: orderData.tableNumber, cashier: cashierName, createdAt: new Date().toISOString() };
        completedOrder.value = newOrder;
      } catch (err) { alert('Gagal memproses transaksi: ' + err.message); } finally { isProcessing.value = false; }
    };

    const closeSuccessModal = () => { completedOrder.value = null; clearCart(); customerName.value = ''; };
    const printReceipt = () => { window.print(); };
    const handleImgError = (event) => { event.target.src = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600'; };

    return { products, mainCategories, subcategories, searchQuery, selectedMainCat, selectedSubcat, cart, orderType, tableNumber, customerName, paymentMethod, cashReceived, isProcessing, completedOrder, setMainCategory, filteredSubcategories, getSubcatName, filteredProducts, getCartQty, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart, cartTotalItems, subtotal, grandTotal, cashChange, handleProcessOrder, closeSuccessModal, printReceipt, handleImgError };
  }
};
