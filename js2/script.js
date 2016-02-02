$(document).ready(function() {


    //Get the canvas and calculate canvas size and max-size
    var $canvas = $("#mycanvas"),
        canvas = $canvas[0];
    var ctx = canvas.getContext('2d');
    var mode = null;
    var mousePos = null;


    var scale = $("#zoom").val() || 1;

    var cb = new CircuitBuilder(scale);
    var cd = new CircuitDrawer(canvas, scale);

    var pointsSelected = [],
        indexPoint = 0;

    var linePoints = [],
        maxLinePoints = 4;

    var borderpoints = [],
        maxBorderPoints = 2;

    var circleCenter = null;

    var rectCenter = null;

    // select type object
    $(".select-form").click(function() {
        indexPoint = 0;
        pointsSelected = [];
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
                pointsSelected = [mousePos];
                break;
            case "circle":
                circleCenter = mousePos;
                $("#centx").text(mousePos.x);
                $("#centy").text(mousePos.y);
                pointsSelected = [mousePos];
                break;
            case "border":
                borderpoints[indexPoint] = mousePos;
                $("#b" + indexPoint + "x").text(mousePos.x);
                $("#b" + indexPoint + "y").text(mousePos.y);
                pointsSelected[indexPoint] = mousePos;
                indexPoint = (indexPoint + 1) % maxBorderPoints;
                break;
            case "line":
                linePoints[indexPoint] = mousePos;
                $("#l" + indexPoint + "x").text(mousePos.x);
                $("#l" + indexPoint + "y").text(mousePos.y);
                pointsSelected[indexPoint] = mousePos;
                indexPoint = (indexPoint + 1) % maxLinePoints;
                break;
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
                indexPoint = 0;
                pointsSelected = [];
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
                indexPoint = 0;
                pointsSelected = [];
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
                pointsSelected = [];
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
                pointsSelected = [];
                $("#rectx").text("");
                $("#recty").text("");
                break;
        }
    });

    window.setInterval(update, 1000 / 60);


    window.addEventListener("keydown", function(e) {
        switch (e.keyCode) {
            case 37: // left arrow
                player.x = (player.x - 30 < 0 ? 0 : player.x - 30);
                break;
            case 38: // up arrow
                player.y = (player.y - 30 < 0 ? 0 : player.y - 30);
                break;
            case 39: // right arrow
                player.x = (player.x + 30 > yourWorld.maxX ? yourWorld.maxX : player.x + 30);
                break;
            case 40: // down arrow
                player.y = (player.y + 30 > yourWorld.maxY ? yourWorld.maxY : player.y + 30);
                break;
        }
    }, false);



    var player = {
        x: 0,
        y: 0
    };
    var yourWorld = {
        minX: 0,
        minY: 0,
        maxX: 800,
        maxY: 800
    };



    function update() {

        function clamp(value, min, max) {
            if (value < min) return min;
            else if (value > max) return max;
            return value;
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0); //reset the transform matrix as it is cumulative
        // clean canvas
        cd.empty(); //clear the viewport AFTER the matrix is reset

        //Clamp the camera position to the world bounds while centering the camera around the player
        var camX = clamp(-player.x + canvas.width / 2, yourWorld.minX, yourWorld.maxX - canvas.width);
        var camY = clamp(-player.y + canvas.height / 2, yourWorld.minY, yourWorld.maxY - canvas.height);

        console.log(camX, camY);

        ctx.translate(camX, camY);

        //draw elements in builder
        var elements = cb.getCircuitElements();
        elements.forEach(function(elem) {
            cd.draw(elem);
        });
        //draw mouse position
        if (mousePos) {
            cd.draw({
                type: "circle",
                color: "pink",
                data: {
                    center: {
                        x: mousePos.x - camX / scale,
                        y: mousePos.y - camY / scale
                    },
                    radius: 3 / scale
                }
            });
        }
        //draw points selected
        pointsSelected.forEach(function(elem) {
            cd.draw({
                type: "circle",
                color: "black",
                data: {
                    center: {
                        x: elem.x - camX / scale,
                        y: elem.y - camY / scale
                    },
                    radius: 3 / scale
                }
            });
        });
    }

    //Catch click event to apply zoom to canvas
    $("#zoom").on("change", function() {
        scale = $("#zoom").val();
        cd.setScale(scale);
        cb.setScale(scale);
        $("#zoom-label").text("Zoom (" + scale + ")");
        //reset points
        pointsSelected = [];
        circleCenter = null;
        rectCenter = null;
        linePoints = [];
        borderpoints = [];
        $("#l0x").text("");
        $("#l0y").text("");
        $("#l1x").text("");
        $("#l1y").text("");
        $("#l2x").text("");
        $("#l2y").text("");
        $("#l3x").text("");
        $("#l3y").text("");
        $("#b0x").text("");
        $("#b0y").text("");
        $("#b1x").text("");
        $("#b1y").text("");
        $("#centx").text("");
        $("#centy").text("");
        $("#rectx").text("");
        $("#recty").text("");
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



// function getMousePos(canvas, evt) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: evt.clientX - rect.left,
//         y: evt.clientY - rect.top
//     };
// }
