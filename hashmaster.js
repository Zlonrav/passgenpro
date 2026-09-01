(function() {
    // Триггер запуска хакерской игры (под твои лимиты полей)
    const LAUNCH_CODE = { word1: 'matrix', word2: 'break', number: 404 };

    // Что нужно угадать логическим перебором
    let game = {
        isActive: false,
        attempts: 0,
        target: { word1: 'admin', word2: 'root', number: 777 }
    };

    document.addEventListener("DOMContentLoaded", () => {
        const genBtn = document.getElementById('genBtn');
        const resultBox = document.querySelector('.result-box');
        const s1 = document.getElementById('s1');
        const s2 = document.getElementById('s2');
        const num = document.getElementById('num');

        if (!genBtn || !resultBox || !s1 || !s2 || !num) return;

        // Перехватываем управление ДО основного скрипта main.js
        genBtn.addEventListener('mousedown', function(event) {
            const valW1 = s1.value.trim().toLowerCase();
            const valW2 = s2.value.trim().toLowerCase();
            const valNum = parseInt(num.value, 10);

            // Режим 1: Проверка на запуск игры
            if (!game.isActive) {
                if (valW1 === LAUNCH_CODE.word1 && valW2 === LAUNCH_CODE.word2 && valNum === LAUNCH_CODE.number) {
                    event.preventDefault();
                    event.stopPropagation();
                    initHackerGame(genBtn, resultBox, s1, s2, num);
                }
                return;
            }

            // Режим 2: Игра активна, обрабатываем попытку взлома
            if (game.isActive) {
                event.preventDefault();
                event.stopPropagation();
                processBruteForce(valW1, valW2, valNum);
            }
        }, true); // true — критически важно для перехвата mousedown/touchstart
        
        // Дублируем для тач-событий мобилок
        genBtn.addEventListener('touchstart', function(event) {
            if (game.isActive) {
                event.preventDefault();
                event.stopPropagation();
                const valW1 = s1.value.trim().toLowerCase();
                const valW2 = s2.value.trim().toLowerCase();
                const valNum = parseInt(num.value, 10);
                processBruteForce(valW1, valW2, valNum);
            }
        }, true);
    });

    function initHackerGame(btn, resBox, s1, s2, num) {
        game.isActive = true;
        game.attempts = 0;

        document.body.classList.add('hash-master-active');
        btn.textContent = 'ВЗЛОМАТЬ ХЭШ';

        // Сброс полей под игру
        s1.value = ''; s2.value = ''; num.value = '';
        s1.placeholder = 'Поиск Логина...';
        s2.placeholder = 'Подбор пароля...';
        document.getElementById('cnt1').innerText = "0";
        document.getElementById('cnt2').innerText = "0";

        // Перерисовываем панель вывода результатов под логи терминала
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
        viewport.scrollTop = viewport.scrollHeight;

        // Условие победы
        if (w1 === game.target.word1 && w2 === game.target.word2 && numVal === game.target.number) {
            setTimeout(() => {
                alert(`[УСПЕХ] Мастер-Хэш взломан!\nПопыток перебора: ${game.attempts}\nВы заслужили статус: Элитный Криптоаналитик 🔓`);
                location.reload();
            }, 400);
        }
    }
})();
