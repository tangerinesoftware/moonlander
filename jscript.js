// copyright 2007 Jon Schuringa

var lastMut;
var goal = Array();
var showTop=5;
var initRange=4;
var range=initRange;
var pause=true;
var vars=new Array("m","h","v")
var op2s=new Array(" + "," - ","*","/")
var op1s=new Array("Math.log","Math.sqrt","Math.sin","Math.exp")
var colors= new Array("blue","red","green","brown","purple","orange");
var colmod=-1;

var heights=new Array();
var speeds=new Array();
var powers=new Array();
var mass=new Array();
var fuels=new Array();

function clearGraph(){

var i;
for (i=1;i<4;i++){
  ctx = document.getElementById('canvas'+i).getContext('2d');
  ctx.clearRect(0,0,180,120);
  ctx.strokeStyle="gray";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(5,5);
  ctx.lineTo(5,120-1);
  ctx.moveTo(1,120-5);
  ctx.lineTo(160,120-5);
  ctx.stroke();
  }
}


function reset(){
  progs.length=0;
  print(showTop);
}

var somethingDone;

function simplifyRec(nd){

  if (nd.type=="op2"){
    if (nd.left.type=="const" && nd.right.type=="const"){
      var s = toString(nd,0);
      var res= eval(s);
      nd.type="const";
      nd.value=res;
      nd.left=0;
      nd.right=0;
      somethingDone=true;
    }
  }
  if (nd.type=="op1"){
    if (nd.left.type=="const" ){
      var s = toString(nd,0);
      var res= eval(s);
      nd.type="const";
      nd.value=res;
      nd.left=0;
      nd.right=0;
      somethingDone=true;
    }
  }
  if (nd.left) simplifyRec(nd.left);
  if (nd.right) simplifyRec(nd.right);
}


function simplify(root){
  do {
    somethingDone=false;
    simplifyRec(root);
  } while (somethingDone)
}


function enableShow(){
 for (i=0;i<20;i++){
     var el = document.getElementById('abut'+i);
     if (el){
        el.disabled = "";
     }
  }
  document.getElementById('bNew').disabled="";
  document.getElementById('bGo').disabled="";
}
function disableShow(){
  for (i=0;i<20;i++){
     var el = document.getElementById('abut'+i);
     if (el){
        el.disabled = "true";
     }
  }
  document.getElementById('bNew').disabled="true";
  document.getElementById('bGo').disabled="true";
}



var timer;
function ani(i){
    disableShow();
  evalExpr(progs[i].expr,true);
  secc=0;

  colmod = (colmod+1)%colors.length;

  timer =setInterval('draw()',50);
}
var secc=0;


