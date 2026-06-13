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
  pares_populares: [
    ["jenipabu_van", "buggy_litoral"],
    ["pipa", "jenipabu_van"],
    ["maracajau", "citytour"]
  ],
  politicas: {
    cancelamento: "Cancelamento com mais de 48h de antecedência garante reembolso integral. Menos de 48h: sem reembolso.",
    pagamento: "Pix e dinheiro em espécie são mais baratos (alguns passeios cobram taxa de 20% no cartão).",
    chuva: "Em caso de chuva forte que impossibilite o passeio, remarcamos sem custo. Chuva leve não cancela.",
    criancas: "Maracajaú requer mínimo 2 anos completos com documento. Demais passeios: consultar.",
    segunda_feira: "Forte dos Reis Magos fecha às segundas — evitar City Tour na segunda."
  }
};

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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

router.post("/chat", async (req: Request, res: Response) => {
  const { messages } = req.body as { messages: ChatMessage[] };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array required" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "OPENAI_API_KEY não configurada" });
    return;
  }

  try {
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
