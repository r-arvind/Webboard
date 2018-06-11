/////////////////////////    For Non-Touch Devices     //////////////////////////////

//stores the location of mouseclick in the start location variable
function dragStartMouse(event) {
    boardArea.mouseDown = true;
    var position = getpositionmouse(event);
    boardArea.mouseDownX = position.x;
    boardArea.mouseDownY = position.y;
    boardArea.mouseX = position.x;
    boardArea.mouseY = position.y;
    boardArea.focus_page = getFocusPage(position);

    // This has to be more modularized for other strokes to work together
    boardArea.currentStroke = new PenStroke(resolvePosition(position));

}


//draws the line as the mouse gets dragged
function dragMouse(event) {
    var position = getpositionmouse(event);
    boardArea.mouseX = position.x;
    boardArea.mouseY = position.y;

    if (boardArea.currentStroke) {
        if (getFocusPage(position) != boardArea.focus_page) {
            boardArea.currentStroke.stop(resolvePosition(position))
            dragStartMouse(event);
            return;
        }
        boardArea.currentStroke.update(resolvePosition(position));
        boardArea.clearTemp();
        boardArea.currentStroke.render(boardArea.temp_context, 0, yOffset());
    }
}

//stops the drawing when the mouse is lifted
function dragStopMouse(event) {
    boardArea.mouseDown = false;
    var position = getpositionmouse(event);
    boardArea.mouseX = position.x;
    boardArea.mouseY = position.y;

    if (boardArea.currentStroke){
        boardArea.currentStroke.update(position);
        boardArea.currentStroke.mouseLeave(position);
	}

}


/////////////////////////    For Touch Devices     //////////////////////////////

//stores the location of mouseclick in the start location variable
function dragStartTouch(event) {
    dragging = true;
    startLocation = getpositiontouch(event);
    boardAttributes.style(position);
    points.push({
        x: mouse.x,
        y: mouse.y
    });
}
//draws the line as the mouse gets dragged
function dragTouch(event) {
    var position;
    if (dragging === true) {
        position = getpositiontouch(event);
        boardAttributes.style(position);
    }
}
//stops the drawing when the mouse is lifted
function dragStopTouch(event) {
    dragging = false;
    boardArea.context.beginPath();
    boardArea.context.drawImage(boardArea.temp_canvas, 0, 0);
    boardArea.temp_context.clearRect(0, 0, boardArea.temp_canvas.width, boardArea.temp_canvas.height);
    points = [];
}



//////////////////////////////////////////////////////////////////////////////////



//adding all of them to the html on load
window.addEventListener('load', init);

window.addEventListener('resize', boardArea.resize.bind(boardArea));

function setupListeners() {
    //touch events
    boardArea.temp_canvas.addEventListener('touchstart', dragStartTouch);
    boardArea.temp_canvas.addEventListener('touchend', dragStopTouch);
    boardArea.temp_canvas.addEventListener('touchmove', dragTouch);
    //mouse events
    boardArea.temp_canvas.addEventListener('mousedown', dragStartMouse);
    boardArea.temp_canvas.addEventListener('mouseup', dragStopMouse);
    boardArea.temp_canvas.addEventListener('mouseleave', dragStopMouse);
    boardArea.temp_canvas.addEventListener('mousemove', dragMouse);
}

//function for getting the location of mouse pointer
function getpositionmouse(event) {
    var x = ((event.clientX - boardArea.canvas.getBoundingClientRect().left) * boardArea.DPR - boardArea.margin_x) / boardArea.scale;
    var y = ((event.clientY - boardArea.canvas.getBoundingClientRect().top) * boardArea.DPR - boardArea.margin_y) / boardArea.scale;
    // console.log((event.clientX - boardArea.canvas.getBoundingClientRect().left - boardArea.margin_x)*boardArea.DPR)
    // console.log(x + ' : ' + y);
    return {
        x: x,
        y: y
    };
}

function getFocusPage(pos) {
    if (pos.y > (1 - boardArea.page_extension) * resY)
        return 1;
    return 0;
}

function yOffset() {
    if (boardArea.focus_page) {
        return (1 - boardArea.page_extension) * boardArea.height;
    } else {
        return -boardArea.page_extension * boardArea.height;
    }
}

function resolvePosition(pos) {
    if (boardArea.focus_page)
        return {
            x: pos.x,
            y: pos.y - (1 - boardArea.page_extension) * resY
        }
    return {
        x: pos.x,
        y: pos.y + boardArea.page_extension * resY
    }
}

//function for getting the location of touch
function getpositiontouch(event) {
    if (event.touches) {
        if (event.touches.length == 1) { // Only deal with one finger
            var touch = event.touches[0]; // Get the information for finger #1
            touchX = touch.pageX - touch.target.offsetLeft;
            touchY = touch.pageY - touch.target.offsetTop;
        }
    }
    return {
        x: touchX,
        y: touchY
    };
}
