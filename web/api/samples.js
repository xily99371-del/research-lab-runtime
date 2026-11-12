import {ALGORITHMS,publicSuite} from '../lib/tasks.js';

export default function handler(req,res){
 res.setHeader('Cache-Control','public, max-age=300, stale-while-revalidate=600');
 if(req.method!=='GET')return res.status(405).json({error:'GET only'});
 const task_id=String(req.query?.task_id||'');
 if(!ALGORITHMS.includes(task_id))return res.status(404).json({error:'题目不存在'});
 try{const samples=publicSuite(task_id).map(({name,input,expected})=>({name,input,expected}));return res.status(200).json({task_id,samples});}
 catch(e){return res.status(500).json({error:'公开样例暂时不可用：'+String(e.message).slice(0,300)});}
}
