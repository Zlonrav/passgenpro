(function() {
    // Секретный триггер запуска игры
    const LAUNCH_CODE = { word1: 'hash', word2: 'master', number: 777 };

    // База сюжетных триад
    const TRIADS = [
        { w1: 'adam', w2: 'douglas', num: 42 },        // 1.  Адам Дуглас / Автостопом по Галактике
        { w1: 'marty', w2: 'doc', num: 88 },           // 2.  Назад в будущее / Марти и Док, 88 скорость Делориан для перемещения во времени
        { w1: 'delorean', w2: 'jigowatt', num: 121 },  // 3.  Назад в будущее / Делориан и 1,12 жиговатта
        { w1: 'neo', w2: 'morpheus', num: 101 },       // 4.  Матрица / Комната 101
        { w1: 'trinity', w2: 'matrix', num: 303 },     // 5.  Матрица / Комната 303
        { w1: 'skynet', w2: 'judgment', num: 214 },    // 6.  Терминатор / Время Судного Дня (2:14 ночи)
        { w1: 'judgment', w2: 'august', num: 29 },     // 7.  Терминатор / День и месяц судного дня (2:14 ночи)    
        { w1: 'cyberdyne', w2: 'systems', num: 97},    // 8.  Терминавтор / Cyberdyne Systems 1997 год
        { w1: 'sarah', w2: 'connor', num: 65},         // 9.  Терминавтор / Сара Коннор, год рождения 1965
        { w1: 'sherlock', w2: 'watson', num: 221 },    // 10. Шерлок Холмс / Бейкер-стрит 221B
        { w1: 'ray', w2: 'bradbury', num: 451 },       // 11. Рэй бредбери / 451 градус по Фаренгейту
        { w1: 'ark', w2: 'librae', num: 47 },          // 12. Борис Штерн / Ковчег 47 Либра
        { w1: 'kings', w2: 'cross', num: 934 },        // 13. Гарри Поттер / Платформа 9 и 3 четверти
        { w1: 'voldemort', w2: 'horcrux', num: 7 },    // 14. Гарри Поттер / Лорд Волан-де-Морт и 7 крестражей
        { w1: 'gringotts', w2: 'vault', num: 687 },    // 15. Гарри Поттер / Сейф №687 в банке «Гринготтс»
        { w1: 'gargantua', w2: 'dilatation', num: 7 }, // 16. Интерстеллар / Замедление времени на планете Миллер возле черной дыры Гаргантюа
        { w1: 'tars', w2: 'honesty', num: 90 },        // 17. Интерстеллар / Настройка уровня честности робота ТАРСа
        { w1: 'joseph', w2: 'cooper', num: 124 },      // 18. Интерстеллар / Возраст Купера при возвращении на Землю
        { w1: 'way', w2: 'station', num: 100 },        // 19. Клиффорд Саймак / Пересадочная станция
        { w1: 'robotics', w2: 'laws', num: 3 }         // 20. Айзек Азимов / Три закона робототехники
    ];

    // Глобальное состояние сессии игры
    let game = {
        isActive: false,
        activatedAt: 0, 
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

        // Механизм точечного перехвата данных до отправки в main.js
        const checkTriggerState = () => {
            const valW1 = s1.value.trim().toLowerCase();
            const valW2 = s2.value.trim().toLowerCase();
            const valNum = parseInt(num.value, 10);

            // Активация хакерского режима игры
            if (!game.isActive && valW1 === LAUNCH_CODE.word1 && valW2 === LAUNCH_CODE.word2 && valNum === LAUNCH_CODE.number) {
                s1.value = ''; s2.value = ''; num.value = '';
                game.activatedAt = Date.now(); 
                
                const randomTriad = TRIADS[Math.floor(Math.random() * TRIADS.length)];
                game.target.word1 = randomTriad.w1;
                game.target.word2 = randomTriad.w2;
                game.target.number = randomTriad.num;

                setTimeout(() => {
                    initHackerGame(genBtn, resultBox, s1, s2, num);
                }, 10);
                return true;
            }

            // Обработка попытки брутфорса во время активной игры
            if (game.isActive) {
                if (Date.now() - game.activatedAt < 400 || game.isProcessing) {
                    return true; 
                }

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
                if (game.isActive && !game.isProcessing && (Date.now() - game.activatedAt >= 400)) {
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
        btn.textContent = 'ВЗЛОМАТЬ';
    
        s1.value = ''; s2.value = ''; num.value = '';
        window._currentW1 = ''; window._currentW2 = ''; window._currentNum = '';
        
        s1.placeholder = 'Поиск Логина...';
        s2.placeholder = 'Подбор пароля...';
        
        const cnt1 = document.getElementById('cnt1');
        const cnt2 = document.getElementById('cnt2');
        if (cnt1) cnt1.innerText = "0";
        if (cnt2) cnt2.innerText = "0";
    
        // Убираем дублирование названия из правой панели, раз оно горит вверху
        resBox.innerHTML = `
            <div class="hacker-terminal">
                <div class="hacker-terminal-header">Протокол OS V2.0 // Процедурный брутфорс</div>
                <div class="hacker-log-viewport" id="terminalViewport" style="overflow-y: auto;">
                    <div class="log-line info">> Квантовый перехват выполнен успешно...</div>
                    <div class="log-line info">> Сгенерирована случайная триада узла защиты.</div>
                    <div class="log-line system">> Нащупайте длину слов, их состав и числовой сдвиг!</div>
                </div>
            </div>
        `;
    }

    // Обработка логики брутфорса с «тепловым» градиентом букв и голубой подсветкой длины
    function processBruteForce(w1, w2, numVal) {
        game.attempts++;
        const viewport = document.getElementById('terminalViewport');
        const s1 = document.getElementById('s1');
        const s2 = document.getElementById('s2');
        const num = document.getElementById('num');
        if (!viewport || !s1 || !s2 || !num) return;

        let feedback = [];

        // Базовые цвета интерфейса терминала
        const cGreen = "color: #39ff14;";
        const cRed = "color: #ef4444;";
        const cBlue = "color: #00ffff;"; // Голубой цвет для "Длина БОЛЬШЕ вашей" и "Искомый сдвиг БОЛЬШЕ"
        const cSuccessBold = "color: #39ff14; font-weight: bold;";

        // ДВИЖОК ГЕНЕРАЦИИ СЛУЧАЙНОГО ШУМА (Вероятность 25% на попытку)
        const isNoiseRound = Math.random() < 0.25;

        // Функция честного подсчета букв
        const countValidMatches = (userInput, targetWord) => {
            let targetChars = [...targetWord];
            let matchCount = 0;
            for (let char of userInput) {
                let index = targetChars.indexOf(char);
                if (index !== -1) {
                    matchCount++;
                    targetChars.splice(index, 1);
                }
            }
            return matchCount;
        };

        // Функция расчета динамического цвета для количества букв
        const getLetterColor = (matches, targetWord) => {
            if (matches === 0) return "#ef4444"; // 0% - Красный
            
            const percent = (matches / targetWord.length) * 100;
            if (percent >= 100) return "#39ff14"; // 100% - Зеленый
            if (percent >= 70) return "#a3ff14";  // 71-99% - Лаймовый/Салатовый
            if (percent >= 36) return "#ffdd00";  // 36-70% - Желтый
            return "#ff7700";                     // 1-35% - Оранжевый
        };

        // Вспомогательная функция искажения букв при шуме (±1, но не меньше 0 и не больше длины слова)
        const applyNoise = (realMatches, targetWord) => {
            if (!isNoiseRound || realMatches === targetWord.length) return realMatches; // Победный ввод не искажаем
            const modifier = Math.random() < 0.5 ? 1 : -1;
            let noisyResult = realMatches + modifier;
            if (noisyResult < 0) noisyResult = 0;
            if (noisyResult > targetWord.length) noisyResult = targetWord.length;
            return noisyResult;
        };

        // === ПРОВЕРКА ПОЛЯ 1 (СЛОВО 1) ===
                // === ПРОВЕРКА ПОЛЯ 1 (СЛОВО 1) ===
        let s1Line = `<span class="log-warn">[СЛОВО 1]</span> `;
        if (w1 === game.target.word1) {
            s1Line += `<span style="${cSuccessBold}">Авторизовано!</span>`;
        } else if (w1.length === 0) {
            // Если поле пустое - выводим системную ошибку красным цветом
            s1Line += `<span style="${cRed}">Слот пуст. Требуется значение.</span>`;
        } else {
            let realMatches = countValidMatches(w1, game.target.word1);
            let displayMatches = applyNoise(realMatches, game.target.word1);
            let letterColor = getLetterColor(displayMatches, game.target.word1);
            
            s1Line += `<span style="color: ${letterColor}; font-weight: bold;">Букв: ${displayMatches}</span> | `;
            
            if (w1.length === game.target.word1.length) {
                s1Line += `<span style="${cGreen}">Длина совпала!</span>`;
            } else if (w1.length < game.target.word1.length) {
                s1Line += `<span style="${cBlue}">Длина БОЛЬШЕ вашей</span>`;
            } else {
                s1Line += `<span style="${cRed}">Длина МЕНЬШЕ вашей</span>`;
            }
        }
        feedback.push(`<div class="log-line">${s1Line}</div>`);

        // === ПРОВЕРКА ПОЛЯ 2 (СЛОВО 2) ===
        let s2Line = `<span class="log-warn">[СЛОВО 2]</span> `;
        if (w2 === game.target.word2) {
            s2Line += `<span style="${cSuccessBold}">Авторизовано!</span>`;
        } else if (w2.length === 0) {
            // Если поле пустое - выводим системную ошибку красным цветом
            s2Line += `<span style="${cRed}">Слот пуст. Требуется значение.</span>`;
        } else {
            let realMatches = countValidMatches(w2, game.target.word2);
            let displayMatches = applyNoise(realMatches, game.target.word2);
            let letterColor = getLetterColor(displayMatches, game.target.word2);
            
            s2Line += `<span style="color: ${letterColor}; font-weight: bold;">Букв: ${displayMatches}</span> | `;
            
            if (w2.length === game.target.word2.length) {
                s2Line += `<span style="${cGreen}">Длина совпала!</span>`;
            } else if (w2.length < game.target.word2.length) {
                s2Line += `<span style="${cBlue}">Длина БОЛЬШЕ вашей</span>`;
            } else {
                s2Line += `<span style="${cRed}">Длина МЕНЬШЕ вашей</span>`;
            }
        }
        feedback.push(`<div class="log-line">${s2Line}</div>`);


        // === ПРОВЕРКА ПОЛЯ 3 (ЧИСЛО) ===
        let numLine = `<span class="log-info">[ЧИСЛО ]</span> `;
        if (numVal === game.target.number) {
            numLine += `<span style="${cSuccessBold}">Сдвиг соли подтвержден!</span>`;
        } else if (isNaN(numVal)) {
            numLine += `<span style="${cRed}">Слот пуст. Требуется значение.</span>`;
        } else if (numVal < game.target.number) {
            numLine += `<span style="${cBlue}">Искомый сдвиг БОЛЬШЕ ${numVal}</span>`;
        } else {
            numLine += `<span style="${cRed}">Искомый сдвиг МЕНЬШЕ ${numVal}</span>`;
        }
        feedback.push(`<div class="log-line">${numLine}</div>`);

        // ДИНАМИЧЕСКИЙ ЗАГОЛОВОК ПОПЫТКИ (Меняет вид, если раунд зашумлен)
        let attemptHeader = '';
        if (isNoiseRound && !(w1 === game.target.word1 && w2 === game.target.word2 && numVal === game.target.number)) {
            attemptHeader = `<div class="log-line" style="color: #ffaa00; margin-top:10px;">~~~ ПОПЫТКА #${game.attempts} [${w1||'?'}:${w2||'?'}:${isNaN(numVal)?'?':numVal}] (Потеря пакетов) ~~~</div>`;
        } else {
            attemptHeader = `<div class="log-line system" style="margin-top:10px;">--- ПОПЫТКА #${game.attempts} [${w1||'?'}:${w2||'?'}:${isNaN(numVal)?'?':numVal}] ---</div>`;
        }
        
        viewport.insertAdjacentHTML('beforeend', attemptHeader);
        feedback.forEach(htmlLine => viewport.insertAdjacentHTML('beforeend', htmlLine));
        viewport.scrollTop = viewport.scrollHeight;

        // ПРОВЕРКА АБСОЛЮТНОЙ ПОБЕДЫ
        if (w1 === game.target.word1 && w2 === game.target.word2 && numVal === game.target.number) {
            game.isActive = false;

            setTimeout(() => {
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

                // Окрашиваем кнопку в золотой цвет с гарантированным !important приоритетом
                const genBtn = document.getElementById('genBtn');
                genBtn.style.setProperty('background', '#ffd700', 'important');
                genBtn.style.setProperty('box-shadow', '0 0 15px #ffd700', 'important');
                genBtn.style.setProperty('color', '#000000', 'important');
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

        s1.value = ''; s2.value = ''; num.value = '';
        window._currentW1 = ''; window._currentW2 = ''; window._currentNum = '';
        const cnt1 = document.getElementById('cnt1');
        const cnt2 = document.getElementById('cnt2');
        if (cnt1) cnt1.innerText = "0";
        if (cnt2) cnt2.innerText = "0";
    }
})();
