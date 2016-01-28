$(document).ready(function() {


    //Get the canvas and calculate canvas size and max-size
    var canvas = $('#mycanvas');
    var ctx = canvas.get(0).getContext('2d');
    var creationMode = null;

    $(".select-form").click(function(){
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        creationMode = $(this).text();
        $(".options-pane").empty();
        
    });

});
