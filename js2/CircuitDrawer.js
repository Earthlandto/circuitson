function CircuitDrawer(canvas, initScale) {

    var ctx = canvas.getContext("2d");
    var scale = initScale || 1;


    this.getScale = function() {
        return scale;
    };

    this.setScale = function(newScale) {
        scale = newScale;
    };

    this.empty = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    this.draw = function(element) {
        // ctx.scale(scale,scale);
        switch (element.type) {
            case "line":
                //same as "border"
            case "border":
                drawLine(element.data, element.color);
                break;
            case "curve":
                drawBezier(element.data, element.color);
                break;
            case "circle":
                var circle = element.data;
                drawCircle(circle.center, circle.radius, element.color);
                break;
            case "rect":
                var rect = element.data;
                drawRect(rect.position, rect.width, rect.height, element.color);
                break;
            default:

        }
    };

    function drawLine(points, color) {

        points = points.map(scalePoint);

        ctx.strokeStyle = color ||  "green";
        ctx.lineWidth = 1*scale;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        // ctx.closePath();
        ctx.stroke();
    }

    function drawCircle(center, radius, color) {
        center = scalePoint(center);
        radius *= scale;
        ctx.lineWidth = 1;
        ctx.strokeStyle = color ||  "black";
        ctx.lineWidth = 1*scale;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        // ctx.closePath();
        ctx.stroke();
    }

    function drawRect(positionUL, width, height, color) {
        positionUL = scalePoint(positionUL);
        width *= scale;
        height *= scale;
        ctx.lineWidth = 1*scale;
        ctx.fillStyle = color || "yellow";
        ctx.strokeStyle = color ||  "yellow";

        ctx.rect(positionUL.x, positionUL.y, width, height);
        ctx.stroke();
    }

    function drawBezier(points, color) {
        if (points.length < 3) return;

        points = points.map(scalePoint);

        ctx.fillStyle = color || "blue";
        ctx.lineWidth = 2*scale;
        ctx.strokeStyle = color || "blue";
        points.forEach(function(elem) {
            drawCircle({
                x: elem.x / scale,
                y: elem.y / scale
            }, 0.5, color);
            ctx.fill();
        });
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        if (points.length > 3) {
            ctx.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
        } else  {
            ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
        }
        // ctx.closePath();
        ctx.stroke();
    }

    function scalePoint(point) {
        return {
            x: point.x * scale,
            y: point.y * scale
        };
    }


}