var inter=20;
var inti=0;
function draw(i){


  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.save();

  ctx.clearRect(0,0,150,300);

  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.lineWidth = 1;
  ctx.lineCap = "round";

   ctx.beginPath();
  ctx.moveTo(10,280);
  ctx.lineTo(50,280);
  ctx.stroke();



    ctx.lineWidth = 1;

  var rh = heights[secc] + inti*(heights[secc+1]-heights[secc])/inter;
  if (rh<0) rh=0;
  rh=rh*2;
  var rf = powers[secc] + inti*(powers[secc+1]-powers[secc])/inter;
  var rfu = fuels[secc] + inti*(fuels[secc+1]-fuels[secc])/inter;
  var rs = speeds[secc] + inti*(speeds[secc+1]-speeds[secc])/inter;
  var rm = mass[secc] + inti*(mass[secc+1]-mass[secc])/inter;
//  ctx.save();
  var oy=280-1;
  var ox=20;

  ctx.beginPath();
  ctx.moveTo(ox,oy-rh);
  ctx.lineTo(ox+3,oy-rh);
  ctx.moveTo(ox+20,oy-rh);
  ctx.lineTo(ox+23,oy-rh);

  ctx.moveTo(ox+1,oy-rh);//legs
  ctx.lineTo(ox+5,oy-rh-15);

  ctx.rect(ox+6,oy-30-rh,10,20);
  ctx.moveTo(ox+6,oy-30-rh);// top
  ctx.lineTo(ox+6+5,oy-38-rh);// top
  ctx.lineTo(ox+6+10,oy-30-rh);// top

  ctx.moveTo(ox+21,oy-rh);
  ctx.lineTo(ox+17,oy-rh-15);
  ctx.stroke();

  if (inti+1!=inter){
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  var fire=rf/2;
  var fire2=fire*0.7
  var fire3=fire*0.65
  var tt=ox+7
   ctx.moveTo(tt,oy-10-rh);
   ctx.lineTo(tt+8,oy-10-rh);
   ctx.lineTo(tt+8,oy-10+ fire-rh);

   ctx.lineTo(tt+6,oy-10+ fire2-rh);
   ctx.lineTo(tt+4,oy-10+ fire-rh);
   ctx.lineTo(tt+2,oy-10+ fire2-rh);
   ctx.lineTo(tt  ,oy-10+ fire-rh);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = "orange";
  ctx.fillStyle = "yellow";

   ctx.moveTo(tt+2,oy-10-rh);
   ctx.lineTo(tt+6,oy-10-rh);
   ctx.lineTo(tt+4,oy-10+ fire3-rh);
   ctx.fill();

  }



   /* <tr><td>Height</td><td><div id='mhe'/></td></tr>
<tr><td>Speed</td><td><div id='msp'/></td></tr>
<tr><td>Thrust</td><td><div id='mth'/></td></tr>
<tr><td>Time</td><td><div id='mti'/></td></tr>
<tr><td>Fuel</td><td><div id='mfu'/></td></tr>
<tr><td>Mass</td><td><div id='mma'/></td></tr>*/
   document.getElementById('mhe').innerHTML=rh.toFixed(2);
  document.getElementById('mfu').innerHTML=rfu.toFixed(2);
   document.getElementById('msp').innerHTML=rs.toFixed(2);
  document.getElementById('mth').innerHTML=rf.toFixed(2);
  var time=secc + inti/inter

  document.getElementById('mti').innerHTML= time.toFixed(2);
  document.getElementById('mma').innerHTML= rm.toFixed(0);

  inti++;
  var multi = 10;//120/heights.length;
  if (inti==inter){


  ctx = document.getElementById('canvas1').getContext('2d');
  ctx.strokeStyle=colors[colmod];
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(5+multi*secc,120-5-Math.max(0,heights[secc]));
  ctx.lineTo(5+multi*(secc+1),120-5-Math.max(0,heights[secc+1]));
  ctx.stroke();


  ctx = document.getElementById('canvas2').getContext('2d');
ctx.strokeStyle=colors[colmod];
  ctx.beginPath();
  ctx.moveTo(5+multi*secc,120-5-speeds[secc]*3);
  ctx.lineTo(5+multi*(secc+1),120-5-speeds[secc+1]*3);
  ctx.stroke();

  ctx = document.getElementById('canvas3').getContext('2d');
ctx.strokeStyle=colors[colmod];
  ctx.beginPath();
  ctx.moveTo(10+multi*secc,120-5-powers[secc]);
  ctx.lineTo(10+multi*(secc+1),120-5-powers[secc+1]);
  ctx.stroke();


/*  ctx = document.getElementById('can4').getContext('2d');
ctx.strokeStyle=colors[colmod];
  ctx.beginPath();
  ctx.moveTo(10+multi*secc,120-mass[secc]/50);
  ctx.lineTo(10+multi*(secc+1),120-mass[secc+1]/50);
  ctx.stroke();
  */

    secc++;
    inti=0;
  }
  if (secc>=heights.length-1) {
  clearInterval(timer);
  enableShow()
  }
 // ctx.restore();
}






function node(){
  this.type="var"
  this.value=vars[0]
  this.left=0
  this.right=0
  this.parent=0
}

