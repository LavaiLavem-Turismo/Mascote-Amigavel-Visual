export const CATALOG = {
  empresa: "La Vai La Vem Turismo",
  // Configure the public business number with VITE_WHATSAPP_NUMBER.
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER ?? "",
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
