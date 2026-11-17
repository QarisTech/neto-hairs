'use strict';
let products = [
 {id:'muse',name:'Black Deep Wave',type:'wig',texture:'wave',image:'deepwave',colour:'Natural black',price:145000,lengths:[16,18,20,22],description:'Long, center-part black hair with defined deep waves.'},
 {id:'sidecurl',name:'Side-Part Curly Wig',type:'wig',texture:'curly',image:'sidecurl',colour:'Natural black',price:null,lengths:[0],description:'A swept side part and rounded black curls with an asymmetric shape.'},
 {"id": "brown-deepwave", "name": "Brown Deep Wave", "type": "wig", "texture": "wave", "image": "brown-deepwave", "colour": "Brown", "price": null, "lengths": [0], "description": "Long brown hair with defined waves and a side part."},
 {"id": "brown-curlybob", "name": "Brown Curly Bob", "type": "wig", "texture": "bob", "image": "brown-curlybob", "colour": "Brown", "price": null, "lengths": [0], "description": "Brown shoulder-length curls with a swept side part."},
 {"id": "pixie-curls", "name": "Short Pixie Curls", "type": "wig", "texture": "curly", "image": "pixie-curls", "colour": "Natural black", "price": null, "lengths": [0], "description": "Short black curls shown on two mannequins."},
 {"id": "shop-curlybob", "name": "Black Curly Bob", "type": "wig", "texture": "bob", "image": "shop-curlybob", "colour": "Natural black", "price": null, "lengths": [0], "description": "A center-part black curly bob photographed in the Neto Hairs shop."},
 {"id": "black-waves", "name": "Black Defined Waves", "type": "wig", "texture": "wave", "image": "black-waves", "colour": "Natural black", "price": null, "lengths": [0], "description": "Black defined waves shown from the front and side."},
 {"id": "straight-bob", "name": "Brown Straight Bob", "type": "wig", "texture": "straight", "image": "straight-bob", "colour": "Brown", "price": null, "lengths": [0], "description": "A smooth brown bob with a side part and curved ends."},
 {"id": "loose-curls", "name": "Black Loose Curls", "type": "wig", "texture": "curly", "image": "loose-curls", "colour": "Natural black", "price": null, "lengths": [0], "description": "Soft black curls shown on a foam mannequin with the Neto Hairs packaging."}
];
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function normalise(p){const variants=p.variants||p.lengths.map(n=>({inches:n||null,grams:null,price:p.price===null?null:p.price+(n-(p.lengths[1]??p.lengths[0]))*5000}));const prices=variants.map(v=>v.price).filter(n=>n!==null);return {...p,variants,lengths:variants.map(v=>v.inches||0),price:prices.length?Math.min(...prices):null,sample:p.sample??true}}
function optionKey(v){return String(v.inches)+':'+String(v.grams)}
function optionFor(p,item){return p.variants.find(v=>item.optionKey?optionKey(v)===item.optionKey:(v.inches||0)===item.length)}
function optionSummary(p){const inches=[...new Set(p.variants.map(v=>v.inches).filter(n=>n!==null))].sort((a,b)=>a-b);const grams=[...new Set(p.variants.map(v=>v.grams).filter(n=>n!==null))].sort((a,b)=>a-b);const range=a=>a.length===1?String(a[0]):a[0]+'–'+a[a.length-1];return [inches.length?range(inches)+' inches':'Length to be confirmed',grams.length?range(grams)+' g':'',p.sample?'Sample prices':''].filter(Boolean).join(' / ')}
products=products.map(normalise);
const $=s=>document.querySelector(s);
const formatPrice=n=>n===null?'Price on request':new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n);
let group='all', texture='', query='', sort='featured', selected=null, selectedLength=0, selectedOptionKey='', toastTimeout;
let bag=[];
try {
 const saved=JSON.parse(localStorage.getItem('neto-hairs-bag')||'[]');
 if(Array.isArray(saved))bag=saved.filter(item=>item&&products.some(p=>p.id===item.id&&optionFor(p,item)));
} catch {}
function imageClass(p){return 'catalog-'+p.image}
function unitPrice(p,length,key=null){const v=p.variants.find(v=>key?optionKey(v)===key:(v.inches||0)===length);return v?.price??null}
function currentProducts(){
 const list=products.filter(p=>(group==='all'||p.texture===group)&&(!texture||p.texture===texture)&&(!query||(p.name+' '+p.description+' '+p.texture+' '+p.type+' '+p.colour).toLowerCase().includes(query)));
 if(sort!=='featured')list.sort((a,b)=>{if(a.price===null)return b.price===null?0:1;if(b.price===null)return -1;return sort==='low'?a.price-b.price:b.price-a.price});
 return list;
}
const plus='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7v14"/></svg>';
function renderProducts(){
 const list=currentProducts();
 $('#products').innerHTML=list.map(p=>`<article class="product-card"><button class="product-photo" data-product="${p.id}" aria-label="Choose options for ${escapeHTML(p.name)}"><span class="product-visual ${imageClass(p)}" role="img" aria-label="${escapeHTML(p.name)}"></span><span class="product-add">${plus}</span></button><p class="product-kind">Wig</p><div class="product-title"><h3><button data-product="${p.id}">${escapeHTML(p.name)}</button></h3><span class="product-price">${formatPrice(p.price)}</span></div><p class="product-detail">${escapeHTML(optionSummary(p))}</p></article>`).join('');
 $('#result-count').textContent=list.length+' '+(list.length===1?'style':'styles');$('#no-results').hidden=list.length>0;
 document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>openProduct(button.dataset.product)));
 animateNewCards();
 document.querySelectorAll('[data-filter]').forEach(button=>{const active=button.dataset.filter===group;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
}
function setGroup(next){group=next;texture='';renderProducts()}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>setGroup(button.dataset.filter)));
document.querySelectorAll('[data-texture]').forEach(link=>link.addEventListener('click',()=>{group='all';texture=link.dataset.texture;query='';$('#collection-search').value='';renderProducts()}));

