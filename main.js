(function() {
    // 1. СКРЫТЫЕ КОНСТАНТЫ
    const _p1 = [112, 97, 115, 115].map(c => String.fromCharCode(c)).join(''); 
    const _p2 = [103, 101, 110, 112, 114, 111].map(c => String.fromCharCode(c)).join('');
    const _p3 = [46, 114, 117].map(c => String.fromCharCode(c)).join('');
    const _s = [74, 109, 110, 100, 95, 86, 49, 49, 48, 51, 50, 54].map(c => String.fromCharCode(c)).join(''); // Jmnd_V110326

    const _vL = () => window.location.hostname === (_p1 + _p2 + _p3);

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

    // 3. УТИЛИТЫ
    const isInsideBtn = (e, el) => {
        const rect = el.getBoundingClientRect();
        const touch = e.changedTouches ? e.changedTouches[0] : e;
        return (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom);
    };

    const fixMobileHeight = () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    const clearResult = () => { 
        clearInterval(animInterval); finalPass = ""; 
        disp.value = ""; disp.placeholder = "--------"; 
        disp.style.color = ""; copy.disabled = true; 
    };

    const applyMask = () => {
        const isHide = hide.checked;
        [s1, s2, num, disp].forEach(el => isHide ? el.classList.add('secure-mask') : el.classList.remove('secure-mask'));
        localStorage.setItem('gen_hideMode', isHide);
    };

    const updateIcons = () => {
        const v1 = s1.value.trim(), v2 = s2.value.trim(), v3 = num.value.trim(), L = parseInt(lenSel.value) || 0;
        const total = v1.length + v2.length;
        
        if (v1.length >= 8 && v2.length >= 8) {
            const progress = Math.min(1, (total - 16) / (32 - 16));
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const rgb = isDark ? "255, 215, 0" : "56, 189, 248";
            helpBtn.style.boxShadow = `0 0 ${8 + progress * 10}px ${1 + progress * 4}px rgba(${rgb}, ${0.3 + progress * 0.6})`;
            helpBtn.style.borderColor = `rgba(${rgb}, ${0.6 + progress * 0.4})`;
            total >= 32 ? helpBtn.classList.add('nimbus-holy') : helpBtn.classList.remove('nimbus-holy');
        } else {
            helpBtn.style.boxShadow = 'none'; helpBtn.classList.remove('nimbus-holy');
            helpBtn.style.borderColor = 'var(--glass-border)';
        }

        const units = iconBox.querySelectorAll('.icon-unit');
        if (!v1 || !v2 || !v3) { units.forEach(u => u.innerText = ""); return; }
        let h = 0x811c9dc5; 
        const seed = v1.toLowerCase() + _s + v2.toLowerCase() + (parseInt(v3) * 179) + (L * 31);
        for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
        [emojis[Math.abs(h)%50], emojis[Math.abs(Math.imul(h,31))%50], emojis[Math.abs(Math.imul(h,73))%50]].forEach((em, i) => { units[i].innerText = em; units[i].style.opacity = "1"; });
    };

    // 4. ГЕНЕРАЦИЯ
    const generate = async () => {
        if (!_vL()) { renderError(); return; }

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
        finalPass = res.join('');
        startDisplayAnim();
    };

    const renderError = () => {
        clearInterval(animInterval); disp.style.color = "#ff4d4d"; disp.value = "ERROR"; copy.disabled = true;
    };

    const startDisplayAnim = () => {
        clearInterval(animInterval);
        let it = 0;
        const chars = pinMode.checked ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^*";
        animInterval = setInterval(() => {
            disp.style.color = "";
            disp.value = finalPass.split("").map((c, i) => i < it ? finalPass[i] : chars[Math.floor(Math.random() * chars.length)]).join("");
            if (it >= finalPass.length) clearInterval(animInterval);
            it += 0.34;
        }, 30);
        copy.disabled = false;
    };

    // 5. СОБЫТИЯ И ЛОГИКА UI
    const validate = async () => {
        let err = false;
        [s1, s2, num].forEach(f => { if(!f.value.trim()){ f.classList.add('input-error'); err=true; } else f.classList.remove('input-error'); });
        if(!err) await generate();
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

    const resetAll = (isPanic = false) => {
        [s1, s2, num].forEach(el => { el.value = ""; el.classList.remove('input-error'); });
        pinMode.checked = localStorage.getItem('gen_pinMode') === 'true';
        hide.checked = localStorage.getItem('gen_hideMode') === 'true';
        updateUI(true);
        if(isPanic) { disp.placeholder = "ОЧИЩЕНО!"; setTimeout(() => disp.placeholder = "--------", 1000); }
        s1.focus();
    };

    // СЛУШАТЕЛИ КНОПОК
    genBtn.addEventListener('mousedown', (e) => { if(isInsideBtn(e, genBtn)) genBtn.classList.add('is-active'); });
    genBtn.addEventListener('mouseup', (e) => { genBtn.classList.remove('is-active'); if(isInsideBtn(e, genBtn)) validate(); });
    
    resetBtn.addEventListener('mousedown', (e) => {
        if(!isInsideBtn(e, resetBtn)) return;
        resetBtn.classList.add('is-active'); isLongPress = false;
        resetTimer = setTimeout(() => { isLongPress = true; localStorage.clear(); location.reload(); }, 2000);
    });
    resetBtn.addEventListener('mouseup', (e) => {
        clearTimeout(resetTimer); resetBtn.classList.remove('is-active');
        if(!isLongPress && isInsideBtn(e, resetBtn)) resetAll(false);
    });

    [s1, s2, num].forEach((el, idx, arr) => {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!el.value.trim()){ el.classList.add('input-error'); el.focus(); }
                else if (el.id === 'num'){ el.blur(); validate(); }
                else arr[idx + 1].focus();
            }
        });
        el.addEventListener('input', () => { el.classList.remove('input-error'); updateIcons(); clearResult(); });
    });

    copy.onclick = () => {
        if (!_vL()) return;
        const t = document.createElement('textarea'); t.value = finalPass; document.body.appendChild(t);
        t.select(); document.execCommand('copy'); document.body.removeChild(t);
        copy.innerText = "ГОТОВО"; setTimeout(() => copy.innerText = "КОПИРОВАТЬ", 1500);
    };

    themeToggle.onclick = () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        themeToggle.innerText = next === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('gen_theme', next);
    };

    helpBtn.onclick = () => {
        window.open(helpBtn.classList.contains('nimbus-holy') ? 'prophecy.html' : 'readme.html', '_blank');
    };

    pinMode.onchange = () => updateUI(true);
    lenSel.onchange = () => { clearResult(); updateIcons(); };
    hide.onchange = applyMask;

    window.onload = () => { resetAll(false); fixMobileHeight(); };
})();
