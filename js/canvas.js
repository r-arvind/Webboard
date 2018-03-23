//canvas element and 2-d context

canvas = document.getElementById('mycanvas');
context = canvas.getContext('2d');

//setting height and width of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//making the background white (initially its transparent)
context.fillStyle = 'white';
context.fillRect(0,0,canvas.width,canvas.height);

//the attributes of the pen

attribute = {
  width:10,                         //width of ink
  color:'#0f0f0f',                //color of ink
  style: pen                    //style of ink [pen,calligraphy]
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
  console.log(x +' : ' + y);
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

  var image = context.getImageData(0,0,canvas.width,canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.fillStyle = 'white';
  context.fillRect(0,0,canvas.width,canvas.height);
  context.putImageData(image,0,0);

}); 



//////////////////////    Miscellaneous Functions    ///////////////////////////


//function for erasing the whole canvas
function clearScreen(){
  context.fillStyle = 'white';
  context.fillRect(0,0,canvas.width,canvas.height);
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
  context.fillStyle = pick();
  context.fillRect(0,0,canvas.width,canvas.height);
}

//saving the image
function save(elem){
  elem.href = canvas.toDataURL();
  elem.download = "mypainting.png";
}


/*
function writeText(text,type){
  context.font = '48px Helvetica';
  context.fillStyle = pick();
  context.strokeStyle = pick();
  if(type == 'fill'){

    context.fillText(text, 50,50);

  }
  if(type == 'stroke'){
    context.lineWidth = 1;
  context.strokeText(text, 50, 50);
  context.lineWidth = attribute.width;
  }
  
}

function editImage(){
  var img = new Image();
  img.src = 'me@dewas2.jpeg';
  context.drawImage(img,0,0);
}
*/






