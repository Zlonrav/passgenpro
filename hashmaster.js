(function() {
    // Секретный триггер запуска игры
    const LAUNCH_CODE = { word1: 'matrix', word2: 'break', number: 404 };

    // Состояние игры (Параметры, которые нужно отгадать)
    let game = {
        isActive: false,
        justActivated: false, // Флаг-защита от мгновенного ложного клика
        attempts: 0,
        target: { word1: 'admin', word2: 'root', number: 777 }
    };

    document.addEventListener("DOMContentLoaded", () => {
        const s1 = document.getElementById('s1');
        const s2 = document.getElementById('s2');
        const num = document.getElementById('num');
        const genBtn = document.getElementById('genBtn');
        const resultBox = document.querySelector('.result-box');

        if (!s1 || !s2 || !num || !genBtn || !resultBox) return;

        // Механизм точечного перехвата данных до отправки в main.js
        const checkTriggerState = () => {
            const valW1 = s1.value.trim().toLowerCase();
            const valW2 = s2.value.trim().toLowerCase();
            const valNum = parseInt(num.value, 10);

            // Активация хакерского режима
            if (!game.isActive && valW1 === LAUNCH_CODE.word1 && valW2 === LAUNCH_CODE.word2 && valNum === LAUNCH_CODE.number) {
                s1.value = ''; s2.value = ''; num.value = '';
                game.justActivated = true; // Защита включена
                
                setTimeout(() => {
                    initHackerGame(genBtn, resultBox, s1, s2, num);
                    // Снимаем защиту чуть позже, когда все события мыши/тача утихнут
                    setTimeout(() => { game.justActivated = false; }, 100);
                }, 10);
                return true;
            }

            // Если игра уже идет, перехватываем клик как попытку взлома
            if (game.isActive) {
                // Если сработал ложный долетающий клик в момент активации — игнорируем
                if (game.justActivated) return true;

                s1.value = ''; s2.value = ''; num.value = '';
                setTimeout(() => {
                    s1.value = window._currentW1 || '';
                    s2.value = window._currentW2 || '';
                    num.value = window._currentNum || '';
                    
                    processBruteForce(s1.value.trim().toLowerCase(), s2.value.trim().toLowerCase(), parseInt(num.value, 10));
                }, 10);
                return true;
            }
            return false;
        };

        // Непрерывно кэшируем ввод пользователя, чтобы оригинальный скрипт его не стёр
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

        // Вешаем слушатели на все виды кликов и тачей для мобильных устройств
        ['mousedown', 'touchstart', 'click'].forEach(eventType => {
            genBtn.addEventListener(eventType, function(e) {
                if (game.isActive) {
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

    // Инициализация хакерского интерфейса
    function initHackerGame(btn, resBox, s1, s2, num) {
        game.isActive = true;
        game.attempts = 0;

        document.body.classList.add('hash-master-active');
        btn.textContent = 'ВЗЛОМАТЬ ХЭШ';

        // Мягкий сброс элементов формы
        s1.value = ''; s2.value = ''; num.value = '';
        window._currentW1 = ''; window._currentW2 = ''; window._currentNum = '';
        
        s1.placeholder = 'Поиск Логина...';
        s2.placeholder = 'Подбор пароля...';
        
        const cnt1 = document.getElementById('cnt1');
        const cnt2 = document.getElementById('cnt2');
        if (cnt1) cnt1.innerText = "0";
        if (cnt2) cnt2.innerText = "0";

        // Отрисовка оболочки терминала внутри .result-box
        resBox.innerHTML = `
            <div class="hacker-terminal">
                <div class="hacker-terminal-header">HashMaster OS v1.0 // Взлом запущен</div>
                <div class="hacker-log-viewport" id="terminalViewport" style="overflow-y: auto;">
                    <div class="log-line info">> Квантовый перехват выполнен успешно...</div>
                    <div class="log-line info">> Обнаружен заблокированный мастер-хэш.</div>
                    <div class="log-line system">> Введите параметры для генерации встречной коллизии.</div>
                </div>
            </div>
        `;
    }

    // Обработка логики брутфорса
    function processBruteForce(w1, w2, numVal) {
        game.attempts++;
        const viewport = document.getElementById('terminalViewport');
        const s1 = document.getElementById('s1');
        const s2 = document.getElementById('s2');
        const num = document.getElementById('num');
        if (!viewport || !s1 || !s2 || !num) return;

        let feedback = [];

        // Сверка Слова 1
        if (w1 === game.target.word1) {
            feedback.push(`<div class="log-line success">[OK] Логин авторизован!</div>`);
        } else {
            let matches = [...w1].filter(char => game.target.word1.includes(char)).length;
            feedback.push(`<div class="log-line warn">[ERR] Логин: совпало букв: ${matches}</div>`);
        }

        // Сверка Слова 2
        if (w2 === game.target.word2) {
            feedback.push(`<div class="log-line success">[OK] Мастер-ключ совпал!</div>`);
        } else {
            let matches = [...w2].filter(char => game.target.word2.includes(char)).length;
            feedback.push(`<div class="log-line warn">[ERR] Ключ: совпало букв: ${matches}</div>`);
        }

        // Сверка Числа (Больше / Меньше)
        if (numVal === game.target.number) {
            feedback.push(`<div class="log-line success">[OK] Сдвиг соли подтвержден!</div>`);
        } else if (isNaN(numVal)) {
            feedback.push(`<div class="log-line info">[SYS] Число: Слот пуст. Требуется значение.</div>`);
        } else if (numVal < game.target.number) {
            feedback.push(`<div class="log-line info">[SYS] Число: Искомый сдвиг БОЛЬШЕ ${numVal}</div>`);
        } else {
            feedback.push(`<div class="log-line info">[SYS] Число: Искомый сдвиг МЕНЬШЕ ${numVal}</div>`);
        }

        // Отрисовка результатов текущего шага вниз терминала
        const attemptHeader = `<div class="log-line system" style="margin-top:10px;">--- ПОПЫТКА #${game.attempts} [${w1||'?'}:${w2||'?'}:${isNaN(numVal)?'?':numVal}] ---</div>`;
        viewport.insertAdjacentHTML('beforeend', attemptHeader);
        
        feedback.forEach(htmlLine => viewport.insertAdjacentHTML('beforeend', htmlLine));
        
        // Автоматическая прокрутка к последней записи лога
        viewport.scrollTop = viewport.scrollHeight;

        // ПРОВЕРКА ПОБЕДЫ
        if (w1 === game.target.word1 && w2 === game.target.word2 && numVal === game.target.number) {
            game.isActive = false; // Выключаем игру, фиксируя результат

            setTimeout(() => {
                // Вывод финального сообщения золотым цветом прямо в лог терминала
                const victoryHTML = `
                    <div class="log-line" style="color: #ffd700; font-weight: bold; margin-top: 15px; border-top: 1px dashed #ffd700; padding-top: 10px;">
                        [УСПЕХ] МАСТЕР-ХЭШ ПОЛНОСТЬЮ ВЗЛОМАН!<br>
                        > Попыток перебора: ${game.attempts}<br>
                        > Статус: Элитный Криптоаналитик 🔓<br>
                        <span style="color: #ffffff; font-size: 11px; font-weight: normal; display:block; margin-top:10px;">
                            (Нажмите кнопку «СБРОС» на форме для возврата к генератору паролей)
                        </span>
                    </div>
                `;
                viewport.insertAdjacentHTML('beforeend', victoryHTML);
                viewport.scrollTop = viewport.scrollHeight;

                // Перевод интерфейса ввода в триумфальный золотой стиль
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

        // Если коллизия не найдена — очищаем инпуты для следующей попытки брутфорса
        s1.value = ''; s2.value = ''; num.value = '';
        window._currentW1 = ''; window._currentW2 = ''; window._currentNum = '';
        const cnt1 = document.getElementById('cnt1');
        const cnt2 = document.getElementById('cnt2');
        if (cnt1) cnt1.innerText = "0";
        if (cnt2) cnt2.innerText = "0";
    }
})();
