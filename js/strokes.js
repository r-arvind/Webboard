function Stroke(startTime = Date.now(), width = boardAttributes.width, color = boardAttributes.color) {
    this.type = this.constructor.name;
    this.startTime = startTime;
    this.width = width;
    this.color = color;
}

function PenStroke(startPosition, startTime = Date.now(), width = boardAttributes.width, color = boardAttributes.color) {
    Stroke.call(this, startTime, width, color);
    this.points = [startPosition];
}

PenStroke.prototype = Object.create(Stroke.prototype);
PenStroke.prototype.constructor = PenStroke;

PenStroke.prototype.update = function(position) {
    this.points.push(position);
}
PenStroke.prototype.mouseLeave = function(position) {
    sessionObject.pages[boardArea.currentPageIndex + boardArea.focus_page].strokeList.push(this);
    boardArea.currentStroke = undefined;
    boardArea.copyTemp();
}
PenStroke.prototype.stop = PenStroke.prototype.mouseLeave;
PenStroke.prototype.render = function(context, ox, oy) {

    context.lineJoin = boardArea.temp_context.lineCap = context.lineCap = boardArea.temp_context.lineJoin = 'round';
    context.lineJoin = context.lineCap = 'round';

    function midPointBtw(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
    }

    var points = this.points;
    if (points.length < 2)
        return;
    var p1 = points[0];
    var p2 = points[1];
    context.strokeStyle = this.color;
    context.lineWidth = correctWidth(this.width);
    // console.log(context.lineWidth)
    context.beginPath();
    moveTo(context, p1.x, p1.y, ox, oy);
    for (var i = 1, len = points.length; i < len; i++) {
        var midPoint = midPointBtw(p1, p2);
        quadraticCurveTo(context, p1.x, p1.y, midPoint.x, midPoint.y, ox, oy);
        p1 = points[i];
        p2 = points[i + 1];
    }
    lineTo(context, p1.x, p1.y, ox, oy);
    context.stroke();
}
