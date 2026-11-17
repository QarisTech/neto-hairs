import {createClient} from '@libsql/client/web';
import {createCommerce} from '../../commerce/core.mjs';
import seed from '../../commerce/seed.json' with {type:'json'};
let instance;
export default async function handler(request,context){
 if(!process.env.LIBSQL_DATABASE_URL||!process.env.LIBSQL_AUTH_TOKEN){const path=new URL(request.url).pathname;
 const data=path.endsWith('/catalogue')?{products:seed.map(p=>({...p,active:false,sample:true,variants:p.variants.map(v=>({...v,stock:0}))}))}:path.endsWith('/store/config')?{checkoutEnabled:false,enquiriesEnabled:false,shipping:[],databaseConfigured:false}:{error:'Store setup is incomplete. The owner needs to connect the database.'};
 return new Response(JSON.stringify(data),{status:path.endsWith('/catalogue')||path.endsWith('/store/config')?200:503,headers:{'content-type':'application/json','cache-control':'no-store'}})}
 try{if(!instance){const db=createClient({url:process.env.LIBSQL_DATABASE_URL,authToken:process.env.LIBSQL_AUTH_TOKEN});instance=createCommerce({db,env:process.env,seed})}const url=new URL(request.url);if(url.pathname.startsWith('/.netlify/functions/api/')){url.pathname=url.pathname.replace('/.netlify/functions/api/','/api/');request=new Request(url,request)}const response=await instance.handle(request,{ip:context.ip||'unknown'});if(request.method==='POST'&&response.ok&&process.env.RESEND_API_KEY){try{await instance.flushNotifications(2)}catch{}}return response}catch(e){console.error('Backend setup error:',e.name);return new Response(JSON.stringify({error:'The store backend is unavailable. Please try again later.'}),{status:503,headers:{'content-type':'application/json','cache-control':'no-store'}})}
}
export const config={path:'/api/*'};
