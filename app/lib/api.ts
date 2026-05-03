const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendMessageStream(
  message: string, 
  onChunk: (text: string) => void,
  signal?: AbortSignal // Добавляем поддержку отмены запроса
) {
  const response = await fetch(`${API_URL}/generate_stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 

      prompt: `<|system|>\nYou are a helpful assistant. Provide concise answers.\n</s>\n<|user|>\n${message}\n</s>\n<|assistant|>\n`, 
  max_tokens: 128 
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json();
    throw { status: response.status, ...err };
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = ""; 

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    
    // Добавляем новый кусок к общему тексту
    fullText += chunk;

    // Вызываем функцию обновления UI
    onChunk(fullText); 
  }
}