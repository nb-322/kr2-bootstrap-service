// Применяем тему до загрузки стилей. По умолчанию — фирменная тёмная.
try {
    const saved = localStorage.getItem('mr-cyborg-theme');
    document.documentElement.dataset.theme = saved === 'light' ? 'light' : 'dark';
} catch { document.documentElement.dataset.theme = 'dark'; }
