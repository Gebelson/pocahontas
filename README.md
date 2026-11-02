# Pocahontas · Modo iPad

Site estático e PWA em português, preparado para o emulador open source [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS), com suporte a Mega Drive (núcleo `segaMD`), controles por toque no iPad e tela horizontal.

## O que está incluso
- Tela inicial dedicada a um único jogo.
- Seleção local de arquivo Mega Drive (`.bin`, `.gen`, `.md`, `.smd`, `.zip`).
- Persistência opcional do arquivo escolhido somente no navegador do dispositivo via IndexedDB, quando disponível. Na próxima visita, botão **Continuar neste iPad**.
- EmulatorJS com modo mobile ativado em dispositivos touch, usando seus controles virtuais nativos. O iPad não foi testado fisicamente neste ambiente.
- Botão para tentar tela cheia e suporte a **Adicionar à Tela de Início** para reduzir a interface do Safari.
- Manifesto PWA, ícones e service worker de cache somente do shell.
- Fundo responsivo, sem anúncios, catálogo nem navegação extra.

## Como usar
1. Publique **a pasta inteira** em uma hospedagem HTTPS (por exemplo, GitHub Pages, Vercel ou Netlify). Não abra o arquivo diretamente via `file://`.
2. Acesse o endereço no Safari do iPad. Prefira usar no modo horizontal.
3. Toque **Escolher arquivo do jogo** e selecione sua cópia legal de ROM Mega Drive em Arquivos.
4. O EmulatorJS será carregado via CDN (`https://cdn.emulatorjs.org/stable/data/`), por isso é necessária conexão pelo menos no primeiro uso.
5. Opcionalmente, no Safari, **Compartilhar → Adicionar à Tela de Início**, e abra pelo ícone da Tela de Início. O iPadOS pode manter indicadores da barra de status, mesmo em modo app.
6. O EmulatorJS pode fornecer menu para salvar/carregar estados de jogo. Os saves são locais ao navegador, não sincronizados entre aparelhos.

## Publicando via GitHub Pages
Este repositório já inclui um fluxo automatizado do GitHub Actions (`.github/workflows/deploy.yml`):
1. No seu repositório no GitHub, acesse **Settings** → **Pages**.
2. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
3. O deploy será feito automaticamente e o site ficará disponível em:
   `https://gebelson.github.io/pocahontas/`

## Para publicar um jogo que já está licenciado para redistribuição
Edite a constante `HOSTED_ROM_URL` perto do final de `index.html` para apontar para o arquivo que você tem autorização para hospedar, por exemplo `./games/jogo-autorizado.bin`.

O projeto **não inclui ROM, personagens, sprites, imagens, música ou outros recursos do jogo protegido**. O fato de um terceiro disponibilizar uma ROM em seu site não dá permissão para redistribuí-la em outro site. O nome do jogo é usado apenas para identificar a experiência solicitada.

## Limitações e teste
- A interface foi criada e validada estaticamente, mas não foi possível executar um teste real de emulação no iPad aqui.
- Suporte à API `requestFullscreen` varia no Safari/iPadOS; a instalação como web app via Tela de Início é o caminho mais confiável.
- Jogabilidade depende do arquivo de ROM fornecido, de sua compatibilidade e da conexão com o CDN do EmulatorJS.
- Alguns dispositivos podem limitar armazenamento local do navegador, exigindo selecionar a ROM novamente.
- O emulador, os cores e controles pertencem ao projeto EmulatorJS, sujeitos à respectiva licença; confira o repositório antes de self-hosting.
