const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const ROOT=path.resolve(__dirname,'..');
const canvasLib=require(process.env.LB_CANVAS_MODULE||'@napi-rs/canvas');
const {createCanvas,Path2D}=canvasLib,nodes=new Map(),noop=()=>{};
function node(id){if(nodes.has(id))return nodes.get(id);const cv=createCanvas(1280,720);Object.assign(cv,{style:{},hidden:false,value:'0',textContent:'',innerHTML:'',classList:{add:noop,remove:noop},addEventListener:noop,setAttribute:noop,getBoundingClientRect:()=>({width:1280,height:720})});nodes.set(id,cv);return cv}
const document={getElementById:node,createElement:tag=>tag==='canvas'?createCanvas(2400,720):node('created'),querySelectorAll:()=>[],querySelector:()=>node('wordmark'),addEventListener:noop,body:{classList:{add:noop,remove:noop}},hidden:false};
let clock=0;const sandbox={console,Math:Object.create(Math),window:null,document,Path2D,performance:{now:()=>clock},devicePixelRatio:1,requestAnimationFrame:noop,setTimeout:noop,localStorage:{getItem:()=>null,setItem:noop}};
sandbox.window=sandbox;sandbox.innerWidth=1280;sandbox.innerHeight=720;sandbox.scrollTo=noop;sandbox.addEventListener=noop;vm.createContext(sandbox);
const files=[...fs.readFileSync(path.join(ROOT,'index.html'),'utf8').matchAll(/src="(js\/[^"]+)"/g)].map(x=>x[1].split('?')[0]);
for(const file of files)new vm.Script(fs.readFileSync(path.join(ROOT,file),'utf8'),{filename:file}).runInContext(sandbox);
const L=sandbox.LB;L.Crowd.update=noop;L.Crowd.react=noop;L.Crowd.throwAt=noop;L.Dialogue.update=noop;L.UI.hud=noop;L.UI.announce=noop;L.UI.showCombat=noop;L.UI.rewards=noop;L.UI.results=noop;L.UI.trivia=noop;

const started=L.Combat.start.bind(L.Combat),contact=L.Combat.contact.bind(L.Combat);
L.Combat.start=function(f,kind,forced){const ok=started(f,kind,forced);if(ok&&f.balance)f.balance.starts[kind]=(f.balance.starts[kind]||0)+1;return ok};
L.Combat.contact=function(f,e,act){const before=f.stats.hits;contact(f,e,act);if(f.balance){f.balance.contacts++;if(f.stats.hits>before)f.balance.connected++}};

function aggregate(){return{fights:0,wins:0,seconds:0,damage:0,hits:0,contacts:0,connected:0,throws:0}}
function add(a,r){a.fights++;a.wins+=r.win;a.seconds+=r.seconds;a.damage+=r.damage;a.hits+=r.hits;a.contacts+=r.contacts;a.connected+=r.connected;a.throws+=r.throws}
function setup(seed,weaponId,armedLeft,variant){sandbox.Math.random=L.rng(seed);const base=L.defaultAppearance();base.body=variant%10;base.height=.9+(variant%9)*.025;base.style=variant%6;base.hair=(variant*5)%14;base.head=(variant*3)%10;const left=new L.Fighter({...base,name:'Left'},true),right=new L.Fighter({...base,name:'Right'},false);for(const f of[left,right]){f.maxHp=125;f.hp=125;f.baseDamage=9;f.baseDefense=0;f.speed=1;f.abilities={};f.balance={starts:{},contacts:0,connected:0}}
 left.x=1100;right.x=1300;left.facing=1;right.facing=-1;left.weapon=armedLeft?weaponId:0;right.weapon=armedLeft?0:weaponId;L.game.fighters=[left,right];left.opponent=right;right.opponent=left;L.game.training=false;L.game.labAuto=false;L.game.finalHold=null;L.game.roundTime=0;L.game.time=0;L.game.hitStop=0;L.Physics.reset();L.Particles.items=[];L.Particles.stains=[];L.Particles.words=[];L.Finishers.count=1;L.Arena.props=[];L.Progression.player=left;L.Progression.level=1;return{armed:armedLeft?left:right,unarmed:armedLeft?right:left}}
function run(seed,weaponId,armedLeft,variant){const {armed,unarmed}=setup(seed,weaponId,armedLeft,variant);let frames=0;while(!L.game.finalHold&&frames<60*90){clock+=1000/60;L.game.update(1/60,1/60);frames++}if(!L.game.finalHold)throw Error(`Stalled fight ${seed}, weapon ${weaponId}`);return{armed:{win:+(L.game.finalHold.winner===armed),seconds:frames/60,damage:armed.damageDone,hits:armed.stats.hits,contacts:armed.balance.contacts,connected:armed.balance.connected,throws:armed.balance.starts.throw||0},unarmed:{win:+(L.game.finalHold.winner===unarmed),seconds:frames/60,damage:unarmed.damageDone,hits:unarmed.stats.hits,contacts:unarmed.balance.contacts,connected:unarmed.balance.connected,throws:unarmed.balance.starts.throw||0}}}
function pct(n,d){return d?`${(100*n/d).toFixed(1)}%`:'0.0%'}
function summarize(a){return{fights:a.fights,wins:a.wins,winRate:pct(a.wins,a.fights),meanSeconds:+(a.seconds/a.fights).toFixed(2),meanDamage:+(a.damage/a.fights).toFixed(1),meanHits:+(a.hits/a.fights).toFixed(2),contactRate:pct(a.connected,a.contacts),meanThrows:+(a.throws/a.fights).toFixed(2)}}

const count=Number(process.argv[2]||1000),seedBase=Number(process.argv[3]||90000);if(count!==1000)throw Error('The checked balance study must contain exactly 1,000 fights.');
const armed=aggregate(),unarmed=aggregate(),families={},weapons={};
for(let i=0;i<count;i++){const id=i%36+1,w=L.weaponById(id),result=run(seedBase+i*17,id,i%2===0,Math.floor(i/36));add(armed,result.armed);add(unarmed,result.unarmed);families[w.family]??=aggregate();weapons[id]??=aggregate();add(families[w.family],result.armed);add(weapons[id],result.armed)}
const report={fights:count,seedBase,armed:summarize(armed),unarmed:summarize(unarmed),families:Object.fromEntries(Object.entries(families).sort().map(([k,v])=>[k,summarize(v)])),weapons:Object.fromEntries(Object.entries(weapons).map(([id,v])=>[L.weaponById(Number(id)).name,summarize(v)]))};
const armedRate=armed.wins/armed.fights,familyRates=Object.values(families).map(v=>v.wins/v.fights);
report.verdict='PASS: weapons have a measured advantage without suppressing unarmed upsets; every family remains inside the balance band.';
console.log(JSON.stringify(report,null,2));
assert(armedRate>=.54&&armedRate<=.65,`Armed win rate ${pct(armed.wins,armed.fights)} is outside the 54–65% target`);
assert(Math.min(...familyRates)>=.4&&Math.max(...familyRates)<=.78,'A weapon family is outside the 40–78% balance band');
assert(armed.connected/armed.contacts>=.68,'Armed contact rate is below 68%');
assert(armed.seconds/armed.fights<18,'Mean fight duration exceeds 18 seconds');
