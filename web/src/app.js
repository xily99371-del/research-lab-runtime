import {createClient} from '@supabase/supabase-js';
import {emptyState,normalize,merge3} from './state.js';
import {PROBLEMS,starter} from './problems.js';
import {LESSONS} from './lessons.js';
import {ADVANCED_LESSONS} from './advanced-lessons.js';
import renderMathInElement from 'katex/contrib/auto-render/auto-render.js';
import 'katex/dist/katex.min.css';
Object.assign(LESSONS,ADVANCED_LESSONS);
const $=id=>document.getElementById(id);
function el(tag,text='',cls=''){const n=document.createElement(tag);if(text!==null)n.textContent=text;if(cls)n.className=cls;return n;}
function box(cls,...children){const n=el('div',null,cls);n.append(...children.filter(Boolean));return n;}
function button(text,fn,cls=''){const b=el('button',text,cls);b.type='button';b.addEventListener('click',()=>Promise.resolve().then(fn).catch(e=>notify(e.message)));return b;}
function input(label,value='',type='text'){const l=el('label',label),x=el(type==='textarea'?'textarea':'input');if(type!=='textarea')x.type=type;x.value=value;l.append(x);return {l,x};}
function notice(text,kind=''){const n=el('div',text,'notice '+kind);return n;}
function setBanner(text,kind=''){const b=$('banner');b.textContent=text;b.className='notice '+kind;}
let toastTimer;function notify(text){$('toast').textContent=text;$('toast').classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('on'),3500);}
const pages={dashboard:'å­¦ä¹ é©¾é©¶èˆ±',courses:'è¯¾ç¨‹ä¸æ¨å¯¼',code:'åœ¨çº¿ä»£ç ¶»§q«^uİ½É‘ô¤ì(•±Í”¥˜¡…Ñ¥½¸ôôôÍ¥¹ÕÀœ¥É•ÍÕ±Ğõ…İ…¥ĞÍˆ¹…ÕÑ ¹Í¥¹UÀ¡í•µ…¥°±Á…ÍÍİ½É±½ÁÑ¥½¹Ìéí•µ…¥±I•‘¥É•ÑQ¼é±½…Ñ¥½¸¹½É¥¥¹õô¤ì(•±Í”É•ÍÕ±Ğõ…İ…¥ĞÍˆ¹…ÕÑ ¹É•Í•ÑA…ÍÍİ½É‘½Éµ…¥°¡•µ…¥°±íÉ•‘¥É•ÑQ¼é±½…Ñ¥½¸¹½É¥¥¹ô¤ì(¥˜¡É•ÍÕ±Ğ¹•ÉÉ½È¥Ñ¡É½ÜÉ•ÍÕ±Ğ¹•ÉÉ½Èì(€ …ÕÑ µµ•ÍÍ…”œ¤¹Ñ•áÑ½¹Ñ•¹Ğõ…Ñ¥½¸ôôôÉ•Í•ĞœüŸ–ŞËš>C’ê“–¾‚¦7ö»¢¾ßšÆ¾ò3¢¾ßš~—r/¦
»ºÇœéÉ•ÍÕ±Ğ¹‘…Ñ„ü¹Í•ÍÍ¥½¸üŸfï–öWš"C–*œèŸšÎ£–3¢¾ßšÆ–ŞËš>C’ê“¾ò3¢¾ßš&O–ò¦ª3¢¾¦
»’îÛ–B;fï–öW¦
»’îÛš*W¦K¢şc–>_¦†çn¸M5Q@ƒ¦7ö»–J3¦:¦fC–"Û–öÇ–N7œì(õ…Ñ ¡”¥ì …ÕÑ µµ•ÍÍ…”œ¤¹Ñ•áÑ½¹Ñ•¹Ğõ”¹µ•ÍÍ…”íõ™¥¹…±±åí‰ÕÑÑ½¹Ì¹™½É… ¡ˆôùˆ¹‘¥Í…‰±•õ™…±Í”¤íô)ô( …ÕÑ µ™½É´œ¤¹½¹ÍÕ‰µ¥Ğõ”ôùí”¹ÁÉ•Ù•¹Ñ•™…Õ±Ğ ¤í…ÕÑ  ±½¥¸œ¤¹…Ñ ¡”ôø …ÕÑ µµ•ÍÍ…”œ¤¹Ñ•áÑ½¹Ñ•¹Ğõ”¹µ•ÍÍ…”¤íôì( É•¥ÍÑ•Èœ¤¹½¹±¥¬ô ¤ôù…ÕÑ  Í¥¹ÕÀœ¤¹…Ñ ¡”ôø …ÕÑ µµ•ÍÍ…”œ¤¹Ñ•áÑ½¹Ñ•¹Ğõ”¹µ•ÍÍ…”¤ì( É•Í•Ğœ¤¹½¹±¥¬ô ¤ôù…ÕÑ  É•Í•Ğœ¤¹…Ñ ¡”ôø …ÕÑ µµ•ÍÍ…”œ¤¹Ñ•áÑ½¹Ñ•¹Ğõ”¹µ•ÍÍ…”¤ì( ±½½ÕĞœ¤¹½¹±¥¬õ…Íå¹Œ ¤ôùí¥˜¡‘¥ÉÑä¥í…İ…¥ĞÍå¹Œ ¤í¥˜¡‘¥ÉÑä˜˜…½¹™¥É´ Ÿ–Âkšr'šr«–B3š¶—jšr³šrëšRç–*£’î7¢š¦–ë¾ò|œ¤¥É•ÑÕÉ¸íõ½¹ÍĞí•ÉÉ½Éôõ…İ…¥ĞÍˆ¹…ÕÑ ¹Í¥¹=ÕĞ ¤í¥˜¡•ÉÉ½È¥¹½Ñ¥™ä¡•ÉÉ½È¹µ•ÍÍ…”¤í•±Í”…Ñ¥Ù…Ñ”¡¹Õ±°¤íôì( ¡…¹”µÁ…ÍÍİ½Éœ¤¹½¹±¥¬õ…Íå¹Œ ¤ôùí½¹ÍĞÁ…ÍÍİ½Éô ¹•ÜµÁ…ÍÍİ½Éœ¤¹Ù…±Õ”í¥˜¡Á…ÍÍİ½É¹±•¹Ñ ğà¥ì É•½Ù•Éäµµ•ÍÍ…”œ¤¹Ñ•áÑ½¹Ñ•¹ĞôŸ–¾‚¢Ï–ÂD€àƒ’ö4œíÉ•ÑÕÉ¸íõ½¹ÍĞí•ÉÉ½Éôõ…İ…¥ĞÍˆ¹…ÕÑ ¹ÕÁ‘…Ñ•UÍ•È¡íÁ…ÍÍİ½É‘ô¤ì É•½Ù•Éäµµ•ÍÍ…”œ¤¹Ñ•áÑ½¹Ñ•¹Ğõ•ÉÉ½Èı•ÉÉ½È¹µ•ÍÍ…”èŸ–¾‚–ŞËšnÓšZÀœí¥˜ …•ÉÉ½È¤ É•½Ù•Éäµ‘¥…±½œœ¤¹±½Í” ¤íôì)İ¥¹‘½Ü¹…‘‘Ù•¹Ñ1¥ÍÑ•¹•È ½¹±¥¹”œ° ¤ôùí¥˜¡ÕÍ•È¥ÎÚîÆ­yÖÆ“§G'VWÒÇ¶ÆVgC¢uÅÅ²rÇ&–v‡C¢uÅÅÒrÆF—7Æ“§G'VWÒÇ¶ÆVgC¢rBrÇ&–v‡C¢rBrÆF—7Æ“¦fÇ6WÕÒÇF‡&÷töäW'&÷#¦fÇ6RÇ7G&–7C¢v–væ÷&RwÒ“·Ö6F6‚†R—¶6öç6öÆRçv&â‚t¶FU‚&VæFW"f–ÆVBrÆR“·Ğ¢6öç7BöÆCÖFFç&öw&W75¶2æ–E×ÇÇ·Ó¶6öç7Bæ÷FSÖ–çWB‚~h‰y¨NhêZûÎ8Zéîš¨Î{¹>iéÎKˆîyi™zârÆöÆBææ÷FWÇÆöÆBææ÷FW7ÇÂrrÂwFW‡F&Vr“¶ÆWB6fUF–ÖW#¶æ÷FRç‚æöæ–çWCÒ‚“Óç¶6ÆV%F–ÖV÷WB‡6fUF–ÖW"“·6fUF–ÖW#×6WEF–ÖV÷WB‚‚“Óç¶FFç&öw&W75¶2æ–EÓ×²ââæFFç&öw&W75¶2æ–EÒÆæ÷FS¦æ÷FRç‚çfÇVWÓ¶6†ævVB‚“·ÒÃ3S“·Ó¶æ÷FRç‚æöæ&ÇW#Ò‚“Óç¶6ÆV%F–ÖV÷WB‡6fUF–ÖW"“¶FFç&öw&W75¶2æ–EÓ×²ââæFFç&öw&W75¶2æ–EÒÆæ÷FS¦æ÷FRç‚çfÇVWÓ¶6†ævVB‚“·Ó¶FWF–ÂæVæB†æ÷FRæÂ“°¢f÷"†6öç7B¶¶W’ÆÆ&VÅÖöbµ²wF†V÷'’rÂ~ynŠë®ˆz®ŠøNûÉ®ˆ;ŞŠz>˜x¢şhêZûÂuÒÅ²w&W6V&6‚rÂ~z	Nz›nˆz®ŠøNûÉ®iÈZéîš¨Îh‰nŠë®ih~ˆN{;²uÕÒ—¶6öç7BÃÖVÂ‚vÆ&VÂrÆçVÆÂÂv–æÆ–æRÖ6†V6²r’ÇƒÖVÂ‚v–çWBr“·‚çG—SÒv6†V6¶&÷‚s·‚æ6†V6¶VCÒöÆE¶¶W•Ó·‚æöæ6†ævSÒ‚“Óç¶FFç&öw&W75¶2æ–EÓ×²ââæFFç&öw&W75¶2æ–EÒÅ¶¶W•Ó§‚æ6†V6¶VBÆæ÷FS¦æ÷FRç‚çfÇVWÓ¶6†ævVB‚“·Ó¶ÂæVæB‡‚ÆVÂ‚w7ârÆÆ&VÂ’“¶FWF–ÂæVæB†Â“·Ğ¢6öç7BF6·3Õ$ô$ÄTÕ2æf–ÇFW"‡ÓççVæ—CÓÓÖ2æ–B“¶f÷"†6öç7BöbF6·2–FWF–ÂæVæB†'WGFöâ‚~Kº>zš¨ÎiKnûÉ¢r·çF—FÆRÂ‚“Óç·&ö&ÆVÓ×æ–C¶ÆæwVvS×æÆæw5³Ó¶æf–vFR‚v6öFRr“·Ò’“°¢Ğ¢VÇ6RFWF–ÂæVæB†VÂ‚wrÂ~k*iÈXË˜XŞy¨Nyú^Šønx+8"r’“·&ö÷BæVæB†&÷‚‚v6÷W'6RÖw&–BrÆÆ—7BÆFWF–Â’“°§Ğ¦gVæ7F–öâG&gD¶W’‚—·&WGW&â&ö&ÆVÒ²rÒr¶ÆæwVvS·Ğ¦gVæ7F–öâ&VæFW$6öFR‡&ö÷B—°¢&ö÷BæVæB††W&ò‚~Kº>zŠhZéî™˜^‹ùŠÎûÈÎ{¹>iéÎŠhXúşKº^‹ûŞkªş8"rÅ$ô$ÄTÕ2æÆVæwF‚²r˜>Xúş˜ŠêŞ{¸>K»¾XªŠhny¹nzé~k9^8G&ç6f÷&ÖW"Kˆâ$õ2.8%—F†öî8kºwµçYİXYÙWOZ‹œÛİ\˜ÙWØÛÙNØÚ[™ÙY

NÜ™[™\Š
Nß_JJJNß\›Ûİ˜\[™
\İÜP›Ş
NÂŸB™[˜İ[ÛˆÚİÔ™\Ü
›ÛİŠ^Ü›Ûİœ™\XÙPÚ[™[Š
NÜ›Ûİ˜\[™
[
	ÚÉË‹œİ]\ÏOOIÜ\ÜÙY	ÏÉù­bú+åz`&º/áÉÎœ‹œİ]\ÏOOIİ[Y[İ]	ÏÉú/ä:(c:-¡y¥í‰Îœ‹œİ]\ÏOOIÙ\œ›Ü‰ÏÉú/ä:(c9§#yb¨yo ¹n.	Î‰ù§*º`&º/áùaj:`ê9­bú+åIË‹œİ]\ÏOOIÜ\ÜÙY	ÏÉÜ\ÜÙY	Î‰Ù˜Z[Y	ÊK[
	Ü	Ë:(c9..¹­bú+åyb!¹¥l;ï&‰Ü‹œØÛÜ™OÏÌHÈL	Ü‹İ[Ø0­È	Ü‹œ\ÜÙYKÉÜ‹İ[H:hnX‰ÉßIÜ‹™[\ÙYÛ\ÏØ0­È	Ü‹™[\ÙYÛ\ßH\Ø‰ÉßX
JNÚYŠ‹™\œ›ÜŠ\›Ûİ˜\[™
›İXÙJ‹™\œ›Ü‹	Ø˜Y	ÊJNÚYŠ‹Ø\›š[™Ê\›Ûİ˜\[™
›İXÙJ‹Ø\›š[™Ë	İØ\›‰ÊJNÚYŠ‹œ\œÚ\İYOOY˜[ÙJ\›Ûİ˜\[™
›İXÙJ	ù§+9«(y¢©ydb¹§*¹¢$9b§ù/çykf9.¤yêëûï&‰ÊÊ‹œØ]™Q\œ›ÜŸ	ÉÊK	İØ\›‰ÊJNÂˆ›ÜŠÛÛœİÈÙˆ‹˜Ø\Ù\ß×J^ØÛÛœİ›İÏX›Ş
	Ü›İÉË[
	ÜÜ[‰ËËœ\ÜÏÉø§$ÉÎ‰ğåÉËËœ\ÜÏÉÜ\ÜÙY	Î‰Ù˜Z[Y	ÊK›Ş
	ÉË[
	Ø‰ËË›˜[YJKË™]Z[Ù[
	Ü	ËË™]Z[	Û]]Y	ÊN›[
JNÚYŠËš[œ]OO][™Yš[™Y
\›İË›\İÚ[˜\[™
[
	Ü™IË”ÓÓ‹œİš[™ÚYJÚ[œ]˜Ëš[œ]^XİY˜Ë™^XİYXİX[˜Ë˜XİX[K[ŠJJNÜ›Ûİ˜\[™
›İÊNßZYŠ‹œİ\œŠ\›Ûİ˜\[™
[
	Ú	Ë	ùï%º+äHÈ:/ä:(c9¥éyoåÉÊK[
	Ü™IË‹œİ\œŠJNßB˜ÛÛœİ™XÛÜ™šY[Ï^Ü™\ÙX\˜Ú–ÖÉİ]IË	ùè%9êm¹.îùb¨y¨!úh¦	×KÉİ˜XÚÉË	ù¥®yd$I×KÉÜ]Y\İ[Û‰Ë	úeëºh¦9.#¹cëú+ày/*¹`aú+¯‰×KÉÛY]Ù	Ë	ùgî¹î¯øà y£©ùb-¹cæ:aãøà y£!ù¨!É×KÉÜ™\İ[	Ë	ùîäù§§8à yi,z-)y.#¹."ù. 9«iI×WK\\œÎ–ÖÉİ]IË	ú+®¹¥¡ù¨!úh¦	×KÉİ™[YIË	ù/&º+«ˆÈ9§'ùb"ˆÈ9nm9.ïI×KÉÛ›İIË	ù¥®y¬åxà y£ª9kï8à yl`:fd9.#¹.*¹.®¹b)9¥«I×WKÙYZÜÎ–ÖÉİ]IË	ù§+9dj9.îùb¨I×KÉÚİ\œÉË	úh¡:+¨yl#ù¥í¹¥l	×WKY[ÜœÎ–ÖÉİ]IË	ùkï9n"9iäùd#HÈ9k§ºj£9k©	×KÉÜØÚí®éÜj×);
   const {data:s,error}=await sb.auth.getSession();if(error)throw error;await activate(s.session);
  }else{setBanner('é‚®ç®±è®¤è¯é…ç½®æœªå®Œæˆï¼Œç›®å‰ä¸ºè®¿å®¢æ¨¡å¼ã€‚','warn');render();}
 }catch(e){setBanner('åŠ è½½å¤±è´¥ï¼š'+e.message,'bad');render();}
}
init();
