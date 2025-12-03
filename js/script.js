// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        document.querySelector('.nav-menu').classList.remove('active');
    });
});

// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.querySelector('.nav-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!menu.contains(e.target) && !menuBtn.contains(e.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
});

// Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (!track || !cards.length || !prevBtn || !nextBtn) {
        console.error("Slider elements not found!");
        return;
    }
    
    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth;
    const gap = 32; // соответствует gap: 2rem (1rem = 16px)
    
    // Функция для обновления позиции
    function updatePosition() {
        const offset = -currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(${offset}px)`;
    }
    
    // Переход к конкретному слайду
    function goToSlide(index) {
        currentIndex = index;
        if(currentIndex >= cards.length) currentIndex = 0;
        if(currentIndex < 0) currentIndex = cards.length - 1;
        updatePosition();
    }
    
    // Навигация
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    
    // Автопрокрутка
    let autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000);
    
    // Остановка автопрокрутки при взаимодействии
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('touchstart', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000);
    });
    
    // Пересчет при изменении размера окна
    window.addEventListener('resize', () => {
        cardWidth = cards[0].offsetWidth;
        updatePosition();
    });
    
    // Инициализация позиции
    updatePosition();
    // Обработка формы обратной связи
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('telegramForm');
    if (!form) return;
    
    const responseEl = document.getElementById('formResponse');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        // Показываем загрузку
        button.textContent = 'Отправка...';
        button.disabled = true;
        responseEl.style.display = 'none';
        
        try {
            // Собираем данные из формы
            const formData = {
                firstname: form.firstname.value.trim(),
                lastname: form.lastname.value.trim(),
                middlename: form.middlename.value.trim(),
                email: form.email.value.trim(),
                message: form.message.value.trim()
            };
            
            // Формируем полное имя
            const fullName = [formData.lastname, formData.firstname, formData.middlename]
                .filter(Boolean)
                .join(' ');
            
            // Отправляем данные на наш API (будет на том же домене Vercel)
            const response = await fetch('/api/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fullName || formData.firstname,
                    email: formData.email,
                    message: formData.message
                })
            });
            
            const result = await response.json();
            
            // Показываем результат пользователю
            responseEl.textContent = result.message;
            if (result.success) {
                responseEl.style.backgroundColor = '#d4edda';
                responseEl.style.color = '#155724';
                responseEl.style.border = '1px solid #c3e6cb';
                form.reset(); // Очищаем форму
            } else {
                responseEl.style.backgroundColor = '#f8d7da';
                responseEl.style.color = '#721c24';
                responseEl.style.border = '1px solid #f5c6cb';
            }
            responseEl.style.display = 'block';
            
            // Прячем сообщение через 5 секунд
            setTimeout(() => {
                responseEl.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            responseEl.textContent = 'Ошибка сети. Проверьте подключение.';
            responseEl.style.backgroundColor = '#f8d7da';
            responseEl.style.color = '#721c24';
            responseEl.style.display = 'block';
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    });
});
});