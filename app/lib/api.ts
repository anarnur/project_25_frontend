const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendMessageStream(
  message: string, 
  onChunk: (text: string) => void,
  signal?: AbortSignal
) {
  // 1. Формируем запрос к бэкенду
  const response = await fetch(`${API_URL}/generate_stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      // Специальный формат промпта для TinyLlama 1.1B
      prompt: `<|system|>\nYou are a professional AI assistant. Answer concisely and stay on topic.\n</s>\n<|user|>\n${message}\n</s>\n<|assistant|>\n`, 
      max_tokens: 256,
      temperature: 0.3
    }),
    signal,
  });

  // 2. Проверка на ошибки сервера
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Ошибка сервера. Проверьте логи Railway.");
  }

  // 3. Настройка потокового чтения (Streaming)
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Поток данных не поддерживается браузером.");

  const decoder = new TextDecoder();
  let fullText = ""; 

  // 4. Цикл чтения чанков
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;

    // 5. Очистка текста от технических тегов модели
    const cleanText = fullText
      .replace(/<\|.*?\|>/g, "") // Удаляет <|system|>, <|user|>, <|assistant|>
      .replace(/<\/s>/g, "")     // Удаляет тег конца строки </s>
      .replace(/^\s+/, "");      // Удаляет лишние пробелы в самом начале

    // Отправляем чистый текст в интерфейс
    onChunk(cleanText); 
  }
}