import{s as V,o as h,c as w,r as B,p as c,g as i,a as o,b as k,d as m,e as p,w as _,m as g,f as C,u as b}from"./index-de0252d1.js";import{m as d,a as A,u as M,b as f,c as P,d as S}from"./tag-f10f8df9.js";function x(){const e=V(!1);return h(()=>{window.requestAnimationFrame(()=>{e.value=!0})}),{ssrBootStyles:w(()=>e.value?void 0:{transition:"none !important"}),isBooted:B(e)}}const L=c({scrollable:Boolean,...d(),...A({tag:"main"})},"VMain"),R=i()({name:"VMain",props:L(),setup(e,s){let{slots:a}=s;const{mainStyles:t}=M(),{ssrBootStyles:r}=x();return f(()=>o(e.tag,{class:["v-main",{"v-main--scrollable":e.scrollable},e.class],style:[t.value,r.value,e.style]},{default:()=>{var n,l;return[e.scrollable?o("div",{class:"v-main__scroller"},[(n=a.default)==null?void 0:n.call(a)]):(l=a.default)==null?void 0:l.call(a)]}})),{}}}),T={__name:"View",setup(e){return(s,a)=>{const t=k("router-view");return m(),p(R,null,{default:_(()=>[o(t)]),_:1})}}};const $=c({...d(),...P({fullHeight:!0}),...g()},"VApp"),F=i()({name:"VApp",props:$(),setup(e,s){let{slots:a}=s;const t=C(e),{layoutClasses:r,getLayoutItem:n,items:l,layoutRef:v}=S(e),{rtlClasses:y}=b();return f(()=>{var u;return o("div",{ref:v,class:["v-application",t.themeClasses.value,r.value,y.value,e.class],style:[e.style]},[o("div",{class:"v-application__wrap"},[(u=a.default)==null?void 0:u.call(a)])])}),{getLayoutItem:n,items:l,theme:t}}}),H={__name:"Default",setup(e){return(s,a)=>(m(),p(F,null,{default:_(()=>[o(T)]),_:1}))}};export{H as default};