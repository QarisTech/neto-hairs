'use strict';
(() => {
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=()=>matchMedia('(hover: hover) and (pointer: fine)').matches;
 const grid=document.querySelector('.texture-grid');
 if(grid){
  const windowEl=document.createElement('div');windowEl.className='rolling-window';windowEl.setAttribute('role','region');windowEl.setAttribute('aria-label','Explore hair textures');
  const track=document.createElement('div');track.className='rolling-track';const set=document.createElement('div');set.className='rolling-set';
  grid.querySelectorAll('.texture-card').forEach(card=>set.append(card.cloneNode(true)));
  set.querySelectorAll('[data-texture]').forEach(link=>link.addEventListener('click',()=>{const original=grid.querySelector('[data-texture="'+link.dataset.texture+'"]');original?.click()}));
  const duplicate=set.cloneNode(true);duplicate.setAttribute('aria-hidden','true');duplicate.inert=true;
  duplicate.querySelectorAll('a').forEach(a=>a.tabIndex=-1);
  track.append(set,duplicate);windowEl.append(track);grid.after(windowEl);
  const pause=document.createElement('button');pause.className='carousel-control';pause.type='button';pause.textContent='Pause carousel';pause.setAttribute('aria-pressed','false');windowEl.after(pause);
  const sync=()=>{pause.hidden=reduced();};sync();matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change',sync);
  pause.addEventListener('click',()=>{const paused=windowEl.classList.toggle('is-paused');pause.textContent=paused?'Play carousel':'Pause carousel';pause.setAttribute('aria-pressed',String(paused))});
  // Focus reveals the original, interactive set without scrolling it offscreen.
  windowEl.addEventListener('focusin',()=>{track.style.transform='none';track.style.animation='none'});
  windowEl.addEventListener('focusout',()=>{requestAnimationFrame(()=>{if(!windowEl.contains(document.activeElement)){track.style.removeProperty('animation');track.style.removeProperty('transform')}})});
 }
 const ribbon=document.querySelector('.brand-ribbon');
 if(ribbon){const track=document.createElement('div');track.className='ribbon-track';const set=document.createElement('div');set.className='ribbon-set';while(ribbon.firstChild)set.append(ribbon.firstChild);track.append(set,set.cloneNode(true));ribbon.append(track)}
 let pointerFrame=0;
 document.querySelector('#products')?.addEventListener('pointermove',event=>{
  if(reduced()||!fine()||event.pointerType==='touch')return;
  const tile=event.target.closest('.product-photo');if(!tile||pointerFrame)return;
  const x=event.clientX,y=event.clientY;
  pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const b=tile.getBoundingClientRect();const px=Math.max(0,Math.min(1,(x-b.left)/b.width)),py=Math.max(0,Math.min(1,(y-b.top)/b.height));tile.style.setProperty('--tilt-x',(0.5-py)*5+'deg');tile.style.setProperty('--tilt-y',(px-0.5)*5+'deg');tile.style.setProperty('--pointer-x',px*100+'%');tile.style.setProperty('--pointer-y',py*100+'%')});
 });
 document.querySelector('#products')?.addEventListener('pointerout',event=>{const tile=event.target.closest('.product-photo');if(tile&&!tile.contains(event.relatedTarget)){tile.style.removeProperty('--tilt-x');tile.style.removeProperty('--tilt-y')}});
 const counter=document.querySelector('#count');
 if(counter)new MutationObserver(()=>{if(reduced())return;counter.classList.remove('bag-bump');requestAnimationFrame(()=>counter.classList.add('bag-bump'))}).observe(counter,{childList:true});
 const progress=document.createElement('div');progress.className='page-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 const finish=()=>{progress.classList.add('done');setTimeout(()=>progress.remove(),300)};
 if(document.readyState==='complete')finish();else window.addEventListener('load',finish,{once:true});
 // The actual catalogue request owns its loading state; there is no timed splash screen.
})();
