(function() {
    // 1. СКРЫТЫЕ ДАННЫЕ (Домен и Соль)
    const _p1 = [112, 97, 115, 115].map(c => String.fromCharCode(c)).join(''); // pass
    const _p2 = [103, 101, 110, 112, 114, 111].map(c => String.fromCharCode(c)).join(''); // genpro
    const _p3 = [46, 114, 117].map(c => String.fromCharCode(c)).join(''); // .ru
    const _s = [74, 109, 110, 100, 95, 102, 110, 108, 95, 86, 49, 48].map(c => String.fromCharCode(c)).join(''); // Jmnd_fnl_V10
    
    const _vD = () => {
        const h = window.location.hostname;
        return h === (_p1 + _p2 + _p3) || h === 'localhost' || h === '127.0.0.1';
    };

    // 2. DOM ЭЛЕМЕНТЫ
    const s1 = document.getElementById('s1'), s2 = document.getElementById('s2'), num = document.getElementById('num'), 
          disp = document.getElementById('display'), copy = document.getElementById('copyBtn'),
          hide = document.getElementById('toggleHide'), pinMode = document.getElementById('pinMode'),
          genBtn = document.getElementById('genBtn'), resetBtn = document.getElementById('resetBtn'), 
          lenSel = document.getElementById('len'), mainTitle = document.getElementById('mainTitle'),
          iconBox = document.getElementById('iconBox'), themeToggle = document.getElementById('themeToggle'),
          helpBtn = document.getElementById('helpBtn');

    const emojis = ["🍎","🍊","🍋","🍇","🍓","🍒","🥑","🥦","🍄","🦁","🐯","🐶","🐱","🐭","🦊","🐼","🐻","🐨","🐙","🦋","⭐️","🌙","☀️","🔥","🌈","🍦","🍕","💎","🚀","🎸","✈️","⚽️","🧩","🔑","💡","⏰","🧭","🔭","🧿","🍀","🍭","🎨","🎲","📀","🔔","📦","📫","🎈","🎭","🎧"];
    
    let finalPass = "", animInterval, panicTimer, resetTimer, isLongPress = false;

    // ПРОВЕРКА 1: Тихая инициализация
    if (!_vD()) { console.log("%cIntegrity check failed", "color:rgba(0,0,0,0)"); }

    // 3. УТИЛИТЫ
    const isInsideBtn = (e, el) => {
        const rect = el.getBoundingClientRect();
        const touch = e.changedTouches ? e.changedTouches[0] : e;
        return (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom);
    };

    const fixMobileHeight = () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        window.scrollTo(0, 0);
    };

    const clearResult = () => { 
        clearInterval(animInterval); 
        finalPass = ""; 
        disp.value = ""; 
        disp.placeholder = "--------"; 
        disp.style.color = ""; 
        copy.disabled = true; 
    };

    const applyMask = () => {
        const isHide = hide.checked;
        [s1, s2, num, disp].forEach(el => isHide ? el.classList.add('secure-mask') : el.classList.remove('secure-mask'));
        localStorage.setItem('gen_hideMode', isHide);
    };

    const updateIcons = () => {
        const v1 = s1.value.trim(), v2 = s2.value.trim(), v3 = num.value.trim(), L = parseInt(lenSel.value) || 0;
        if (!v1 || !v2 || !v3) { iconBox.querySelectorAll('.icon-unit').forEach(u => u.innerText = ""); return; }
        let h = 0x811c9dc5; 
        const seed = v1.toLowerCase() + _s + v2.toLowerCase() + (parseInt(v3) * 179) + (L * 31);
        for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
        const combo = [emojis[Math.abs(h)%50], emojis[Math.abs(Math.imul(h,31))%50], emojis[Math.abs(Math.imul(h,73))%50]];
        iconBox.querySelectorAll('.icon-unit').forEach((u, i) => u.innerText = combo[i]);
    };

    // 4. ДВИЖОК ГЕНЕРАЦИИ
    const generate = async () => {
        // ПРОВЕРКА 2: Блокировка расчетов
        if (!_vD()) { renderResult("ERROR", true); return; }

        const v1 = s1.value.trim().toLowerCase(), v2 = s2.value.trim().toLowerCase(), v3 = num.value.trim();
        const n = parseInt(v3) || 0, L = parseInt(lenSel.value);

        if ((v1 === 'hash' && v2 === 'genesis') || (v1 === 'genesis' && v2 === 'hash')) {
            clearResult(); if (window.startMatrix) window.startMatrix(n === 42 ? "#FFD700" : "#00FF00"); return;
        }

        const msgUint8 = new TextEncoder().encode(v1 + _s + v2 + (n * 179) + (L * 31));
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        let tH = hashArray.slice(0, 4).reduce((acc, i) => (acc << 8) | i, 0);
        let res = [];

        if (pinMode.checked) {
            for (let i = 0; i < L; i++) {
                tH = Math.imul(tH ^ (hashArray[i % 32]), 0x85ebca6b);
                res.push("0123456789"[Math.abs(tH) % 10]);
            }
        } else {
            const U = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", D = "0123456789", S = "!@#$%^*", M = "abcdefghijklmnopqrstuvwxyz";
            const alphaNum = U + D + M, all = U + D + S + M;
            res = [alphaNum[hashArray[0] % alphaNum.length], D[hashArray[1] % 10], S[hashArray[2] % 7]];
            for (let i = 3; i < L; i++) {
                tH = Math.imul(tH ^ hashArray[i % 32], 0x85ebca6b);
                res.push(all[Math.abs(tH) % all.length]);
            }
            for (let i = res.length - 1; i > 0; i--) {
                const j = Math.abs(Math.imul(tH, i)) % (i + 1);
                [res[i], res[j]] = [res[j], res[i]];
            }
        }
        renderResult(res.join(''), false);
    };

    const renderResult = (val, isErr) => {
        clearInterval(animInterval);
        finalPass = val;
        let it = 0;
        // ПРОВЕРКА 3: Взлом анимации при неверном домене
        const forcedError = !_vD() || isErr;
        const chars = pinMode.checked ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^*";
        
        animInterval = setInterval(() => {
            if (forcedError) {
                disp.value = "ERROR";
                disp.style.color = "#ff4d4d";
                copy.disabled = true;
                clearInterval(animInterval);
                return;
            }
            disp.style.color = "";
            disp.value = finalPass.split("").map((c, i) => i < it ? finalPass[i] : chars[Math.floor(Math.random() * chars.length)]).join("");
            if (it >= finalPass.length) { clearInterval(animInterval); copy.disabled = false; }
            it += 0.34;
        }, 30);
    };

    // 5. УПРАВЛЕНИЕ UI И СОБЫТИЯ
    const validate = () => {
        let err = false;
        [s1, s2, num].forEach(f => { if(!f.value.trim()){ f.classList.add('input-error'); err=true; } else f.classList.remove('input-error'); });
        if(!err) generate();
    };

    const resetAll = (isPanic = false) => {
        [s1, s2, num].forEach(el => { el.value = ""; el.classList.remove('input-error'); });
        pinMode.checked = localStorage.getItem('gen_pinMode') === 'true';
        const savedTheme = localStorage.getItem('gen_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
        updateUI(true);
        if(isPanic) { disp.placeholder = "ОЧИЩЕНО!"; setTimeout(() => disp.placeholder = "--------", 1000); }
    };

    const updateUI = (fullReset = false) => {
        const isPin = pinMode.checked;
        if (fullReset) clearResult();
        document.body.classList.toggle('pin-mode-active', isPin);
        mainTitle.innerText = isPin ? "Генератор PIN-кодов" : "Генератор паролей";
        lenSel.innerHTML = isPin 
            ? '<option value="4" selected>4</option><option value="6">6</option><option value="8">8</option>'
            : '<option value="8">8</option><option value="12" selected>12</option><option value="16">16</option><option value="20">20</option>';
        updateIcons(); applyMask();
    };

    // Слушатели событий
    genBtn.addEventListener('click', validate);
    resetBtn.addEventListener('click', () => resetAll(false));
    
    copy.onclick = () => {
        if (!_vD()) return;
        navigator.clipboard.writeText(finalPass);
        const oldText = copy.innerText;
        copy.innerText = "ГОТОВО";
        setTimeout(() => copy.innerText = oldText, 1500);
    };

    themeToggle.onclick = () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        themeToggle.innerText = next === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('gen_theme', next);
    };

    [s1, s2, num].forEach(el => {
        el.addEventListener('input', () => { el.classList.remove('input-error'); updateIcons(); clearResult(); });
    });

    pinMode.onchange = () => updateUI(true);
    lenSel.onchange = () => { clearResult(); updateIcons(); };
    hide.onchange = applyMask;

    window.addEventListener('resize', fixMobileHeight);
    window.onload = () => { resetAll(false); fixMobileHeight(); };

    // Паника через 60 сек бездействия
    ['mousedown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => { 
        clearTimeout(panicTimer); panicTimer = setTimeout(() => resetAll(true), 60000); 
    }));
})();
