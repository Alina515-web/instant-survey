// Ждем, пока весь HTML загрузится в браузере
document.addEventListener('DOMContentLoaded', function() {

    // 1. Находим все нужные элементы на странице
    const titleEl = document.getElementById('survey-title');
    const questionsContainer = document.getElementById('survey-questions');
    const formEl = document.getElementById('survey-form');
    const submitBtn = document.getElementById('submit-btn');
    const resultBlock = document.getElementById('result');
    const resultDataEl = document.getElementById('result-data');

    // 2. Загружаем JSON файл при помощи Fetch API
    fetch('survey-config.json')
        .then(function(response) {
            // Проверяем, успешно ли нашел браузер файл
            if (response.ok === false) {
                throw new Error('Файл конфигурации не найден');
            }
            return response.json(); // Превращаем текст JSON в обычный объект JS
        })
        .then(function(data) {
            // Когда данные успешно получены, запускаем построение сайта
            buildSurvey(data);
        })
        .catch(function(error) {
            // Если произошла ошибка (нет файла, ошибка в синтаксическом коде JSON и т.д.)
            titleEl.textContent = 'Ошибка загрузки опроса: ' + error.message;
        });

    // 3. Функция, которая строит опросник на основе данных из JSON
    function buildSurvey(data) {
        // Меняем заголовок "Загрузка..." на реальное название из файла
        titleEl.textContent = data.title;

        // Перебираем массив вопросов обычным циклом
        for (let i = 0; i < data.questions.length; i++) {
            const q = data.questions[i]; // Текущий вопрос

            // Создаем оболочку-дивы для каждого вопроса
            const questionBlock = document.createElement('div');
            questionBlock.className = 'question-block';

            // Создаем текст вопроса
            const label = document.createElement('label');
            label.className = 'question-text';
            label.textContent = q.text;
            questionBlock.appendChild(label);

            // Проверяем тип вопроса и создаем нужные элементы интерфейса
            if (q.type === 'text') {
                questionBlock.innerHTML += '<input type="text" name="' + q.id + '" placeholder="Введите ответ">';
            }
            else if (q.type === 'textarea') {
                questionBlock.innerHTML += '<textarea name="' + q.id + '" rows="3" placeholder="Введите развернутый ответ"></textarea>';
            }
            else if (q.type === 'radio' || q.type === 'checkbox') {
                // Если это выбор вариантов, перебираем массив опций вложенным циклом
                for (let j = 0; j < q.options.length; j++) {
                    const optionText = q.options[j];

                    // Собираем HTML-строку для радиокнопки или чекбокса
                    questionBlock.innerHTML +=
                        '<label class="option-label">' +
                            '<input type="' + q.type + '" name="' + q.id + '" value="' + optionText + '"> ' +
                            optionText +
                        '</label>';
                }
            }

            // Добавляем готовый блок вопроса в общий контейнер формы
            questionsContainer.appendChild(questionBlock);
        }

        // Показываем кнопку отправки, так как вопросы успешно сгенерировались
        submitBtn.classList.remove('hidden');
    }

    // 4. Обработка отправки заполненной формы
    formEl.addEventListener('submit', function(event) {
        event.preventDefault(); // Запрещаем странице перезагружаться при отправке

        // Используем встроенный инструмент FormData для автоматического сбора ответов
        const formData = new FormData(formEl);
        const userAnswers = {};

        // Собираем данные в красивый объект
        formData.forEach(function(value, key) {
            // Если у нас чекбоксы (несколько ответов на один ID), собираем их в массив
            if (userAnswers[key]) {
                // Если это уже массив, просто добавляем новое значение
                if (Array.isArray(userAnswers[key])) {
                    userAnswers[key].push(value);
                } else {
                    // Если это была строка, превращаем её в массив и добавляем новое значение
                    userAnswers[key] = [userAnswers[key], value];
                }
            } else {
                // Для обычных полей и радиокнопок просто записываем значение строкой
                userAnswers[key] = value;
            }
        });

        // Выводим результаты на экран
        resultDataEl.textContent = JSON.stringify(userAnswers, null, 2); // null, 2 делает JSON красивым с отступами
        resultBlock.classList.remove('hidden'); // Показываем блок результатов

        // Плавно скроллим к блоку результатов, чтобы пользователь их увидел
        resultBlock.scrollIntoView({ behavior: 'smooth' });
    });

});
