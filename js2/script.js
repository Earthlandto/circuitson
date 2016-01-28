$(document).ready(function() {


    //Get the canvas and calculate canvas size and max-size
    var $canvas = $("#mycanvas"),
        canvas = $canvas[0];
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

    $('#convert-JSON').click(function(event) {
        if (!cb) return;
        var json = cb.toJSON();
        var blob = new Blob([json], {
            type: "application/json"
        });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "circuit.json";
        a.click();
        window.URL.revokeObjectURL(url);
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
        }
    });

    window.setInterval(update, 1000 / 60);

    function update() {
        cd.empty();
        var elements = cb.getCircuitElements();
        elements.forEach(function(elem) {
            cd.draw(elem);
        });
        if (mousePos) {
            cd.draw({
                type: "circle",
                color: "pink",
                data: {
                    center: {
                        x: mousePos.x,
                        y: mousePos.y
                    },
                    radius: 3
                }
            });
        }
    }

    //Catch click event to apply zoom to canvas
    $("#zoom").on("change", function() {
        var zoom_val = $("#zoom").val();
        //cd.setScale(zoom_val);
        $("#zoom-label").text("Zoom (" + zoom_val + ")");
    });

    // var scale = 1; // scale of the image
    // var xLast = 0; // last x location on the screen
    // var yLast = 0; // last y location on the screen
    // var xImage = 0; // last x location on the image
    // var yImage = 0; // last y location on the image

    // if mousewheel is moved
    // $canvas.bind("mousewheel", function(e, delta) {
    //     console.log(e, delta);
    //     // find current location on screen
    //     var xScreen = e.pageX - $(this).offset().left;
    //     var yScreen = e.pageY - $(this).offset().top;
    //
    //     // find current location on the image at the current scale
    //     xImage = xImage + ((xScreen - xLast) / scale);
    //     yImage = yImage + ((yScreen - yLast) / scale);
    //
    //     // determine the new scale
    //     if (delta > 0) {
    //         scale *= 2;
    //     } else {
    //         scale /= 2;
    //     }
    //     scale = scale < 1 ? 1 : (scale > 64 ? 64 : scale);
    //
    //     // determine the location on the screen at the new scale
    //     var xNew = (xScreen - xImage) / scale;
    //     var yNew = (yScreen - yImage) / scale;
    //
    //     // save the current screen location
    //     xLast = xScreen;
    //     yLast = yScreen;
    //
    //     // redraw
    //     $(this).find('div').css('-moz-transform', 'scale(' + scale + ')' + 'translate(' + xNew + 'px, ' + yNew + 'px' + ')')
    //         .css('-moz-transform-origin', xImage + 'px ' + yImage + 'px');
    //     return false;
    // });

    $("#mycanvas").on("mousemove", function(e) {
        mousePos = (function(e) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        })(e);
    });

    var container = $canvas.parent();
    //Run function when browser resizes
    $(window).resize(resizeCanvas);

    function resizeCanvas() {
        //Call a function to redraw other content (texts, images etc)
        $canvas.attr('width', $(container).width()); //max width
        $canvas.attr('height', $(container).width()); //max height
    }
    //initial call
    resizeCanvas();

});



function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
