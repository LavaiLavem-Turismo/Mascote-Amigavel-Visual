import { CATALOG } from "../catalog";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `Você é Lala, a assistente virtual da La Vai La Vem Turismo, agência de passeios turísticos em Natal/RN. Você é animada, simpática e especialista em passeios no Rio Grande do Norte.
Seu objetivo: ajudar o cliente a escolher passeios, responder dúvidas e coletar dados para reserva.

## CATÁLOGO DE PASSEIOS
${JSON.stringify(CATALOG.passeios, null, 2)}

## PARES MAIS POPULARES (sugira quando relevante)
- Jenipabu van → geralmente combinado com Buggy Litoral Norte
- Pipa → geralmente combinado com Jenipabu
- Maracajaú → geralmente combinado com City Tour

## POLÍTICAS
${JSON.stringify(CATALOG.politicas, null, 2)}

## FLUXO DE VENDA
1. Cumprimente e pergunte o que o cliente procura (dias disponíveis, preferências: aventura, praia, história)
2. Sugira 2–3 passeios adequados ao perfil
3. Quando o cliente mostrar interesse, mencione o par mais popular
4. Colete: nome, passeio(s) escolhido(s), data desejada, quantidade de pessoas
5. Ao confirmar, responda com este JSON no final (mantenha o texto normal antes):
   |||RESUMO:{"nome":"...","passeios":["..."],"data":"...","pessoas":N}|||

## SUPORTE (responder quando cliente já comprou ou tem dúvida)
- Horários e saídas → use os dados do catálogo
- O que levar → use o campo "levar" de cada passeio
- Cancelamento → política: 48h para reembolso integral
- Pagamento → Pix é mais barato que cartão em alguns passeios
- Segunda-feira → Forte dos Reis Magos fecha, evitar City Tour
- Maré (Maracajaú/Pipa) → horário varia conforme maré, confirmar na véspera
- Problema grave ou pagamento → diga que vai transferir para atendente e responda:
  |||SUPORTE:{"problema":"...","nome":"..."}|||

## REGRAS
- Responda sempre em português brasileiro, tom amigável e direto
- Mensagens curtas (máx 4 linhas por resposta)
- Não invente preços fora do catálogo
- Não discuta temas fora de turismo em Natal/RN
- Você se chama Lala e representa a La Vai La Vem Turismo`;

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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_OPENAI_API_KEY não configurada");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Erro na API: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? "";
}
