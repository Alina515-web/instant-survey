fetch('data.json')
    .then(response => response.json())
    .then(coursesArray => {
        const catalogDiv = document.getElementById('catalog');

        // Очищаем текст "Загрузка каталога..." перед выводом данных
        catalogDiv.innerHTML = '';

        // Перебираем массив курсов из JSON
        coursesArray.forEach(course => {

            // Создаем массив HTML-тегов для текущей карточки
            const tagsHtml = course.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            // Собираем шаблон карточки
            const cardHtml = `
                <div class="card">
                    <img class="card-image" src="${course.image}" alt="${course.title}">
                    <div class="card-content">
                        <div class="tags-container">${tagsHtml}</div>
                        <h2 class="card-title">${course.title}</h2>
                        <p class="lessons">Количество уроков: <strong>${course.lessonsCount}</strong></p>
                        <div class="status ${course.isAvailable ? 'available' : 'unavailable'}">
                            ${course.isAvailable ? '● Доступен' : '✕ Закрыт'}
                        </div>
                    </div>
                </div>
            `;

            // Добавляем готовую карточку в нашу общую сетку на сайте
            catalogDiv.innerHTML += cardHtml;
        });
    })
    .catch(error => {
        console.error('Ошибка загрузки каталога:', error);
        document.getElementById('catalog').innerText = 'Не удалось загрузить каталог товаров.';
    });
