//canvas element and 2-d context

canvas = document.getElementById('mycanvas');
context = canvas.getContext('2d');

//setting height and width of the canvas

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



//the attributes of the pen

attribute = {
  width:10,                         //width of ink
  color:'#000000',                //color of ink
  style: pen                     //style of ink [pen,calligraphy]
};

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
function getpositionmouse(event){
  var x = event.clientX - canvas.getBoundingClientRect().left;
  var y = event.clientY - canvas.getBoundingClientRect().top;
  return {x:x,y:y};
}

//function for getting the location of touch
function getpositiontouch(event) {
  if(event.touches) {
      if (event.touches.length == 1) { // Only deal with one finger
          var touch = event.touches[0]; // Get the information for finger #1
          touchX=touch.pageX-touch.target.offsetLeft;
          touchY=touch.pageY-touch.target.offsetTop;
      }
  }
  return {x:touchX,y:touchY};
}

/////////////////////////    For Non-Touch Devices     ////////////////////////////// 

//stores the location of mouseclick in the start location variable
function dragStartMouse(event){
  dragging = true;
  startLocation = getpositionmouse(event);
  attribute.style(startLocation);
}
//draws the line as the mouse gets dragged
function dragMouse(event){
  var position;
  if(dragging === true){
    position = getpositionmouse(event) ;
    attribute.style(position);
  }
}
//stops the drawing when the mouse is lifted
function dragStopMouse(event){
  dragging = false;
  context.beginPath();
}


/////////////////////////    For Touch Devices     ////////////////////////////// 

//stores the location of mouseclick in the start location variable
function dragStartTouch(event){
  dragging = true;
  startLocation = getpositiontouch(event);
  attribute.style(position);
}
//draws the line as the mouse gets dragged
function dragTouch(event){
  var position;
  if(dragging === true){
    position = getpositiontouch(event) ;
    attribute.style(position);
  }
}
//stops the drawing when the mouse is lifted
function dragStopTouch(event){
  dragging = false;
  context.beginPath();
}

//////////////////////////////////////////////////////////////////////////////////


//adding the function to their respective events

function init() {

  //touch events
  canvas.addEventListener('touchstart',dragStartTouch);
  canvas.addEventListener('touchend',dragStopTouch);
  canvas.addEventListener('touchmove',dragTouch);
  //mouse events
  canvas.addEventListener('mousedown',dragStartMouse);
  canvas.addEventListener('mouseup',dragStopMouse);
  canvas.addEventListener('mousemove',dragMouse);
}

//adding all of them to the html on load
window.addEventListener('load',init);

window.addEventListener('resize',function(){
  //A copy of the canvas in memory
/*
  var MemCanvas = document.createElement('canvas');
  var MemCtx = MemCanvas.getContext('2d');
  MemCanvas.width = canvas.width;
  MemCanvas.height =canvas.height;
  MemCtx.drawImage(canvas, 0, 0);
  var widthRatio = window.innerWidth/canvas.width;
  var heightRatio = window.innerHeight/canvas.height;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  MemCtx.scale(widthRatio, heightRatio);
  context.drawImage(MemCanvas, 0, 0);*/

  var image = context.getImageData(0,0,canvas.width,canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.putImageData(image,0,0);

}); 



//////////////////////    Miscellaneous Functions    ///////////////////////////


//function for erasing the whole canvas
function clearScreen(){
  context.clearRect(0,0,canvas.width,canvas.height);
}


//Eraser
function eraser(){
  attribute.color = '#ffffff';
}

//color picker
function pick(){ 
  attribute.color = document.getElementById('pick').value;
  return document.getElementById('pick').value;
}

//Pencil
function pencil(){
  attribute.color = pick();
}

//ColorFill
function colorfill(){
  attribute.color = pick();
  context.fillRect(0,0,canvas.width,canvas.height,pick());
}

//saving the image
function save(elem){
  elem.href = canvas.toDataURL();
  elem.download = "mypainting.png";
}




