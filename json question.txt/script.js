document.addEventListener('DOMContentLoaded', () => {
    let questions = [];

    const container = document.getElementById('questions-container');
    const form = document.getElementById('survey-form');
    const downloadBtn = document.getElementById('download-btn');


    fetch('config.json')
        .then(response => {
            if (!response.ok) throw new Error('Не удалось получить файл конфигурации');
            return response.json();
        })
        .then(data => {
            questions = data;
            renderSurvey();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            if (container) {
                container.innerHTML = `<p class="loading-text" style="color: #e53e3e;">Ошибка загрузки вопросов: ${error.message}</p>`;
            }
        });


    function renderSurvey() {
        if (!container) return;
        container.innerHTML = '';

        questions.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = 'question-card';

            const qText = document.createElement('div');
            qText.className = 'question-text';
            qText.textContent = `${index + 1}. ${q.text}`;
            card.appendChild(qText);

            const optionsGroup = document.createElement('div');
            optionsGroup.className = 'options-group';

            if (q.type === 'text') {
                optionsGroup.innerHTML = `<textarea data-id="${q.id}" placeholder="Напишите ваш ответ здесь..."></textarea>`;
            }
            else if ((q.type === 'single' || q.type === 'multiple') && q.options) {
                const inputType = q.type === 'single' ? 'radio' : 'checkbox';

                q.options.forEach(opt => {
                    optionsGroup.innerHTML += `
                        <label class="option-label">
                            <input type="${inputType}" name="group_${q.id}" data-id="${q.id}" value="${opt}">
                            <span>${opt}</span>
                        </label>
                    `;
                });
            }

            card.appendChild(optionsGroup);
            container.appendChild(card);
        });


        if (downloadBtn) downloadBtn.classList.remove('hidden');
    }


    function collectAnswers() {
        const results = [];

        questions.forEach((q, index) => {
            let userResponse = '';

            if (q.type === 'text') {
                const textarea = document.querySelector(`textarea[data-id="${q.id}"]`);
                userResponse = textarea ? textarea.value.trim() : '';
            }
            else if (q.type === 'single') {
                const radio = document.querySelector(`input[data-id="${q.id}"]:checked`);
                userResponse = radio ? radio.value : '';
            }
            else if (q.type === 'multiple') {
                const checkedBoxes = document.querySelectorAll(`input[data-id="${q.id}"]:checked`);
                const values = Array.from(checkedBoxes).map(cb => cb.value);
                userResponse = values.length > 0 ? values.join(', ') : '';
            }


            results.push(`Вопрос ${index + 1}: ${q.text}\nОтвет: ${userResponse || '(нет ответа)'}`);
        });

        return results.join('\n\n');
    }


    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const answersText = collectAnswers();


            let fileContent = 'РЕЗУЛЬТАТЫ ОПРОСА\n';
            fileContent += '='.repeat(40) + '\n';
            fileContent += `Дата заполнения: ${new Date().toLocaleString('ru-RU')}\n`;
            fileContent += '='.repeat(40) + '\n\n';
            fileContent += answersText;


            const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');


            link.href = URL.createObjectURL(blob);
            const dateStr = new Date().toISOString().slice(0, 10);
            link.download = `survey_results_${dateStr}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        });
    }
});
