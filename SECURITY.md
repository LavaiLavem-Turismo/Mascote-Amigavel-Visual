# Política de segurança

## Versões suportadas

Como este é um projeto aberto e em evolução, a branch principal é a única
versão que recebe correções de segurança.

## Reportar uma vulnerabilidade

Não abra uma issue pública para vulnerabilidades. Entre em contato
privadamente com os mantenedores do repositório, incluindo:

- descrição do problema;
- impacto potencial;
- passos mínimos para reproduzir;
- uma sugestão de correção, se houver.

Não inclua chaves de API, tokens, dados de clientes ou informações pessoais no
relato. A equipe deve confirmar o recebimento e combinar a divulgação após a
correção.

## Segredos expostos

Se uma chave aparecer no histórico do Git ou em um log, considere-a
comprometida: revogue-a no provedor, gere uma nova e remova o valor do código.
Apagar o arquivo local não é suficiente para remover um segredo do histórico.