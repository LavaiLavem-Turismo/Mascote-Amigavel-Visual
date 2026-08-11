# La Vai La Vem Turismo

Chatbot de atendimento para uma agência de passeios em Natal/RN. O projeto
inclui uma interface web, um app mobile em Expo e uma API Express que conversa
com um modelo de linguagem para recomendar passeios, responder dúvidas e
encaminhar reservas para o WhatsApp.

## O que existe neste repositório

- `artifacts/chatbot` — interface web em React + Vite.
- `artifacts/mobile` — app mobile em Expo/React Native.
- `artifacts/api-server` — API Express; a chave do provedor de IA fica apenas
  no servidor.
- `lib` — contratos e bibliotecas compartilhadas do workspace.
- `attached_assets` — imagens e materiais visuais usados pela aplicação.

## Começando

### Requisitos

- Node.js 24 ou compatível
- pnpm 10 ou compatível
- Uma chave da Groq para executar as respostas da IA

### Configuração

1. Copie `.env.example` para `.env` quando executar localmente.
2. Defina `GROQ_API_KEY` somente no ambiente do servidor.
3. Para habilitar o botão de reserva na web, defina `VITE_WHATSAPP_NUMBER`.
4. Para o app mobile, defina `EXPO_PUBLIC_DOMAIN` e
   `EXPO_PUBLIC_WHATSAPP_NUMBER` no ambiente do Expo.

Nunca use `VITE_GROQ_API_KEY`, `VITE_OPENAI_API_KEY` ou
`EXPO_PUBLIC_GROQ_API_KEY`: variáveis com esses prefixos chegam ao cliente e
podem ser vistas por qualquer visitante.

### Executar

Em terminais separados:

```bash
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/chatbot run dev
```

Para o app mobile:

```bash
pnpm --filter @workspace/mobile run dev
```

Verificações locais:

```bash
pnpm run typecheck
pnpm --filter @workspace/chatbot run build
pnpm --filter @workspace/api-server run build
```

## Como funciona

O navegador e o app mobile enviam o histórico da conversa para `POST /api/chat`.
O servidor seleciona o agente (`lala`, `mama` ou `papa`), monta o prompt com o
catálogo e chama a API compatível da Groq. Marcadores estruturados no texto
(`RESUMO`, `SUPORTE` e `CHIPS`) são interpretados pelos clientes para exibir
ações de reserva, suporte e sugestões de resposta.

O catálogo de passeios fica em `artifacts/chatbot/src/catalog.ts` para a
interface web e também é usado pelo prompt do servidor. Ao atualizar preços,
horários ou políticas, revise as duas fontes.

## Privacidade e segurança

Este é um projeto de referência. Antes de colocá-lo em produção:

- substitua os dados comerciais de exemplo;
- configure CORS para os domínios permitidos, em vez de aceitar qualquer origem;
- adicione autenticação, rate limiting e monitoramento adequados ao seu caso;
- revise as políticas de privacidade e o tratamento de dados de reserva;
- não envie chaves, tokens ou arquivos `.env` para o Git.

Se uma chave for exposta, revogue-a imediatamente no provedor e gere outra.

## Contribuindo

Leia [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir uma alteração. Para
vulnerabilidades de segurança, siga [SECURITY.md](SECURITY.md) e não publique
detalhes exploráveis em uma issue.

## Licença

Distribuído sob a licença [MIT](LICENSE).