function createRandomTree(dep,max,min){
  var n=new node()
  var full = document.getElementById('oper').value=="full"
  var what;
  if (dep<min) what="op2"
  else {
    if (dep>max) {
      if (Math.random()>0.5) what="var"; else what="const";
    } else {
      if (Math.random()>0.5) { if (Math.random()>0.7 && full) what= "op1"; else what="op2"; }
      else if (Math.random()>0.5) what="var"; else what="const";
    }
  }
  switch (what){
  case "var":
    n.value=vars[Math.floor(vars.length*Math.random())];break;
  case "const":
    n.value=-10+20*Math.random();break;
  case "op2":
    n.value=op2s[Math.floor(op2s.length*Math.random())];
    n.left=createRandomTree(dep+1,max,min);
    n.left.parent=n;
    n.right=createRandomTree(dep+1,max,min);
    n.right.parent=n;
    break;
  case "op1":
    n.value=op1s[Math.floor(op1s.length*Math.random())];
    n.left=createRandomTree(dep+1,max,min);
    n.left.parent=n;
    n.right=0;
    break;
  }
  n.type=what;
  return n;
}

function toString(root,level){
  if (level>6) return "xxxx";
  switch (root.type){
  case "var":
    return root.value;break;
  case "const":
    return Math.round(100*root.value)/100;break;
  case "op2":
   var r;
   try {
   if (root.left.type=="op2")
     r="("+toString(root.left,level+1)+")"+root.value;
   else
     r=toString(root.left,level+1)+root.value;
   if (root.right.type=="op2")
     r +="("+toString(root.right,level+1)+")"
   else
     r +=toString(root.right,level+1)
     } catch (e){}
   return r;
 case "op1":
   var r;
   try {
    r=root.value+"("
    r +=toString(root.left,level+1)
    r+=")"
   } catch (e){}
   return r;

  }
}

var pcount=0;
function program(){
  this.expr=0;
  this.score=0;
  this.root=0;
  this.id=pcount++;
}

var progs=new Array();
var MAXPROGS=30;


function selectionSort(L){
   var i, minimum, tmp;
   for (i=0; i<L.length-1; i++) {
      minimum = i;
      for(var j = i+1; j < L.length; j++) {
         if(L[j].score < L[minimum].score) minimum = j;
      }
      tmp = L[i];
      L[i] = L[minimum];
      L[minimum] = tmp;
   }
}


function add(root,p,s,from){
   if (isNaN(s)) return;



   var np=new program();
   np.expr=p;
   np.score=s;
   np.root=root;
  if (progs.length<MAXPROGS) {
   simplify(root);
    progs.push(np);
  } else {

    // if from found, replace
     var i;
     // find max
     var m=-1000000;
     var mi=-1;
     var fromFound=false;
     var fromI;
     for (i=0;i<progs.length;i++){
       if (from==progs[i].id) {
         fromFound=true;
         fromI = i;
       }
       if (progs[i].score>m){
         m= progs[i].score;
         mi=i;
       }
     }
     if (fromFound ){
       if (s<progs[fromI].score) {
        simplify(root);
         progs[fromI]=np;
         range=initRange;

       }
     }
     else
     if (s<m) {
      simplify(root);
       progs[mi]=np;
       range=initRange;

     }


       range*=0.99;
       if (range<1.1) range=1.1

     selectionSort(progs);
  }
}

var flip=0;
function print(m,but){
  flip++;
  var dot;
  if (flip%2==0) dot="..."; else dot="";
  var inbetween= "<div style='color:red' id='loader'>busy"+dot+"</div>";
  if (pause) inbetween="<div style='display:none;color:red' id='loader'>busy</div>"

  var s="<table class=\"table\"><tr><td>"+inbetween+"</td><td><b>Score</b></td><td><b>Genetic thrust formula</b></td></tr>";
  var i;
  for (i in progs){
    if (m--==0) break;
    s+="<tr><td><button class=\"btn btn-primary\" disabled id='abut"+i+"' onclick='ani("+i+")'>show</button></td><td><FONT SIZE=-1>";

    s+= progs[i].score.toFixed(4) + "</font></td><td><FONT SIZE=-1>f(v,h,m)=" + progs[i].expr + "</font></td></tr>";
  }
  s+="</table>";
   document.getElementById("dump").innerHTML=s;
}

