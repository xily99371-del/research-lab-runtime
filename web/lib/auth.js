export async function authenticate(req){
 const token=String(req.headers.authorization||'');
 if(!token.startsWith('Bearer ')||token.length>12000)throw Object.assign(new Error('请先登录邮箱账户'),{status:401});
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_ANON_KEY;
 if(!url||!key)throw Object.assign(new Error('Authentication configuration missing'),{status:503});
 const r=await fetch(url+'/auth/v1/user',{headers:{apikey:key,Authorization:token},signal:AbortSignal.timeout(12000)});
 if(!r.ok)throw Object.assign(new Error('登录已过期，请重新登录'),{status:401});
 const user=await r.json();if(!user.id||user.is_anonymous)throw Object.assign(new Error('需要邮箱账户'),{status:401});
 return {token,user};
}
export async function rpc(token,name,body){
 const r=await fetch(process.env.SUPABASE_URL+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:process.env.SUPABASE_ANON_KEY,Authorization:token,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
 const data=await r.json();if(!r.ok)throw Object.assign(new Error(data.message||'Database error'),{status:429});return data;
}
