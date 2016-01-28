function CircuitBuilder() {

    var myobjects = [];

    this.addLine = function(type, linePoints) {
        create(type, linePoints, false);
    };

    this.addBorder = function(borderpoints) {
        create("border", borderpoints, true);
    };

    this.addCircle = function(center, radius, isStatic, density, friction, restitution) {
        create("circle", {center: center, radius: radius}, isStatic, density, friction, restitution);
    };

    this.addRect = function (position, width, heigh, isStatic, density, friction, restitution){
        create ("rect", {position: position, width:width, heigh: heigh}, isStatic, density, friction, restitution );
    };


    function create(typeObject, data, isStatic, density, friction, restitution) {
        var obj = {
            type: typeObject,
            data: data,
            isStatic: isStatic,
            restitution: restitution || null,
            density: density || null,
            friction: friction ||  null,
            color: getRandomColor()
        };
        myobjects.push(obj);
        console.log(obj);
    }
}


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}
