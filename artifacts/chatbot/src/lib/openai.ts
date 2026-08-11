import { sendChatMessage } from "./api";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
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
      // ignore parse errors
    }
  }

  if (suporteMatch) {
    try {
      suporte = JSON.parse(suporteMatch[1]);
    } catch {
      // ignore parse errors
    }
  }

  return { text, resumo, suporte };
}

export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  // Keep the provider key on the server. This compatibility helper intentionally
  // delegates to the same protected endpoint used by the current chat screen.
  return sendChatMessage(
    messages
      .filter((message) => message.role !== "system")
      .map(({ role, content }) => ({
        role: role as "user" | "assistant",
        content,
      })),
    "lala",
  );
}
