// function bezierCurveTo(ctx, x1, y1, x2, y2, x3, y3) {
//     var ox = boardArea.margin_x;
//     var oy = boardArea.margin_y;
//     x1 *= boardArea.scale;
//     y1 *= boardArea.scale;
//     x2 *= boardArea.scale;
//     y2 *= boardArea.scale;
//     x3 *= boardArea.scale;
//     y3 *= boardArea.scale;
//     ctx.bezierCurveTo(Math.round(ox + x1), Math.round(oy + y1), Math.round(ox + x2), Math.round(oy + y2), Math.round(ox + x3), Math.round(oy + y3));
// }

function quadraticCurveTo(ctx, x1, y1, x2, y2, xx=0, yy=0) {
    var ox = boardArea.margin_x;
    var oy = boardArea.margin_y;
    x1 *= boardArea.scale;
    y1 *= boardArea.scale;
    x2 *= boardArea.scale;
    y2 *= boardArea.scale;
    ctx.quadraticCurveTo(ox + x1 + xx, oy + y1 + yy, ox + x2 + xx, oy + y2 + yy);
}

function moveTo(ctx, x1, y1, xx = 0, yy = 0, bypass = false) {
    var newX = x1 * boardArea.scale;
    var newY = y1 * boardArea.scale;
    ctx.moveTo(boardArea.margin_x + newX + xx, boardArea.margin_y + newY + yy);
}

function lineTo(ctx, x1, y1, xx=0, yy=0) {

    var newX = x1 * boardArea.scale;
    var newY = y1 * boardArea.scale;

    ctx.lineTo(boardArea.margin_x + newX + xx, boardArea.margin_y + newY + yy);
}

function correctWidth(w) {
    return Math.max(1, Math.round(w * boardArea.scale));
}
