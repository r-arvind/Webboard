function Page() {
    this.strokeList = []
    this.startTime = Date.now();
    this.endTime = Date.now();
}
Page.prototype.clear = function() {
    this.strokeList = [];
}

var sessionObject = {
    "sessionStartTime": Date.now(),
    "sessionEndTime": Date.now(),
    "pages": [new Page()],
}

var ratio = Math.sqrt(2);
var resY = 800;
var resX = 1130;
// 1130 X 800
// Math.sqrt(2) = 1130 / 800

var boardArea = {
    canvas: document.getElementById("mycanvas"),
    temp_canvas: document.getElementById("tmp_canvas"),
    page_extension: 0,
    focus_page: 0,
    currentStroke: undefined,
    currentPageIndex: 0,
    mouseX: 0,
    mouseY: 0,
    width: 0,
    height: 0,
    mouseDown: false,
    mouseDownX: 0,
    mouseDownY: 0,
    shiftDown: false,
    scale: 0,
    margin_x: 0,
    margin_y: 0,
    DPR: 1,

    setup: function() {
        this.size();
        this.temp_context = this.temp_canvas.getContext("2d");
        this.context = this.canvas.getContext("2d");

        this.mouseDown = false;
        this.shiftDown = false;
        render();
    },
    size: function() {

        this.DPR = window.devicePixelRatio || 1;
        boardArea.width = document.getElementById("sketch").clientWidth * this.DPR;
        boardArea.height = window.innerHeight * this.DPR;
        this.canvas.width = boardArea.width;
        this.canvas.height = boardArea.height;
        this.canvas.style.width = boardArea.width / this.DPR;
        this.canvas.style.height = boardArea.height / this.DPR;

        this.temp_canvas.width = boardArea.width;
        this.temp_canvas.height = boardArea.height;
        this.temp_canvas.style.width = boardArea.width / this.DPR;
        this.temp_canvas.style.height = boardArea.height / this.DPR;


        // Currently Forcing height to fit screen - necessary for extending page
        // if (boardArea.width / boardArea.height >= ratio) {
        this.scale = boardArea.height / resY;
        this.margin_x = (boardArea.width - boardArea.height * ratio) / 2;
        this.margin_y = 0;
        // } else {
        //     this.scale = boardArea.width / resX;
        //     this.margin_y = (boardArea.height - boardArea.width / ratio) / 2;
        //     this.margin_x = 0;
        // }
        // console.log("MARGIN" ,this.margin_x , this.margin_y)
    },
    resize: function() {
        this.size();
        render();
    },

    clear: function() {
        this.context.clearRect(0, 0, boardArea.width, boardArea.height);
        this.temp_context.clearRect(0, 0, boardArea.width, boardArea.height);
    },
    clearContext: function(context) {
        context.clearRect(0, 0, boardArea.width, boardArea.height);
    },
    clearTemp: function() {
        // this.context.clearRect(0, 0, boardArea.width, boardArea.height);
        this.temp_context.clearRect(0, 0, boardArea.width, boardArea.height);
    },
    copyTemp: function() {
        this.context.drawImage(this.temp_canvas, 0, 0);
        this.clearTemp();
    },
}

//the boardAttributess of the canvas

boardAttributes = {
    width: 1,
    pencilWidth: 4,
    eraseWidth: 30, //width of ink
    color: '#000', //color of ink
    prev_color: '#000',
    // style: bezier, // commented for now
    // active: 'pencil' //style of ink [pen,calligraphy] // commented for now
};


var points = []; //list of points for drawing quadratic curves


///////////////////////    Various Canvas algorithms for the writing part  //////////////////////////////

//using quadratic curves to make sharp edges smooth
// function bezier(position) {
//
//     boardArea.temp_context.strokeStyle = boardAttributes.color;
//     boardArea.temp_context.lineJoin = boardArea.temp_context.lineCap = 'round';
//     boardArea.temp_context.fillStyle = boardAttributes.color;
//     boardArea.temp_context.lineWidth = boardAttributes.width;
//
//     function midPointBtw(p1, p2) {
//         return {
//             x: p1.x + (p2.x - p1.x) / 2,
//             y: p1.y + (p2.y - p1.y) / 2
//         };
//     }
//     boardArea.currentStroke.points.push(position);
//     boardArea.temp_context.fillStyle = 'white';
//     boardArea.clearTemp();
//     var points = boardArea.currentStroke.points;
//     var p1 = points[0];
//     var p2 = points[1];
//     boardArea.temp_context.beginPath();
//     boardArea.temp_context.moveTo(p1.x, p1.y);
//     for (var i = 1, len = points.length; i < len; i++) {
//         var midPoint = midPointBtw(p1, p2);
//         boardArea.temp_context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
//         p1 = points[i];
//         p2 = points[i + 1];
//     }
//     boardArea.temp_context.lineTo(p1.x, p1.y);
//     boardArea.temp_context.stroke();
// }

//adding the function to their respective events

function init() {

    boardArea.setup();

    setupListeners();
    //set slider
    setSlider(boardAttributes.width);
}






//////////////////////    Miscellaneous Functions    ///////////////////////////


//function for erasing the whole canvas
function clearScreen() {
    if (boardArea.page_extension != 0)
        prevPage();

	// setTimeout required because prevPage is not rendered otherwise
    setTimeout(function() {
        if (confirm("This Page will be cleared. The action cannot be undone.")) {
            sessionObject.pages[boardArea.currentPageIndex].clear();
            render();
        }
    }, 20)

}

