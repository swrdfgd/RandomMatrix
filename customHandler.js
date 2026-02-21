// =====================================================
// CUSTOM TOKEN ENGINE (STABLE VERSION)
// Menggunakan generator milik index.html
// =====================================================

// ---------- TOKEN MAP ----------

const TOKEN_MAP = {

  natural:(a,r,c)=>getRandomEntry("natural",[],r,c),
  integer:(a,r,c)=>getRandomEntry("integer",[],r,c),
  rational:(a,r,c)=>getRandomEntry("rational",[],r,c),

  alphabet:()=>{
    const s="abcdefghijklmnopqrstuvwxyz";
    return s[Math.floor(Math.random()*s.length)];
  },

  pi:()=> "\\pi",

  sqrt:(a,r,c)=>{
    const v=evaluate(a[0],r,c);
    return `\\sqrt{${v}}`;
  },

  frac:(a,r,c)=>{
    if(a.length<2) return "";
    const x=evaluate(a[0],r,c);
    const y=evaluate(a[1],r,c);
    return `\\frac{${x}}{${y}}`;
  },

  pow:(a,r,c)=>{
    if(a.length<2) return "";
    const b=evaluate(a[0],r,c);
    const e=evaluate(a[1],r,c);
    return `{${b}}^{${e}}`;
  },

  choose:(a,r,c)=>{
    if(!a.length) return "";
    const pick=Math.floor(Math.random()*a.length);
    return evaluate(a[pick],r,c);
  }
};

// ---------- PARSER ----------

function splitArgs(str){
  let args=[],cur="",depth=0;
  for(let ch of str){
    if(ch=="[") depth++;
    if(ch=="]") depth--;
    if(ch=="," && depth===0){
      args.push(cur.trim());
      cur="";
    } else cur+=ch;
  }
  if(cur) args.push(cur.trim());
  return args;
}

function evaluate(expr,r,c){

  expr=expr.trim();

  // buang [[...]]
  if(expr.startsWith("[[") && expr.endsWith("]]"))
    expr=expr.slice(2,-2).trim();

  // fungsi: name(arg,arg)
  let fn=expr.match(/^([a-zA-Z]+)\((.*)\)$/);
  if(fn){
    const name=fn[1].toLowerCase();
    const args=splitArgs(fn[2]);
    if(!TOKEN_MAP[name]) return expr;
    return TOKEN_MAP[name](args,r,c);
  }

  // nested: name[[...]]
  let nested=expr.match(/^([a-zA-Z]+)\[\[(.+)\]\]$/);
  if(nested){
    const name=nested[1].toLowerCase();
    if(!TOKEN_MAP[name]) return expr;
    return TOKEN_MAP[name]([`[[${nested[2]}]]`],r,c);
  }

  // token sederhana
  if(TOKEN_MAP[expr])
    return TOKEN_MAP[expr]([],r,c);

  return expr;
}

// =====================================================
// PENTING: KEMBALIKAN GENERATOR FUNCTION
// supaya setiap sel menghasilkan angka baru
// =====================================================

function processCustomList(list,r=1,c=1){
  return list.map(item=>{

    // jika sudah function → biarkan
    if(typeof item === "function") return item;

    // jika bukan string → convert
    if(typeof item !== "string") return ()=>String(item);

    // literal
    if(!item.includes("[[")) return ()=>item;

    // token generator
    return ()=>evaluate(item,r,c);
  });
}



// =====================================================
// RANDOM CUSTOM BUTTON
// =====================================================

const CUSTOM_EXAMPLES=[
"[[natural]], [[integer]], [[rational]]",
"[[alphabet]], [[pi]]",
"[[sqrt[[natural]]]]",
//"[[frac[[natural]],[[natural]]]]",
//"[[pow[[natural]],2]]",
//"[[choose(a,b,c,[[natural]])]]"
];

function fillRandomCustom(){
  const ex=CUSTOM_EXAMPLES[Math.floor(Math.random()*CUSTOM_EXAMPLES.length)];
  document.getElementById("customValues").value=ex;
}

document.addEventListener("DOMContentLoaded",()=>{
  const btn=document.getElementById("randomCustomBtn");
  if(btn) btn.addEventListener("click",fillRandomCustom);
});
