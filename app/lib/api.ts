const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function streamGenerate(
  prompt: string,
  onToken: (token: string) => void,
  signal: AbortSignal
): Promise<void> {
  const response = await fetch(`${API_URL}/generate/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: `You are a helpful AI assistant. Answer clearly and concisely.\n\nUser: ${prompt}\nAssistant:`, max_tokens: 256 }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json();
    throw { status: response.status, ...err };
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.text) onToken(parsed.text);
      } catch {}
    }
  }
}