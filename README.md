# Project 25 — AI Chat Frontend

Чат-интерфейс для дообученной LLM модели. Фронтенд на Next.js подключён к FastAPI бэкенду с поддержкой стриминга токенов в реальном времени.

![AI Chat Screenshot](public/screenshot.png)

## 🔗 Ссылки

- **Приложение**: https://project-25-frontend-oks8xvt69-anarnurs-projects.vercel.app
- **Бэкенд API**: https://project23docker-production.up.railway.app
- **Demo-видео**: (вставь ссылку на Loom/YouTube)

## 🛠 Стек

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- FastAPI бэкенд (Project 24) с StreamingResponse

## ⚙️ Архитектура

Стриминг реализован через `fetch` + `response.body.getReader()`. Бэкенд отдаёт токены в формате SSE (`data: {...}\n\n`), фронтенд читает поток и дописывает токены в последнее сообщение через `setMessages(prev => ...)`. Состояние чата хранится в хуке `useChat.ts`.

app/
├── components/
│   ├── ChatWindow.tsx     # список сообщений + автоскролл
│   ├── MessageBubble.tsx  # одно сообщение (user/assistant)
│   └── PromptInput.tsx    # поле ввода + кнопки Send/Stop
├── hooks/
│   └── useChat.ts         # вся логика: state, streaming, AbortController
├── lib/
│   ├── api.ts             # fetch + ReadableStream
│   └── types.ts           # Message, Role, ApiError
└── page.tsx               # главная страница

## 🚀 Локальный запуск

1. Клонируй репозиторий:
```bash
   git clone https://github.com/anarnur/project_25_frontend.git
   cd project_25_frontend
```

2. Установи зависимости:
```bash
   npm install
```

3. Создай `.env.local`:

NEXT_PUBLIC_API_URL=https://project23docker-production.up.railway.app

4. Запусти:
```bash
   npm run dev
```

5. Открой http://localhost:3000

## 🔐 Переменные окружения

| Переменная | Описание |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL задеплоенного FastAPI бэкенда |

## ✅ Реализованные функции

- Стриминг ответа токен за токеном
- История диалога в рамках сессии
- Кнопка «Стоп» через AbortController
- Обработка ошибок (сеть, 429, 5xx)
- Автопрокрутка к последнему сообщению
- Адаптивный интерфейс

