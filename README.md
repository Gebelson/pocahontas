# Pocahontas · Acesso direto para iPad

Esta versão **não pede um arquivo de jogo ao visitante**. Ao abrir, carrega automaticamente o player público do título **Disney's Pocahontas**, Mega Drive, via incorporação disponibilizada por [Arcader.com](https://arcader.com/pocahontas/). O provedor publica a URL e o código de embed do jogo.

## Publicação na Vercel

1. Descompacte o ZIP.
2. Substitua os arquivos do projeto anterior pelos arquivos desta versão.
3. Faça novo deploy na Vercel. É um site estático, não precisa instalar dependências.
4. Acesse `https://pocahontas.vercel.app` e recarregue a página. Se já havia instalado o PWA, feche e abra novamente após o deploy.

## Experiência

- A página exibe diretamente um iframe do player remoto. Não há seleção de arquivos nem tela de entrada.
- O iframe ocupa uma área 4:3 centralizada, encaixada na tela do iPad sem deformar a imagem.
- O menu discreto permite solicitar tela cheia, reiniciar e abrir o jogo no site de origem quando necessário.
- No Safari, Compartilhar → Adicionar à Tela de Início deixa o site com aparência de aplicativo.

## Limitações importantes

- **Dependência de terceiros:** o jogo é servido pelo Arcader, não pela Vercel nem pelo seu servidor. Não foi possível confirmar se o iframe do provedor carrega e funciona corretamente no iPad. O provedor pode alterar ou bloquear o embed a qualquer momento.
- **Controles por toque:** não podem ser garantidos. Como o emulador está hospedado em outra origem, nosso site não pode injetar controles ou reconfigurar botões dentro do iframe. Se o provedor não oferecer controles touch, é preciso integração autorizada ou um emulador próprio com acesso licenciado à ROM.
- **Direitos autorais:** não há arquivos de jogo, imagens do jogo ou ROM incluídos neste pacote. A existência do código de incorporação não transfere direitos sobre o jogo da Disney.
- **Tela cheia:** `requestFullscreen` depende do navegador; no Safari iPad a opção Adicionar à Tela de Início geralmente oferece a experiência mais limpa.
- **Não houve teste físico em iPad**, nem confirmação de carregamento do iframe em navegador real neste ambiente.

## Para versão independente e garantida

A solução mais robusta usa EmulatorJS e ROM servida pelo próprio site (com autorização para sua hospedagem). Assim é possível integrar de verdade controles táteis, save states e uma experiência estável, sem dependências do Arcader.

## Estabilidade e ciclo de vida
Consulte INVESTIGATION.md para evidências, limites e testes. O menu não recria o player. Reiniciar exige confirmação. O site não consegue garantir retomada nem saves no player externo, especialmente em Safari/iOS. Não há detecção confiável de execução ou congelamento entre origens.
