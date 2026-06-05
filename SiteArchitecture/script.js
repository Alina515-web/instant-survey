function saveAnswersToFile () {
    let textContent = 'Результаты тестирования\n=============================\n';

    for (let i = 1; i <= 10; i++) {
        const questionName = `q\${i}`;
        const selected = document.querySelector(`input[name="\${questionName}"]:checked`);

        if (selected) {
            textContent += `Вопрос ${i}: ${selected.nextElementSibling.textContent}\n`;
        } else {
            textContent += `Вопрос ${i}: Ответ не выбран\n`;
        }
    }

    const  blob = new Blob([textContent], {type: 'text/plain; charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `test_results_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById('savedBtn').addEventListener('click', saveAnswersToFile);