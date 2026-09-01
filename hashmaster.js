(function() {
    // Секретный триггер запуска игры
    const LAUNCH_CODE = { word1: 'matrix', word2: 'break', number: 404 };

    // База сюжетных триад (Персонаж 1 : Персонаж 2 : Секретный сдвиг)
    const TRIADS = [
        { w1: 'adam', w2: 'douglas', num: 42 },      // Автостопом по Галактике
        { w1: 'marti', w2: 'doc', num: 88 },          // Назад в будущее
        { w1: 'neo', w2: 'morpheus', num: 101 },      // Матрица / Комната 101
        { w1: 'luke', w2: 'vader', num: 777 },         // Звездные войны
        { w1: 'sherlock', w2: 'watson', num: 221 }    // Шерлок Холмс / Бейкер-стрит
    ];

    // Глобальное состояние сессии игры
    let game = {
        isActive: false,
        justActivated: false, 
        isProcessing: false, 
        attempts: 0,
        target: { word1: '', word2: '', number: 0 }
    };

    document.addEventListener("DOMContentLoaded", () => {
        const s1 = document.getElementById('s1');
        const s2 = document.getElementById('s2');
        const num = document.getElementById('num');
        const genBtn = document.getElementById('genBtn');
        const resultBox = document.querySelector('.result-box');

        if (!s1 || !s2 || !num || !genBtn || !resultBox) return;

        const checkTriggerState = () => {
            const valW1 = s1.value.trim().toLowerCase();
            const valW2 = s2.value.trim().toLowerCase();
            const valNum = parseInt(num.value, 10);

            if (!game.isActive && valW1 === LAUNCH_CODE.word1 && valW2 === LAUNCH_CODE.word2 && valNum === LAUNCH_CODE.number) {
                s1.value = ''; s2.value = ''; num.value = '';
                game.justActivated = true; 
                
                const randomTriad = TRIADS[Math.floor(Math.random() * TRIADS.length)];
                game.target.word1 = randomTriad.w1;
                game.target.word2 = randomTriad.w2;
                game.target.number = randomTriad.num;

                setTimeout(() => {
                    initHackerGame(genBtn, resultBox, s1, s2, num);
                    setTimeout(() => { game.justActivated = false; }, 100);
                }, 10);
                return true;
            }

            if (game.isActive) {
                if (game.justActivated || game.isProcessing) return true; 

                game.isProcessing = true; 
                s1.value = ''; s2.value = ''; num.value = '';
                
                setTimeout(() => {
                    s1.value = window._currentW1 || '';
                    s2.value = window._currentW2 || '';
                    num.value = window._currentNum || '';
                    
                    processBruteForce(s1.value.trim().toLowerCase(), s2.value.trim().toLowerCase(), parseInt(num.value, 10));
                    
                    setTimeout(() => { game.isProcessing = false; }, 300);
                }, 10);
                return true;
            }
            return false;
        };

        const trackInput = () => {
            if (game.isActive) {
                window._currentW1 = s1.value;
                window._currentW2 = s2.value;
                window._currentNum = num.value;
            }
        };
        
        s1.addEventListener('input', trackInput);
        s2.addEventListener('input', trackInput);
        num.addEventListener('input', trackInput);

        ['mousedown', 'touchstart', 'click'].forEach(eventType => {
            genBtn.addEventListener(eventType, function(e) {
                if (game.isActive && !game.isProcessing && !game.justActivated) {
                    window._currentW1 = s1.value;
                    window._currentW2 = s2.value;
                    window._currentNum = num.value;
                }
                if (checkTriggerState()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, { capture: true, passive: false });
        });
    });

    function initHackerGame(btn, resBox, s1, s2, num) {
        game.isActive = true;
        game.attempts = 0;

        document.body.classList.add('hash-master-active');
        btn.textContent = 'ВЗЛОМАТЬ ХЭШ';

        s1.value = ''; s2.value = ''; num.value = '';
        window._currentW1 = ''; window._currentW2 = ''; window._currentNum = '';
        
        s1.placeholder = 'Поиск Логина...';
        s2.placeholder = 'Подбор пароля...';
        
        const cnt1 = document.getElementById('cnt1');
        const cnt2 = document.getElementById('cnt2');
        if (cnt1) cnt1.innerText = "0";
        if (cnt2) cnt2.innerText = "0";

        resBox.innerHTML = `
            <div class="hacker-terminal">
                <div class="hacker-terminal-header">HashMaster OS v2.0 // Процедурный брутфорс</div>
                <div class="hacker-log-viewport" id="terminalViewport" style="overflow-y: auto;">
                    <div class="log-line info">> Квантовый перехват выполнен успешно...</div>
                    <div class="log-line info">> Сгенерирована случайная триада узла защиты.</div>
                    <div class="log-line system">> Нащупайте длину слов, их состав и числовой сдвиг!</div>
                </div>
            </div>
        `;
    }
    // Обработка логики брутфорса с цветовым разделением логов
    function processBruteForce(w1, w2, numVal) {
        game.attempts++;
        const viewport = document.getElementById('terminalViewport');
        const s1 = document.getElementById('s1');
        const s2 = document.getElementById('s2');
        const num = document.getElementById('num');
        if (!viewport || !s1 || !s2 || !num) return;

        let feedback = [];

        // Исключаем спам символами через Set
        const uniqueW1 = new Set([...w1]);
        const uniqueW2 = new Set([...w2]);

        // Цветовые константы на базе стилей хакерской темы
        const cGreen = "color: #39ff14;";
        const cRed = "color: #ef4444;";
        const cSuccessBold = "color: #39ff14; font-weight: bold;";

        // === ПРОВЕРКА ПОЛЯ 1 (СЛОВО 1) ===
        let s1Line = `<span class="log-warn">[СЛОВО 1]</span> `;
        if (w1 === game.target.word1) {
            s1Line += `<span style="${cSuccessBold}">Авторизовано!</span>`;
        } else {
            let matches = [...uniqueW1].filter(char => game.target.word1.includes(char)).length;
            s1Line += `Букв: ${matches} | `;
            
            // Цветовая разметка длины слова 1
            if (w1.length === game.target.word1.length) {
                s1Line += `<span style="${cGreen}">Длина совпала!</span>`;
            } else if (w1.length < game.target.word1.length) {
                s1Line += `<span style="${cRed}">Длина БОЛЬШЕ вашей</span>`;
            } else {
                s1Line += `<span style="${cRed}">Длина МЕНЬШЕ вашей</span>`;
            }
        }
        feedback.push(`<div class="log-line">${s1Line}</div>`);

        // === ПРОВЕРКА ПОЛЯ 2 (СЛОВО 2) ===
        let s2Line = `<span class="log-warn">[СЛОВО 2]</span> `;
        if (w2 === game.target.word2) {
            s2Line += `<span style="${cSuccessBold}">Авторизовано!</span>`;
        } else {
            let matches = [...uniqueW2].filter(char => game.target.word2.includes(char)).length;
            s2Line += `Букв: ${matches} | `;
            
            // Цветовая разметка длины слова 2
            if (w2.length === game.target.word2.length) {
                s2Line += `<span style="${cGreen}">Длина совпала!</span>`;
            } else if (w2.length < game.target.word2.length) {
                s2Line += `<span style="${cRed}">Длина БОЛЬШЕ вашей</span>`;
            } else {
                s2Line += `<span style="${cRed}">Длина МЕНЬШЕ вашей</span>`;
            }
        }
        feedback.push(`<div class="log-line">${s2Line}</div>`);

        // === ПРОВЕРКА ПОЛЯ 3 (ЧИСЛО) ===
        if (numVal === game.target.number) {
            feedback.push(`<div class="log-line"><span class="log-info">[ЧИСЛО ]</span> <span style="${cSuccessBold}">Сдвиг соли подтвержден!</span></div>`);
        } else if (isNaN(numVal)) {
            feedback.push(`<div class="log-line"><span class="log-info">[ЧИСЛО ]</span> Слот пуст. Требуется значение.</div>`);
        } else if (numVal < game.target.number) {
            feedback.push(`<div class="log-line"><span class="log-info">[ЧИСЛО ]</span> Искомый сдвиг БОЛЬШЕ ${numVal}</div>`);
        } else {
            feedback.push(`<div class="log-line"><span class="log-info">[ЧИСЛО ]</span> Искомый сдвиг МЕНЬШЕ ${numVal}</div>`);
        }

        // Рендерим блок попытки вниз терминала
        const attemptHeader = `<div class="log-line system" style="margin-top:10px;">--- ПОПЫТКА #${game.attempts} [${w1||'?'}:${w2||'?'}:${isNaN(numVal)?'?':numVal}] ---</div>`;
        viewport.insertAdjacentHTML('beforeend', attemptHeader);
        
        feedback.forEach(htmlLine => viewport.insertAdjacentHTML('beforeend', htmlLine));
        viewport.scrollTop = viewport.scrollHeight;

        // ПРОВЕРКА АБСОЛЮТНОЙ ПОБЕДЫ
        if (w1 === game.target.word1 && w2 === game.target.word2 && numVal === game.target.number) {
            game.isActive = false; // Отключаем игру

            setTimeout(() => {
                // Вычисление рангов по твоей шкале
                let rank = "Скрипт-кидди 💻"; 
                if (game.attempts >= 1 && game.attempts <= 5) {
                    rank = "Создатель 🌌";
                } else if (game.attempts >= 6 && game.attempts <= 10) {
                    rank = "Neo / Избранный 🕶️";
                } else if (game.attempts >= 11 && game.attempts <= 20) {
                    rank = "Элитный Криптоаналитик 🔓";
                }

                let timeLeft = 10;
                const victoryHTML = `
                    <div class="log-line" style="color: #ffd700; font-weight: bold; margin-top: 15px; border-top: 1px dashed #ffd700; padding-top: 10px;">
                        [УСПЕХ] МАСТЕР-ХЭШ ПОЛНОСТЬЮ ВЗЛОМАН!<br>
                        > Попыток перебора: ${game.attempts}<br>
                        > Звание: ${rank}<br>
                        <span id="countdownTimer" style="color: #ffffff; font-size: 11px; font-weight: normal; display:block; margin-top:10px;">
                            Перезагрузка генератора и возврат в сансару через: [${timeLeft}]
                        </span>
                    </div>
                `;
                viewport.insertAdjacentHTML('beforeend', victoryHTML);
                viewport.scrollTop = viewport.scrollHeight;

                const intervalId = setInterval(() => {
                    timeLeft--;
                    const timerEl = document.getElementById('countdownTimer');
                    if (timerEl) {
                        timerEl.innerHTML = `Перезагрузка генератора и возврат в сансару через: [${timeLeft}]`;
                    }
                    
                    if (timeLeft <= 0) {
                        clearInterval(intervalId);
                        location.reload(); 
                    }
                }, 1000);

                // Окрашиваем кнопку в золотой цвет
                const genBtn = document.getElementById('genBtn');
                genBtn.style.background = '#ffd700';
                genBtn.style.boxShadow = '0 0 15px #ffd700';
                genBtn.style.color = '#000000';
                genBtn.textContent = 'ВЗЛОМАНО';
                genBtn.disabled = true;

                [s1, s2, num].forEach(el => {
                    el.value = '';
                    el.disabled = true;
                    el.style.borderColor = '#ffd700';
                    el.placeholder = 'ДОСТУП ПРЕДОСТАВЛЕН';
                });
            }, 400);
            return;
        }

        // Если не угадал — очищаем инпуты для новой попытки
        s1.value = ''; s2.value = ''; num.value = '';
        window._currentW1 = ''; window._currentW2 = ''; window._currentNum = '';
        const cnt1 = document.getElementById('cnt1');
        const cnt2 = document.getElementById('cnt2');
        if (cnt1) cnt1.innerText = "0";
        if (cnt2) cnt2.innerText = "0";
    }
})();
