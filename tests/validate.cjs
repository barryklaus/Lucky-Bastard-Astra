const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const ROOT=path.resolve(__dirname,'..');
const canvasLib=require(process.env.LB_CANVAS_MODULE||'@napi-rs/canvas');
const {createCanvas,Path2D}=canvasLib;
const nodes=new Map();const noop=()=>{};function node(id){if(nodes.has(id))return nodes.get(id);let cv=createCanvas(1280,720);Object.assign(cv,{style:{},hidden:false,value:'0',textContent:'',innerHTML:'',classList:{add:noop,remove:noop},addEventListener:noop,setAttribute:noop,getBoundingClientRect:()=>({width:560,height:580})});nodes.set(id,cv);return cv}
const document={getElementById:node,createElement:tag=>tag==='canvas'?createCanvas(2400,720):node('created'),querySelectorAll:()=>[],querySelector:()=>node('wordmark'),addEventListener:noop,body:{classList:{add:noop,remove:noop}},hidden:false};let clock=0;const storage=new Map();
const sandbox={console,Math:Object.create(Math),window:null,document,Path2D,performance:{now:()=>clock},devicePixelRatio:1,requestAnimationFrame:noop,setTimeout:noop,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}};sandbox.window=sandbox;sandbox.innerWidth=1280;sandbox.innerHeight=720;sandbox.scrollTo=noop;sandbox.addEventListener=noop;vm.createContext(sandbox);
const files=[...fs.readFileSync(path.join(ROOT,'index.html'),'utf8').matchAll(/src="(js\/[^\"]+)"/g)].map(x=>x[1].split('?')[0]);for(const file of files){const text=fs.readFileSync(path.join(ROOT,file),'utf8');new vm.Script(text,{filename:file}).runInContext(sandbox)}const L=sandbox.LB;
function test(name,fn){try{const out=fn();console.log('PASS '+name+(out===undefined?'':' '+JSON.stringify(out)))}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1}}
test('All classic scripts parse and initialize without runtime errors',()=>files.length);
test('Gore is enabled by default',()=>assert.equal(L.settings.reducedGore,false));
test('Exactly 1000 unique valid trivia questions',()=>{assert.equal(L.trivia.length,1000);assert.equal(new Set(L.trivia.map(q=>q.prompt)).size,1000);for(const q of L.trivia){assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.equal(q.choices.filter(c=>c===q.answer).length,1);assert(q.explanation)}return Object.fromEntries([...new Set(L.trivia.map(q=>q.category))].map(c=>[c,L.trivia.filter(q=>q.category===c).length]))});
test('36 weapon designs, 30 abilities, 25 specials, 336 dialogue lines, 30 crowd shouts',()=>{assert.equal(L.weapons.length,36);assert.equal(new Set(L.weapons.map(w=>w.path)).size,36);assert.equal(L.abilities.length,30);assert.equal(L.specials.length,25);const lines=Object.values(L.dialogue).flat();assert.equal(lines.length,336);assert.equal(new Set(lines).size,336);assert.equal(L.crowdLines.length,30)});
test('All character variants render with native Canvas',()=>{let c=createCanvas(1600,1000),ctx=c.getContext('2d');ctx.fillStyle='#eaca55';ctx.fillRect(0,0,1600,1000);for(let i=0;i<10;i++){let a=L.defaultAppearance();a.body=i;a.head=i;a.hair=i;a.top=i;a.bottom=i%8;a.shoes=i%8;a.cloth=L.palette.cloth[i%8];let f=new L.Fighter(a,true);f.x=160+(i%5)*315;f.y=430+Math.floor(i/5)*500;f.state='idle';f.weapon=i*3;L.Rig.draw(ctx,f,3.14+i)}fs.writeFileSync(path.join(ROOT,'tests/character-render.png'),c.toBuffer('image/png'))});
test('Five full-width arena canvases render',()=>{for(let i=0;i<5;i++){L.Arena.create(i);assert.equal(L.Arena.cache.width,2400);assert.equal(L.Arena.cache.height,720);fs.writeFileSync(path.join(ROOT,`tests/arena-${i+1}.png`),L.Arena.cache.toBuffer('image/png'))}});
// Use simulation without UI/crowd redraw cost. This does not replace real-browser verification.
L.Crowd.update=noop;L.Crowd.react=noop;L.Dialogue.update=noop;L.UI.hud=noop;L.UI.announce=noop;L.UI.showCombat=noop;L.UI.rewards=noop;L.UI.results=noop;L.UI.trivia=noop;
function setup(seed,level=1,weapon=0){sandbox.Math.random=L.rng(seed);let a=L.defaultAppearance();a.weapon=weapon;const p=new L.Fighter(a,true),e=new L.Fighter(L.randomAppearance(),false,level);L.game.fighters=[p,e];p.opponent=e;e.opponent=p;L.game.training=false;L.game.labAuto=false;L.game.finalHold=null;L.game.roundTime=0;L.game.time=0;L.game.hitStop=0;L.Physics.reset();L.Arena.create(Math.floor((level-1)/5));L.Crowd.init();L.Progression.player=p;L.Progression.level=level;return[p,e]}
function tick(n=1){for(let i=0;i<n;i++){clock+=1000/60;L.game.update(1/60,1/60)}}
test('Autonomous fights complete across tiers',()=>{const summary=[];for(let level of[1,5,10,15,20,25])for(let weapon of[0,1,8,27,36]){let[p,e]=setup(level*42+weapon,level,weapon),count=0;while(!L.game.finalHold&&count<60*180){tick();count++}assert(L.game.finalHold,`Fight stalled at level ${level}, weapon ${weapon}; hp ${p.hp}/${e.hp}; state ${p.state}/${e.state}, x ${p.x}/${e.x}, hits ${p.stats.hits}/${e.stats.hits}`);summary.push({level,weapon,seconds:Math.round(count/60),winner:L.game.finalHold.winner.player?'player':'cpu',hits:p.stats.hits+e.stats.hits})}assert(summary.reduce((sum,row)=>sum+row.seconds,0)/summary.length<18,'Fast combat pace regressed above 18-second sample average');return summary});
test('Final blow holds for four simulation seconds',()=>{const[p,e]=setup(5);L.Combat.lethal(p,e,{});const hold=L.game.finalHold;tick(239);assert(L.game.finalHold);assert(hold.elapsed<4);tick(2);assert(!L.game.finalHold)});
test('Training attacks visibly reach valid collision region',()=>{const outputs=[];for(const kind of['punch','kick','weapon']){const[p,e]=setup(21,1,kind==='weapon'?1:0);p.x=1148;e.x=p.x+(kind==='weapon'?225:158);L.game.training=true;L.Combat.start(p,kind,{lab:true,target:kind==='kick'?'body':'head'});p.action.time=p.action.impact;let before=e.hp;L.Combat.contact(p,e,p.action);assert(e.hp<before,`${kind} did not connect`);outputs.push({kind,damage:before-e.hp})}return outputs});
test('All 36 weapon contacts',()=>{let missed=[];for(let id=1;id<=36;id++){const[p,e]=setup(19,1,id);p.x=1148;e.x=p.x+225;L.Combat.start(p,'weapon',{lab:true,target:'body'});p.action.time=p.action.impact;let before=e.hp;L.Combat.contact(p,e,p.action);if(e.hp===before)missed.push(id)}assert.equal(missed.length,0,'Missed weapons '+missed);return {tested:36}});
test('Trivia deck has no immediate repeats',()=>{const seen=new Set();for(let i=0;i<1000;i++){const q=L.Trivia.choose();assert(!seen.has(q.id));seen.add(q.id)}});
test('Crowd projectiles never change health',()=>{const[p,e]=setup(9);L.Physics.projectiles=[{type:'trash',x:e.x,y:e.y-150,vx:0,vy:0,life:2,angle:0,spin:1,target:e,hit:false,bounce:0}];const hp=e.hp;L.Physics.update(.016);assert.equal(e.hp,hp);assert(e.stamina<100)});
test('Rewards advance through round 25 with independent CPU stats',()=>{setup(10);L.Progression.player=new L.Fighter(L.defaultAppearance(),true);L.Progression.level=1;L.Progression.wins=0;L.Progression.revived={};for(let i=1;i<25;i++){let rewards=L.Progression.makeRewards();assert.equal(rewards.length,3);L.Progression.choose(rewards[0]);assert.equal(L.Progression.level,i+1);assert.equal(L.game.world,Math.floor(i/5));assert(Object.keys(L.game.fighters[1].abilities).length===0)}assert.equal(L.Progression.level,25)});
test('Resurrection restores player and preserves opponent damage',()=>{const[p,e]=setup(10);L.Progression.player=p;p.hp=0;e.hp=40;L.Progression.revive();assert.equal(p.hp,p.maxHp*.6);assert.equal(e.hp,40);assert.equal(L.game.screen,'combat')});
test('Disconnected head persists and settles',()=>{const[p,e]=setup(10);L.settings.reducedGore=false;L.Physics.detach(e,'head');assert(e.headDetached);for(let i=0;i<600;i++)L.Physics.update(1/60);assert.equal(L.Physics.parts.length,1);assert(L.Physics.parts[0].y<=L.FLOOR);L.settings.reducedGore=false});
test('Walking support foot remains planted in world space',()=>{const[p]=setup(91);p.state='walk';p.moveDir=1;p.stride=.2;p.x=1000;const first=L.Animation.pose(p,0).frontFoot.x+p.x;let move=2;p.x+=move;p.stride+=move*Math.PI/48;const second=L.Animation.pose(p,0).frontFoot.x+p.x;assert(Math.abs(second-first)<.0001);return {worldDrift:second-first}});
test('All 25 special attack sequences finish without stuck grapple states',()=>{let misses=[];for(const special of L.specials){const[p,e]=setup(52);p.x=1148;e.x=1308;L.game.training=true;L.game.labAuto=false;L.Combat.start(p,'special',{lab:true,special,target:'body'});tick(240);assert(!['grappled','lifted','carried','thrown'].includes(e.state),special.name+' left opponent stuck');if(p.stats.hits===0)misses.push(special.name)}assert.equal(misses.length,0,'Special contacts missed: '+misses.join(', '));return{misses}});
test('A complete 25-level run can be won using offered rewards and allowed trivia',()=>{const originalCreate=L.Arena.create;L.Arena.create=function(i){this.world=i;this.props=[]};let best=0,winner=null;for(let attempt=1;attempt<=25&&!winner;attempt++){sandbox.Math.random=L.rng(1000+attempt);let appearance=L.defaultAppearance();appearance.weapon=36;L.Progression.start(appearance);let revives=new Set();for(let level=1;level<=25;){let frames=0;while(!L.game.finalHold&&frames<60*180){tick();frames++}if(!L.game.finalHold)break;let hold=L.game.finalHold;if(!hold.winner.player){let zone=Math.floor((level-1)/5);if(revives.has(zone))break;revives.add(zone);L.Progression.revive();continue}best=Math.max(best,level);if(level===25){winner={attempt,revivals:revives.size};break}L.game.finalHold=null;let rewards=L.Progression.makeRewards();L.Progression.choose(rewards[0]);level++}}L.Arena.create=originalCreate;assert(winner,'No win within tested runs; best '+best);return winner});
test('All anatomical finishers detach the correct original rig layers and settle during the hold',()=>{
 const sheet=createCanvas(1840,800),c=sheet.getContext('2d');c.fillStyle='#ded1ac';c.fillRect(0,0,1840,800);
 const types=['head','frontArm','frontLeg','upperBody'];
 for(let col=0;col<types.length;col++){
  const type=types[col],[p,e]=setup(61);p.x=1130;e.x=1300;e.hp=0;e.weapon=9;L.settings.reducedGore=false;
  L.Combat.lethal(p,e,{rare:true,finisher:type});assert.equal(L.game.finalHold.finisher,type);assert.equal(L.Physics.parts.length,1);
  const part=L.Physics.parts[0];assert.equal(part.type,type);assert.equal(part.appearance.hair,e.appearance.hair);assert.equal(part.appearance.shoes,e.appearance.shoes);
  assert(type==='head'?e.headDetached:type==='upperBody'?e.upperDetached:e.detached[type]);
  function frame(row){c.save();c.beginPath();c.rect(col*460,row*400,460,400);c.clip();c.translate(col*460+28,row*400+350);c.scale(.88,.88);c.translate(-1100,-576);c.fillStyle='#b8a983';c.fillRect(1080,578,550,50);L.Particles.drawGround(c);L.Rig.draw(c,p,L.game.time);L.Rig.draw(c,e,L.game.time);L.Physics.draw(c);L.Particles.draw(c);c.restore();c.fillStyle='#252329';c.font='bold 17px Arial';c.fillText(type.toUpperCase()+(row?' — LANDED':' — SEPARATED'),col*460+22,row*400+25)}
  tick(25);frame(0);tick(204);frame(1);assert(L.game.finalHold&&L.game.finalHold.elapsed<4);assert(part.settled,type+' did not land within hold');
  const bottom=Math.max(...part.points.map(q=>q.x*Math.sin(part.angle)+q.y*Math.cos(part.angle)+q.r));assert(Math.abs(part.y+bottom-L.FLOOR)<.001,type+' did not contact ground');
  e.heal();assert(!e.headDetached&&!e.upperDetached&&Object.keys(e.detached).length===0);
 }
 fs.writeFileSync(path.join(ROOT,'tests/finishers-render.png'),sheet.toBuffer('image/png'));
});
test('First ordinary knockout guarantees an anatomical finisher',()=>{const[p,e]=setup(87);L.Finishers.count=0;e.hp=0;L.Combat.lethal(p,e,{kind:'punch'});assert.equal(L.game.finalHold.finisher,'head');assert(e.headDetached)});
test('Reduced Gore hides blood and renders substitute effects without breaking finishers',()=>{const[p,e]=setup(98);L.settings.reducedGore=true;L.Particles.items=[];L.Particles.stains=[];e.hp=0;L.Combat.lethal(p,e,{rare:true,finisher:'upperBody'});assert(!L.Particles.items.some(p=>p.kind==='blood'));assert.equal(L.Particles.stains.length,0);const c=createCanvas(1600,720).getContext('2d');L.Rig.draw(c,e,0);L.Physics.draw(c);L.Particles.drawGround(c);L.settings.reducedGore=false});
test('Blood particles and ground splashes are bounded',()=>{L.Particles.items=[];L.Particles.stains=[];for(let i=0;i<50;i++){L.Particles.blood(i*45,300,28);L.Particles.stain(i*45,576,20)}assert(L.Particles.items.length<=180);assert(L.Particles.stains.length<=36)});