function copy(nd,level,par){

try {
  var n=new node();
  if (level>6) return n;
 //n=nd;
  n.type=nd.type;
  n.value=nd.value;
  n.parent=par


  if (nd.left!=0) n.left=copy(nd.left,level+1,n); else n.left=0;
  if (nd.right!=0) n.right=copy(nd.right,level+1,n); else n.right=0;
  } catch (e){};
  return n;
}

function copyProg(i){
  var np = new program();
  np.from=progs[i].id;
  np.root = copy(progs[i].root,0,0);
  return np;
}

function count(root,level){
if (level>6) return 0;
  try {
  if (root.type=="const" || root.type=="var") return 1;

  if (root.right==0)
    return 1+count(root.left,level+1);
  else
    return 1+count(root.left,level+1)+count(root.right,level+1);
  } catch (e) {return 1};
}

var stopNode;
var curNode;
var resNode;


function check(nd,par){
  if (par && nd.parent!=par) alert("oh");
  if (nd.left) {
    if (nd.left.parent!=nd) alert("oh");
    check(nd.left,nd);
  }
  if (nd.right) {
    if (nd.right.parent!=nd) alert("oh");
    check(nd.right,nd);
  }
}


function getNode(nd,level){
try {
  if (level>6) return;
  if (stopNode==curNode) resNode=nd;
  curNode++;
  if (nd.left) getNode(nd.left,level+1);
  if (nd.right) getNode(nd.right,level+1);
  } catch (e){}
}

function change(n){
 switch (n.type){
  case "var":
     if (Math.random()<0.3){
        var mul=new node();
        var co=new node();
        co.type="const"
        mul.type="op2"
        mul.value="*"
        co.value=-2+4*Math.random();
        mul.parent=n.parent;

        if (n.parent.left==n) n.parent.left=mul; else n.parent.right=mul;

        mul.left=co;co.parent=mul;
        mul.right=n;n.parent=mul;



     } else {
      n.value=vars[Math.floor(vars.length*Math.random())];
      }
      break;
  case "const":
    n.value=n.value*(-range+2*range*Math.random())+ -range+2*range*Math.random();break;
  case "op2":
    n.value=op2s[Math.floor(op2s.length*Math.random())];break;
  case "op1":
    n.value=op1s[Math.floor(op1s.length*Math.random())];
    break;
  }
}
function mutateOne(p){
 var c=count(p.root,0);
 var m = Math.floor(c*Math.random());
 curNode=0;
 stopNode=m;
 resNode=0;
 getNode(p.root,0);
 if (resNode) change(resNode);

 check(p.root,0);
}

function mutate(){
  //1 pick one
  var mu = copyProg(Math.floor(progs.length*Math.random()));
  // 2. mutate
  mutateOne(mu);
  return mu;
}

function crossover(){
  //1 pick two
  var c1 = copyProg(Math.floor(progs.length*Math.random()));
  var c2 = copyProg(Math.floor(progs.length*Math.random()));
  // 2. cross
 var c=count(c1.root,0)-1;
 var m = 1+Math.floor(c*Math.random());
 curNode=0;
 stopNode=m;
 resNode=0;
 getNode(c1.root,0);
 if (!resNode) return c1;
 var res1=resNode;

 c=count(c2.root,0)-1;
 m = 1+Math.floor(c*Math.random());
 curNode=0;
 stopNode=m;
 resNode=0;
 getNode(c2.root,0);
 if (!resNode) return c1;
 var res2=resNode;

 if (res1.parent.left==res1){
   res1.parent.left=res2;
   res2.parent=res1.parent;
 } else {
   res1.parent.right=res2;
   res2.parent=res1.parent;
 }
 c1.from=-1;
 check(c1.root,0);
 return c1;
}


function genetic(){
  // 1 mutate
  // 2 swap tree
  // 3 mean child
  if (Math.random()<0.80){
    var yo= mutate();
    if (Math.random()<0.5) mutateOne(yo);
    lastMut=true;
    return yo;

    }
  else {
    lastMut=false;
    return crossover();
    }
}


