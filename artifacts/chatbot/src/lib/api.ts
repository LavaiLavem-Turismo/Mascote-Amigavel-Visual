export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ResumoData {
  nome: string;
  passeios: string[];
  data: string;
  pessoas: number;
}

export interface SuporteData {
  problema: string;
  nome: string;
}

export interface ParsedResponse {
  text: string;
  resumo?: ResumoData;
  suporte?: SuporteData;
}

export function parseResponse(content: string): ParsedResponse {
  const resumoMatch = content.match(/\|\|\|RESUMO:(\{.*?\})\|\|\|/s);
  const suporteMatch = content.match(/\|\|\|SUPORTE:(\{.*?\})\|\|\|/s);

  const text = content
    .replace(/\|\|\|RESUMO:\{.*?\}\|\|\|/s, "")
    .replace(/\|\|\|SUPORTE:\{.*?\}\|\|\|/s, "")
    .trim();

  let resumo: ResumoData | undefined;
  let suporte: SuporteData | undefined;

  if (resumoMatch) {
    try {
      resumo = JSON.parse(resumoMatch[1]);
    } catch {
      // ignore
    }
  }

  if (suporteMatch) {
    try {
      suporte = JSON.parse(suporteMatch[1]);
    } catch {
      // ignore
    }
  }

  return { text, resumo, suporte };
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const response = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Erro desconhecido" }));
    throw new Error((err as { error?: string }).error ?? "Erro na requisição");
  }

  const data = (await response.json()) as { content: string };
  return data.content;
}
