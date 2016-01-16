$(document).ready(function() {


    //Get the canvas and calculate canvas size and max-size
    var canvas = $('#mycanvas');
    var ctx = canvas.get(0).getContext('2d');
    var container = $(canvas).parent();

    //Run function when browser resizes
    $(window).resize(respondCanvas);

    function respondCanvas() {
        //Call a function to redraw other content (texts, images etc)
        canvas.attr('width', $(container).width()); //max width
        canvas.attr('height', $(container).height()); //max height
    }
    //Initial call
    respondCanvas();


    var mouseX, mouseY;
    var p0 = {
        x: 0,
        y: 0
    };
    var p1 = {
        x: 0,
        y: 0
    };

    var mycircuit = new CircuitBuilder();
    mycircuit.init();

    // Catch click event to create lines into canvas
    $('#mycanvas').click(function(event) {
        mouseX = event.pageX - $(this).offset().left;
        mouseY = event.pageY - $(this).offset().top;
        p0 = p1;
        p1 = {
            x: mouseX,
            y: mouseY
        };
        // mycircuit.addBorder([p0, p1]);
		// mycircuit.addLine([p0, p1]);
		mycircuit.addLine([p0,{x: 100, y:10},{x: 400, y:100}, p1]);
    });

    //Catch click event to apply zoom to canvas
    $("#zoom").click(function() {
        var zoom_val = $("#zoom").val();
        mycircuit.setScale(zoom_val);
        $("#zoom-label").text("Zoom (" + zoom_val + ")");
    });

});