function evalExpr(expr,show){
  var hhM
  var score=0;
  heights.length=0; speeds.length=0;powers.length=0;mass.length=0;fuels.length=0;
  for (hh=0;hh<1;hh++){
    var h=(hh==0)?100:300;
    var v=0;
    var shipm=2000;

    var maxf=20000;
    var fuel=300;
    m=fuel+shipm;
    var g=4;
    var div=420;
    var f=0;
    var sec=0;

    while (h>0){
    if (hh==0 && show) { heights.push(Math.max(0,h)); speeds.push(v); powers.push(f); mass.push(m);fuels.push(fuel) }



    sec++;
    if (sec>100) return 100000;
 try {
      f=eval(expr);
      } catch (e){}
      if (f<0) f=0;
      if (f>100) f=100;
      var force=(f/100)*maxf;
      //if (force>fuel*div) force=fuel*div;
      if (fuel<=0) {
            force=0;
            f=0;
       }
       fuel-=force/div;
       if (fuel<0) fuel=0;

      v=v-force/m+g; h=h-v;
      m=fuel+shipm;


    }
  score+=eval(goal);
   if (hh==0 && show) { heights.push(h); speeds.push(v); powers.push(f); mass.push(m); fuels.push(fuel) }
  if (hh==0 && show) { heights.push(0); speeds.push(v); powers.push(f); mass.push(m);fuels.push(fuel) }
  }

  return score;
}

function onGo(){
  pause=false;
 var el = document.getElementById('bGo');
 if (el) el.disabled = "true";
 el = document.getElementById('bPause');
 if (el) el.disabled = "";
 el = document.getElementById('bNew');
 if (el) el.disabled = "true";
 disableShow();
 var el = document.getElementById('loader');
 if (el) el.style.display = "";

}

function onPause(){
  pause=true;
 var el = document.getElementById('bGo');
 if (el) el.disabled = "";
 el = document.getElementById('bPause');
 if (el) el.disabled = "true";
  el = document.getElementById('bNew');
 if (el) el.disabled = "";
 enableShow();
  var el = document.getElementById('loader');
 if (el) el.style.display = "none";
}

function loop(){
    //document.getElementById("dump").innerHTML+="<b>Loop</b>";
    if (!pause){
      var ttt;
    for (ttt=0;ttt<140;ttt++){
      var np=genetic()
       var expr=toString(np.root,0)
     //  expr=expr.replace(/--/g,"+");


      if (expr.indexOf && expr.indexOf("xxx")>=0){
      } else {



          var score = evalExpr(expr,false);


          //document.getElementById("dump").innerHTML+=expr+"  " +score +"  " +np.from +"<br>";
          add(np.root,expr,score,np.from);
      }
    }
    print(showTop,false)
    }

  setTimeout("loop()",30)
}

function populate(){
  //  document.getElementById("dump").innerHTML+="<b>Loop</b>";

    MAXPROGS= document.getElementById("popSize").value;
    showTop= document.getElementById("showTop").value;


    var X =document.getElementsByName('goal');
    var t;
    for (t=0;t<X.length;t++){
      if (X[t].checked) {
        switch (t){
        case 0: goal="v";break;
        case 1: goal="Math.max(v,5)-5+(300-fuel)/10";break;
        case 2: goal="Math.max(v,5)-5+fuel/10";break;
        case 3: goal="Math.max(v,5)-5+sec/10";break;
        case 4: goal="-v";break;
        case 5: goal=document.getElementById("user").value;break;
        }
      }
    }
    if (goal.length==0){
      alert("Goal cannot be empty");
      return;
    }
    document.getElementById("goaltext").innerHTML= "<div style='color:red'>minimize " + goal +"</div>";


    progs.length=0;
    while (progs.length< MAXPROGS){
      var root=createRandomTree(0,4,2)
      check(root,0);
      var expr=toString(root,0)
      expr=expr.replace(/--/g,"+");
      var score = evalExpr(expr,false);
      add(root,expr,score,-1);
    }
    selectionSort(progs);
    print(showTop,true);
    enableShow();

    var el = document.getElementById('bGo');
     if (el){
        el.disabled = "";
     }




}

//populate();

clearGraph();
loop();
