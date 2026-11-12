const forms = document.querySelectorAll('.js-form');
const toastElement = document.getElementById('orderToast');
const orderAlert = document.getElementById('orderAlert');
const orderModalElement = document.getElementById('orderModal');

forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        form.classList.remove('was-validated');
        form.reset();

        if (toastElement) {
            bootstrap.Toast.getOrCreateInstance(toastElement).show();
        }

        if (orderAlert && form.id === 'orderForm') {
            orderAlert.classList.remove('d-none');
        }

        if (orderModalElement && orderModalElement.contains(form)) {
            bootstrap.Modal.getOrCreateInstance(orderModalElement).hide();
        }
    });

    form.addEventListener('reset', () => {
        form.classList.remove('was-validated');
    });
});

const serviceSelect = document.getElementById('order-service');
const esportsFields = document.getElementById('esports-fields');
const ratingSelect = document.getElementById('order-rating');
const profileInput = document.getElementById('order-profile');
const esportsEstimate = document.getElementById('esports-estimate');

if (serviceSelect && esportsFields && ratingSelect && profileInput && esportsEstimate) {
    const updateEsports = () => {
        const selected = serviceSelect.value === 'esports';
        esportsFields.hidden = !selected;
        ratingSelect.disabled = !selected;
        profileInput.disabled = !selected;
        const discount = Number(ratingSelect.value);
        profileInput.required = selected && discount > 0;
        const price = new Intl.NumberFormat('ru-RU').format(4000 * (1 - discount / 100));
        esportsEstimate.textContent = `Работы от ${price} ₽ · скидка ${discount}%`;
    };

    if (new URLSearchParams(window.location.search).get('service') === 'esports') {
        serviceSelect.value = 'esports';
    }
    serviceSelect.addEventListener('change', updateEsports);
    ratingSelect.addEventListener('change', updateEsports);
    serviceSelect.form.addEventListener('reset', () => {
        // Reset values are applied after the reset event finishes.
        setTimeout(updateEsports, 0);
    });
    updateEsports();
}
