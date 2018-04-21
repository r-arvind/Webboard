//canvas element and 2-d context
canvas = document.getElementById('mycanvas');
context = canvas.getContext('2d');

//setting height and width of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//making the background white (initially its transparent)
context.fillStyle = 'white';
context.fillRect(0,0,canvas.width,canvas.height);


//the attributes of the canvas

attribute = {
  width:7,
  pencilWidth: 10,
  eraseWidth: 30,                //width of ink
  color:'#0f0f0f',              //color of ink
  style: bezier,
  active: 'pencil'                   //style of ink [pen,calligraphy]
};


//an object for saving the pages
pages = {};

//variable initializations
var prev_color = "";      //when a person changes from pen to eraser, this variable remembers the pen color
var dragging = false;     //this variable is true when mouse is being dragged
var startLocation;        //when momuse button is clicked, this object stores the position
var points = [ ];        //list of points for drawing quadratic curves



///////////////////////    Various Canvas algorithms for the writing part  //////////////////////////////


// calligraphic pen like style (simple strokes of line)
function calligraphy(position){
  context.strokeStyle = attribute.color;
  context.lineJoin = context.lineCap = 'round';  
  context.lineWidth = attribute.width;
  context.beginPath();
  context.moveTo(startLocation.x,startLocation.y);
  context.lineTo(position.x,position.y);
  context.closePath();
  context.stroke();
  startLocation = position;
}

//simple pen style (continuous dots joined by lines)
function pen(position){

  context.strokeStyle = attribute.color;
  context.lineJoin = context.lineCap = 'round';  
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

//using quadratic curves to make sharp edges smooth
function bezier(position){

  context.lineWidth = attribute.width;
  context.lineJoin = context.lineCap = 'round';
  function midPointBtw(p1, p2) {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2
      };
    }  
  points.push({ x: position.x, y: position.y });
  var p1 = points[0];
  var p2 = points[1];
  context.beginPath();
  context.moveTo(p1.x, p1.y);
  for (var i = 1, len = points.length; i < len; i++) {
      var midPoint = midPointBtw(p1, p2);
      context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      p1 = points[i];
      p2 = points[i+1];
  }
  context.moveTo(p1.x, p1.y);
  context.stroke();
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

  if( attribute['style'] == bezier){
    points.push({ x: startLocation.x, y: startLocation.y });
  }
  else{
    attribute.style(startLocation);
  }
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
  if(attribute['style'] == bezier){
    points.length = 0;
  }
  else{
    context.beginPath();
  }
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
  //set slider
  setSlider(attribute.width);
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
  if(canvas.height > window.innerHeight){
    canvas.height = window.innerHeight;
  }
}

//Eraser
function eraser(elem){
  attribute['active'] = 'eraser';
  removeActive();
  elem.classList.add('is-active');
  sliderMaxMin(10,50);
  attribute.width = attribute.eraseWidth;
  setSlider(attribute.eraseWidth);
  if(attribute.color !== "#ffffff")
    prev_color = attribute.color;
  attribute.color = '#ffffff';
}

//Pencil
function pencil(elem){

  attribute['active'] = 'pencil';
  removeActive();
  elem.classList.add('is-active');
  sliderMaxMin(1,30);
  attribute.width = attribute.pencilWidth;
  setSlider(attribute.width);
  attribute.color = prev_color;
  attribute.color = pick();
}

//ColorFill
function colorfill(){
  context.fillStyle = attribute.color;
  context.fillRect(0,0,canvas.width,canvas.height);
}

//Save the Webboard as pdf
function save(){
  savepage();
  var pdf = new jsPDF({orientation:'landscape', unit: 'mm',format:'a3'});
  var key1 = 0;
  for (key in pages){
    var dataURL = pages[key];
    pdf.addImage(dataURL, 'JPEG',0,30);
    pdf.addPage();
  }
  pdf.save('webboard.pdf');
}

function setSlider(val){
  var slider = document.querySelector('.slider');
  slider.value = val;
}

function getSlider(){
  var slider = document.querySelector('.slider');
  return slider.value;
}

function sliderMaxMin(min,max){
  var slider = document.querySelector('.slider');
  slider.max = max;
  slider.min = min;
}

function changeObjSize(){
  if(attribute['active'] === 'pencil'){
    attribute.width = getSlider();
    attribute.pencilWidth = getSlider();
  }
  if (attribute['active'] == 'eraser'){
    attribute.eraseWidth = getSlider();
    attribute.width = getSlider();
  }
}

function removeActive(){
  var active = Array.prototype.slice.call(document.querySelectorAll('.is-active'));
  active.forEach(function(element){
    if(element.classList.contains('is-active')){
        element.classList.remove('is-active');
    }
});
}

///////////////////////////Functions for changing pages/////////////////////////////////

//getting current page number
function getPageNo(){
  var classname = canvas.className;
  var pageno = classname.substr(6);
  return pageno;
}

//converting dataurl to image and drawing image on canvas
function dataToCanvas(url){

  var img = new Image;
  img.src = url;
  img.onload = function(){
    context.drawImage(img,0,0);
  };
}

//saving a page in the dictionary
function savepage(){
  var page = getPageNo();
  pages[page] = canvas.toDataURL();
}

//going to the next page
function nextPage(){
  var pageno = getPageNo();
  var total = Object.keys(pages).length;
  var next = (Number(pageno) + 1).toString();
  savepage();
  canvas.className = 'canvas' + next;
  if(next in pages){
    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height);
    dataToCanvas(pages[next]);
    setPageNo(next,total);
  }
  else{
    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height);
    setPageNo(next,next);
  }
}

//going to the previous page
function prevPage(){
  var pageno = getPageNo();
  var total = Object.keys(pages).length;
  var prev = (Number(pageno) - 1).toString();
  if(prev>0){
    savepage();
    canvas.className = 'canvas' + prev;
    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height);
    dataToCanvas(pages[prev]);
    setPageNo(prev,total);
  }
}

//////////////////////// different colors  and modal//////////////////////////////


// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "None";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function changecolor(a)
{
  attribute['active'] = 'pencil';
  attribute.color = a;
  modal.style.display = "none";
     
}

function setPageNo(page, total) {
  savepage();
  var x = document.getElementsByClassName("page")[0];
  x.innerHTML = 'Page ' +(page.toString() + ' of ' + ((total.toString())));
}


function extendPage(){
  var image = context.getImageData(0,0,canvas.width,canvas.height);
  canvas.width = canvas.width;
  canvas.height = canvas.height + window.innerHeight;
  context.fillStyle = 'white';
  context.fillRect(0,0,canvas.width,canvas.height);
  context.putImageData(image,0,0);
}

function activateModal(){
  document.querySelector('.modal').classList.add('is-active');
}

function closeModal(){
  document.querySelector('.modal').classList.remove('is-active');
  
}

