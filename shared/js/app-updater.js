/**
 * MITCalc Web App - Universal Cache Buster & Force Updater for iOS WebClip / PWA / Desktop
 * Đặc trị hiện tượng iOS Cốc Cốc / Safari lưu cache cứng khi Thêm vào Màn hình chính (Add to Home Screen)
 */

(function () {
    'use strict';

    /**
     * Thực hiện ép cập nhật và xóa toàn bộ bộ nhớ đệm
     */
    async function forceAppUpdate() {
        // Tạo màn hình thông báo trực quan
        showUpdateToast();

        try {
            // 1. Xóa toàn bộ Cache Storage API (nếu có)
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(function (name) {
                        return caches.delete(name);
                    })
                );
            }
        } catch (err) {
            console.warn('[Updater] Cache storage deletion error:', err);
        }

        try {
            // 2. Hủy đăng ký toàn bộ Service Workers (nếu có)
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let i = 0; i < registrations.length; i++) {
                    await registrations[i].unregister();
                }
            }
        } catch (err) {
            console.warn('[Updater] Service worker unregister error:', err);
        }

        try {
            // 3. Xóa sessionStorage
            sessionStorage.clear();
        } catch (e) { }

        // 4. Tạo URL mang timestamp để ép iOS WebKit bỏ qua disk cache
        const timestamp = Date.now();
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('v', timestamp);
        currentUrl.searchParams.set('updated', '1');

        // 5. Thử gửi request mạng trực tiếp với header no-cache để re-prime pipeline
        try {
            await fetch(currentUrl.toString(), {
                method: 'GET',
                cache: 'reload',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        } catch (fetchErr) {
            // Vẫn tiếp tục nếu fetch lỗi (ví dụ file:/// hoặc offline)
        }

        // 6. Tải lại trang với URL mới
        setTimeout(function () {
            window.location.replace(currentUrl.toString());
        }, 300);
    }

    /**
     * Hiển thị Toast thông báo đang cập nhật
     */
    function showUpdateToast() {
        if (document.getElementById('updateToastOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'updateToastOverlay';
        overlay.className = 'update-toast-overlay';
        overlay.innerHTML =
            '<div class="update-toast-card">' +
            '  <div class="update-toast-spinner"></div>' +
            '  <div class="update-toast-title">⚡ Đang Cập Nhật Ứng Dụng...</div>' +
            '  <div class="update-toast-desc">' +
            '    Đang xóa toàn bộ bộ nhớ đệm (Cache) trên iPhone / Cốc Cốc và tải phiên bản mới nhất từ máy chủ.<br>' +
            '    Trang sẽ tự động làm mới trong giây lát!' +
            '  </div>' +
            '</div>';
        document.body.appendChild(overlay);
    }

    /**
     * Hiển thị thông báo cập nhật thành công (nếu vừa reload sau update)
     */
    function checkUpdatedNotice() {
        const url = new URL(window.location.href);
        if (url.searchParams.get('updated') === '1') {
            // Xóa query param để URL sạch đẹp mà không reload
            url.searchParams.delete('updated');
            url.searchParams.delete('v');
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : '') + url.hash);
            }

            // Hiển thị badge thành công
            const badge = document.createElement('div');
            badge.style.cssText =
                'position: fixed; top: 16px; left: 50%; transform: translateX(-50%);' +
                'background: #065f46; color: #34d399; border: 1.5px solid #10b981;' +
                'padding: 8px 18px; border-radius: 9999px; font-size: 0.85rem; font-weight: 700;' +
                'box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(16,185,129,0.4);' +
                'z-index: 99999; display: flex; align-items: center; gap: 8px; animation: toastPop 0.25s ease-out;';
            badge.innerHTML = '<span>✅ Đã cập nhật phiên bản mới nhất thành công!</span>';
            document.body.appendChild(badge);

            setTimeout(function () {
                badge.style.opacity = '0';
                badge.style.transition = 'opacity 0.4s ease';
                setTimeout(function () {
                    if (badge.parentNode) badge.parentNode.removeChild(badge);
                }, 400);
            }, 3000);
        }
    }

    // Đăng ký toàn cục
    window.forceAppUpdate = forceAppUpdate;

    // Gắn sự kiện khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        checkUpdatedNotice();

        // Gắn sự kiện click cho các nút có id btnForceUpdate hoặc class btn-force-update
        const buttons = document.querySelectorAll('#btnForceUpdate, .btn-force-update');
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                forceAppUpdate();
            });
        });
    }
})();
