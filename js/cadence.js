'use strict';
(()=>{
 const baseUpdate=LB.Combat.update;
 const baseDamage=LB.Combat.damage;
 const baseContact=LB.Combat.contact;
 const resting=state=>state==='knockdown'||state==='getup';

 LB.Combat.update=function(f,dt){
  const enemy=f.opponent;
  const late=LB.game.roundTime>45;
  if(!['grappled','lifted','carried','thrown'].includes(f.state)&&f.y!==LB.FLOOR){
   f.y=LB.clamp(f.y+dt*620,LB.FLOOR-180,LB.FLOOR);
  }
  if((LB.game.exchangePauseUntil||0)>LB.game.time+2)LB.game.exchangePauseUntil=0;
  if(enemy&&!f.action&&resting(enemy.state)&&f.hp>0){
   f.stamina=Math.min(100,f.stamina+dt*22*(1+LB.abilityValue(f,'stamina')));
   f.cooldown=Math.max(.18,f.cooldown-dt);
   f.facing=enemy.x>=f.x?1:-1;
   f.state='idle';
   return;
  }
  if(late&&enemy&&!f.action&&f.hitTimer<=0&&f.hp>0&&enemy.hp>0){
   f.facing=enemy.x>=f.x?1:-1;
   const weapon=LB.weaponById(f.weapon),body=LB.bodySpecs[f.appearance.body];
   const weaponRange=weapon?(body.w+body.arm-4+weapon.reach*.99)*f.appearance.height:158;
   const desired=(weapon?LB.clamp(weaponRange,175,270):158)*(1-LB.abilityValue(f,'reach')*.25)+(f.appearance.style===1?5:f.appearance.style===2?-12:0);
   const dist=Math.abs(f.x-enemy.x);
   if(dist>desired+8){const move=Math.min(dist-desired,dt*250);f.x+=f.facing*move;f.state='walk';f.moveDir=1;f.stride+=move*Math.PI/48}
   else if(dist<desired-20){const move=Math.min(desired-dist,dt*170);f.x-=f.facing*move;f.state='walk';f.moveDir=-1;f.stride+=move*Math.PI/48}
   else if(f.cooldown<=0)this.start(f,f.weapon?'weapon':'punch',{target:'body'});
   else{f.cooldown=Math.max(0,f.cooldown-dt*2);f.state='idle'}
   return;
  }
  if(!late&&enemy&&!f.action&&f.hitTimer<=0&&f.hp>0&&enemy.hp>0&&LB.game.time<(LB.game.exchangePauseUntil||0)){
   f.facing=enemy.x>=f.x?1:-1;
   f.state='idle';
   return;
  }
  if(!late&&enemy&&!f.action&&f.cooldown<=0&&f.hp>0&&enemy.hp>0&&Math.abs(f.x-enemy.x)<290&&Math.random()<dt*.42){
   f.stamina=Math.min(100,f.stamina+dt*22*(1+LB.abilityValue(f,'stamina')));
   f.state='idle';
   f.guard='high';
   f.cooldown=LB.rand(.34,.68);
   return;
  }
  const action=f.action,state=f.state,hitTimer=f.hitTimer;
  baseUpdate.call(this,f,dt);
  if(action&&!f.action&&f.state==='idle'){
   const heavy=action.kind==='special'||action.kind==='grapple';
   const medium=action.kind==='kick'||action.kind==='weapon'||action.kind==='throw';
   const pause=LB.rand(heavy?.58:medium?.34:.22,heavy?.88:medium?.58:.44)/f.attackSpeed;
   f.cooldown=Math.max(f.cooldown,pause);
  }
  if(hitTimer>0&&f.hitTimer<=0&&f.state==='idle')f.cooldown=Math.max(f.cooldown,f.recoveryPause||.22);
  if(state==='knockdown'&&f.state==='getup'&&f.action)f.action.duration=.62;
  if(f.recoveryPause&&f.state==='idle')f.recoveryPause=0;
 };

 LB.Combat.damage=function(f,enemy,amount,x,y,meta={}){
  const hp=enemy.hp;
  baseDamage.call(this,f,enemy,amount*1.45*(meta.kind==='weapon'?1.2:1),x,y,meta);
  if(enemy.hp<=0||enemy.hp>=hp||meta.blocked||LB.game.finalHold)return;
  LB.game.exchangePauseUntil=Math.max(LB.game.exchangePauseUntil||0,LB.game.time+LB.rand(.3,.48));
  if(enemy.state==='knockdown'){
   enemy.hitTimer=Math.max(enemy.hitTimer,1.08);
   enemy.recoveryPause=.42;
   f.cooldown=Math.max(f.cooldown,.5);
   return;
  }
  const extra=meta.special?.28:meta.critical?.2:meta.kind==='weapon'?.12:meta.kind==='kick'?.1:meta.kind==='combo'?.08:.05;
  if(enemy.state==='hurt'&&Math.random()<extra*(1-LB.abilityValue(enemy,'knockdown'))){
   enemy.state='knockdown';
   enemy.hitTimer=1.08;
   enemy.recoveryPause=.42;
   enemy.fallProgress=0;
   enemy.knockdowns++;
   f.cooldown=Math.max(f.cooldown,.5);
   LB.Particles.word(enemy.x,enemy.y-230,'DOWN!','#f4cf4d');
   LB.Crowd.react('big');
  }
 };

 LB.Combat.contact=function(f,enemy,act){
  const hp=enemy.hp;
  baseContact.call(this,f,enemy,act);
  if(LB.game.roundTime>45&&enemy.hp===hp&&enemy.hp>0&&!['block','headSway','bodySway','stepBack','knockdown','getup'].includes(enemy.state)&&Math.abs(f.x-enemy.x)<300){
   const b=LB.bodySpecs[enemy.appearance.body],y=enemy.y-(b.leg+b.torso*.4)*enemy.appearance.height;
   this.damage(f,enemy,f.damage*.72,(f.x+enemy.x)/2,y,{kind:act.kind,critical:false,special:false});
  }
 };
})();
