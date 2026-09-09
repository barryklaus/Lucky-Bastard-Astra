'use strict';
(()=>{const P=LB.path,L=LB.line,E=LB.ellipse;function local(c,x,y,angle,fn){c.save();c.translate(x,y);c.rotate(angle);fn();c.restore()}
function limb(c,a,b,width,color,shadow,clothed=false){const len=Math.hypot(b.x-a.x,b.y-a.y),angle=Math.atan2(b.y-a.y,b.x-a.x)-Math.PI/2;local(c,a.x,a.y,angle,()=>{P(c,`M${-width*.85} -3 Q${-width*1.25} ${len*.22} ${-width*.79} ${len*.51} L${-width*.61} ${len-1} Q0 ${len+width*.65} ${width*.68} ${len-1} L${width*.88} ${len*.46} Q${width*1.1} ${len*.1} ${width*.7} -3 Q0 ${-width*.6} ${-width*.85} -3Z`,color,LB.ink,2.5);P(c,`M${width*.5} 1 Q${width*.9} ${len*.5} ${width*.43} ${len} L${-width*.1} ${len-1} Q${width*.35} ${len*.5} ${width*.15} 0Z`,shadow,null);if(clothed){P(c,`M${-width*.6} ${len*.67} l${width*.75} -5 M${-width*.6} ${len*.78} l${width*.9} -3`,null,LB.shade(color,-40),1.3);L(c,[width*.55,10,width*.4,len-8],LB.shade(color,22),1)}})}
// Forearms use local +Y from elbow to wrist; the hand artwork points along -Y.
// Turn only the hand, keeping the cuff and weapon grip at the same wrist joint.
LB.drawHand=function(c,pose,skin,angle=0){c.save();c.rotate(angle+Math.PI);const shadow=LB.shade(skin,-32);if(['open','block','falling','victory','pointing','relaxed','limp'].includes(pose)){let v=pose==='victory';P(c,v?'M-7 8 L-8-1-16-10 Q-20-18-14-20 L-4-10-5-34 Q-4-40 1-36 L5-16 10-37 Q15-42 17-36 L14-12 Q22-20 24-13 L20 6 12 15-1 16Z':'M-8 10 L-10 0-19-10 Q-22-16-18-18 Q-14-21-6-9 L-9-30 Q-7-36-3-31 L1-15 0-36 Q3-42 7-35 L9-15 12-33 Q16-38 19-32 L17-12 22-24 Q28-26 27-20 L23 4 15 17 0 18Z',skin,LB.ink,2);P(c,'M-8 1 Q4-4 11 3 M3 2 L5 11 M14-8 L14 1',null,shadow,1.4)}else{P(c,'M-7 13 L-12 3-10-8 Q-9-14-2-13 Q2-18 7-14 Q14-17 17-12 Q24-11 23-3 L21 11 13 17-1 17Z',skin,LB.ink,2.2);P(c,'M-10 0 Q-1-6 9-2 L13 3 Q12 8 7 8 L-2 6',skin,LB.ink,1.5);P(c,'M0-11 L0-5 M8-12 L8-5 M16-9 L16-3 M-1 12 L13 12',null,shadow,1.3)}c.restore()};
// All saved footwear IDs now resolve to low-top sneakers. The ankle joint and
// sole position stay fixed for walking, kicks, crowd rigs and detached legs.
function shoe(c,ankle,type,angle,color){local(c,ankle.x,ankle.y-4,angle,()=>{
 const style=Number.isInteger(type)&&type>=0&&type<8?type:0;
 const upper=style===3?'#e4dcc6':color,shadow=LB.shade(upper,-30),trim=style===6?'#c9aa6c':'#e8dec5';
 P(c,'M-13-10 Q-6-13-1-8 L4-7 7-12 Q12-12 14-5 Q27-5 33 1 L34 7 Q18 12-13 7 L-15 0Z',upper,LB.ink,2.4);
 P(c,'M-13-7 Q-8-5-1-5 L-2 2-13 2Z',shadow,null);
 P(c,'M-12-10 Q-5-7 2-8',null,LB.shade(upper,-48),2);
 P(c,'M3-8 L8-11 17-1 11 2Z',LB.shade(upper,17),LB.ink,1);
 if(style===0||style===5)P(c,'M-6-2 L1-4 8 2 17-1 18 3 6 5Z',trim,null);
 if(style===1)P(c,'M18-3 Q28-4 33 2 L31 6 16 5Z',trim,LB.ink,1);
 if(style===2)P(c,'M-10-3 L0-5 3-1 14 1 12 5-8 4Z',shadow,LB.ink,1);
 if(style===3)L(c,[-5,-2,1,2,11,2],shadow,1.5);
 if(style===4){for(let i=0;i<8;i++)E(c,-6+(i%4)*4,-2+Math.floor(i/4)*4,.65,.65,shadow)}
 if(style===6)P(c,'M-10-5 L-2-5 3 4-11 4Z',trim,LB.ink,1);
 if(style===7){for(let row=0;row<2;row++)for(let col=0;col<5;col++)if((row+col)%2===0){const x=-9+col*4,y=-4+row*4;P(c,`M${x} ${y} h4 v4 h-4Z`,trim,null)}}
 // Lacing, toe seam, continuous rubber sole and tread remain readable in combat.
 for(let i=0;i<3;i++)L(c,[3+i*3,-7+i*3,9+i*3,-8+i*3],trim,1.5);
 P(c,'M19-2 Q18 3 30 3',null,LB.shade(upper,30),1.3);
 P(c,'M-14 3 Q5 8 34 3 L34 9 Q9 15-14 9Z','#ded5bd',LB.ink,1.7);
 L(c,[-11,7,4,9,29,7],shadow,1);
 L(c,[-8,8,-7,11,0,11,1,9,12,10,12,12,22,11,23,8],LB.shade('#ded5bd',-35),1);
})}

LB.Rig={draw(c,f,t,opts={}){const a=f.appearance,b=LB.bodySpecs[a.body],p=f.poseOverride||LB.Animation.pose(f,t),scale=(f.scale||1)*(a.height||1);const only=opts.onlyPart,body=only?only==='upperBody':!f.upperDetached,head=(body||only==='head')&&!f.headDetached,visible=name=>only?(only===name||(only==='upperBody'&&name.endsWith('Arm'))):(!f.detached?.[name]&&!(f.upperDetached&&name.endsWith('Arm')));c.save();c.translate(f.x||0,f.y??LB.FLOOR);if(!opts.noShadow){E(c,0,2,b.w*1.25*scale,10*scale,'#211c2433')}c.scale((f.facing||1)*scale,scale);c.translate(p.pelvis.x,p.y);c.rotate(p.rotation+(f.physicsRotation||0));const root=p.pelvis;const sh=LB.shade(a.skin,-32),cs=LB.shade(a.cloth,-30),ps=LB.shade(a.pants,-29);const torsoPt={x:root.x+Math.sin(p.torso)*b.torso,y:root.y-Math.cos(p.torso)*b.torso};const shoulders=[{x:torsoPt.x-b.w*.7,y:torsoPt.y+15},{x:torsoPt.x+b.w*.67,y:torsoPt.y+12}];const hips=[{x:root.x-b.hip*.56,y:root.y-4},{x:root.x+b.hip*.5,y:root.y-2}];const longSleeve=[1,3,4,6,7,8].includes(a.top),sleeveless=[2,5].includes(a.top),legWidth=a.bottom===5?9:a.bottom===4?17:a.bottom===6?16:12+(b.hip-25)*.22;const drawLeg=(front)=>{if(!visible(front?'frontLeg':'rearLeg'))return;let hip=hips[front?1:0],foot=front?p.frontFoot:p.rearFoot;let knee=LB.Animation.ik(hip,foot,b.leg*.53,b.leg*.52,front?-.9:1);let shorts=a.bottom===1;limb(c,hip,knee,legWidth,a.pants,ps,true);limb(c,knee,foot,shorts?8:legWidth*.78,shorts?a.skin:a.pants,shorts?sh:ps,!shorts);if(a.bottom===4){P(c,`M${hip.x-8} ${hip.y+24} l20 2 -1 21 -20-1Z`,LB.shade(a.pants,-10),LB.ink,1.3);L(c,[hip.x-8,hip.y+29,hip.x+12,hip.y+31],LB.ink,1)}shoe(c,foot,a.shoes,foot.y<-10?-.2:.01,LB.shade(a.pants,13));};const drawArm=(front)=>{if(!visible(front?'frontArm':'rearArm'))return;const shoulder=shoulders[front?1:0],hand=front?p.frontHand:p.rearHand;const elbow=LB.Animation.ik(shoulder,hand,b.arm*.5,b.arm*.51,front?1:-1);const thick=8+(b.w-25)*.15,upperColor=sleeveless?a.skin:a.cloth;limb(c,shoulder,elbow,thick+(longSleeve?3:0),upperColor,sleeveless?sh:cs,!sleeveless);limb(c,elbow,hand,thick*.79+(longSleeve?2:0),longSleeve?a.cloth:a.skin,longSleeve?cs:sh,longSleeve);const angle=Math.atan2(hand.y-elbow.y,hand.x-elbow.x)-Math.PI/2;local(c,hand.x,hand.y,angle,()=>{if(longSleeve)P(c,`M-10-7 L10-7 10 1-9 1Z`,cs,LB.ink,1.5);if(front&&f.weapon&&!['grapple','grappled','lifted','carried'].includes(f.state)){c.save();c.rotate(p.weaponAngle-angle);LB.drawWeapon(c,f.weapon,t);c.restore()}LB.drawHand(c,front&&f.weapon?'grip':p.hand,a.skin,0)});if(front){f.localHand={x:hand.x,y:hand.y};f.localFoot={x:p.frontFoot.x,y:p.frontFoot.y};}};
// Back accessory and secondary hair stay parented to the torso.
if(body&&a.top===6){P(c,`M${torsoPt.x-28} ${torsoPt.y+3} Q${torsoPt.x-56} ${torsoPt.y-35} ${torsoPt.x-4} ${torsoPt.y-30} Q${torsoPt.x+30} ${torsoPt.y-24} ${torsoPt.x+25} ${torsoPt.y+12}Z`,cs)}
const hx=torsoPt.x+Math.sin(p.head)*10,hy=torsoPt.y-38;if(head)local(c,hx,hy,p.head,()=>{if([6,9,13].includes(a.hair)){let sw=Math.sin(t*3)*4;P(c,`M-25-30 Q-54-22-50 12 L${-56+sw} 47 -36 36 -29 43 -21 2Z`,a.hairColor);P(c,'M-36-8 Q-42 14-41 27',null,LB.shade(a.hairColor,25),2)}});
drawArm(false);drawLeg(false);
const w=b.w,hip=b.hip,tx=torsoPt.x,ty=torsoPt.y,rx=root.x,ry=root.y;
if(body){
P(c,`M${torsoPt.x-13} ${torsoPt.y-24} L${torsoPt.x+14} ${torsoPt.y-22} ${torsoPt.x+17} ${torsoPt.y+13} Q${torsoPt.x} ${torsoPt.y+26} ${torsoPt.x-18} ${torsoPt.y+13}Z`,a.skin);P(c,`M${torsoPt.x-13} ${torsoPt.y-20} L${torsoPt.x+10} ${torsoPt.y-16} ${torsoPt.x+9} ${torsoPt.y+7} ${torsoPt.x-13} ${torsoPt.y+2}Z`,sh,null);
// Each body uses separate shoulder, waist and hip dimensions; curves alter the silhouette.
let jacket=[3,4,6,8].includes(a.top),waist=[6,8].includes(a.body)?w*1.12:a.body===7?hip*.82:hip;
P(c,`M${tx-14} ${ty+2} Q${tx-w*.8} ${ty-2} ${tx-w} ${ty+20} Q${tx-w-8} ${ty+48} ${rx-waist} ${ry-10} L${rx-hip} ${ry+8} Q${rx} ${ry+19} ${rx+hip} ${ry+7} Q${rx+w+10} ${ty+61} ${tx+w} ${ty+20} Q${tx+w*.85} ${ty+1} ${tx+14} ${ty+2} Q${tx} ${ty+22} ${tx-14} ${ty+2}Z`,a.cloth,LB.ink,3.2);
P(c,`M${tx+w-12} ${ty+17} Q${tx+w+5} ${ty+53} ${rx+hip-6} ${ry+4} L${rx+hip-22} ${ry+6} Q${tx+w-6} ${ty+44} ${tx+w-21} ${ty+17}Z`,cs,null);
P(c,`M${tx-17} ${ty+4} Q${tx-3} ${ty+25} ${tx+17} ${ty+4}`,null,LB.shade(a.cloth,-45),4);
if(jacket){P(c,`M${tx-13} ${ty+9} L${tx-17} ${ty+32} ${rx-13} ${ry+7} ${rx+10} ${ry+10} ${tx+13} ${ty+18}Z`,'#d7caa7',LB.ink,1.6);if(a.top===3||a.top===8){P(c,`M${tx-14} ${ty+3} L${tx-26} ${ty+25} ${tx-15} ${ty+30} ${tx-22} ${ty+43} ${tx-7} ${ty+48} ${tx-3} ${ty+22}Z`,cs);P(c,`M${tx+14} ${ty+4} L${tx+26} ${ty+23} ${tx+16} ${ty+30} ${tx+21} ${ty+39} ${tx+6} ${ty+52}Z`,cs)}else{L(c,[tx,ty+20,rx,ry+8],'#cfb983',2);for(let y=ty+24;y<ry;y+=6)L(c,[tx-3,y,tx+3,y],LB.ink,1)}}
if(a.top===6){P(c,`M${rx-26} ${ry-24} Q${rx} ${ry-34} ${rx+26} ${ry-23} L${rx+18} ${ry-4} ${rx-20} ${ry-5}Z`,cs,LB.ink,1.5);L(c,[tx-10,ty+15,tx-13,ty+44], '#ddceb0',2);L(c,[tx+10,ty+15,tx+15,ty+39],'#ddceb0',2)}
if(a.top===7){P(c,`M${tx-13} ${ty+1} L${tx-3} ${ty+17} ${tx-16} ${ty+23} ${tx-24} ${ty+10}Z`,LB.shade(a.cloth,20));P(c,`M${tx+13} ${ty+1} L${tx+2} ${ty+17} ${tx+17} ${ty+23} ${tx+24} ${ty+10}Z`,LB.shade(a.cloth,20));L(c,[tx,ty+20,rx,ry+6],cs,1.5);for(let y=ty+28;y<ry;y+=12)E(c,tx+2,y,1.5,1.5,LB.ink)}
if(a.top===9){LB.text(c,'13',tx,ty+57,35,'#dfd1a9','Impact','center');L(c,[tx-w+8,ty+26,tx-w+4,ty+46],'#dfd1a9',5)}if(a.top===2){P(c,`M${tx-28} ${ty+18} L${tx-8} ${ty+23} ${tx-9} ${ty+44} ${tx-28} ${ty+41}Z`,cs,LB.ink,1.2)}
P(c,`M${tx-w+13} ${ty+35} l10 7 -12 4 M${rx-hip+8} ${ry-20} l14 3 M${rx+hip-7} ${ry-15} l-15 4`,null,LB.shade(a.cloth,-48),1.6);if(a.top===4){P(c,`M${rx-34} ${ry-28} l17 5 -3 16 -18-4Z`,cs,LB.ink,1.5);L(c,[rx-30,ry-25,rx-21,ry-22],'#d0b480',1.3)}
if(a.accessory===6)P(c,`M${tx-16} ${ty+7} Q${tx-6} ${ty+40} ${tx+15} ${ty+8}`,null,'#d5b45b',3);
}
drawLeg(true);if(body&&a.bottom===3)P(c,`M${rx-hip} ${ry-6} Q${rx} ${ry+5} ${rx+hip} ${ry-4} L${rx+hip+12} ${ry+43} Q${rx} ${ry+58} ${rx-hip-12} ${ry+42}Z`,a.pants,LB.ink,2.5);
drawArm(true);
if(head)local(c,hx,hy,p.head,()=>{c.scale(b.head*p.headScale,b.head);LB.drawFace(c,a,p.face,t,f.look??1,1-(f.hp||100)/(f.maxHp||100))});
if(body&&f.hp/f.maxHp<.5){P(c,`M${tx-22} ${ty+46} l9-6 3 9 9-5 -7 16 -15-2Z`,a.skin,LB.ink,1.2);P(c,`M${tx+15} ${ty+31} l7 5 -9 3`,null,cs,2)}
if(!only){
 if(f.headDetached&&body)LB.drawSever(c,tx,ty-21,14);
 if(f.upperDetached)LB.drawSever(c,rx,ry+2,hip);
 for(const [key,index] of [['frontArm',1],['rearArm',0]])if(f.detached?.[key]&&body)LB.drawSever(c,shoulders[index].x,shoulders[index].y,11);
 for(const [key,index] of [['frontLeg',1],['rearLeg',0]])if(f.detached?.[key])LB.drawSever(c,hips[index].x,hips[index].y,14);
}else if(only==='upperBody')LB.drawSever(c,rx,ry+6,hip);
else if(only==='head')LB.drawSever(c,hx,hy+34,10);
else if(only.endsWith('Arm')){const q=shoulders[only==='frontArm'?1:0];LB.drawSever(c,q.x,q.y,11)}
else{const q=hips[only==='frontLeg'?1:0];LB.drawSever(c,q.x,q.y,13)}
f.renderHead={x:hx,y:hy};c.restore();},contact(f,t,kind='punch'){const p=LB.Animation.pose(f,t),a=f.appearance,s=(f.scale||1)*a.height,hand=kind==='kick'||kind==='knee'?p.frontFoot:p.frontHand;let x=hand.x,y=hand.y;const rot=p.rotation+(f.physicsRotation||0),rx=x*Math.cos(rot)-y*Math.sin(rot)+p.pelvis.x,ry=x*Math.sin(rot)+y*Math.cos(rot)+p.y;return{x:f.x+rx*s*f.facing,y:f.y+ry*s}}};
})();
