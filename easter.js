window.startMatrix = (color) => {
    let canvas = document.getElementById('matrix-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        document.body.appendChild(canvas);
    }
    canvas.style.cssText = `position: fixed!important; top:0; left:0; width:100vw; height:100vh; z-index:2147483646; background:#000; display:block;`;
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
    setInterval(draw, 35);

    const isHoly = (color === '#FFD700');
    const title = isHoly ? "⭐ ВЫСШЕЕ ОТКРОВЕНИЕ ⭐" : "📜 ОТКРОВЕНИЕ ХЭШИСТА";
    const revelations = [
        "Мир есть функция. Ввод определяет Вывод.",
        "Твой пароль — лишь тень в пещере Платона. Хеш — его истинная форма.",
        "Случайности не существует. Есть лишь бесконечно длинный ключ, который ты еще не подобрал."
    ];
    const msg = isHoly ? "Ты ввел Святое Число 42. <br> Истина открыта." : revelations[Math.floor(Math.random() * revelations.length)];

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:2147483647; color:${color}; text-align:center; background:rgba(0,0,0,0.9); padding:30px 20px; border:2px solid ${color}; box-shadow:0 0 30px ${color}; font-family:monospace; width:85%; max-width:400px; box-sizing:border-box;`;
    overlay.innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: auto;">
            <h2 style="margin: 0 0 20px 0; font-size: 24px; line-height: 1.3; color: ${color}; text-transform: uppercase; letter-spacing: 1px; width: 100%; box-sizing: border-box;">${title}</h2>
            <p style="font-size: 18px; margin: 0 0 30px 0; line-height: 1.5; font-weight: bold; width: 100%; box-sizing: border-box;">${msg}</p>
            <button onclick="location.reload()" style="background: transparent; color: ${color}; border: 2px solid ${color}; padding: 12px 20px; font-size: 16px; font-weight: bold; cursor: pointer; text-transform: uppercase; width: 100%; border-radius: 8px; transition: 0.3s;" onmouseover="this.style.background='${color}'; this.style.color='#000'" onmouseout="this.style.background='transparent'; this.style.color='${color}'">ВЕРНУТЬСЯ В САНСАРУ</button>
        </div>
        <style>
            #matrix-canvas + div { height: auto !important; max-height: 90vh; overflow-y: auto; }
            @media (max-width: 480px) { h2 { font-size: 18px !important; margin-bottom: 15px !important; } p { font-size: 15px !important; margin-bottom: 20px !important; } }
        </style>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
};
