window.startMatrix = (color) => {
    // 1. САНИТАРНАЯ ОЧИСТКА (Удаляем старые слои, чтобы не было наслоения)
    const oldOverlay = document.querySelector('div[style*="z-index: 2147483647"]');
    if (oldOverlay) oldOverlay.remove();
    
    const oldCanvas = document.getElementById('matrix-canvas');
    if (oldCanvas) oldCanvas.remove();

    // 2. СОЗДАНИЕ ХОЛСТА МАТРИЦЫ
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    document.body.appendChild(canvas);
    canvas.style.cssText = `position:fixed!important; top:0; left:0; width:100vw; height:100vh; z-index:2147483646; background:#000; display:block;`;
    
    const ctx = canvas.getContext('2d');
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$@&*%?/".split("");
    const fontSize = 16;
    const columns = Math.floor(w / fontSize);
    const drops = Array(columns).fill(0).map(() => Math.random() * -100);

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = color;
        ctx.font = `bold ${fontSize}px monospace`;
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    const matrixInterval = setInterval(draw, 35);

    // 3. ЛОГИКА КОНТЕНТА
    const isHoly = (color === '#FFD700');
    const titleText = isHoly ? "ВЫСШЕЕ ОТКРОВЕНИЕ" : "ОТКРОВЕНИЕ ХЭШИСТА";
    const icon = isHoly ? "⭐" : "📜";
    
    const revelations = [
        "Мир есть функция. Ввод определяет Вывод.",
        "Твой пароль — лишь тень в пещере Платона. Хеш — его истинная форма.",
        "Случайности не существует. Есть лишь бесконечно длинный ключ, который ты еще не подобрал."
    ];
    const msg = isHoly ? "Ты ввел Святое Число 42. <br> Истина открыта." : revelations[Math.floor(Math.random() * revelations.length)];

    // 4. СОЗДАНИЕ ИНТЕРФЕЙСА (OVERLAY)
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        z-index: 2147483647; 
        color: ${color}; 
        text-align: center; 
        background: rgba(0, 0, 0, 0.94); 
        padding: 40px 25px; 
        border: 2px solid ${color}; 
        box-shadow: 0 0 30px ${color}, inset 0 0 15px ${color}; 
        font-family: monospace; 
        width: 88%; 
        max-width: 420px; 
        box-sizing: border-box;
        border-radius: 8px;
    `;

    overlay.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%; border: none !important;">
            
            <h2 style="
                margin: 0 0 25px 0; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                gap: 12px; 
                width: 100%; 
                white-space: nowrap; 
                color: ${color}; 
                text-transform: uppercase; 
                letter-spacing: 1.5px; 
                border: none !important; 
                background: none !important;
                font-size: clamp(14px, 4.8vw, 21px);
            ">
                ${icon} ${titleText} ${isHoly ? icon : ''}
            </h2>

            <p style="font-size: 17px; margin: 0 0 35px 0; line-height: 1.6; font-weight: bold; border: none !important; color: ${color}; width: 100%;">
                ${msg}
            </p>
            
            <button onclick="location.reload()" 
                style="background: transparent; color: ${color}; border: 1px solid ${color}; padding: 15px 25px; font-size: 16px; font-weight: bold; cursor: pointer; text-transform: uppercase; width: 100%; border-radius: 4px; transition: 0.3s; outline: none; letter-spacing: 1px;" 
                onmouseover="this.style.background='${color}'; this.style.color='#000'; this.style.boxShadow='0 0 15px ${color}'" 
                onmouseout="this.style.background='transparent'; this.style.color='${color}'; this.style.boxShadow='none'">
                ВЕРНУТЬСЯ В САНСАРУ
            </button>
        </div>
        <style>
            /* Жесткая зачистка всех вложенных границ */
            #matrix-canvas + div * { border: none !important; outline: none !important; box-shadow: none; }
            #matrix-canvas + div button { border: 1px solid ${color} !important; }
            
            @media (max-width: 480px) { 
                #matrix-canvas + div { width: 94% !important; padding: 35px 15px !important; }
                h2 { gap: 8px !important; }
            }
        </style>`;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
};