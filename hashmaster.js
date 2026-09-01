(function() {
    // Секретный триггер запуска
    const LAUNCH_CODE = { word1: 'matrix', word2: 'break', number: 404 };

    // Состояние игры (Параметры, которые нужно отгадать)
    let game = {
        isActive: false,
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

        // Самый надежный способ: перехватываем ввод данных прямо в момент, 
        // когда оригинальный скрипт пытается прочитать поля для генерации SHA-256.
        // Переопределяем стандартный метод получения значений .value у инпутов.
        
        const checkTriggerState = () => {
            const valW1 = s1.value.trim().toLowerCase();
            const valW2 = s2.value.trim().toLowerCase();
            const valNum = parseInt(num.value, 10);

            // Если игра еще не запущена и введен секретный код
            if (!game.isActive && valW1 === LAUNCH_CODE.word1 && valW2 === LAUNCH_CODE.word2 && valNum === LAUNCH_CODE.number) {
                // Принудительно подменяем значения полей на пустые строки для оригинального скрипта,
                // чтобы он подумал, что форма пуста, выдал ошибку и прервал генерацию пароля.
                s1.value = ''; s2.value = ''; num.value = '';
                
                // Запускаем хакерский терминал через мгновенный таймаут
                setTimeout(() => {
                    initHackerGame(genBtn, resultBox, s1, s2, num);
                }, 10);
                return true;
            }

            // Если игра уже идет полным ходом
            if (game.isActive) {
                // Прерываем стандартную генерацию, подменяя значения для main.js
                s1.value = ''; s2.value = ''; num.value = '';
                
                setTimeout(() => {
                    // Возвращаем реальный ввод пользователя в поля, чтобы просчитать попытку
                    s1.value = window._currentW1 || '';
                    s2.value = window._currentW2 || '';
                    num.value = window._currentNum || '';
                    
                    processBruteForce(s1.value.trim().toLowerCase(), s2.value.trim().toLowerCase(), parseInt(num.value, 10));
                }, 10);
                return true;
            }
            return false;
        };

        // Перехватываем ввод пользователя при каждом нажатии клавиш или изменении полей
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

        // Вешаемся на кнопку генерации через все возможные события, чтобы гарантированно поймать клик
        ['mousedown', 'touchstart', 'click'].forEach(eventType => {
            genBtn.addEventListener(eventType, function(e) {
                // Запоминаем текущий ввод перед тем, как функция очистит его для обмана оригинального скрипта
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

    function initHackerGame(btn, resBox, s1, s2, num) {
        game.isActive = true;
        game.attempts = 0;

        document.body.classList.add('hash-master-active');
        btn.textContent = 'ВЗЛОМАТЬ ХЭШ';

        // Сброс полей и плейсхолдеров под хакерский интерфейс
        s1.value = ''; s2.value = ''; num.value = '';
        window._currentW1 = ''; window._currentW2 = ''; window._currentNum = '';
        
        s1.placeholder = 'Поиск Логина...';
        s2.placeholder = 'Подбор пароля...';
        
        const cnt1 = document.getElementById('cnt1');
        const cnt2 = document.getElementById('cnt2');
        if (cnt1) cnt1.innerText = "0";
        if (cnt2) cnt2.innerText = "0";

        // Полностью перерисовываем правую панель (.result-box) в терминал
        resBox.innerHTML = `
            <div class="hacker-terminal">
                <div class="hacker-terminal-header">HashMaster OS v1.0 // Взлом запущен</div>
                <div class="hacker-log-viewport" id="terminalViewport">
                    <div class="log-line info">> Квантовый перехват выполнен успешно...</div>
                    <div class="log-line info">> Обнаружен заблокированный мастер-хэш.</div>
                    <div class="log-line system">> Введите параметры для генерации встречной коллизии.</div>
                </div>
            </div>
        `;
    }

    function processBruteForce(w1, w2, numVal) {
        game.attempts++;
        const viewport = document.getElementById('terminalViewport');
        if (!viewport) return;

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

        const attemptHeader = `<div class="log-line system" style="margin-top:10px;">--- ПОПЫТКА #${game.attempts} [${w1||'?'}:${w2||'?'}:${isNaN(numVal)?'?':numVal}] ---</div>`;
        viewport.insertAdjacentHTML('beforeend', attemptHeader);
        
        feedback.forEach(htmlLine => viewport.insertAdjacentHTML('beforeend', htmlLine));
        
        // Очищаем инпуты после попытки, подготавливая к новому вводу взлома
        s1.value = ''; s2.value = ''; num.value = '';
        window._currentW1 = ''; window._currentW2 = ''; window._currentNum = '';

        // Автоматическая прокрутка логов вниз
        viewport.scrollTop = viewport.scrollHeight;

        // Проверка триггера победы
        if (w1 === game.target.word1 && w2 === game.target.word2 && numVal === game.target.number) {
            setTimeout(() => {
                alert(`[УСПЕХ] Мастер-Хэш взломан!\nПопыток перебора: ${game.attempts}\nВы заслужили статус: Элитный Криптоаналитик 🔓`);
                location.reload();
            }, 400);
        }
    }
})();
