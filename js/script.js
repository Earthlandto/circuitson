$(document).ready(function() {

    var cc = new CraftCircuit();
    cc.init();

    var mouseX, mouseY;

    $('#mycanvas').click(function(event) {
        posX = event.pageX - $(this).offset().left;
        posY = event.pageY - $(this).offset().top;
        console.log(posX, posY);
    });

});