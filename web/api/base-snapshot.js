// Maintenance only: clone the configured clean base, never user source, and
// create a non-expiring base snapshot. Protected by a server HMAC proof.
import {Sandbox} from '@vercel/sandbox';import{createHmac,timingSafeEqual}from'node:crypto';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 const key=process.env.GRADER_SIGNING_KEY;if(!key)return res.status(503).json({error:'Unavailable'});
 const expected=createHmac('sha256',Buffer.from(key,'hex')).update('research-lab-base-retention-v1').digest();
 const received=Buffer.from(String(req.headers['x-release-proof']||''),'hex');if(received.length!==expected.length||!timingSafeEqual(received,expected))return res.status(401).json({error:'Unauthorized'});
 let s;try{s=await Sandbox.create({source:{type:'snapshot',snapshotId:process.env.SANDBOX_SNAPSHOT_ID},timeout:60000,persistent:false,networkPolicy:'deny-all',resources:{vcpus:1}});const snapshot=await s.snapshot({expiration:0});return res.status(200).json({snapshotId:snapshot.snapshotId,expiresAt:snapshot.expiresAt||null,status:snapshot.status});}catch(e){return res.status(503).json({error:e.message});}finally{if(s)try{await s.stop();}catch{}}
}
