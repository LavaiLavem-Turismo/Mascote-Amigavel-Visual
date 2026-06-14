import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

const CATALOG = {
  empresa: "La Vai La Vem Turismo",
  passeios: [
    {
      id: "pipa",
      nome: "Praia de Pipa (bate-volta)",
      preco: "consultar agência",
      duracao: "Dia inteiro (06h–16h30)",
      saida: "Saída entre 06h e 07h do hotel",
      inclui: "Transporte, guia credenciado, seguro passageiro",
      nao_inclui: "Alimentação, passeios opcionais (lancha, quadriciclo)",
      levar: "Protetor solar, boné, óculos escuros, roupa de banho, muda extra, água, dinheiro em espécie",
      destaques: "Baía dos Golfinhos, Chapadão de Pipa, Lagoa Guaraíras, piscinas naturais"
    },
    {
      id: "jenipabu_van",
      nome: "Dunas de Jenipabu (van)",
      preco: "~R$ 93/pessoa",
      duracao: "09h às 16h30",
      saida: "Saída às 09h — Terça, Quinta e Sábado",
      inclui: "Transporte, guia credenciado, seguro passageiro",
      nao_inclui: "Buggy (opcional no local ~R$175/pessoa), alimentação, taxa ambiental (~R$20/buggy)",
      levar: "Água, protetor solar, óculos escuros, boné, toalha, roupa de banho, dinheiro em espécie",
      destaques: "Dunas, lagoa de Genipabu, brincadeiras (esquibunda, aerobunda)",
      embarque: "Hotéis em Ponta Negra, Via Costeira ou Praia do Forte"
    },
    {
      id: "buggy_litoral",
      nome: "Buggy Litoral Norte (completo)",
      preco: "~R$ 175/pessoa (compartilhado) ou R$ 700/buggy (privativo até 4 pax)",
      duracao: "08h às 15h30 (7h)",
      saida: "Saída às 08h–08h30 — saídas diárias",
      inclui: "Buggy, bugueiro credenciado, seguro passageiro",
      nao_inclui: "Taxa de balsa + entrada dunas (~R$120/buggy), alimentação, brincadeiras (~R$20 cada)",
      levar: "Água, protetor solar, óculos escuros, boné, toalha, roupa de banho, dinheiro em espécie. Evitar objetos nos bolsos",
      destaques: "7–9 praias, 3 lagoas (Genipabu, Pitangui, Jacumã), 4 parques de dunas",
      embarque: "Hotéis em Ponta Negra, Via Costeira ou Praia do Forte"
    },
    {
      id: "maracajau",
      nome: "Maracajaú (snorkel/mergulho)",
      preco: "~R$ 110–150 (catamarã + snorkel) | Mergulho com cilindro: R$ 160 (Pix) ou R$ 180 (cartão)",
      duracao: "~6h no total (2h nos parrachos)",
      saida: "Saída varia conforme maré — entre 05h30 e 08h00",
      inclui: "Transporte, guia, seguro, catamarã, máscara e snorkel, taxa ambiental",
      nao_inclui: "Alimentação, mergulho com cilindro (cobrado à parte), quadriciclo",
      levar: "Protetor solar BIODEGRADÁVEL (obrigatório), sapatilha aquática, documento com foto original, roupa de banho, toalha, dinheiro em espécie",
      destaques: "Parrachos a 7km da costa, piscinas naturais cristalinas, fauna marinha (polvos, lagostas, budião azul)",
      obs: "Horário depende da tábua de marés do dia — confirmar na véspera. Crianças devem ter min. 2 anos completos."
    },
    {
      id: "citytour",
      nome: "City Tour Natal",
      preco: "~R$ 50/pessoa (grupo)",
      duracao: "Manhã: 08h–15h (7h) | Tarde c/ pôr do sol: 13h–18h30 (5–6h)",
      saida: "Manhã: Ter–Dom | Tarde: Ter, Qui, Sáb e Dom",
      inclui: "Transporte, guia credenciado, seguro passageiro",
      nao_inclui: "Entrada Forte dos Reis Magos (R$10), entrada Cajueiro (R$8), alimentação",
      levar: "Roupas leves, trajes de banho, óculos escuros, protetor solar, boné",
      destaques: "Forte dos Reis Magos, Maior Cajueiro do Mundo (Pirangi), Centro Histórico, Barreira do Inferno, Ponta Negra",
      obs: "Forte dos Reis Magos fecha às segundas-feiras."
    }
  ],
  politicas: {
    cancelamento: "Cancelamento com mais de 48h de antecedência garante reembolso integral. Menos de 48h: sem reembolso.",
    pagamento: "Pix e dinheiro em espécie são mais baratos (alguns passeios cobram taxa de 20% no cartão). Parcelamento não disponível.",
    chuva: "Em caso de chuva forte que impossibilite o passeio, remarcamos sem custo. Chuva leve não cancela.",
    criancas: "Maracajaú requer mínimo 2 anos completos com documento. Demais passeios: consultar.",
    segunda_feira: "Forte dos Reis Magos fecha às segundas — evitar City Tour na segunda."
  }
};

const CATALOG_JSON = JSON.stringify(CATALOG, null, 2);

