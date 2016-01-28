function CircuitDrawer(canvas) {

    var ctx = canvas.getContext("2d");

    this.empty = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    this.draw = function(element) {
        switch (element.type) {
            case "line":
                drawLine(element.data, element.color);
                break;
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
    }

    function drawLine(data, color) {
        ctx.strokeStyle = color ||  "green";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(data[0].x, data[0].y);
        ctx.lineTo(data[1].x, data[1].y);
        ctx.stroke();
    }

    function drawCircle(center, radius, color) {

        ctx.strokeStyle = color ||  "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    function drawRect(position, width, height, color) {
        ctx.fillStyle = color || "yellow";
        ctx.strokeStyle = color ||  "yellow";

        ctx.rect(position.x, position.y, width, height);
        ctx.stroke();
    }

    function drawBezier(points, color) {

        if (points.length < 3) return;

        ctx.fillStyle = color || "blue";
        ctx.lineWidth = 5;
        ctx.strokeStyle = color || "blue";
        points.forEach(function(elem) {
            drawCircle(elem, 2, color);
            ctx.fill();
        });
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        if (points.length > 3) {
            ctx.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
        } else  {
            ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
        }
        ctx.stroke();
    }


}
