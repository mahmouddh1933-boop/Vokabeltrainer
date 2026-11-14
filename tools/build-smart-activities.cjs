/* Explicitly reviewed conversions; no learner text is evaluated or sent to a service. */
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const norm=s=>s.normalize('NFD').replace(/\p{M}/gu,'').replace(/ـ/g,'');
const label=q=>q.prompt.match(/«([^»]+)»/)?.[1]||q.prompt.replace(/^[^:]+:\s*/,'');
const configs={workbooks:{},exams:{}},inventory=[];
function spec(tasks,kind,labels){
 if(!tasks.every(q=>q.kind==='choice'))throw Error('Only fixed-choice tasks can be converted.');
 if(kind==='match'&&new Set(tasks.map(q=>q.answer)).size!==tasks.length)throw Error('Matching must be one-to-one.');
 let targets=kind==='match'?[...new Set(tasks.map(q=>q.answer))]:[...new Set(tasks.flatMap(q=>q.options))];
 if(kind==='classify'&&targets.some(v=>norm(v)==='اسم'))targets.sort((a,b)=>['اسم','فعل','حرف'].indexOf(norm(a))-['اسم','فعل','حرف'].indexOf(norm(b)));
 const items=tasks.map(q=>({id:q.id,label:labels?.[q.id]||label(q)}));
 for(const item of items)if(items.some(other=>other.id!==item.id&&other.label===item.label))item.label=tasks.find(q=>q.id===item.id).prompt;
 return {kind,items,targets:targets.map(value=>({value,label:value}))};
}
const groups=[
 ['youth-two','youth-two-data','youth-training-two.html',{
  'a-p01-b1':'classify','a-p02-b1':'match','a-p03-b1':'classify','a-p05-b1':'classify','a-p07-b1':'match','a-p08-b2':'classify',
  'b-p09-b1':'match','b-p12-b1':'match','c-p17-b1':'classify','c-p20-b1':'match','c-p24-b2':'classify','d-p25-b1':'match','d-p25-b2':'match','d-p28-b2':'match'}],
 ['youth-book-two-part-one','youth-book-two-part-one-data','youth-book-two-part-one.html',Object.fromEntries([1,2,3,4,5,6].map(n=>['u'+n+'-vocabulary','match']))]
];
for(const [key,module,page,selected]of groups){const data=require(path.join(root,'js',module+'.js'));configs.workbooks[key]={};for(const [id,kind]of Object.entries(selected)){const a=data.activities.find(a=>a.id===id);if(!a)throw Error(id);const labels=kind==='match'&&!['a-p02-b1','b-p12-b1','c-p20-b1'].includes(id)?Object.fromEntries(a.tasks.map(q=>[q.id,q.prompt.replace(/^اختر الكلمة الموافقة للتعريف:\s*/, '')])):undefined;configs.workbooks[key][id]=spec(a.tasks,kind,labels);inventory.push({page,id,title:a.title,kind,tasks:a.tasks.length});}}
const exams=require(path.join(root,'data/exams/bank.json'));
for(const exam of exams.exams){configs.exams[exam.id]={};exam.sections.forEach((section,index)=>{
 if(!section.tasks.every(q=>q.kind==='choice'))return;
 const answers=new Set(section.tasks.map(q=>q.answer)),options=new Set(section.tasks.flatMap(q=>q.options));
 const title=norm(section.title);let kind=null;
 if(title.includes('اسم وفعل وحرف')||title.includes('اسم او فعل او حرف')||title.includes('نوع الجملة')||title.includes('الجملة الاسمية والفعلية'))kind='classify';
 else if(section.tasks.length>=4&&answers.size===section.tasks.length&&options.size===section.tasks.length&&(/اصل|الاضداد|معاني|المعاني|مفردات/.test(title)))kind='match';
 if(!kind)return;
 configs.exams[exam.id][index]=spec(section.tasks,kind);inventory.push({page:'exams.html',exam:exam.id,section:index,title:section.title,kind,tasks:section.tasks.length});
});}
inventory.push({page:'book-level-two.html',title:'تصنيف الكلمات حسب الحرف الأول',kind:'classify',lessons:28,tasks:168});
const data={version:1,...configs,inventory};fs.writeFileSync(path.join(root,'data/smart-activities.json'),JSON.stringify(data,null,2)+'\n');fs.writeFileSync(path.join(root,'js/smart-activities-data.js'),'window.SmartActivityCatalog='+JSON.stringify(data)+';\n');console.log('Interactive blocks:',inventory.length,'plus 27 additional letter lessons; question tasks:',inventory.reduce((n,x)=>n+x.tasks,0));
