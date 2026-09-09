'use strict';
// Detached artwork is drawn from the same rig layers, not a generic replacement sprite.
LB.drawSever=function(c,x,y,width){
 c.save();c.translate(x,y);
 if(LB.settings.reducedGore){LB.Particles&&LB.ellipse(c,0,0,width,6,'#e7cc8b');LB.text(c,'✦',0,4,17,'#fff1b4','Arial','center')}
 else{LB.path(c,`M${-width} -3 L${-width*.6} -7 -3 -3 3 -6 ${width*.6} -3 ${width} 1 Q${width*.6} 10 0 7 Q${-width*.7} 8 ${-width} -3Z`,'#a62832',LB.ink,1.7);LB.path(c,'M-4-2 Q-6-8-1-9 Q4-11 5-5 L4 4-3 4Z','#f3dcc0',LB.ink,1);LB.path(c,`M${-width*.7} 4 l2 12 3-11 M${width*.6} 4 l-1 9 4-9`,null,'#b62c32',2)}
 c.restore();
};
LB.Finishers={count:0,deck:[],labels:{head:'HEADS WILL ROLL.',frontArm:'DISARMED. LITERALLY.',rearArm:'DISARMED. LITERALLY.',frontLeg:'LAST LEG. LOST.',rearLeg:'LAST LEG. LOST.',upperBody:'HALF THE BASTARD.'},
 perform(winner,loser,forced,pose){
  let type=forced;
  if(!type){if(!this.count)type='head';else{if(!this.deck.length)this.deck=LB.shuffle(['head','frontArm','head','frontLeg','upperBody']);type=this.deck.pop()}}
  this.count++;
  LB.Physics.detach(loser,type,pose);
  if(!LB.settings.reducedGore)LB.Particles.blood(loser.x,loser.y-145,24,winner.facing);
  else LB.Particles.burst(loser.x,loser.y-145,24,'#e7d19c','dust');
  return type;
 },
 geometry(f,type,p){
  const b=LB.bodySpecs[f.appearance.body],root=p.pelvis;
  const torso={x:root.x+Math.sin(p.torso)*b.torso,y:root.y-Math.cos(p.torso)*b.torso};
  let points;
  if(type==='head')points=[{x:torso.x+Math.sin(p.head)*10,y:torso.y-38,r:47*b.head}];
  else if(type==='upperBody')points=[{x:root.x,y:root.y,r:b.hip},{x:torso.x,y:torso.y+20,r:b.w},{x:torso.x,y:torso.y-38,r:47*b.head},{...p.frontHand,r:22},{...p.rearHand,r:22}];
  else if(type.endsWith('Arm')){const front=type==='frontArm',s={x:torso.x+(front?b.w*.67:-b.w*.7),y:torso.y+(front?12:15)},h=front?p.frontHand:p.rearHand,e=LB.Animation.ik(s,h,b.arm*.5,b.arm*.51,front?1:-1);points=[{...s,r:13},{...e,r:13},{...h,r:23}]}
  else{const front=type==='frontLeg',h={x:root.x+(front?b.hip*.5:-b.hip*.56),y:root.y-(front?2:4)},a=front?p.frontFoot:p.rearFoot,k=LB.Animation.ik(h,a,b.leg*.53,b.leg*.52,front?-.9:1);points=[{...h,r:17},{...k,r:15},{x:a.x+9,y:a.y,r:25}]}
  const scale=(f.scale||1)*f.appearance.height,rot=p.rotation+(f.physicsRotation||0),face=f.facing||1;
  points=points.map(q=>({x:(q.x*Math.cos(rot)-q.y*Math.sin(rot)+p.pelvis.x)*scale*face,y:(q.x*Math.sin(rot)+q.y*Math.cos(rot)+p.y)*scale,r:q.r*scale}));
  const anchor={x:points.reduce((sum,q)=>sum+q.x,0)/points.length,y:points.reduce((sum,q)=>sum+q.y,0)/points.length};
  return{anchor,points:points.map(q=>({x:q.x-anchor.x,y:q.y-anchor.y,r:q.r}))};
 },
 drawPart(c,p){
  c.save();c.translate(p.x,p.y);c.rotate(p.angle);
  if(LB.settings.reducedGore){LB.path(c,'M-28-5 L-15-15-9-33 6-20 25-24 20-5 35 7 16 15 10 33-5 18-25 24-20 5Z','#26232b');LB.text(c,'?!',0,9,26,'#f6dfa0','Impact','center')}
  else{c.translate(-p.anchor.x,-p.anchor.y);LB.Rig.draw(c,p.rig,0,{noShadow:true,onlyPart:p.type})}
  c.restore();
 }
};