$('#sort').addEventListener('change',e=>{sort=e.target.value;renderProducts()});
$('#search-open').addEventListener('click',()=>{$('.search-inline').hidden=false;$('#collection').scrollIntoView({behavior:reducedMotion()?'instant':'smooth'});$('#collection-search').focus({preventScroll:true})});
$('#collection-search').addEventListener('input',e=>{query=e.target.value.toLowerCase().trim();renderProducts()});
$('#clear-search').addEventListener('click',()=>{query='';$('#collection-search').value='';renderProducts();$('#collection-search').focus()});
$('#reset-filters').addEventListener('click',()=>{group='all';texture='';query='';$('#collection-search').value='';renderProducts()});
function reducedMotion(){return matchMedia('(prefers-reduced-motion: reduce)').matches}
function openProduct(id){
 selected=products.find(p=>p.id===id);if(!selected)return;selectedLength=selected.lengths[0];selectedOptionKey=optionKey(selected.variants[0]);
 const photo=$('#dialog-product-image');photo.className='dialog-product-image '+imageClass(selected);photo.setAttribute('aria-label',selected.name+' texture inspiration');
 $('.chosen-color strong').textContent=selected.colour;$('#product-dialog-title').textContent=selected.name;$('#dialog-description').textContent=selected.description;
 renderLengths();$('#product-dialog').showModal();
}
function renderLengths(){
 $('#dialog-price').textContent=formatPrice(unitPrice(selected,selectedLength,selectedOptionKey));
 $('#length-options').innerHTML=selected.variants.map((v,i)=>{const label=[v.inches?v.inches+' inches':'Length to be confirmed',v.grams?v.grams+' g':''].filter(Boolean).join(' / ');return `<button type="button" data-option="${i}" data-length="${v.inches||0}" class="${optionKey(v)===selectedOptionKey?'selected':''}" aria-pressed="${optionKey(v)===selectedOptionKey}" aria-label="${label}">${v.inches?v.inches+'″':'As pictured'}${v.grams?' / '+v.grams+' g':''}</button>`}).join('');
 document.querySelectorAll('[data-option]').forEach(button=>button.addEventListener('click',()=>{const i=Number(button.dataset.option),v=selected.variants[i];selectedLength=v.inches||0;selectedOptionKey=optionKey(v);renderLengths();document.querySelector(`[data-option="${i}"]`).focus()}));
}
function toast(message){clearTimeout(toastTimeout);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimeout=setTimeout(()=>$('#toast').classList.remove('visible'),3500)}
function persistBag(){try{localStorage.setItem('neto-hairs-bag',JSON.stringify(bag));return true}catch{return false}}
function renderBag(){
 $('#count').textContent=bag.length;$('#bag-open').setAttribute('aria-label','Open shopping bag, '+bag.length+' '+(bag.length===1?'item':'items'));
 $('#bag-items').innerHTML=bag.length?bag.map((item,index)=>{const p=products.find(p=>p.id===item.id);return `<div class="bag-row"><div class="bag-thumb ${imageClass(p)}" role="img" aria-label="${escapeHTML(p.name)}"></div><div><h3>${escapeHTML(p.name)}</h3><p>${item.length?item.length+' inches':'Length to be confirmed'}${optionFor(p,item)?.grams?' / '+optionFor(p,item).grams+' g':''} / ${escapeHTML(p.colour)}</p><p>${formatPrice(unitPrice(p,item.length,item.optionKey))}</p></div><button class="remove-item" data-remove="${index}" aria-label="Remove ${escapeHTML(p.name)} from bag">Remove</button></div>`}).join(''):'<p class="bag-empty">Your next favourite is waiting. Explore the collection and make it yours.</p>';
 $('#total').textContent=bag.some(item=>unitPrice(products.find(p=>p.id===item.id),item.length,item.optionKey)===null)?'Confirm pricing':formatPrice(bag.reduce((total,item)=>total+unitPrice(products.find(p=>p.id===item.id),item.length,item.optionKey),0));
 document.querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.remove);const name=products.find(p=>p.id===bag[index].id).name;bag.splice(index,1);persistBag();renderBag();toast(name+' removed from your bag');const next=document.querySelector(`[data-remove="${Math.min(index,bag.length-1)}"]`);(next||$('#continue')).focus()}));
}
$('#add').addEventListener('click',()=>{if(!selected)return;bag.push({id:selected.id,length:selectedLength,optionKey:selectedOptionKey});const saved=persistBag();renderBag();$('#product-dialog').close();toast(selected.name+' added to your bag.'+(saved?'':' Saved for this visit only.'))});
$('#product-close').addEventListener('click',()=>$('#product-dialog').close());$('#bag-open').addEventListener('click',()=>$('#bag').showModal());$('#bag-close').addEventListener('click',()=>$('#bag').close());$('#continue').addEventListener('click',()=>{$('#bag').close();$('#collection').scrollIntoView({behavior:reducedMotion()?'instant':'smooth'})});
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close()}));
function animateNewCards(){
 if(reducedMotion()||typeof IntersectionObserver==='undefined')return;
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;if(reducedMotion()){observer.unobserve(entry.target);return}entry.target.animate([{opacity:.7,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:Number(entry.target.dataset.motionOrder||0)*70,easing:'cubic-bezier(.16,1,.3,1)',fill:'none'});observer.unobserve(entry.target)})},{threshold:.12});
 document.querySelectorAll('.product-card:not([data-motion-ready])').forEach((card,i)=>{card.dataset.motionReady='true';card.dataset.motionOrder=i%3;observer.observe(card)});
}
document.querySelectorAll('[data-featured-product]').forEach(button=>button.addEventListener('click',()=>openProduct(button.dataset.featuredProduct)));
$('#year').textContent=new Date().getFullYear();renderProducts();renderBag();
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let activeMotion=[];
function animateText(heading){
 if(reducedMotion()||typeof heading.animate!=='function')return;
 if(!heading.matches('.hero h1')){activeMotion.push(heading.animate([{opacity:.7,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,easing:'cubic-bezier(.16,1,.3,1)'}));return}
 const label=heading.textContent.trim();heading.setAttribute('aria-label',label);
 const plain=[...heading.childNodes].find(node=>node.nodeType===3&&node.textContent.trim());
 if(plain){const fragment=document.createDocumentFragment();plain.textContent.trim().split(/\s+/).forEach((word,wi)=>{if(wi)fragment.append(document.createTextNode(' '));const wrap=document.createElement('span');wrap.className='motion-word';wrap.setAttribute('aria-hidden','true');[...word].forEach(char=>{const letter=document.createElement('span');letter.className='motion-letter';letter.textContent=char;wrap.append(letter)});fragment.append(wrap)});plain.replaceWith(fragment)}
 heading.querySelectorAll('.motion-letter').forEach((letter,i)=>activeMotion.push(letter.animate([{opacity:.55,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:900,delay:i*24,easing:'cubic-bezier(.16,1,.3,1)',fill:'none'})));
 const scriptLine=[...heading.children].find(el=>!el.classList.contains('motion-word'));if(scriptLine){scriptLine.setAttribute('aria-hidden','true');activeMotion.push(scriptLine.animate([{opacity:.65,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:1100,delay:180,easing:'cubic-bezier(.16,1,.3,1)'}))}
}
if(!reducedMotion()&&typeof IntersectionObserver!=='undefined'){
 animateText(document.querySelector('.hero h1'));
 const entrances=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){if(!reducedMotion())animateText(entry.target);entrances.unobserve(entry.target)}})},{threshold:.18});
 document.querySelectorAll('.section-intro h2,.story-copy h2,.care-heading h2,.closing h2').forEach(el=>entrances.observe(el));
 document.querySelectorAll('dialog').forEach(dialog=>new MutationObserver(()=>{if(dialog.open&&!reducedMotion())activeMotion.push(dialog.animate([{opacity:.5,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.16,1,.3,1)'}))}).observe(dialog,{attributes:true,attributeFilter:['open']}));
}
const parallaxHero=document.querySelector('.hero');let parallaxFrame=0;
function updateParallax(){parallaxFrame=0;if(reducedMotion()){parallaxHero.style.removeProperty('--parallax-photo');parallaxHero.style.removeProperty('--parallax-copy');return}const bounds=parallaxHero.getBoundingClientRect();if(bounds.bottom<=0||bounds.top>=innerHeight)return;const phone=innerWidth<=600;const travelled=Math.max(0,Math.min(-bounds.top,bounds.height));parallaxHero.style.setProperty('--parallax-photo',Math.min(phone?12:30,travelled*(phone?.035:.075))+'px');parallaxHero.style.setProperty('--parallax-copy',-Math.min(phone?5:12,travelled*.03)+'px')}
function queueParallax(){if(!parallaxFrame)parallaxFrame=requestAnimationFrame(updateParallax)}
if(typeof requestAnimationFrame==='function'){window.addEventListener('scroll',queueParallax,{passive:true});window.addEventListener('resize',queueParallax,{passive:true});queueParallax()}
motionPreference.addEventListener?.('change',()=>{if(reducedMotion()){document.getAnimations?.().forEach(animation=>animation.cancel());activeMotion.forEach(animation=>animation.cancel());activeMotion=[]}if(typeof requestAnimationFrame==='function')queueParallax()});

async function refreshCatalogue(){
 if(typeof fetch!=='function')return;
 $('#products').setAttribute('aria-busy','true');
 try{const response=await fetch('/api/catalogue',{cache:'no-store'});if(!response.ok)throw new Error('Catalogue unavailable');const data=await response.json();products=data.products.map(normalise);bag=bag.filter(item=>products.some(p=>p.id===item.id&&optionFor(p,item)));renderProducts();renderBag();const note=document.querySelector('.catalogue-note>span');if(note)note.textContent=products.some(p=>p.sample)?'Explore the collection / Some details await confirmation':'Explore the Neto Hairs collection'}catch{const note=document.querySelector('.catalogue-note>span');if(note)note.textContent='Current product details could not load. Please refresh.';document.querySelectorAll('[data-product]').forEach(b=>b.disabled=true)}finally{$('#products').setAttribute('aria-busy','false')}
}
refreshCatalogue();
