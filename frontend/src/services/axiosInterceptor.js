import axios from 'axios';

let isShowingAuthModal = false;

export function setupAxiosInterceptors(router) {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message || '';

      if (status === 401 || message.toLowerCase().includes('unauthenticated')) {
        if (!isShowingAuthModal) {
          isShowingAuthModal = true;

          const overlay = document.createElement('div');
          overlay.id = 'auth-modal-overlay';
          overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 9999;
            background: rgba(25,21,18,0.55); backdrop-filter: blur(3px);
            display: grid; place-items: center; padding: 20px;
          `;

          const dialog = document.createElement('div');
          dialog.style.cssText = `
            width: 100%; max-width: 400px; background: #fff;
            border-radius: 12px; padding: 24px;
            border: 1px solid #e5e5e5; box-shadow: 0 4px 24px rgba(0,0,0,0.12);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          `;

          dialog.innerHTML = `
            <h3 style="margin:0 0 10px; font-size:1.15rem; color:#1a1512; font-family:Georgia,serif;">
              Sesi Berakhir
            </h3>
            <p style="margin:0 0 20px; font-size:0.86rem; color:#6b6560; line-height:1.5;">
              Sesi login Anda telah berakhir atau token tidak valid. Silakan login kembali untuk melanjutkan.
            </p>
            <div style="display:flex; justify-content:flex-end;">
              <button id="auth-modal-ok-btn" style="
                padding: 8px 20px; border-radius: 6px; border:none;
                background:#c0392b; color:#fff; font-size:0.82rem;
                font-weight:700; cursor:pointer;
              ">Login Kembali</button>
            </div>
          `;

          overlay.appendChild(dialog);
          document.body.appendChild(overlay);

          document.getElementById('auth-modal-ok-btn').addEventListener('click', () => {
            document.body.removeChild(overlay);
            isShowingAuthModal = false;
            localStorage.removeItem('warung-auth-data');
            router.push('/login');
          });
        }
      }

      return Promise.reject(error);
    }
  );
}
