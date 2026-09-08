'use strict';
(()=>{const names=['Bare knuckles','Eviction bat','Frying pan','Fire extinguisher','Office stapler','Garden shovel','Rubber chicken','Traffic cone','Pool cue','Bread knife','Rolling pin','Meat tenderizer','Toilet plunger','Golf club','Broken bottle','Folding chair','Keyboard','Briefcase','Cactus on a stick','Wet-floor sign','Steel umbrella','Flamingo mallet','Stop sign','Vacuum cleaner','Party cannon','Pizza cutter','Baguette','Sledgehammer','Swordfish','Trophy','Mop of shame','Mic stand','Giant toothbrush','Tax binder','Disco mace','Divorce papers','Museum laser sword'];
const shapes=[null,
['M-5 6 L-6-42 Q-14-67-12-111 Q-10-123 2-122 Q12-119 10-108 L4-42 4 6Z','#a97545'],
['M-4 9 L-5-53 Q-34-57-36-87 Q-37-122-4-127 Q30-129 31-94 Q32-61 4-53 L4 9Z','#69767a'],
['M-7 5 L-10-30 Q-25-36-24-87 Q-24-101-12-104 L-12-115 9-115 9-104 Q24-99 24-88 L23-46 Q21-33 7-30 L7 5Z','#cb5346'],
['M-4 8 L-6-35 -17-40 -19-85 Q2-99 30-86 L31-75 1-71 2-42 5 8Z','#578b88'],
['M-4 9 L-5-93 Q-26-98-23-125 L-18-157 20-157 24-122 Q24-99 5-93 L4 9Z','#87919a'],
['M-3 8 Q-12-7-6-31 Q-24-53-16-80 L-11-101 Q-26-108-12-119 L-8-135 Q7-142 15-130 L25-128 18-119 Q30-110 13-104 L12-83 Q33-58 12-34 L4 9Z','#edbd4c'],
['M-5 8 L-12-16 -36-17 -7-112 Q-2-121 3-111 L35-17 11-16 5 8Z','#e7833d'],
['M-3 9 L-4-175 0-192 3-174 3 9Z','#bd9d68'],
['M-5 9 L-5-38 -11-43 -8-142 Q20-123 13-82 L6-40 5 9Z','#b8c7be'],
['M-4 10 L-4-28 Q-13-30-13-41 L-12-107 Q-10-118-3-118 L-3-135 3-135 3-118 Q13-115 13-107 L13-41 Q12-29 4-28 L4 10Z','#c99155'],
['M-4 9 L-4-90 -31-91 -31-120 31-120 31-91 4-90 4 9Z','#8a8e89'],
['M-4 8 L-4-106 Q-31-108-32-137 L31-137 Q31-109 4-106 L4 8Z','#a9684d'],
['M-3 8 L-3-149 Q-32-147-33-167 L-29-177 -2-174 4-156 3 8Z','#aeb8b3'],
['M-5 8 L-6-36 Q-17-40-17-50 L-17-78 -10-69 -7-95 0-77 12-96 16-79 16-49 Q15-39 6-36 L5 8Z','#629e74'],
['M-4 10 L-5-48 -37-48 -35-99 -29-112 31-112 37-100 35-48 4-48 5 10Z M-35-48 L-48-6 M35-48 L46-6','#798c94'],
['M-6 8 L-9-25 -21-27 -23-118 20-122 24-27 8-25 6 8Z','#cbc3ad'],
['M-5 9 L-6-22 -39-28 -42-92 Q-38-101-24-99 L28-99 42-88 37-28 6-22 5 9Z','#8a634e'],
['M-4 8 L-4-49 Q-19-52-19-75 L-29-76 Q-41-78-42-98 L-42-116 -31-116 -30-92 -19-93 -20-125 Q-19-147-5-149 Q12-150 14-127 L13-97 26-99 25-119 36-120 38-94 Q35-81 14-82 L13-59 4-49 4 8Z','#6e9d64'],
['M-4 10 L-7-20 -36-22 -31-118 27-121 35-22 6-20 4 10Z','#e6bd47'],
['M-3 8 L-3-84 Q-25-103-41-91 Q-29-124 0-132 Q30-123 41-91 Q19-102 3-84 L3 8Z','#637b94'],
['M-3 8 L-4-80 Q-28-81-25-105 Q-20-119 8-110 L10-126 Q-12-132-5-147 Q8-161 27-146 L37-143 25-135 20-114 Q32-87 4-80 L3 8Z','#dd8090'],
['M-4 8 L-4-104 -26-104 -43-122 -43-150 -26-168 25-168 43-150 43-122 25-104 4-104 4 8Z','#c45b4a'],
['M-4 8 L-5-63 -25-71 -24-118 Q-18-137 8-127 L25-108 23-67 6-63 5 8Z','#918359'],
['M-5 8 L-8-33 -22-82 -27-121 29-121 21-79 8-33 5 8Z','#a3639d'],
['M-4 9 L-5-63 Q-29-71-25-93 Q-22-117 0-117 Q25-116 26-93 Q27-70 5-63 L4 9Z','#b0bcb4'],
['M-6 9 Q-17-6-12-37 L-16-108 Q-15-139-3-143 Q11-141 15-116 L11-30 Q15-4 6 9Z','#d5a45a'],
['M-4 9 L-5-110 -38-111 -40-145 36-145 40-113 5-110 4 9Z','#747f85'],
['M-5 9 L-4-42 -19-36 -10-63 Q-27-77-18-109 L-24-128 -9-121 -1-194 5-125 Q34-113 16-69 L26-45 5-43 5 9Z','#75a6b1'],
['M-5 9 L-6-50 -22-51 -22-62 -4-66 -4-80 Q-31-87-24-109 L-39-111 -42-131 -27-130 -27-140 27-140 27-130 42-131 39-111 24-109 Q30-88 4-80 L4-66 22-62 22-51 6-50 5 9Z','#d2a746'],
['M-3 8 L-4-123 -27-126 -37-160 Q-14-175 30-162 L37-128 4-123 3 8Z','#b4aa87'],
['M-3 8 L-3-150 Q-15-157-11-173 Q-5-184 6-177 Q20-164 3-150 L3 8Z','#899094'],
['M-4 9 L-6-94 -17-100 -17-157 8-158 16-151 16-107 6-94 4 9Z','#70adad'],
['M-4 9 L-6-24 -29-30 -29-119 25-125 31-117 31-30 6-24 4 9Z','#944f4c'],
['M-4 9 L-4-66 -15-79 -20-104 -11-126 10-130 26-111 25-87 4-66 4 9Z','#b8afbf'],
['M-5 9 L-6-28 -30-31 -38-115 16-132 36-47 7-28 5 9Z','#e7ddc5'],
['M-5 9 L-6-42 -13-46 -13-56 -5-60 -5-162 Q0-176 5-162 L5-60 13-56 13-46 6-42 5 9Z','#8ec9b7']];
const families=['Unarmed','Blunt','Kitchen','Heavy','Office','Pole','Absurd','Improvised','Pole','Blade','Kitchen','Blunt','Household','Pole','Blade','Heavy','Office','Office','Absurd','Improvised','Pole','Party','Pole','Household','Party','Kitchen','Kitchen','Heavy','Absurd','Blunt','Household','Pole','Household','Office','Party','Office','Blade'];
LB.weapons=names.slice(1).map((name,i)=>{const id=i+1;const heavy=[3,15,17,23,27].includes(id),pole=[5,8,13,20,22,28,30,31].includes(id);return{id,name,family:families[id],damage:heavy?18:7+(id*7%10),reach:pole?122:heavy?84:58+(id*13%45),weight:heavy?1.65:pole?1.2:.8+(id%3)*.15,speed:heavy?.78:1.05-(id%4)*.06,knockback:heavy?65:25+(id%5)*8,path:shapes[id][0],color:shapes[id][1]}});
LB.weaponById=id=>LB.weapons[id-1]||null;
LB.drawWeapon=function(c,id,t=0){const w=LB.weaponById(id);if(!w)return;c.save();LB.path(c,w.path,w.color,LB.ink,2.6);const shade=LB.shade(w.color,-30);LB.line(c,[-2,2,-2,-30],shade,2);if([1,10,26].includes(id)){for(let y=-48;y>-112;y-=18)LB.path(c,`M-6 ${y} Q0 ${y-5} 7 ${y-1}`,null,shade,2)}if(id===2){LB.ellipse(c,-2,-93,25,28,null,'#343e44',3);LB.path(c,'M-18-108 Q-7-119 7-114',null,'#a4aeaa',2)}if(id===3){LB.path(c,'M-12-82 L12-82 12-54 -12-54Z','#e9dbb8',null);LB.text(c,'FIRE',0,-68,9,LB.ink,'Arial','center');LB.path(c,'M10-109 Q38-120 27-56',null,'#272c2b',5)}if([5,9,13,25,27,36].includes(id))LB.line(c,[0,-65,3,-107],'#e2e2cb',2);if([7,19].includes(id)){LB.path(c,id===7?'M-17-50 L17-50 22-35 -21-35Z':'M-22-79 L22-79 22-49 -22-49Z','#e9e2bd',null);if(id===19)LB.text(c,'!',0,-54,24,LB.ink,'Arial','center')}if(id===6){LB.ellipse(c,6,-128,2.5,3,'#fff8d7',LB.ink,1);LB.ellipse(c,7,-128,1,2,LB.ink);LB.path(c,'M-10-62 Q8-69 8-49 Q-5-45-10-62',null,'#b88335',2)}if([16,33,35].includes(id)){for(let y=-110;y<-35;y+=12)LB.line(c,[-19,y,16,y],id===16?'#7c7f77':'#a89e86',1.5)}if(id===18){for(let y=-125;y<-67;y+=14){LB.line(c,[-16,y,-23,y-4],'#d9deab',2);LB.line(c,[10,y,18,y-5],'#d9deab',2)}}if(id===22)LB.text(c,'STOP',0,-132,14,'#f8e4cf','Arial','center');if(id===28){LB.ellipse(c,4,-115,3,4,'#f7eed8',LB.ink,1);LB.line(c,[2,-105,12,-102,8,-88],LB.ink,2)}if(id===29)LB.text(c,'#2',0,-112,14,'#73512b','Arial','center');if(id===32)for(let y=-150;y<-105;y+=7)LB.line(c,[-16,y,9,y],'#efe6c8',3);if(id===34){for(let y=-117;y<-79;y+=10)LB.line(c,[-15,y,22,y],'#e8e1cc',1.3);for(let x=-9;x<20;x+=9)LB.line(c,[x,-123,x,-77],'#686376',1.3)}if(id===36){c.shadowColor='#6effcb';c.shadowBlur=12;LB.line(c,[0,-68,0,-160],'#b2ffe0',5)}c.restore()};
})();
