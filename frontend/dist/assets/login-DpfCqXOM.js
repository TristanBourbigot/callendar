import{af as u,_ as m,am as g,an as f,ag as v,a2 as r,Z as c,X as V,c as k,U as w}from"./logo-D1JeDcum.js";import{ad as y,ae as i,af as p,c as n,ag as a,ah as $,ak as b,am as l,ai as d,aK as x}from"./index-BSLI3giW.js";const h=y({data(){return{visible:!1,isHoveringPass:!1,isHoveringSign:!1,errorMessages:!1,user:{email:"",password:""}}},methods:{login:function(){u.post("http://185.98.137.203:2999/api/v1/user/login",{email:this.user.email,password:this.user.password}).then(e=>{document.cookie=`jwt=${e.data.token};max-age=7200;path=/`,document.cookie=`email=${this.user.email};max-age=7200;path=/`,window.location.href="/"}).catch(e=>{this.errorMessages=!0,console.log(e)})}}});function C(e,s,t,E,I,N){return i(),p("div",null,[n(w,{class:"mx-auto pa-12 pb-8 mt-10",elevation:"8","max-width":"448",rounded:"lg"},{default:a(()=>[n(g,{class:"mx-auto my-5","max-width":"228",src:f}),e.errorMessages?(i(),$(v,{key:0,density:"compact",text:"Identifiant ou mot de passe incorrect",type:"error"})):b("",!0),s[8]||(s[8]=l("div",{class:"text-subtitle-1 text-medium-emphasis"},"Email",-1)),n(r,{modelValue:e.user.email,"onUpdate:modelValue":s[0]||(s[0]=o=>e.user.email=o),density:"compact",placeholder:"Adresse Email","prepend-inner-icon":"mdi-email-outline",variant:"outlined"},null,8,["modelValue"]),n(r,{modelValue:e.user.password,"onUpdate:modelValue":s[1]||(s[1]=o=>e.user.password=o),"append-inner-icon":e.visible?"mdi-eye":"mdi-eye-off",type:e.visible?"text":"password",density:"compact",placeholder:"Entrer votre mot de passe","prepend-inner-icon":"mdi-lock-outline",variant:"outlined","onClick:appendInner":s[2]||(s[2]=o=>e.visible=!e.visible)},null,8,["modelValue","append-inner-icon","type"]),n(c,{class:"mb-8",size:"large",variant:"tonal",onClick:s[3]||(s[3]=o=>e.login()),block:""},{default:a(()=>s[6]||(s[6]=[d(" Connexion > ")])),_:1}),n(V,{class:"text-center"},{default:a(()=>[l("a",{onMouseover:s[4]||(s[4]=o=>e.isHoveringSign=!0),onMouseout:s[5]||(s[5]=o=>e.isHoveringSign=!1),class:x([{"text-secondary-link":!e.isHoveringSign,"text-secondary-link-hover":e.isHoveringSign},"text-decoration-none"]),href:"signup"},[s[7]||(s[7]=d(" S'inscrire ")),n(k,{icon:"mdi-chevron-right"})],34)]),_:1})]),_:1})])}const H=m(h,[["render",C]]),S={},B={class:"full-height",style:{background:"linear-gradient(45deg, #F27405, #A60808)"},id:"wrapper"};function M(e,s){const t=H;return i(),p("div",B,[n(t)])}const T=m(S,[["render",M]]);export{T as default};
