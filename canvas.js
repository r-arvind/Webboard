canvas = document.getElementById('mycanvas');
context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var dragging=false,startLocation;


function caligraphy(position){
  context.beginPath();
  context.moveTo(startLocation.x,startLocation.y);
  context.lineTo(position.x,position.y);
  context.closePath();
  context.stroke();
  startLocation = position;
}

var dot = function (position){

};


function pen(position){

  context.lineTo(position.x,position.y);
  context.stroke();
  context.beginPath();
  context.arc(position.x,position.y,attributes.width/2,0,Math.PI*2);
  context.fill();
  context.beginPath();
  context.moveTo(position.x,position.y)

}


function getPosition(event){
  var x = event.clientX - canvas.getBoundingClientRect().left;
  var y = event.clientY - canvas.getBoundingClientRect().top;
  return {x:x,y:y};
}


function dragstart(event){
  dragging = true;
  startLocation = getPosition(event);
  caligraphy(position);
}

function drag(event){
  var position;
  if(dragging === true){
    position = getPosition(event) ;
    caligraphy(position);
  }

}

function dragstop(event){
  dragging = false;
  context.beginPath();

}

function init() {
  


  canvas.addEventListener('mousedown',dragstart);
  canvas.addEventListener('mouseup',dragstop);
  canvas.addEventListener('mousemove',drag)
}

attributes = {
  width:10,
  color:'rgb(0,0,0)',
  style: 'free'
}

window.addEventListener('load',init)

