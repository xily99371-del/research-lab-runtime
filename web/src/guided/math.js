import katex from 'katex';

// Only authored lesson prose is normalized. Learner code and external/user text
// are never evaluated, and source links are rendered separately as safe anchors.
const greek={'α':'\\alpha','β':'\\beta','γ':'\\gamma','δ':'\\delta','ε':'\\epsilon','η':'\\eta','θ':'\\theta','λ':'\\lambda','μ':'\\mu','π':'\\pi','ρ':'\\rho','σ':'\\sigma','τ':'\\tau','φ':'\\phi','ψ':'\\psi','ω':'\\omega','Δ':'\\Delta','Σ':'\\sum','Π':'\\prod','∂':'\\partial','∇':'\\nabla','∈':'\\in','∉':'\\notin','≤':'\\le','≥':'\\ge','≠':'\\ne','≈':'\\approx','∞':'\\infty','×':'\\times','·':'\\cdot','→':'\\to','←':'\\leftarrow','∝':'\\propto','∼':'\\sim','∪':'\\cup','∩':'\\cap','−':'-','√':'\\sqrt'};
const sub={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','ᵢ':'i','ⱼ':'j','ₖ':'k','ₜ':'t','ₙ':'n','ₘ':'m','ₐ':'a','ₚ':'p','ₓ':'x','ⱼ':'j','ⱼ':'j'};
export function asciiToTex(raw){
 let s=raw.trim();
 s=s.replace(/R\^\(([^)]+)\)/g,(_,p)=>'\\mathbb{R}^{'+p+'}');
 s=s.replace(/\^\(([^)]+)\)/g,(_,p)=>'^{'+p+'}');
 s=s.replace(/\b(din|dout|d_in|d_out)\b/g,x=>x.includes('out')?'d_{\\mathrm{out}}':'d_{\\mathrm{in}}');
 s=s.replace(/\b([A-Za-z]+)_([A-Za-z0-9]+)_([A-Za-z0-9]+)\b/g,'$1_{$2,$3}');
 s=s.replace(/\b([A-Za-z]+)_([A-Za-z]{2,})\b/g,'$1_{\\mathrm{$2}}');
 s=s.replace(/[₀₁₂₃₄₅₆₇₈₉ᵢⱼₖₜₙₘₐₚₓ]+/g,x=>'_{'+[...x].map(c=>sub[c]||c).join('')+'}');
 s=s.replace(/ᵀ/g,'^{\\mathsf T}').replace(/²/g,'^{2}').replace(/³/g,'^{3}');
 s=s.replace(/\b(softmax|sigmoid|diag|rank|tr|clip|IoU|Recall|Var|Cov|Gini|Speedup|argmin|argmax|ReLU|ceil|floor)\b/g,'\\operatorname{$1}');
 s=s.replace(/\b(exp|log|sin|cos|tan|max|min)\b/g,'\\$1');
 s=s.replace(/[αβγδεηθλμπρστφψωΔΣΠ∂∇∈∉≤≥≠≈∞×·→←∝∼∪∩−√]/g,c=>greek[c]+' ');
 s=s.replace(/\b(Attention|LayerNorm|FFN|Source|AST|IR|Machine|Code|TP|FP|FN|TN)\b/g,'\\mathrm{$1}');
 // Preserve text-like multi-letter identifiers rather than silently changing math.
 s=s.replace(/\b(true|false|goal|mask|source|target|mean|std)\b/g,'\\mathrm{$1}');
 return s;
}
const delimiters=/\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$/g;
const run=/[A-Za-z0-9Α-ω∂∇ΣΠΔ∞√|][A-Za-z0-9Α-ω∂∇ΣΠΔ∞√∈∉≤≥≠≈∝∼∪∩ᵀ₀-₉ᵢⱼₖₜₙₘₐₚₓ²³ \t_+=<>*\/^()\[\]{}|.,'’:\-×·−%]*/g;
function autoSegments(s){
 const out=[];let pos=0;
 for(const m of s.matchAll(run)){
  let text=m[0],trim=text.trimEnd();
  const code=/\b(?:def|return|import|while|for|assert)\b|__\w+__|\.py\b|https?:|[a-z_]\w*\.\w+\(/.test(trim);
  const math=!code&&trim.length<240&&(/[=∈∉≤≥≠≈∂∇Σ√ᵀ]/.test(trim)||/\bO\([^)]*\)|\bR\^\(|\d\s*[×^]\s*\d/.test(trim));
  if(!math)continue;
  let start=m.index;
  // A final sentence punctuation is prose, not part of an equation.
  trim=trim.replace(/[.,:]+$/,'');
  if(!trim)continue;
  if(start>pos)out.push({type:'text',value:s.slice(pos,start)});
  out.push({type:'math',value:asciiToTex(trim),display:false,original:trim,automatic:true});
  pos=start+trim.length;
 }
 if(pos<s.length)out.push({type:'text',value:s.slice(pos)});
 return out;
}
export function mathSegments(text){
 const s=String(text??'').replace(/\\n\\n/g,'\n\n');let out=[],p=0;
 // Inline code/fenced snippets are protected before scanning legacy notation.
 const protectedParts=s.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
 for(const part of protectedParts){
  if(part.startsWith('`')){out.push({type:'code',value:part.replace(/^```[^\n]*\n|```$/g,'').replace(/^`|`$/g,'')});continue;}
  p=0;
  for(const m of part.matchAll(delimiters)){
   out.push(...autoSegments(part.slice(p,m.index)));
   out.push({type:'math',value:m[1]??m[2]??m[3],display:m[1]!==undefined||m[3]!==undefined,automatic:false});p=m.index+m[0].length;
  }
  out.push(...autoSegments(part.slice(p)));
 }
 return out;
}
export function richText(text,tag='div',cls='lesson-prose'){
 const host=document.createElement(tag);host.className=cls;
 for(const part of mathSegments(text)){
  if(part.type==='math'){
   const n=document.createElement(part.display?'div':'span');n.className=part.display?'math-block':'math-inline';n.dataset.mathSource=part.value;
   try{katex.render(part.value,n,{displayMode:part.display,throwOnError:true,strict:'ignore',trust:false,output:'htmlAndMathml'});}catch(e){n.classList.add('math-parse-error');n.textContent=part.original||part.value;n.title='公式解析错误：'+e.message;}
   host.append(n);
  }else if(part.type==='code'){
   const c=document.createElement('code');c.textContent=part.value;host.append(c);
  }else{
   for(const [i,s]of part.value.split('**').entries()){
    if(i%2){const strong=document.createElement('strong');strong.textContent=s;host.append(strong);}else host.append(document.createTextNode(s));
   }
  }
 }
 return host;
}
export function validateMath(text){
 const errors=[];let count=0;
 for(const p of mathSegments(text))if(p.type==='math'){count++;try{katex.renderToString(p.value,{throwOnError:true,strict:'ignore',trust:false});}catch(e){errors.push({source:p.original||p.value,latex:p.value,error:e.message});}}
 return {count,errors};
}
