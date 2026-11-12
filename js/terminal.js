/* Декоративные команды выполняются внутри страницы, без доступа к системе. */
(() => {
    const form = document.getElementById('terminal-form');
    if (!form) return;
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const home = document.getElementById('terminal-home');
    const stage = document.getElementById('terminal-stage');
    const canvas = document.getElementById('terminal-canvas');
    const context = canvas.getContext('2d');
    const label = document.getElementById('terminal-mode');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let mode = '', frame = 0, elapsed = 0, previous = 0, lastMatrix = 0;
    let drops = [], blobs = [], image, visible = true;
    const history = [];
    let historyIndex = 0;
    const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ZX<>:+=*';

    function resize() {
        if (!mode) return;
        const scale = mode === 'lava' ? 4 : 1;
        canvas.width = Math.max(1, Math.floor(stage.clientWidth / scale));
        canvas.height = Math.max(1, Math.floor(stage.clientHeight / scale));
        context.fillStyle = '#050b08';
        context.fillRect(0, 0, canvas.width, canvas.height);
        drops = Array.from({ length: Math.ceil(canvas.width / 15) }, () => ({ y: -Math.random() * canvas.height, speed: 8 + Math.random() * 12 }));
        image = context.createImageData(canvas.width, canvas.height);
        draw();
    }
    function matrix() {
        const { width, height } = canvas;
        context.fillStyle = 'rgba(3, 12, 7, .14)';
        context.fillRect(0, 0, width, height);
        context.font = '14px monospace';
        drops.forEach((drop, column) => {
            const char = glyphs[Math.floor(Math.random() * glyphs.length)];
            context.fillStyle = '#29d76b';
            context.fillText(char, column * 15, drop.y - 15);
            context.fillStyle = '#cdffdf';
            context.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], column * 15, drop.y);
            drop.y += drop.speed;
            if (drop.y > height + 40 && Math.random() > .97) drop.y = -15;
        });
    }
    function lava() {
        const { width, height } = canvas;
        const t = elapsed / 1000;
        const positions = blobs.map((blob) => ({
            x: (.5 + Math.sin(t * blob.speed * .6 + blob.phase) * blob.travel) * width,
            y: (.5 + Math.cos(t * blob.speed + blob.phase) * .43) * height,
            r: blob.radius * Math.min(width, height)
        }));
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let field = 0;
                positions.forEach((blob) => {
                    const dx = x - blob.x, dy = y - blob.y;
                    field += blob.r * blob.r / (dx * dx + dy * dy + .1);
                });
                // Тёплый свет из нижней части лампы, плавные границы сливающихся капель.
                const glow = Math.max(0, 1 - Math.abs(field - 1) * 2);
                const inside = Math.max(0, Math.min(1, (field - .92) * 8));
                const warmth = y / height;
                const i = (y * width + x) * 4;
                image.data[i] = 14 + glow * 40 + inside * 195;
                image.data[i + 1] = 7 + glow * 7 + inside * (38 + warmth * 95);
                image.data[i + 2] = 29 + glow * 21 + inside * (40 - warmth * 30);
                image.data[i + 3] = 255;
            }
        }
        context.putImageData(image, 0, 0);
    }
    function draw() {
        if (mode === 'cmatrix') matrix();
        else if (mode === 'lava') lava();
    }
    function tick(now) {
        if (!mode || document.hidden || !visible || reducedMotion.matches) { frame = 0; return; }
        elapsed += previous ? Math.min(now - previous, 80) : 0;
        previous = now;
        if (now - lastMatrix > (mode === 'lava' ? 33 : 50)) {
            draw(); lastMatrix = now;
        }
        frame = requestAnimationFrame(tick);
    }
    function resume() {
        if (!frame && mode && visible && !document.hidden && !reducedMotion.matches) {
            previous = 0;
            frame = requestAnimationFrame(tick);
        }
    }
    function stop(focus = true) {
        cancelAnimationFrame(frame); frame = 0; mode = '';
        home.hidden = false; stage.hidden = true;
        output.textContent = 'Процесс завершён. cmatrix · lava · help';
        if (focus) input.focus();
    }
    function start(next) {
        if (!context) { output.textContent = 'Браузер не поддерживает анимацию Canvas.'; return; }
        cancelAnimationFrame(frame); frame = 0;
        mode = next; elapsed = 0; previous = 0; lastMatrix = 0;
        home.hidden = true; stage.hidden = false;
        blobs = Array.from({ length: 7 }, (_, index) => ({ phase: index * 1.8, radius: .12 + Math.random() * .08, travel: .15 + Math.random() * .22, speed: .25 + Math.random() * .2 }));
        label.textContent = next === 'lava' ? 'LAVA / ambient mode' : 'CMATRIX / digital rain';
        output.textContent = reducedMotion.matches ? 'Движение отключено в настройках устройства. Показан статичный кадр. Выход: Esc.' : `${next} запущен. Выход: Esc, Ctrl+C или exit.`;
        resize();
        if (mode === 'cmatrix' && reducedMotion.matches) {
            drops.forEach((drop) => { drop.y = Math.random() * canvas.height; });
            for (let i = 0; i < 20; i++) matrix();
        }
        resume();
    }
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const command = input.value.trim().toLowerCase();
        input.value = '';
        if (!command) return;
        history.push(command); historyIndex = history.length;
        if (command === 'cmatrix') start('cmatrix');
        else if (['lava', 'lavat', 'lavalamp', 'лава'].includes(command)) start('lava');
        else if (['exit', 'stop', 'clear', 'reset'].includes(command)) stop(false);
        else if (command === 'help') output.textContent = 'cmatrix — Матрица; lava / lavat — лавовая лампа; exit — выход; clear — сброс. Esc / Ctrl+C — остановить. ↑ ↓ — история.';
        else output.textContent = `Команда «${command}» не найдена. Введи help для списка команд.`;
    });
    input.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            historyIndex = Math.max(0, Math.min(history.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
            input.value = history[historyIndex] || '';
        }
    });
    const terminal = form.closest('.repair-terminal');
    terminal.addEventListener('keydown', (event) => {
        if (mode && (event.key === 'Escape' || (event.ctrlKey && event.key.toLowerCase() === 'c'))) {
            event.preventDefault(); stop();
        }
    });
    document.getElementById('terminal-stop').addEventListener('click', () => stop());
    new ResizeObserver(resize).observe(stage);
    if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); }).observe(terminal);
    document.addEventListener('visibilitychange', resume);
    reducedMotion.addEventListener('change', () => { if (mode) start(mode); });
    window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
})();
