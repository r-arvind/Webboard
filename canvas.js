//canvas element and 2-d context

canvas = document.getElementById('mycanvas');
context = canvas.getContext('2d');

//setting height and width of the canvas

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//the attributes of the pen

attribute = {
  width:5,                            //width of ink
  color:'rgb(0,0,0)',                //color of ink
  style: pen                         //style of ink [pen,calligraphy]
}

//variable initializations (dragging tells the state of pen)(startlocation stores the location of mouse click)

var dragging = false;
var startLocation;

// calligraphic pen like style (simple strokes of line)

function calligraphy(position){
  context.strokeStyle = attribute.color;
  context.lineWidth = attribute.width;
  context.beginPath();
  context.moveTo(startLocation.x,startLocation.y);
  context.lineTo(position.x,position.y);
  context.closePath();
  context.stroke();
  startLocation = position;
}

//simple pen style (continuous dots)

function pen(position){

  context.strokeStyle = attribute.color;  
  context.fillStyle = attribute.color;
  context.lineWidth = attribute.width;
  context.lineTo(position.x,position.y);
  context.stroke();
  context.beginPath();
  context.arc(position.x,position.y,attribute.width/2,0,Math.PI*2);
  context.fill();
  context.beginPath();
  context.moveTo(position.x,position.y)
}

//function for getting the location of mouse pointer

function getPosition(event){
  var x = event.clientX - canvas.getBoundingClientRect().left;
  var y = event.clientY - canvas.getBoundingClientRect().top;
  return {x:x,y:y};
}

//stores the location of mouseclick in the start location variable

function dragstart(event){
  dragging = true;
  startLocation = getPosition(event);
  //attribute.style(position);
}

//draws the line as the mouse gets dragged

function drag(event){
  var position;
  if(dragging === true){
    position = getPosition(event) ;
    attribute.style(position);
  }
}

//stops the drawing when the mouse is lifted

function dragstop(event){
  dragging = false;
  context.beginPath();
}

//adding the function to their respective events

function init() {
  canvas.addEventListener('mousedown',dragstart);
  canvas.addEventListener('mouseup',dragstop);
  canvas.addEventListener('mousemove',drag);
}

//adding all of them to the html on load

window.addEventListener('load',init)

