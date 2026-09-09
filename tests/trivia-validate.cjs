'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const context={window:null,console,Math};context.window=context;vm.createContext(context);
for(const file of ['js/core.js','js/trivia.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file}).runInContext(context);
const L=context.LB;
assert.equal(L.trivia.length,1000);assert.equal(new Set(L.trivia.map(q=>q.prompt)).size,1000);
const counts={};
const checks={
 Addition:q=>{const [,a,b]=q.prompt.match(/What is (\d+) \+ (\d+)\?/);return Number(a)+Number(b)},
 Subtraction:q=>{const [,a,b]=q.prompt.match(/What is (\d+) − (\d+)\?/);return Number(a)-Number(b)},
 Multiplication:q=>{const [,a,b]=q.prompt.match(/What is (\d+) × (\d+)\?/);assert(Number(a)<=10&&Number(b)<=10);return Number(a)*Number(b)},
 Division:q=>{const [,a,b]=q.prompt.match(/What is (\d+) ÷ (\d+)\?/);assert.equal(Number(a)%Number(b),0);assert(Number(a)<=100&&Number(b)<=10);return Number(a)/Number(b)},
 Counting:q=>Number(q.prompt.match(/after (\d+)/)[1])+1,
 Money:q=>{const [paid,price]=[...q.prompt.matchAll(/\$(\d+)/g)].map(m=>Number(m[1]));assert(paid<=20&&price<=10);return paid-price},
 Doubles:q=>Number(q.prompt.match(/double (\d+)/)[1])*2,
 Halves:q=>Number(q.prompt.match(/half of (\d+)/)[1])/2,
 Computing:q=>{const n=[...q.prompt.matchAll(/\d+/g)].map(m=>Number(m[0]));return n[0]+n[1]},
 'Scientific units':q=>Number(q.prompt.match(/in (\d+) metres/)[1])*100,
 Logic:q=>Number(q.prompt.match(/have (\d+) books/)[1])-2,
 Wordplay:q=>q.prompt.match(/word ([A-Z]+)\?/)[1].length,
 'Everyday counting':q=>Number(q.prompt.match(/are (\d+) unlit/)[1])-3
};
let checked=0;
for(const q of L.trivia){counts[q.category]=(counts[q.category]||0)+1;assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.equal(q.choices.filter(c=>c===q.answer).length,1);assert(q.explanation);assert(!/factorial|hypotenuse|nonnegative remainder|base \d|aₙ|clock hands|letter arrangements|unsigned values|\^|³/.test(q.prompt));if(checks[q.category]){assert.equal(Number(q.answer),checks[q.category](q),q.prompt);assert(Number.isInteger(Number(q.answer)));assert(Number(q.answer)>=0);checked++}}
for(const category of ['Addition','Subtraction','Multiplication','Division','Counting','Money','Doubles','Halves'])assert.equal(counts[category],100);
const used=new Set();for(let i=0;i<1000;i++){const q=L.Trivia.choose();assert(!used.has(q.id));used.add(q.id)}
console.log('PASS Exactly 1000 unique valid trivia questions',JSON.stringify(counts));
console.log('PASS Independently checked answers for all '+checked+' arithmetic and counting questions');
console.log('PASS Complex maths removed; multiplication uses 1–10 and division is exact');
console.log('PASS Four unique choices per question, one correct answer, and no repeated draw before deck exhaustion');
