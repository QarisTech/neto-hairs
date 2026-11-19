'use strict';
(() => {
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=()=>matchMedia('(hover: hover) and (pointer: fine)').matches;
 // One shared controller for fallback photos and owner-published photos/videos.
 window.NetoCarousel=win=>{
  win._stopCarousel?.();
  const set=win.querySelector('.rolling-set');if(!set)return;
  win.querySelectorAll('[data-carousel-copy]').forEach(node=>node.remove());
  win.classList.remove('manual-carousel');win.classList.add('media-carousel');
  const track=document.createElement('div');track.className='media-carousel-track';set.replaceWith(track);track.append(set);
  let frame=0,last=0,distance=0,position=0,drag=false,visible=true;
  const originals=[...set.children];
  const duplicate=()=>{const copy=set.cloneNode(true);copy.dataset.carouselCopy='true';copy.setAttribute('aria-hidden','true');copy.querySelectorAll('button,a,video').forEach(node=>node.tabIndex=-1);copy.querySelectorAll('video').forEach(video=>{video.removeAttribute('autoplay');video.preload='none'});[...copy.children].forEach((card,i)=>card.querySelectorAll('button,a').forEach((node,j)=>node.addEventListener('click',event=>{event.preventDefault();originals[i].querySelectorAll('button,a')[j]?.click()})));track.append(copy)};
  const measure=()=>{track.querySelectorAll('[data-carousel-copy]').forEach(node=>node.remove());distance=set.getBoundingClientRect().width+(parseFloat(getComputedStyle(track).gap)||0);if(!reduced()&&distance>0){for(let i=0;i<Math.ceil(win.clientWidth/distance)+1;i++)duplicate()}else win.scrollLeft=0};
  const playing=()=>[...win.querySelectorAll('video')].some(v=>!v.paused&&!v.ended);
  const run=now=>{if(!win.isConnected)return;const delta=Math.min(now-(last||now),50);last=now;if(!reduced()&&visible&&!document.hidden&&!drag&&!playing()&&distance){position=(position+delta*.025)%distance;win.scrollLeft=position}frame=requestAnimationFrame(run)};
  win.addEventListener('pointerdown',()=>{drag=true});const release=()=>{position=win.scrollLeft;drag=false};win.addEventListener('pointerup',release);win.addEventListener('pointercancel',release);win.addEventListener('pointerleave',release);win.addEventListener('scroll',()=>{if(drag||playing())position=win.scrollLeft},{passive:true});
  win.addEventListener('keydown',event=>{if(event.target===win&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();position=Math.max(0,win.scrollLeft+(event.key==='ArrowRight'?160:-160));win.scrollLeft=position}});
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;observer?.observe(win);const visibility=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>visible=entries[0].isIntersecting):null;visibility?.observe(win);const preference=matchMedia('(prefers-reduced-motion: reduce)');preference.addEventListener?.('change',measure);
  win._stopCarousel=()=>{cancelAnimationFrame(frame);observer?.disconnect();visibility?.disconnect();preference.removeEventListener?.('change',measure)};measure();frame=requestAnimationFrame(run);
 };
 // Categories remain a four-item editorial grid; highlights have their own rolling strip.
 const grid=document.querySelector('.highlight-grid');
 if(grid){const win=document.createElement('div');win.className='rolling-window';win.tabIndex=0;win.setAttribute('role','region');win.setAttribute('aria-label','Highlighted hair photos and videos');const set=document.createElement('div');set.className='rolling-set';document.querySelectorAll('.texture-grid .texture-card').forEach(card=>{const copy=card.cloneNode(true);if(copy.dataset.texture)copy.href='/shop.html?texture='+copy.dataset.texture;set.append(copy)});win.append(set);grid.append(win);window.NetoCarousel(win)}
 const categories=document.querySelector('#favourites');if(categories){if(typeof IntersectionObserver==='function'){const reveal=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){categories.classList.add('is-visible');reveal.disconnect()}},{threshold:.15});reveal.observe(categories)}else categories.classList.add('is-visible')}
 const ribbon=document.querySelector('.brand-ribbon');
 if(ribbon){const track=document.createElement('div');track.className='ribbon-track';const set=document.createElement('div');set.className='ribbon-set';while(ribbon.firstChild)set.append(ribbon.firstChild);const copy=set.cloneNode(true);copy.setAttribute('aria-hidden','true');track.append(set,copy);const viewport=document.createElement('div');viewport.className='ribbon-window';viewport.append(track);ribbon.append(viewport)}
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