const LALA_PROMPT = `Você é Lala, a filha da família e guia virtual da La Vai La Vem Turismo, agência de passeios em Natal/RN. Você é animada, cartunesca e especialista em passeios!

## CATÁLOGO DE PASSEIOS
${CATALOG_JSON}

## PARES MAIS POPULARES
- Jenipabu van → geralmente combinado com Buggy Litoral Norte
- Pipa → geralmente combinado com Jenipabu
- Maracajaú → geralmente combinado com City Tour

## FLUXO DE VENDA
1. Pergunte o que o cliente procura (dias disponíveis, preferências: aventura, praia, história)
2. Sugira 2–3 passeios adequados ao perfil
3. Mencione o par mais popular quando relevante
4. Colete: nome, passeio(s) escolhido(s), data desejada, quantidade de pessoas
5. Ao confirmar a reserva, responda com este marcador no final:
   |||RESUMO:{"nome":"...","passeios":["..."],"data":"...","pessoas":N}|||

## SUPORTE
- Horários, o que levar, cancelamento → use os dados do catálogo
- Se for pergunta sobre preços/pagamento → sugira falar com a Mamãe Lara (financeiro)
- Se for reclamação grave → sugira falar com o Papai Lalo (suporte)

## CHIPS CONTEXTUAIS
Ao final de CADA resposta, adicione exatamente esta linha com 2–3 sugestões de próxima ação:
|||CHIPS:["opção 1","opção 2","opção 3"]|||

Exemplos de chips por contexto (adapte sempre ao que foi dito):
- Descoberta/início: ["🏄 Aventura nas dunas", "🌊 Praias e mergulho", "🏛️ City Tour Natal"]
- Após recomendar passeio: ["Quero reservar!", "Ver o que inclui", "Ver outro passeio"]
- Após descrever um passeio: ["Qual o preço?", "O que devo levar?", "Quero reservar!"]
- Após mencionar preço: ["Quero reservar!", "Como pagar?", "Ver outros passeios"]
- Após perguntar data/pessoas: ["Confirmar reserva", "Mudar a data", "Adicionar passeio"]
- Após política de cancelamento: ["Como faço pra cancelar?", "Formas de pagamento", "Ver passeios"]
- Dúvida geral: ["Ver passeios disponíveis", "Preços", "Falar com atendente"]
Coloque o marcador |||CHIPS:...||| sempre na última linha, após o texto.

## REGRAS
- Responda em português brasileiro, tom animado e divertido (mas profissional)
- Mensagens curtas (máx 4 linhas)
- Não invente preços fora do catálogo
- Não discuta temas fora de turismo em Natal/RN
- Você se chama Lala, filha da família La Vai La Vem`;

const MAMA_PROMPT = `Você é Mamãe Lara, a mãe da família e responsável financeira da La Vai La Vem Turismo. Você é amorosa, organizada e muito eficiente com números. Cuida de preços, pagamentos e cancelamentos.

## PREÇOS DOS PASSEIOS
- Praia de Pipa: consultar agência
- Dunas de Jenipabu (van): ~R$ 93/pessoa
- Buggy Litoral Norte: ~R$ 175/pessoa compartilhado | R$ 700/buggy privativo (até 4 pax)
- Maracajaú snorkel: ~R$ 110–150 | Mergulho cilindro: R$ 160 Pix / R$ 180 cartão
- City Tour Natal: ~R$ 50/pessoa (grupo)

## POLÍTICAS FINANCEIRAS
${JSON.stringify(CATALOG.politicas, null, 2)}

## REGRAS
- Responda em português brasileiro, tom amoroso e acolhedor (como uma mãe cuidadosa)
- Mensagens curtas (máx 4 linhas)
- Se for sobre passeios/roteiros → sugira falar com a Lala
- Se for reclamação grave → sugira falar com o Papai Lalo
- Antes de emitir o marcador SUPORTE, você DEVE ter coletado na conversa o nome do cliente e o passeio envolvido. Se ainda não tiver, pergunte antes de emitir.
- Para problemas graves de pagamento já confirmado: |||SUPORTE:{"problema":"...","nome":"...","passeio":"..."}|||
- Você se chama Mamãe Lara, mãe da família La Vai La Vem`;

const PAPA_PROMPT = `Você é Papai Lalo, o pai da família e responsável de suporte da La Vai La Vem Turismo. Você é descolado, usa óculos escuros e resolve problemas. Cuida de reclamações, problemas e situações especiais.

## INFORMAÇÕES PARA SUPORTE
${JSON.stringify(CATALOG.politicas, null, 2)}

## REGRAS
- Responda em português brasileiro, tom descontraído mas profissional (como um pai confiante)
- Mensagens curtas (máx 4 linhas)
- Se for sobre passeios → sugira falar com a Lala
- Se for sobre preços/pagamento → sugira falar com a Mamãe Lara
- Antes de emitir o marcador SUPORTE, você DEVE ter coletado na conversa o nome do cliente e o passeio envolvido. Se ainda não tiver, pergunte antes de emitir.
- Para problemas que precisam de atendente humano: |||SUPORTE:{"problema":"...","nome":"...","passeio":"..."}|||
- Para elogios: agradeça com entusiasmo e diga que vai repassar para a equipe
- Você se chama Papai Lalo, pai da família La Vai La Vem`;

const SYSTEM_PROMPTS: Record<string, string> = {
  lala: LALA_PROMPT,
  mama: MAMA_PROMPT,
  papa: PAPA_PROMPT,
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

router.post("/chat", async (req: Request, res: Response) => {
  const { messages, agent } = req.body as { messages: ChatMessage[]; agent?: string };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array required" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GROQ_API_KEY não configurada" });
    return;
  }

  const systemPrompt = SYSTEM_PROMPTS[agent ?? "lala"] ?? LALA_PROMPT;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 500,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      res.status(response.status).json({ error: JSON.stringify(error) });
      return;
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const content = data.choices[0]?.message?.content ?? "";
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
