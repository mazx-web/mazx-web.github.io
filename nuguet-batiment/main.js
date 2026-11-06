/* Pierre Nuguet – Entreprise de bâtiment | Mazx web */
(function(){
  "use strict";
  var doc=document.documentElement, body=document.body;
  var reduit=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Chargement : lance le héros */
  window.addEventListener("load",function(){requestAnimationFrame(function(){body.classList.add("charge");});});
  setTimeout(function(){body.classList.add("charge");},1800);

  /* En-tête : fond plein après le héros, se cache en descendant */
  var entete=document.querySelector(".entete"), dernierY=0;
  function surDefil(){
    var y=window.scrollY;
    if(entete){
      entete.classList.toggle("plein",y>60);
      entete.classList.toggle("cache",y>dernierY&&y>400&&!body.classList.contains("menu-ouvert"));
    }
    dernierY=y;
  }
  window.addEventListener("scroll",surDefil,{passive:true});surDefil();

  /* Menu mobile */
  var burger=document.querySelector(".burger");
  if(burger){
    burger.addEventListener("click",function(){
      var o=body.classList.toggle("menu-ouvert");
      burger.setAttribute("aria-expanded",o?"true":"false");
    });
    document.querySelectorAll(".nav a").forEach(function(a){a.addEventListener("click",function(){body.classList.remove("menu-ouvert");burger.setAttribute("aria-expanded","false");});});
  }

  /* Épure du héros : le trait se dessine ligne après ligne */
  var epureHeros=document.querySelector(".heros .epure");
  if(epureHeros){
    var traits=epureHeros.querySelectorAll("[data-trace]");
    traits.forEach(function(t,i){
      t.setAttribute("pathLength","1");
      if(reduit){t.style.strokeDashoffset=0;return;}
      t.style.transition="stroke-dashoffset "+(t.dataset.duree||1.6)+"s cubic-bezier(.65,0,.35,1) "+(0.5+i*0.16)+"s";
    });
    var lancer=function(){traits.forEach(function(t){t.style.strokeDashoffset=0;});};
    window.addEventListener("load",function(){setTimeout(lancer,150);});
    setTimeout(lancer,1900);
    var txt=epureHeros.querySelectorAll("text");
    txt.forEach(function(t,i){t.style.opacity=0;t.style.transition="opacity .8s ease "+(2.4+i*0.2)+"s";});
    var montrer=function(){txt.forEach(function(t){t.style.opacity=1;});};
    window.addEventListener("load",function(){setTimeout(montrer,150);});setTimeout(montrer,1900);
  }

  /* Section « le trait » : la ferme se construit au défilement */
  var trait=document.querySelector(".trait");
  if(trait){
    var tTraits=trait.querySelectorAll("[data-trace]");
    tTraits.forEach(function(t){t.setAttribute("pathLength","1");});
    var etapes=trait.querySelectorAll(".etape"), points=trait.querySelectorAll(".trait-progres i");
    var mobile=window.matchMedia("(max-width:820px)");
    function majTrait(){
      if(mobile.matches||reduit){tTraits.forEach(function(t){t.style.strokeDashoffset=0;});etapes.forEach(function(e){e.classList.add("actif");});return;}
      var r=trait.getBoundingClientRect(), total=r.height-window.innerHeight;
      var p=Math.min(1,Math.max(0,-r.top/total));
      var n=tTraits.length;
      tTraits.forEach(function(t,i){
        var d=i/n*0.85, f=d+0.28;
        var local=Math.min(1,Math.max(0,(p-d)/(f-d)));
        t.style.strokeDashoffset=1-local;
      });
      var idx=Math.min(etapes.length-1,Math.floor(p*etapes.length*0.999));
      etapes.forEach(function(e,i){e.classList.toggle("actif",i===idx);});
      points.forEach(function(e,i){e.classList.toggle("actif",i<=idx);});
    }
    window.addEventListener("scroll",majTrait,{passive:true});window.addEventListener("resize",majTrait);majTrait();
  }

  /* Apparitions */
  var cibles=document.querySelectorAll(".revele,.monte");
  if("IntersectionObserver" in window&&!reduit){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("vu");io.unobserve(e.target);}});},{rootMargin:"0px 0px -12% 0px"});
    cibles.forEach(function(c){io.observe(c);});
  } else cibles.forEach(function(c){c.classList.add("vu");});

  /* Compteurs */
  var compteurs=document.querySelectorAll("[data-compte]");
  if(compteurs.length&&"IntersectionObserver" in window){
    var ioc=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return; ioc.unobserve(e.target);
      var el=e.target, fin=+el.dataset.compte, suf=el.dataset.suffixe||"", t0=null;
      if(reduit){el.textContent=fin+suf;return;}
      function pas(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/1600);var v=Math.round(fin*(1-Math.pow(1-k,3)));el.textContent=v+suf;if(k<1)requestAnimationFrame(pas);}
      requestAnimationFrame(pas);
    });},{threshold:.6});
    compteurs.forEach(function(c){ioc.observe(c);});
  }

  /* Parallaxe douce des bandeaux */
  var bandeaux=document.querySelectorAll(".bandeau-img img");
  if(bandeaux.length&&!reduit){
    var majB=function(){bandeaux.forEach(function(img){var r=img.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>window.innerHeight)return;var p=(r.top+r.height/2-window.innerHeight/2)/window.innerHeight;img.style.transform="translate3d(0,"+(p*-12)+"%,0)";});};
    window.addEventListener("scroll",majB,{passive:true});majB();
  }

  /* Avant / après */
  document.querySelectorAll(".aa").forEach(function(aa){
    var input=aa.querySelector("input");
    var maj=function(){aa.style.setProperty("--pos",input.value+"%");};
    input.addEventListener("input",maj);maj();
    var vu=false;
    if("IntersectionObserver" in window&&!reduit){
      var o=new IntersectionObserver(function(es){es.forEach(function(e){
        if(e.isIntersecting&&!vu){vu=true;o.disconnect();
          var t0=null;function anim(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/1800);var v=50+Math.sin(k*Math.PI*2)*-22*(1-k);input.value=v;maj();if(k<1)requestAnimationFrame(anim);}
          requestAnimationFrame(anim);}
      });},{threshold:.6});
      o.observe(aa);
    }
  });

  /* Vidéo YouTube : chargée seulement au clic */
  document.querySelectorAll(".video[data-yt]").forEach(function(v){
    v.addEventListener("click",function(){
      var f=document.createElement("iframe");
      f.src="https://www.youtube-nocookie.com/embed/"+v.dataset.yt+"?autoplay=1&rel=0";
      f.allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";f.allowFullscreen=true;f.title=v.getAttribute("aria-label")||"Vidéo";
      v.innerHTML="";v.appendChild(f);v.style.cursor="default";
    },{once:true});
  });

  /* Galerie : filtres + visionneuse */
  var galerie=document.querySelector(".galerie");
  if(galerie){
    var items=[].slice.call(galerie.querySelectorAll("button"));
    document.querySelectorAll(".filtres button").forEach(function(b){
      b.addEventListener("click",function(){
        document.querySelectorAll(".filtres button").forEach(function(x){x.setAttribute("aria-pressed","false");});
        b.setAttribute("aria-pressed","true");
        var f=b.dataset.filtre;
        items.forEach(function(it){it.classList.toggle("masque",f!=="tout"&&it.dataset.cat.indexOf(f)<0);});
      });
    });
    var vis=document.querySelector(".visionneuse"), vImg=vis.querySelector("img"), vTxt=vis.querySelector("p"), courant=0, dernierFocus=null;
    function visibles(){return items.filter(function(i){return !i.classList.contains("masque");});}
    function montre(i){var l=visibles();courant=(i+l.length)%l.length;var it=l[courant];vImg.src=it.dataset.grand;vImg.alt=it.querySelector("img").alt;vTxt.textContent=it.querySelector("span").textContent;}
    items.forEach(function(it){it.addEventListener("click",function(){dernierFocus=it;montre(visibles().indexOf(it));vis.classList.add("ouverte");vis.querySelector(".v-fermer").focus();});});
    function fermer(){vis.classList.remove("ouverte");if(dernierFocus)dernierFocus.focus();}
    vis.querySelector(".v-fermer").addEventListener("click",fermer);
    vis.querySelector(".v-prec").addEventListener("click",function(){montre(courant-1);});
    vis.querySelector(".v-suiv").addEventListener("click",function(){montre(courant+1);});
    vis.addEventListener("click",function(e){if(e.target===vis)fermer();});
    document.addEventListener("keydown",function(e){if(!vis.classList.contains("ouverte"))return;if(e.key==="Escape")fermer();if(e.key==="ArrowLeft")montre(courant-1);if(e.key==="ArrowRight")montre(courant+1);});
  }

  /* Formulaire : prépare un e-mail de demande de devis */
  var form=document.querySelector("#form-devis");
  if(form){
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var d=new FormData(form), msg=form.querySelector(".form-msg");
      if(!d.get("nom")||!d.get("tel")||!d.get("projet")){msg.textContent="Indiquez votre nom, votre téléphone et votre projet pour envoyer la demande.";return;}
      var corps="Nom : "+d.get("nom")+"\nTéléphone : "+d.get("tel")+"\nCommune : "+(d.get("commune")||"")+"\nType de travaux : "+d.get("type")+"\n\n"+d.get("projet");
      window.location.href="mailto:nuguet.bat@hotmail.com?subject="+encodeURIComponent("Demande de devis – "+d.get("type"))+"&body="+encodeURIComponent(corps);
      msg.textContent="Votre messagerie s'ouvre avec la demande prête à envoyer.";
    });
  }

  var an=document.querySelector("[data-annee]");if(an)an.textContent=new Date().getFullYear();
})();
