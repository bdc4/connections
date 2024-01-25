import{p as B,R as Z,C as A,a6 as k,W as ee,X as te,al as W,r as ne,V as K,c as l,Y as z,s as oe,o as se,U as ae,B as L,a0 as ue}from"./index-de0252d1.js";const de=B({class:[String,Array],style:{type:[String,Array,Object],default:null}},"component");function fe(a){const v=Z("useRender");v.render=a}function ie(a){let v=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"content";const f=A(),u=A();if(k){const s=new ResizeObserver(n=>{a==null||a(n,s),n.length&&(v==="content"?u.value=n[0].contentRect:u.value=n[0].target.getBoundingClientRect())});ee(()=>{s.disconnect()}),te(f,(n,r)=>{r&&(s.unobserve(W(r)),u.value=void 0),n&&s.observe(W(n))},{flush:"post"})}return{resizeRef:f,contentRect:ne(u)}}const E=Symbol.for("vuetify:layout"),le=Symbol.for("vuetify:layout-item"),X=1e3,pe=B({overlaps:{type:Array,default:()=>[]},fullHeight:Boolean},"layout");function ye(){const a=K(E);if(!a)throw new Error("[Vuetify] Could not find injected layout");return{getLayoutItem:a.getLayoutItem,mainRect:a.mainRect,mainStyles:a.mainStyles}}const re=(a,v,f,u)=>{let s={top:0,left:0,right:0,bottom:0};const n=[{id:"",layer:{...s}}];for(const r of a){const y=v.get(r),g=f.get(r),$=u.get(r);if(!y||!g||!$)continue;const h={...s,[y.value]:parseInt(s[y.value],10)+($.value?parseInt(g.value,10):0)};n.push({id:r,layer:h}),s=h}return n};function me(a){const v=K(E,null),f=l(()=>v?v.rootZIndex.value-100:X),u=A([]),s=z(new Map),n=z(new Map),r=z(new Map),y=z(new Map),g=z(new Map),{resizeRef:$,contentRect:h}=ie(),Y=l(()=>{const t=new Map,c=a.overlaps??[];for(const e of c.filter(i=>i.includes(":"))){const[i,o]=e.split(":");if(!u.value.includes(i)||!u.value.includes(o))continue;const p=s.get(i),m=s.get(o),R=n.get(i),S=n.get(o);!p||!m||!R||!S||(t.set(o,{position:p.value,amount:parseInt(R.value,10)}),t.set(i,{position:m.value,amount:-parseInt(S.value,10)}))}return t}),b=l(()=>{const t=[...new Set([...r.values()].map(e=>e.value))].sort((e,i)=>e-i),c=[];for(const e of t){const i=u.value.filter(o=>{var p;return((p=r.get(o))==null?void 0:p.value)===e});c.push(...i)}return re(c,s,n,y)}),T=l(()=>!Array.from(g.values()).some(t=>t.value)),x=l(()=>b.value[b.value.length-1].layer),_=l(()=>({"--v-layout-left":L(x.value.left),"--v-layout-right":L(x.value.right),"--v-layout-top":L(x.value.top),"--v-layout-bottom":L(x.value.bottom),...T.value?void 0:{transition:"none"}})),I=l(()=>b.value.slice(1).map((t,c)=>{let{id:e}=t;const{layer:i}=b.value[c],o=n.get(e),p=s.get(e);return{id:e,...i,size:Number(o.value),position:p.value}})),H=t=>I.value.find(c=>c.id===t),O=Z("createLayout"),j=oe(!1);se(()=>{j.value=!0}),ae(E,{register:(t,c)=>{let{id:e,order:i,position:o,layoutSize:p,elementSize:m,active:R,disableTransitions:S,absolute:F}=c;r.set(e,i),s.set(e,o),n.set(e,p),y.set(e,R),S&&g.set(e,S);const N=ue(le,O==null?void 0:O.vnode).indexOf(t);N>-1?u.value.splice(N,0,e):u.value.push(e);const U=l(()=>I.value.findIndex(w=>w.id===e)),C=l(()=>f.value+b.value.length*2-U.value*2),G=l(()=>{const w=o.value==="left"||o.value==="right",M=o.value==="right",Q=o.value==="bottom",V={[o.value]:0,zIndex:C.value,transform:`translate${w?"X":"Y"}(${(R.value?0:-110)*(M||Q?-1:1)}%)`,position:F.value||f.value!==X?"absolute":"fixed",...T.value?void 0:{transition:"none"}};if(!j.value)return V;const d=I.value[U.value];if(!d)throw new Error(`[Vuetify] Could not find layout item "${e}"`);const P=Y.value.get(e);return P&&(d[P.position]+=P.amount),{...V,height:w?`calc(100% - ${d.top}px - ${d.bottom}px)`:m.value?`${m.value}px`:void 0,left:M?void 0:`${d.left}px`,right:M?`${d.right}px`:void 0,top:o.value!=="bottom"?`${d.top}px`:void 0,bottom:o.value!=="top"?`${d.bottom}px`:void 0,width:w?m.value?`${m.value}px`:void 0:`calc(100% - ${d.left}px - ${d.right}px)`}}),J=l(()=>({zIndex:C.value-1}));return{layoutItemStyles:G,layoutItemScrimStyles:J,zIndex:C}},unregister:t=>{r.delete(t),s.delete(t),n.delete(t),y.delete(t),g.delete(t),u.value=u.value.filter(c=>c!==t)},mainRect:x,mainStyles:_,getLayoutItem:H,items:I,layoutRect:h,rootZIndex:f});const q=l(()=>["v-layout",{"v-layout--full-height":a.fullHeight}]),D=l(()=>({zIndex:v?f.value:void 0,position:v?"relative":void 0,overflow:v?"hidden":void 0}));return{layoutClasses:q,layoutStyles:D,getLayoutItem:H,items:I,layoutRect:h,layoutRef:$}}const ge=B({tag:{type:String,default:"div"}},"tag");export{ge as a,fe as b,pe as c,me as d,ie as e,de as m,ye as u};