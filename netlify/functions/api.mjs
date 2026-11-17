import {createClient} from '@libsql/client/web';
import {createCommerce,digest} from '../../commerce/core.mjs';
import seed from '../../commerce/seed.json' with {type:'json'};
const setting=name=>{const value=globalThis.Netlify?.env?.get?.(name)??process.env[name];return typeof value==='string'?value.trim():''};
const reply=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
export function runtimeSettings(){const env={};for(const key of ['SITE_URL','OWNER_EMAIL','OWNER_PASSWORD_HASH','CHECKOUT_ENABLED','REFUNDS_ENABLED','PAYSTACK_SECRET_KEY','RESEND_API_KEY','EMAIL_FROM','RATE_LIMIT_SALT'])env[key]=setting(key);env.LIBSQL_DATABASE_URL=setting('LIBSQL_DATABASE_URL')||setting('TURSO_DATABASE_URL');env.LIBSQL_AUTH_TOKEN=setting('LIBSQL_AUTH_TOKEN')||setting('TURSO_AUTH_TOKEN');return env}
export function createNetlifyHandler({getSettings=runtimeSettings,makeClient=createClient,makeCommerce=createCommerce}={}){return async function handler(request,context={}){
 const url=new URL(request.url);if(url.pathname.startsWith('/.netlify/functions/api/')){url.pathname=url.pathname.replace('/.netlify/functions/api/','/api/');request=new Request(url,request)}
 const path=url.pathname,env=getSettings(),ownerLogin={emailPresent:!!env.OWNER_EMAIL,emailMatchesJessica:(env.OWNER_EMAIL||'').toLowerCase()==='jessicanetochukwu@gmail.com',passwordHashPresent:!!env.OWNER_PASSWORD_HASH,passwordHashFingerprint:env.OWNER_PASSWORD_HASH?(await digest(env.OWNER_PASSWORD_HASH)).slice(0,16):null,passwordHashFormatValid:/^pbkdf2:210000:[a-f0-9]{32}:[a-f0-9]{64}$/.test(env.OWNER_PASSWORD_HASH||'')},settingsPresent={databaseUrl:!!env.LIBSQL_DATABASE_URL,authToken:!!env.LIBSQL_AUTH_TOKEN};
 const missingSettings=[...(!settingsPresent.databaseUrl?['LIBSQL_DATABASE_URL (or TURSO_DATABASE_URL)']:[]),...(!settingsPresent.authToken?['LIBSQL_AUTH_TOKEN (or TURSO_AUTH_TOKEN)']:[])];
 if(missingSettings.length){console.warn('Neto setup: missing runtime settings',settingsPresent);const error='The deployed Netlify function cannot read: '+missingSettings.join(', ')+'. Check Production/Functions settings and redeploy.';
 if(path==='/api/catalogue')return reply({products:seed.map(p=>({...p,active:false,sample:true,variants:p.variants.map(v=>({...v,stock:0}))}))});
 if(path==='/api/store/config')return reply({checkoutEnabled:false,enquiriesEnabled:false,shipping:[],databaseConfigured:false,setupState:'missing_runtime_settings',settingsPresent,missingSettings});
 return reply({error,setupState:'missing_runtime_settings',settingsPresent,missingSettings},503)}
 try{
  if(!/^libsql:\/\//.test(env.LIBSQL_DATABASE_URL)&&!/^https:\/\//.test(env.LIBSQL_DATABASE_URL))return reply({error:'Database URL must start with libsql:// or https://. Use the Turso database URL, not the dashboard page address.',setupState:'invalid_database_url',settingsPresent},503);
  const db=makeClient({url:env.LIBSQL_DATABASE_URL,authToken:env.LIBSQL_AUTH_TOKEN});
  if(path==='/api/store/config'&&request.method==='GET'){
   try{await db.execute('SELECT 1');const result=await db.execute("SELECT name FROM sqlite_master WHERE type='table'");const tables=new Set(result.rows.map(r=>r.name));const required=['products','inventory','customers','leads','shipping','orders','sessions','users','returns','suppliers','purchases','refunds','audit','limits','outbox'];if(required.some(t=>!tables.has(t)))return reply({checkoutEnabled:false,enquiriesEnabled:false,shipping:[],databaseConfigured:true,schemaInitialized:false,setupState:'schema_not_initialized',settingsPresent,error:'Turso is connected, but the application tables are not initialized. Run commerce/bootstrap.sql in this database.'})}
   catch(error){console.error('Neto database connection check failed:',error.code||error.name);return reply({checkoutEnabled:false,enquiriesEnabled:false,shipping:[],databaseConfigured:false,setupState:'database_connection_failed',settingsPresent,error:'The runtime settings are present, but Turso could not be reached or rejected access. Check the database URL, token and Functions logs.'})}
  }
  const instance=makeCommerce({db,env,seed});
  const response=await instance.handle(request,{ip:context.ip||'unknown'});
  if(path==='/api/store/config'&&response.ok){const data=await response.json();return reply({...data,databaseConfigured:true,schemaInitialized:true,setupState:'ready',settingsPresent,ownerLogin,diagnosticsVersion:3})}
  if(request.method==='POST'&&response.ok&&env.RESEND_API_KEY){try{await instance.flushNotifications(2)}catch{}}
  return response;
 }catch(error){console.error('Backend setup error:',error.code||error.name);return reply({error:'The store backend is unavailable. Open /api/store/config to check connection setup.',setupState:'backend_error',settingsPresent},503)}
}}
export default createNetlifyHandler();
export const config={path:'/api/*'};
