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
