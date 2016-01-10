$(document).ready(function() {

    var mouseX, mouseY;

    $('#mycanvas').click(function(event) {
        mouseX = event.pageX - $(this).offset().left;
        mouseY = event.pageY - $(this).offset().top;
    });


    var cc = new CraftCircuit();
    cc.init();

    var pointsline = [{
        x: 0,
        y: 0
    }, {
        x: 50,
        y: 50
    }];
    cc.addLine(pointsline);

});
