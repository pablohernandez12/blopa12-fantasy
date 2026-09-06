let players=[
{name:"Marcos Alonso",team:"Celta",price:27000000,market:8,start:85,form:80,fixture:65},
{name:"Jon Martín",team:"Real Sociedad",price:36000000,market:6,start:90,form:78,fixture:70},
{name:"Zubeldia",team:"Real Sociedad",price:16415176,market:4,start:95,form:74,fixture:70},
{name:"Riquelme",team:"Betis",price:12000000,market:-3,start:65,form:75,fixture:60}
];
function score(p){return Math.round(Math.max(0,Math.min(100,.25*(50+p.market*6)+.30*p.start+.25*p.form+.20*p.fixture)))}
function action(s){return s>=78?'🟢 COMPRAR':s<=52?'🔴 VIGILAR/VENDER':'🟡 MANTENER'}
function money(n){return (n/1e6).toFixed(1)+'M'}
function render(){
let ranked=players.map(p=>({...p,score:score(p)})).sort((a,b)=>b.score-a.score);
let buy=ranked.filter(x=>x.score>=78).length, risk=ranked.filter(x=>x.score<=52).length;
document.querySelector('#metrics').innerHTML=`<div class="card">👥 Jugadores<div class="big">${ranked.length}</div></div><div class="card">⭐ Mejor opción<div class="big">${ranked[0]?.name||'-'}</div></div><div class="card">🟢 Comprar<div class="big">${buy}</div></div><div class="card">🔴 Riesgo<div class="big">${risk}</div></div>`;
document.querySelector('#rows').innerHTML=ranked.map(p=>`<tr><td><b>${p.name}</b><br><span class="note">${p.team}</span></td><td>${money(p.price)}</td><td class="${p.market>=0?'good':'bad'}">${p.market>=0?'+':''}${p.market}%</td><td>${p.start}%</td><td><b>${p.score}/100</b></td><td>${action(p.score)}</td></tr>`).join('');
let top=ranked[0]; document.querySelector('#strategy').innerHTML=top?`Hoy la mejor oportunidad del ejemplo es <b>${top.name}</b> (${top.score}/100). Para tu liga, combina siempre puntos inmediatos + titularidad + subida de mercado.`:'Carga jugadores.';
}
document.querySelector('#sample').onclick=()=>{localStorage.removeItem('blopaPlayers');players=[...players];render()}
document.querySelector('#upload').onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=ev=>{let lines=ev.target.result.trim().split(/\r?\n/);let h=lines.shift().split(',').map(x=>x.trim().toLowerCase());players=lines.map(line=>{let a=line.split(',');let get=(k,d=0)=>a[h.indexOf(k)]??d;return{name:get('player','Jugador'),team:get('team',''),price:Number(get('price')),market:Number(get('market',0)),start:Number(get('start_probability',50)),form:Number(get('form_score',50)),fixture:Number(get('next_fixture_score',50))}});localStorage.setItem('blopaPlayers',JSON.stringify(players));render()};r.readAsText(f)}
document.querySelector('#export').onclick=()=>{let data=JSON.stringify(players.map(p=>({...p,score:score(p),action:action(score(p))})),null,2);let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download='blopa12-analisis.json';a.click()}
let saved=localStorage.getItem('blopaPlayers');if(saved)players=JSON.parse(saved);render();
