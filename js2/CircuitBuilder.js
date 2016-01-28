function CircuitBuilder() {

    var circuitElements = [];
    // var scale = 10;

    this.getCircuitElements = function() {
        return circuitElements;
    };

    // this.getScale = function() {
    //     return scale;
    // };
    //
    // this.setScale = function(newScale) {
    //     scale = newScale;
    // };

    this.toJSON = function() {
        return JSON.stringify(circuitElements);
    };

    this.addLine = function(type, linePoints) {
        // linePoints = scalePoints(linePoints);
        create(type, linePoints, false);
    };

    this.addBorder = function(borderpoints) {
        // borderpoints = scalePoints(borderpoints);
        create("border", borderpoints, true);
    };

    this.addCircle = function(center, radius, isStatic, density, friction, restitution) {
        // center = scalePoint(center);
        create("circle", {
            center: center,
            radius: radius
        }, isStatic, density, friction, restitution);
    };

    this.addRect = function(position, width, height, isStatic, density, friction, restitution) {
        // position = scalePoint(position);
        create("rect", {
            position: position,
            width: width,
            height: height
        }, isStatic, density, friction, restitution);
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
        circuitElements.push(obj);
    }

    // function scalePoint(point) {
    //     return {
    //         x: point.x / scale,
    //         y: point.y / scale
    //     };
    // }
    //
    // function scalePoints(points) {
    //     return points.map(function(elem) {
    //         return {
    //             x: elem.x / scale,
    //             y: elem.y / scale
    //         };
    //     });
    // }
}


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}
