# Investigação e validação — 2026-11-02

## Resultado e limites
O player continua Arcader/Emulatrix; não foi obtida uma fonte de ROM autorizada para migrar. Não foi demonstrada uma correção definitiva do congelamento. Nenhuma ROM foi baixada ou redistribuída. O visitante continua sem selecionar arquivos.

O wrapper remoto index.html força foco em `content` a cada 250 ms; Emulatrix.htm repete isso em `container`. Emulatrix_SegaGenesis.htm define `Emulator_execute=false` no blur e true no focus. Isso evidencia uma pausa intencional, mas não comprova que o loop sempre retome. O aviso de freeze pertence ao provedor. O código remoto também declara incompatibilidade com Safari/iOS. Os botões de toque enviam keydown/touchstart e keyup/touchend; não há tratamento de touchcancel nesses listeners. Isso pode deixar entradas presas quando o sistema cancela um toque.

Fontes inspecionadas (HTML, sem buscar ROM):
- https://arcader.com/emulatrix/sega/index.html?system=sega&game=pocahontas
- https://arcader.com/emulatrix/sega/Emulatrix.htm
- https://arcader.com/emulatrix/sega/Emulatrix_SegaGenesis.htm
- https://emulatorjs.org/docs/options/ (migração exigiria EJS_gameUrl autorizado e core segaMD)

Não foi encontrado protocolo público postMessage para controle pelo site pai. As funções de save/load internas existem no provedor, mas não são acessíveis entre origens. A página não tenta executar essas funções, injetar keyup nem ler canvas remoto. Somente o provedor pode corrigir seus listeners e loop ou oferecer uma ponte documentada.

## Alterações
- lifecycle.js: separa transporte (loading/document-loaded/waiting/error), visibilidade/foco/retorno/pagehide, conexão e menu. Emulação fica explicitamente unknown: não há telemetria para distinguir running/user-paused/unresponsive. Suspensão do sistema não é inferida como fato. Eventos observáveis ficam no data-lifecycle do app, sem gravar dados do jogo.
- index.html: mantém o mesmo iframe; menu acessível, continuar com tentativa única de foco no iframe externo, layout 4:3 com safe areas. O provedor ainda pode disputar foco internamente; não prometemos foco no canvas interno.
- Reinício apenas após confirmação; nenhum reload por orientação, menu, retorno, offline ou atualização de SW. Sem focus loops locais. Abrir menu não pausa programaticamente o jogo; pode acionar a pausa por blur do provedor.
- sw.js: cache próprio v3, network first, lifecycle.js no shell, limpeza limitada aos caches deste app, evita guardar respostas HTTP de erro. Não armazena recursos externos. A atualização não força recarregamento da página aberta.
- Manifesto solicita landscape (Safari pode ignorar); não força rotação nem autoplay.

## Testes
`node tests/static.cjs`, `node --check lifecycle.js`, `node --check sw.js`: aprovados.
Playwright Chromium com fixture controlada: abrir/fechar menu, guarda de foco durante menu, retorno explícito de foco, reinício cancelado/confirmado, eventos sintéticos blur/visibilitychange/pagehide/pageshow com BFCache, redimensionamento portrait/landscape, identidade do iframe e ausência de recarga involuntária: aprovados. O teste não valida execução, controles ou progresso do jogo real. Confirmações foram simuladas por window.confirm na fixture.

Para repetir: substitua __SITE_FILES__ em tests/lifecycle.playwright.js por objeto JSON com index.html e lifecycle.js atuais, salve fora da pasta publicada e execute `playwright-cli run-code --filename ARQUIVO`. O teste usa rotas interceptadas e não transfere ROMs. O erro de service worker da fixture é esperado porque a rota sw.js é abortada; não é um teste de PWA offline.

O navegador real abriu a cadeia de iframes remotos, mas isso NÃO comprova inicialização do core, controles funcionais nem ausência de congelamento. Não se validou partida real. Exigem iPad físico: iniciar partida, multitouch A/B/C/Start, ausência de botões presos, menu durante gameplay, troca real de abas/apps, bloquear/desbloquear, pressão de memória, áudio/autoplay, tela cheia, controle Bluetooth e reabertura do PWA. Save/restore e recuperação após descarte da página não estão integrados; dependem do provedor. Se o iPadOS descartar a página, o site não consegue preservar memória do emulador remoto.
