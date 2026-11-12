const form = document.getElementById('orderForm');

if (form) {
    const service = document.getElementById('order-service');
    const fields = document.getElementById('esports-fields');
    const rating = document.getElementById('order-rating');
    const profile = document.getElementById('order-profile');
    const estimate = document.getElementById('esports-estimate');
    const phone = document.getElementById('order-phone');
    const alert = document.getElementById('orderAlert');
    const name = document.getElementById('order-name');
    const requested = new URLSearchParams(window.location.search).get('service');
    const selectedOption = Array.from(service.options).find((option) => option.value === requested);
    if (selectedOption) {
        Array.from(service.options).forEach((option) => { option.defaultSelected = option === selectedOption; });
        service.value = requested;
    }

    const update = () => {
        const esports = service.value === 'esports';
        const discount = Number(rating.value);
        fields.hidden = !esports;
        rating.disabled = !esports;
        profile.disabled = !esports;
        profile.required = esports && discount > 0;
        profile.setCustomValidity('');
        if (esports && profile.value.trim()) {
            try {
                const url = new URL(profile.value);
                if (!['https:', 'http:'].includes(url.protocol) || !['faceit.com', 'www.faceit.com'].includes(url.hostname) || !/^\/(?:[a-z]{2}\/)?players\/[^/]+\/?$/.test(url.pathname)) {
                    profile.setCustomValidity('Укажите ссылку на профиль игрока FACEIT.');
                }
            } catch { profile.setCustomValidity('Укажите ссылку на профиль игрока FACEIT.'); }
        }
        const price = new Intl.NumberFormat('ru-RU').format(4000 * (1 - discount / 100));
        estimate.textContent = `Работы от ${price} ₽ · скидка ${discount}%`;
        const digits = phone.value.replace(/\D/g, '');
        const validPhone = digits.length === 10 || (digits.length === 11 && /^[78]/.test(digits));
        phone.setCustomValidity(validPhone ? '' : 'Введите 10 цифр номера телефона.');
        name.setCustomValidity(name.value.trim().length >= 2 ? '' : 'Введите имя, минимум два символа.');
    };
    form.addEventListener('input', () => { alert.classList.add('d-none'); update(); });
    form.addEventListener('change', () => { alert.classList.add('d-none'); update(); });
    form.addEventListener('reset', () => {
        form.classList.remove('was-validated');
        alert.classList.add('d-none');
        setTimeout(update, 0);
    });
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        update();
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            form.querySelector(':invalid')?.focus();
            return;
        }
        const data = new FormData(form);
        const lines = ['MR CYBORG — заявка', '', `Услуга: ${service.selectedOptions[0].textContent}`, `Имя: ${data.get('name').trim()}`, `Телефон: ${data.get('phone')}`, `E-mail: ${data.get('email')}`, `Устройство: ${data.get('device') || 'Не указано'}`, `Передача техники: ${data.get('delivery')}`, `Задача: ${data.get('comment') || 'Не указана'}`];
        if (service.value === 'esports') lines.push(`Рейтинг: ${rating.selectedOptions[0].textContent}`, `Профиль: ${profile.value || 'Не указан'}`, estimate.textContent, 'Скидка на работы после подтверждения уровня. Комплектующие оплачиваются отдельно.');
        const url = URL.createObjectURL(new Blob(['\ufeff' + lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mr-cyborg-request.txt';
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        alert.classList.remove('d-none');
    });
    update();
}