test('Final blow begins with hit-stop before slow motion',()=>{const[p,e]=setup(102);e.hp=0;L.Combat.lethal(p,e,{rare:true,finisher:'head'});const part=L.Physics.parts[0],x=part.x,y=part.y;tick(4);assert.equal(part.x,x);assert.equal(part.y,y);tick(8);assert.notEqual(part.y,y);assert(L.game.finalHold.elapsed<4)});

test('Open hands and victory fingers point beyond the wrist, away from the elbow',()=>{
 for(const pose of ['victory','open','block','relaxed'])for(const direction of [-Math.PI/2,0,Math.PI/2,Math.PI]){
  const cv=createCanvas(160,160),c=cv.getContext('2d');c.translate(80,80);c.rotate(direction-Math.PI/2);L.drawHand(c,pose,'#d8956b');
  const rgba=c.getImageData(0,0,160,160).data;let forward=0,backward=0;
  for(let y=0;y<160;y++)for(let x=0;x<160;x++)if(rgba[(y*160+x)*4+3]>64){const d=(x-80)*Math.cos(direction)+(y-80)*Math.sin(direction);if(d>22)forward++;if(d<-22)backward++}
  assert(forward>50&&forward>backward*3,pose+' fingers turn toward the elbow at '+direction);
 }
});
test('Every ear size stays connected to all ten head silhouettes',()=>{
 for(let head=0;head<10;head++)for(let ears=0;ears<4;ears++){
  const a={...L.defaultAppearance(),head,ears,hair:11,beard:0,accessory:0,details:5},cv=createCanvas(220,220),c=cv.getContext('2d');c.translate(110,110);c.scale(1.4,1.4);L.drawFace(c,a,'hurt',2);
  const rgba=c.getImageData(0,0,220,220).data,seen=new Uint8Array(220*220),queue=[110*220+110];seen[queue[0]]=1;
  for(let i=0;i<queue.length;i++){const at=queue[i],x=at%220,y=Math.floor(at/220);for(const next of [x?at-1:-1,x<219?at+1:-1,y?at-220:-1,y<219?at+220:-1])if(next>=0&&!seen[next]&&rgba[next*4+3]>64){seen[next]=1;queue.push(next)}}
  const size=ears===1?1.35:ears===3?.7:1;
  for(let side=0;side<2;side++){const x=Math.round(110+(L.faceEarAnchors[head][side]+(side?1:-1)*10*size)*1.4),y=Math.round(110+(side?2:0)*1.4);assert(seen[y*220+x],`Floating ear: head ${head}, ears ${ears}, side ${side}`)}
 }
});
test('Corrected wrist and ear artwork renders in victory, guard and weapon poses',()=>{
 const cv=createCanvas(1800,1000),c=cv.getContext('2d');c.fillStyle='#e3d7b5';c.fillRect(0,0,1800,1000);
 const poses=['victory','block','idle','punch','victory'];
 for(let i=0;i<10;i++){const a={...L.defaultAppearance(),body:i,head:i,ears:1,hair:i,top:i,accessory:i===2?5:0,cloth:L.palette.cloth[i%8]};const f=new L.Fighter(a,true);f.x=160+(i%5)*360;f.y=445+Math.floor(i/5)*490;f.state=poses[i%5];f.weapon=i%5===4?9:0;f.facing=i<5?1:-1;f.action=f.state==='punch'?{kind:'punch',time:.2,duration:.45,impact:.22,target:'head'}:null;L.Rig.draw(c,f,2);L.text(c,L.options.head[i]+' / '+f.state,f.x,f.y+38,17,L.ink,'Arial','center')}
 fs.writeFileSync(path.join(ROOT,'tests/anatomy-fix-render.png'),cv.toBuffer('image/png'));
 const faces=createCanvas(1400,660),fc=faces.getContext('2d');fc.fillStyle='#e3d7b5';fc.fillRect(0,0,1400,660);
 for(let head=0;head<10;head++)for(let ears=0;ears<4;ears++){fc.save();fc.translate(70+head*140,95+ears*165);L.drawFace(fc,{...L.defaultAppearance(),head,ears,hair:11,beard:0,accessory:0,details:5},'hurt',2);L.text(fc,L.options.ears[ears],0,65,12,L.ink,'Arial','center');fc.restore()}
 fs.writeFileSync(path.join(ROOT,'tests/ear-attachment-render.png'),faces.toBuffer('image/png'));
});
