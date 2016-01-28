$(document).ready(function() {


    //Get the canvas and calculate canvas size and max-size
    var canvas = document.getElementById('mycanvas');
    var ctx = canvas.getContext('2d');
    var mode = null;
    var mousePos = null;

    var cb = new CircuitBuilder();
    var cd = new CircuitDrawer(canvas);

    var linePoints = [],
        indexline = 0,
        maxLinePoints = 4;

    var borderpoints = [],
        indexBorder = 0,
        maxBorderPoints = 2;

    var circleCenter = null;

    var rectCenter = null;

    // select type object
    $(".select-form").click(function() {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        mode = $(this).text().toLowerCase();
        $("." + mode + "-pane").removeClass("hidden").siblings().addClass("hidden");
    });

    canvas.addEventListener('mousemove', function(evt) {
        mousePos = getMousePos(canvas, evt);
    }, false);

    // Catch click event to create lines into canvas
    $('#mycanvas').click(function(event) {
        switch (mode) {
            case "rect":
                rectCenter = mousePos;
                $("#rectx").text(mousePos.x);
                $("#recty").text(mousePos.y);
                break;
            case "circle":
                circleCenter = mousePos;
                $("#centx").text(mousePos.x);
                $("#centy").text(mousePos.y);
                break;
            case "border":
                borderpoints[indexBorder] = mousePos;
                $("#b" + indexBorder + "x").text(mousePos.x);
                $("#b" + indexBorder + "y").text(mousePos.y);
                indexBorder = (indexBorder + 1) % maxBorderPoints;
                break;
            case "line":
                linePoints[indexline] = mousePos;
                $("#l" + indexline + "x").text(mousePos.x);
                $("#l" + indexline + "y").text(mousePos.y);
                indexline = (indexline + 1) % maxLinePoints;
                break;
            default:

        }
    });

    //Submit element
    $('#add-object').click(function(event) {
        if (!mode) return;
        switch (mode) {
            case "line":
                if (linePoints.length === 0) return;
                if (linePoints.length === 2)
                    cb.addLine('line', linePoints);
                else if (linePoints.length > 2) {
                    cb.addLine('curve', linePoints);
                }
                linePoints = [];
                indexline = 0;
                $("#l0x").text("");
                $("#l0y").text("");
                $("#l1x").text("");
                $("#l1y").text("");
                $("#l2x").text("");
                $("#l2y").text("");
                $("#l3x").text("");
                $("#l3y").text("");
                break;
            case "border":
                if (borderpoints.length === 0) return;
                cb.addBorder(borderpoints);
                borderpoints = [];
                indexBorder = 0;
                $("#b0x").text("");
                $("#b0y").text("");
                $("#b1x").text("");
                $("#b1y").text("");
                break;
            case "circle":
                if (!circleCenter) return;
                var radius = $("#radius").val();
                var cStatic = $("#circle-static").prop("checked");
                var cden = $("#circle-den").val(),
                    cfric = $("#circle-fric").val(),
                    cres = $("#circle-res").val();
                cb.addCircle(circleCenter, radius, cStatic, cden, cfric, cres);
                circleCenter = null;
                $("#centx").text("");
                $("#centy").text("");
                break;
            case "rect":
                if (!rectCenter) return;
                var rectW = $("#rectW").val();
                var rectH = $("#rectH").val();
                var rStatic = $("#rect-static").prop("checked");
                var rden = $("#rect-den").val(),
                    rfric = $("#rect-fric").val(),
                    rres = $("#rect-res").val();
                cb.addRect(rectCenter, rectW, rectH, rStatic, rden, rfric, rres);
                rectCenter = null;
                $("#rectx").text("");
                $("#recty").text("");
                break;
            default:

        }
    });

    window.setInterval(update, 1000 / 60);

    function update() {
        cd.empty();
        var elements = cb.getCircuitElements();
        elements.forEach(function(elem){
            cd.draw(elem);
        });


    }
});



function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
