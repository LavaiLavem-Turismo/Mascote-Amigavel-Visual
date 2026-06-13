# La Vai La Vem Turismo — Chatbot de Atendimento

Chatbot de atendimento ao cliente para a La Vai La Vem Turismo, agência de passeios em Natal/RN. A IA recomenda passeios, responde dúvidas e coleta dados para reserva, redirecionando ao WhatsApp.

## Run & Operate

- `pnpm --filter @workspace/chatbot run dev` — frontend do chatbot (porta 22967)
- `pnpm --filter @workspace/api-server run dev` — API Express (porta 8080)
- `pnpm run typecheck` — typecheck completo
- `pnpm run build` — build completo

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind (DM Sans, dark theme)
- API: Express 5
- IA: OpenAI gpt-4o-mini via `OPENAI_API_KEY`

## Where things live

- `artifacts/chatbot/` — app frontend (React + Vite)
- `artifacts/chatbot/src/catalog.ts` — catálogo de passeios e políticas
- `artifacts/chatbot/src/lib/api.ts` — cliente HTTP + parser de marcadores
- `artifacts/chatbot/src/pages/ChatPage.tsx` — interface principal do chat
- `artifacts/chatbot/src/components/` — MessageBubble, TypingIndicator, WhatsAppButton
- `artifacts/api-server/src/routes/chat.ts` — endpoint POST /api/chat (system prompt + OpenAI)

## Architecture decisions

- OpenAI é chamado pelo backend (Express), não pelo frontend — chave fica segura no servidor
- System prompt completo com catálogo embutido no `chat.ts` do servidor
- Marcadores `|||RESUMO:...||| ` e `|||SUPORTE:...||| ` parseados no frontend para exibir botão WhatsApp ou alerta de suporte
- Vite proxy redireciona `/api` → `localhost:8080` em dev

## Product

- Chat em português com avatar da mascote papagaio e logo da empresa
- Recomendação de passeios por perfil (aventura, praia, história)
- Coleta de dados: nome, passeios, data, número de pessoas
- Botão WhatsApp com mensagem pré-preenchida ao fechar reserva
- Transferência para atendente humano em casos de suporte complexo

## User preferences

- Identidade visual: fundo #0f1117, cards #1a1d27, azul #1E90FF, vermelho #C0392B, teal #00d4aa
- Fonte: DM Sans
- Número WhatsApp: `5584999999999` — trocar pelo número real em `artifacts/chatbot/src/catalog.ts`

## Gotchas

- Sempre reiniciar o workflow `api-server` após alterar `artifacts/api-server/src/routes/chat.ts`
- O número de WhatsApp está em `artifacts/chatbot/src/catalog.ts` → campo `whatsapp`
- `OPENAI_API_KEY` deve estar nos Secrets do Replit