//Eraser
function eraser(elem) {
    boardAttributes['active'] = 'eraser';
    removeActive();
    elem.classList.add('is-active');
    sliderMaxMin(10, 50);
    boardAttributes.width = boardAttributes.eraseWidth;
    setSlider(boardAttributes.eraseWidth);
    if (boardAttributes.color !== "#ffffff")
        boardAttributes.prev_color = boardAttributes.color;
    boardAttributes.color = '#ffffff';
}

//Pencil
function pencil(elem) {

    boardAttributes['active'] = 'pencil';
    removeActive();
    elem.classList.add('is-active');
    sliderMaxMin(1, 30);
    boardAttributes.width = boardAttributes.pencilWidth;
    setSlider(boardAttributes.width);
    boardAttributes.color = boardAttributes.prev_color;
    boardAttributes.color = pick();
}

//ColorFill
function colorfill() {
    boardArea.context.fillStyle = boardAttributes.color;
    // boardArea.context.fillRect(0,0,canvas.width,canvas.height);
}

//Save the Webboard as pdf
function save() {
    savepage();
    var pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3'
    });
    var key1 = 0;
    for (key in pages) {
        var dataURL = pages[key];
        pdf.addImage(dataURL, 'JPEG', 0, 30);
        pdf.addPage();
    }
    pdf.save('webboard.pdf');
}

function setSlider(val) {
    var slider = document.querySelector('.slider');
    slider.value = val;
}

function getSlider() {
    var slider = document.querySelector('.slider');
    return slider.value;
}

function sliderMaxMin(min, max) {
    var slider = document.querySelector('.slider');
    slider.max = max;
    slider.min = min;
}

function changeObjSize() {
    if (boardAttributes['active'] === 'pencil') {
        boardAttributes.width = getSlider();
        boardAttributes.pencilWidth = getSlider();
    }
    if (boardAttributes['active'] == 'eraser') {
        boardAttributes.eraseWidth = getSlider();
        boardAttributes.width = getSlider();
    }
}

function removeActive() {
    var active = Array.prototype.slice.call(document.querySelectorAll('.is-active'));
    active.forEach(function(element) {
        if (element.classList.contains('is-active')) {
            element.classList.remove('is-active');
        }
    });
}

///////////////////////////Functions for changing pages/////////////////////////////////

//getting current page number
function getPageNo() {
    var classname = canvas.className;
    var pageno = classname.substr(6);
    return pageno;
}

//converting dataurl to image and drawing image on canvas
function dataToCanvas(url) {

    var img = new Image;
    img.src = url;
    img.onload = function() {
        boardArea.context.drawImage(img, 0, 0);
    };
}

//saving a page in the dictionary
function savepage() {
    var page = getPageNo();
    pages[page] = canvas.toDataURL();
}

//going to the next page
function nextPage() {

    if (boardArea.page_extension) {
        boardArea.page_extension = 0;
    }
    boardArea.currentPageIndex++;
    if (sessionObject.pages.length == boardArea.currentPageIndex) {
        sessionObject.pages.push(new Page());
    }
    render();
    // var pageno = getPageNo();
    // var total = Object.keys(pages).length;
    // var next = (Number(pageno) + 1).toString();
    // savepage();
    // canvas.className = 'canvas' + next;
    // if (next in pages) {
    //     boardArea.context.fillStyle = 'white';
    //     boardArea.context.clearRect(0, 0, canvas.width, canvas.height);
    //     dataToCanvas(pages[next]);
    //     setPageNo(next, total);
    // } else {
    //     boardArea.context.fillStyle = 'white';
    //     boardArea.context.clearRect(0, 0, canvas.width, canvas.height);
    //     setPageNo(next, next);
    // }
}

//going to the previous page
function prevPage() {
    if (boardArea.page_extension) {
        boardArea.page_extension = 0;
        render();
        return;
    }
    if (boardArea.currentPageIndex) {
        boardArea.currentPageIndex--;
        render();
    }

    // var pageno = getPageNo();
    // var total = Object.keys(pages).length;
    // var prev = (Number(pageno) - 1).toString();
    // if (prev > 0) {
    //     savepage();
    //     canvas.className = 'canvas' + prev;
    //     boardArea.context.fillStyle = 'white';
    //     boardArea.context.clearRect(0, 0, canvas.width, canvas.height);
    //     dataToCanvas(pages[prev]);
    //     setPageNo(prev, total);
    // }
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

function changecolor(a) {
    boardAttributes['active'] = 'pencil';
    boardAttributes.color = a;
    modal.style.display = "none";

}

function setPageNo(page, total) {
    savepage();
    var x = document.getElementsByClassName("page")[0];
    x.innerHTML = 'Page ' + (page.toString() + ' of ' + ((total.toString())));
}


function extendPage() {
    if (boardArea.page_extension < .85) {
        boardArea.page_extension += .1;
        if (boardArea.currentPageIndex + 1 == sessionObject.pages.length) {
            sessionObject.pages.push(new Page())
        }
        render();
    } else {

        nextPage();
    }
    // var image = boardArea.context.getImageData(0, 0, canvas.width, canvas.height);
    // canvas.width = canvas.width;
    // canvas.height = canvas.height + window.innerHeight;
    // boardArea.context.fillStyle = 'white';
    // boardArea.context.clearRect(0, 0, canvas.width, canvas.height);
    // boardArea.context.putImageData(image, 0, 0);
}

function activateModal() {
    document.querySelector('.modal').classList.add('is-active');
}

function closeModal() {
    document.querySelector('.modal').classList.remove('is-active');

}
