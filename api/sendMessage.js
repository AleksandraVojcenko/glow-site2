// Функция для обработки запросов к API
export default async function handler(req, res) {
  // Разрешаем CORS запросы
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Обработка предварительных OPTIONS запросов
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Разрешены только POST-запросы' 
    });
  }

  try {
    // Получаем данные из запроса
    const { name, email, message } = req.body;

    // Проверяем обязательные поля
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Заполните все поля' 
      });
    }

    // Ваши данные из переменных окружения Vercel
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    // Формируем текст для Telegram
    const telegramText = `
📨 *Новое сообщение с сайта*

👤 *Имя:* ${name}
📧 *Email:* ${email}
✉️ *Сообщение:*
${message}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
    `.trim();

    // Отправляем в Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: telegramText,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      }
    );

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ 
        success: true, 
        message: '✅ Сообщение отправлено! Я отвечу вам скоро.' 
      });
    } else {
      console.error('Ошибка Telegram:', data);
      return res.status(500).json({ 
        success: false, 
        message: '❌ Ошибка отправки. Попробуйте позже.' 
      });
    }

  } catch (error) {
    console.error('Ошибка сервера:', error);
    return res.status(500).json({ 
      success: false, 
      message: '❌ Внутренняя ошибка сервера' 
    });
  }
}