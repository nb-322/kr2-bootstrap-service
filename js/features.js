/* Общие интерактивные возможности всех страниц. Сборка и сервер не требуются. */
(() => {
    const products = [
    {
        "id": "battery",
        "name": "Замена аккумулятора",
        "price": 2800,
        "tags": "Подбираем совместимый аккумулятор и возвращаем устройству автономность.",
        "url": "service-battery.html"
    },
    {
        "id": "camera",
        "name": "Замена камеры смартфона",
        "price": 3200,
        "tags": "Не работает фокус, появились пятна или камера не включается? Подберём модуль под вашу модель.",
        "url": "service-camera.html"
    },
    {
        "id": "charging",
        "name": "Ремонт разъёма зарядки",
        "price": 2400,
        "tags": "Телефон не заряжается или кабель отходит? Проверим разъём и цепь питания, устраним неисправность.",
        "url": "service-charging.html"
    },
    {
        "id": "cooling",
        "name": "Чистка и замена термопасты",
        "price": 2200,
        "tags": "Устраняем пыль и перегрев ноутбука или ПК, обслуживаем систему охлаждения.",
        "url": "service-cooling.html"
    },
    {
        "id": "data",
        "name": "Восстановление данных",
        "price": 4000,
        "tags": "Восстанавливаем файлы с повреждённых дисков, флешек и карт памяти. Возможность восстановления оценим после диагностики.",
        "url": "service-data.html"
    },
    {
        "id": "esports",
        "name": "Анализ и апгрейд ПК для киберспорта",
        "price": 4000,
        "tags": "Готовим ПК под вашу игру, монитор и бюджет: анализируем производительность, подбираем апгрейд и настраиваем систему.",
        "url": "service-esports.html"
    },
    {
        "id": "motherboard",
        "name": "Ремонт материнской платы",
        "price": 5500,
        "tags": "Находим неисправности платы компьютера или ноутбука и восстанавливаем работу компонентов.",
        "url": "service-motherboard.html"
    },
    {
        "id": "ram",
        "name": "Установка оперативной памяти",
        "price": 1200,
        "tags": "Подберём совместимую память для ПК или ноутбука, установим модули и проверим стабильность работы.",
        "url": "service-ram.html"
    },
    {
        "id": "screen",
        "name": "Замена экрана смартфона",
        "price": 3500,
        "tags": "Меняем дисплейный модуль целиком: стекло, матрицу и тачскрин. Работаем с iPhone, Samsung, Xiaomi и Honor.",
        "url": "service-screen.html"
    },
    {
        "id": "software",
        "name": "Установка системы и программ",
        "price": 1500,
        "tags": "Устанавливаем Windows или Linux, драйверы и нужные программы. Перенос файлов согласуем до начала работ.",
        "url": "service-software.html"
    },
    {
        "id": "ssd",
        "name": "Замена SSD и перенос системы",
        "price": 1800,
        "tags": "Установим совместимый SSD и перенесём систему с файлами, чтобы компьютер быстрее запускался и открывал программы.",
        "url": "service-ssd.html"
    }
];
    const money = (value) => `${value.toLocaleString('ru-RU')} ₽`;
    const normalize = (value) => value.toLowerCase().replaceAll('ё', 'е').trim();
    const header = document.querySelector('.navbar > .container');
    if (!header) return;
    header.insertAdjacentHTML('beforeend', `
        <div class="site-tools" aria-label="Инструменты сервиса">
            <button class="tool-button site-tools__search" id="open-search" type="button" aria-haspopup="dialog"><span aria-hidden="true">⌕</span> Поиск по сайту <kbd>Ctrl K</kbd></button>
            <button class="tool-button" id="open-picker" type="button" aria-haspopup="dialog">✧ Подобрать ремонт</button>
            <button class="tool-button" id="theme-toggle" type="button" aria-pressed="false">Тёмная тема</button>
        </div>`);
    document.body.insertAdjacentHTML('beforeend', `
        <dialog class="feature-dialog" id="search-dialog" aria-labelledby="search-title">
            <div class="feature-dialog__heading"><h2 id="search-title">Поиск по MR CYBORG</h2><button class="icon-button" type="button" data-close="search-dialog" aria-label="Закрыть поиск">×</button></div>
            <label class="field-label" for="site-search">Услуга, раздел или вопрос</label>
            <input class="feature-input" id="site-search" type="search" placeholder="Например, перегрев или замена экрана" autocomplete="off" maxlength="100" autofocus>
            <p class="feature-muted" id="search-status" role="status"></p>
            <ul class="search-results" id="search-results"></ul>
        </dialog>
        <dialog class="feature-dialog" id="picker-dialog" aria-labelledby="picker-title">
            <div class="feature-dialog__heading"><div><span class="eyebrow">ЛАБОРАТОРИЯ MR CYBORG</span><h2 id="picker-title">Что случилось с техникой?</h2></div><button class="icon-button" type="button" data-close="picker-dialog" aria-label="Закрыть подбор">×</button></div>
            <p class="feature-muted">Расскажи о симптоме — подскажем, с какой услуги начать. Точную причину определит мастер на бесплатной диагностике.</p>
            <form id="picker-form" class="picker-form">
                <label class="field-label" for="picker-device">Твоё устройство</label>
                <select class="feature-input" id="picker-device"><option value="computer">Компьютер или ноутбук</option><option value="phone">Смартфон</option></select>
                <label class="field-label" for="picker-symptom">Что случилось?</label>
                <select class="feature-input" id="picker-symptom"></select>
                <button class="button button--primary" type="submit">Запустить анализ →</button>
            </form>
            <div class="picker-result" id="picker-result" role="status"></div>
        </dialog>
        <button class="chat-launcher" id="chat-launcher" type="button" aria-expanded="false" aria-controls="cyborg-chat"><span class="chat-launcher__icon" aria-hidden="true">▣</span><span>MR CYBORG<small>Спросить консультанта</small></span></button>
        <section class="cyborg-chat" id="cyborg-chat" aria-labelledby="chat-title" hidden>
            <div class="cyborg-chat__header"><div><strong id="chat-title">▣ MR CYBORG</strong><small>Бот-консультант · ответы автоматически</small></div><button class="icon-button" id="chat-close" type="button" aria-label="Закрыть чат">×</button></div>
            <div class="cyborg-chat__messages" id="chat-messages" role="log" aria-live="polite" aria-relevant="additions"></div>
            <p class="cyborg-chat__typing" id="chat-typing" role="status" hidden>MR CYBORG печатает<span aria-hidden="true">…</span></p>
            <div class="cyborg-chat__suggestions"><button type="button" data-question="Диагностика">Диагностика</button><button type="button" data-question="Сколько стоит ремонт?">Цены</button><button type="button" data-question="Как оставить заявку?">Заявка</button></div>
            <form class="cyborg-chat__form" id="chat-form"><label class="visually-hidden" for="chat-input">Сообщение консультанту</label><input class="feature-input" id="chat-input" placeholder="Напиши свой вопрос…" maxlength="500" autocomplete="off" required><button class="button button--primary" type="submit" aria-label="Отправить сообщение">➜</button></form>
        </section>`);

    const themeButton = document.getElementById('theme-toggle');
    function syncThemeButton() {
        const dark = document.documentElement.dataset.theme === 'dark';
        themeButton.textContent = dark ? '☀ Светлая тема' : '☾ Тёмная тема';
        themeButton.setAttribute('aria-pressed', String(dark));
    }
    document.body.dataset.bsTheme = document.documentElement.dataset.theme;
    syncThemeButton();
    themeButton.addEventListener('click', () => {
        const change = () => {
            const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            document.body.dataset.bsTheme = next;
            try { localStorage.setItem('mr-cyborg-theme', next); } catch { /* Тема работает и без хранилища. */ }
            syncThemeButton();
        };
        if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.startViewTransition(change);
        } else { change(); }
    });
    window.addEventListener('storage', (event) => {
        if (event.key === 'mr-cyborg-theme' && ['light', 'dark'].includes(event.newValue)) {
            document.documentElement.dataset.theme = event.newValue;
            document.body.dataset.bsTheme = event.newValue;
            syncThemeButton();
        }
    });

    const searchDialog = document.getElementById('search-dialog');
    const pickerDialog = document.getElementById('picker-dialog');
    const searchInput = document.getElementById('site-search');
    document.getElementById('open-search').addEventListener('click', () => searchDialog.showModal());
    document.getElementById('open-picker').addEventListener('click', () => pickerDialog.showModal());
    document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
    [searchDialog, pickerDialog].forEach((dialog) => dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }));
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.code === 'KeyK') {
            event.preventDefault();
            if (!document.querySelector('dialog[open]')) searchDialog.showModal();
            if (searchDialog.open) searchInput.focus();
        }
    });
    const pages = [
        { name: 'Главная', tags: 'сервис ремонт техника', url: 'index.html', detail: 'О сервисе MR CYBORG' },
        { name: 'Компьютерные услуги', tags: 'ноутбук пк компьютер', url: 'computer-services.html', detail: 'Ремонт и апгрейд ПК' },
        { name: 'Телефонные услуги', tags: 'смартфон телефон iphone samsung', url: 'phone-services.html', detail: 'Ремонт смартфонов' },
        { name: 'Заявка на ремонт', tags: 'заказ заявка записаться курьер', url: 'order.html', detail: 'Выбрать услугу и заполнить заявку' },
        { name: 'Контакты', tags: 'адрес телефон почта время работы москва маршрут', url: 'contacts.html', detail: 'Ежедневно 08:00–22:00 · МСК' }
    ];
    const searchIndex = [...products.map((product) => ({ ...product, detail: `от ${money(product.price)}` })), ...pages];
    function renderSearch() {
        const words = normalize(searchInput.value).split(/\s+/).filter(Boolean);
        const found = searchIndex.filter((item) => words.every((word) => normalize(`${item.name} ${item.tags}`).includes(word)));
        document.getElementById('search-status').textContent = words.length ? (found.length ? `Найдено: ${found.length}` : 'Ничего не найдено. Попробуй «экран», «перегрев» или «контакты».') : 'Услуги и разделы сайта';
        const list = document.getElementById('search-results');
        list.replaceChildren();
        found.forEach((item) => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = item.url;
            const title = document.createElement('strong');
            title.textContent = item.name;
            const detail = document.createElement('span');
            detail.textContent = item.detail;
            link.append(title, detail);
            li.append(link);
            list.append(li);
        });
    }
    searchInput.addEventListener('input', renderSearch);
    renderSearch();

    const symptoms = {
        computer: [ ['cooling', 'Греется, шумит или выключается'], ['ssd', 'Медленно запускается и открывает файлы'], ['ram', 'Не хватает памяти при работе'], ['motherboard', 'Не включается'], ['software', 'Ошибки системы или программ'], ['data', 'Пропали важные файлы'], ['esports', 'Хочу больше FPS в играх'] ],
        phone: [ ['screen', 'Разбит экран или не работает сенсор'], ['battery', 'Быстро разряжается'], ['charging', 'Не заряжается или отходит кабель'], ['camera', 'Камера не работает или не фокусируется'], ['data', 'Нужно восстановить файлы'] ]
    };
    const device = document.getElementById('picker-device');
    const symptom = document.getElementById('picker-symptom');
    const result = document.getElementById('picker-result');
    function updateSymptoms() {
        symptom.replaceChildren();
        symptoms[device.value].forEach(([id, label]) => {
            const option = document.createElement('option'); option.value = id; option.textContent = label; symptom.append(option);
        });
        result.replaceChildren();
    }
    device.addEventListener('change', updateSymptoms);
    symptom.addEventListener('change', () => result.replaceChildren());
    updateSymptoms();
    document.getElementById('picker-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const service = products.find((item) => item.id === symptom.value);
        result.replaceChildren();
        const caption = document.createElement('span'); caption.className = 'eyebrow'; caption.textContent = 'АНАЛИЗ ЗАВЕРШЁН';
        const title = document.createElement('h3'); title.textContent = service.name;
        const description = document.createElement('p'); description.textContent = service.tags;
        const price = document.createElement('p'); price.textContent = `Работы от ${money(service.price)}. Итоговую стоимость согласуем после диагностики.`;
        const detail = document.createElement('a'); detail.className = 'picker-result__item'; detail.href = service.url; detail.textContent = 'Что входит в услугу ↗';
        const order = document.createElement('a'); order.className = 'btn btn-primary'; order.href = `order.html?service=${service.id}`; order.textContent = 'Оставить заявку →';
        result.append(caption, title, description, price, detail, order);
        result.classList.remove('result-ready'); void result.offsetWidth; result.classList.add('result-ready');
    });

    const chat = document.getElementById('cyborg-chat');
    const launcher = document.getElementById('chat-launcher');
    const chatInput = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    let history = [];
    try {
        const saved = JSON.parse(sessionStorage.getItem('mr-cyborg-chat-history') || '[]');
        if (Array.isArray(saved)) history = saved.filter((item) => item && ['bot', 'user'].includes(item.role) && typeof item.text === 'string').slice(-40);
    } catch { /* Новая беседа при недоступном хранилище. */ }
    function addMessage(role, text, save = true) {
        const bubble = document.createElement('p');
        bubble.className = `cyborg-chat__message cyborg-chat__message--${role}`;
        const name = document.createElement('strong');
        name.textContent = role === 'bot' ? 'MR CYBORG' : 'Вы';
        bubble.append(name, document.createTextNode(text));
        messages.append(bubble);
        messages.scrollTop = messages.scrollHeight;
        if (save) {
            history.push({ role, text });
            history = history.slice(-40);
            try { sessionStorage.setItem('mr-cyborg-chat-history', JSON.stringify(history)); } catch { /* Беседа продолжится в памяти. */ }
        }
    }
    history.forEach((item) => addMessage(item.role, item.text, false));
    if (!history.length) addMessage('bot', 'Привет! Я MR CYBORG, бот-консультант сервиса. Помогу узнать цены, условия ремонта и найти нужную услугу. Опиши поломку или нажми «Подобрать ремонт» в меню.');
    function toggleChat(open) {
        chat.hidden = !open;
        launcher.setAttribute('aria-expanded', String(open));
        if (open) { chatInput.focus(); messages.scrollTop = messages.scrollHeight; }
        else launcher.focus();
    }
    launcher.addEventListener('click', () => toggleChat(chat.hidden));
    document.getElementById('chat-close').addEventListener('click', () => toggleChat(false));
    chat.addEventListener('keydown', (event) => { if (event.key === 'Escape') toggleChat(false); });
    function reply(question) {
        const q = normalize(question);
        if (/диагност/.test(q)) return 'Диагностика бесплатная. Мастер определит причину и согласует точную стоимость до начала работ. Начать можно с раздела «Подобрать ремонт».';
        if (/гарант/.test(q)) return 'На выполненные работы — 6 месяцев. Условия гарантии на комплектующие фиксируем в заказе. Подробности есть на странице каждой услуги.';
        if (/достав|курьер|переда/.test(q)) return 'Технику можно передать в сервисе или курьером. Выбери способ передачи в заявке; детали согласуем отдельно.';
        if (/контакт|телефон|адрес|работаете|график/.test(q)) return 'Мы на связи ежедневно с 08:00 до 22:00 (МСК). Телефон: +7 (919) 899-84-36. Почта: MISTER_CYBORG@yandex.ru. Москва, бульвар Генерала Карбышева, 18к3. Карта — в «Контактах».';
        if (/заявк|заказ|запис/.test(q)) return 'Нажми «Оставить заявку», выбери услугу и заполни форму. Сайт скачает текстовый файл с заявкой: автоматическая отправка пока не подключена. Свяжись с сервисом по контактам, чтобы передать заявку.';
        const rules = [ [/экран|сенсор|стекло/, 'screen'], [/разряж|аккум|батаре/, 'battery'], [/заряд|кабел|разъем/, 'charging'], [/камер|фокус/, 'camera'], [/греет|перегрев|шум|термопаст|чистк/, 'cooling'], [/файл|данны|восстанов/, 'data'], [/fps|фпс|киберспорт|faceit/, 'esports'], [/памят|оператив|озу/, 'ram'], [/медлен|ssd|ссд|тормоз/, 'ssd'], [/не включ|материн/, 'motherboard'], [/windows|linux|программ|систем/, 'software'] ];
        const rule = rules.find(([pattern]) => pattern.test(q));
        if (rule) {
            const service = products.find((item) => item.id === rule[1]);
            return `${service.name} — работы от ${money(service.price)}. ${service.tags} Это предварительная рекомендация: точную причину определит мастер. Найди услугу в поиске или нажми «Подобрать ремонт».`;
        }
        if (/цен|стоит|стоим/.test(q)) return 'Например: чистка — от 2 200 ₽, замена экрана — от 3 500 ₽, установка ОЗУ — от 1 200 ₽. Все услуги и начальные цены доступны в поиске. Итог зависит от диагностики и комплектующих.';
        if (/привет|здравств|спасибо/.test(q)) return 'Бип-буп! На связи MR CYBORG. Расскажи, что случилось с техникой, или спроси о диагностике и ценах.';
        return 'Пока не распознал вопрос. Я могу рассказать про экран, батарею, перегрев, апгрейд, диагностику, гарантию и заявку. А «Подобрать ремонт» поможет выбрать услугу по симптому.';
    }
    let pending = false;
    function sendQuestion(text) {
        if (pending || !text.trim()) return;
        pending = true;
        addMessage('user', text.trim());
        chatInput.value = '';
        document.getElementById('chat-typing').hidden = false;
        chat.querySelectorAll('button[type="submit"], [data-question]').forEach((button) => { button.disabled = true; });
        window.setTimeout(() => {
            document.getElementById('chat-typing').hidden = true;
            addMessage('bot', reply(text));
            pending = false;
            chat.querySelectorAll('button[type="submit"], [data-question]').forEach((button) => { button.disabled = false; });
        }, 900);
    }
    document.getElementById('chat-form').addEventListener('submit', (event) => { event.preventDefault(); sendQuestion(chatInput.value); });
    chat.querySelectorAll('[data-question]').forEach((button) => button.addEventListener('click', () => sendQuestion(button.dataset.question)));

    // Появление блоков при прокрутке; без поддержки API контент сразу виден.
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add('reveal--visible'); observer.unobserve(entry.target); }
        }), { threshold: 0.08 });
        document.querySelectorAll('.service-card, .category-card, .contact-card, .repair-terminal').forEach((element) => { element.classList.add('reveal'); observer.observe(element); });
    }
})();
