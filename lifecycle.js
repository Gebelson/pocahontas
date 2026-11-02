(()=>{
  'use strict';
  const frame=document.getElementById('game'), loader=document.getElementById('loading');
  const menu=document.getElementById('top'), open=document.getElementById('openMenu');
  const status=document.getElementById('status');
  // Transport and page lifecycle only: the cross-origin emulator exposes no bridge.
  const state={transport:'loading',page:'visible',menu:false,emulation:'unknown',connection:navigator.onLine?'online':'offline'};
  let timeout;
  function report(){
    document.body.classList.toggle('connection-lost',state.connection==='offline');
    document.getElementById('app').dataset.lifecycle=JSON.stringify(state);
    status.textContent=state.connection==='offline'?'Sem conexão. A partida não foi recarregada; o player pode precisar de internet.':
      state.transport==='error'?'Falha de carregamento observada. Reiniciar descarta a partida atual.':
      state.transport==='waiting'?'O provedor está demorando. O jogo não foi reiniciado.':
      'Use os controles do próprio player. A execução e os saves dependem do provedor; o menu não confirma uma pausa.';
  }
  function dismissLoader(){loader.hidden=true;}
  function focusPlayer(){
    if(!state.menu && !document.hidden && state.page!=='pagehidden') frame.focus({preventScroll:true});
  }
  function setMenu(value,restore=false){
    state.menu=value; menu.hidden=!value;
    document.body.classList.toggle('hud-visible',value);
    open.setAttribute('aria-expanded',String(value));
    if(value) document.getElementById('closeMenu').focus({preventScroll:true});
    else if(restore) focusPlayer();
    report();
  }
  function waiting(){if(state.transport==='loading'){state.transport='waiting';dismissLoader();setMenu(true);}}
  function arm(){clearTimeout(timeout);timeout=setTimeout(waiting,12000);}
  frame.addEventListener('load',()=>{clearTimeout(timeout);state.transport='document-loaded';dismissLoader();report();});
  frame.addEventListener('error',()=>{clearTimeout(timeout);state.transport='error';dismissLoader();setMenu(true);});
  open.addEventListener('click',()=>setMenu(true));
  document.getElementById('closeMenu').addEventListener('click',()=>setMenu(false,true));
  document.getElementById('reload').addEventListener('click',()=>{
    if(!confirm('Reiniciar o jogo? O progresso não salvo no player será perdido.')) return;
    state.transport='loading';state.emulation='unknown';setMenu(false);loader.hidden=false;
    frame.src=frame.getAttribute('src');arm();
  });
  document.getElementById('fullScreen').addEventListener('click',async()=>{
    try {
      if(document.fullscreenElement) await document.exitFullscreen();
      else if(document.getElementById('app').requestFullscreen) await document.getElementById('app').requestFullscreen();
      else alert('No Safari, use Compartilhar → Adicionar à Tela de Início.');
    } catch { alert('Tela cheia indisponível. No Safari, use Compartilhar → Adicionar à Tela de Início.'); }
  });
  addEventListener('keydown',e=>{if(e.key==='Escape' && state.menu)setMenu(false,true);});
  addEventListener('blur',()=>{state.page=document.hidden?'background':'focus-away';report();});
  addEventListener('focus',()=>{state.page=document.hidden?'background':'returned';report();});
  document.addEventListener('visibilitychange',()=>{
    state.page=document.hidden?'background':'returned';report();
    if(!document.hidden)focusPlayer();
  });
  addEventListener('pagehide',()=>{state.page='pagehidden';report();});
  addEventListener('pageshow',()=>{state.page=document.hidden?'background':'returned';report();focusPlayer();});
  for(const event of ['online','offline'])addEventListener(event,()=>{state.connection=navigator.onLine?'online':'offline';report();});
  // No heartbeat can prove a cross-origin game is running, paused or frozen.
  // No synthetic key releases or undocumented postMessage commands are sent.
  if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});
  arm();report();
})();
