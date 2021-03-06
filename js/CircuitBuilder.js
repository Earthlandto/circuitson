function CircuitBuilder() {

    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2World = Box2D.Dynamics.b2World;
    var b2MassData = Box2D.Collision.Shapes.b2MassData;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
    // var b2ContactListener = Box2D.Dynamics.b2ContactListener;


    var world;
    var worldScale = 10;
    var debugDraw;

    var canvasWidth = $("#mycanvas")[0].width;
    var canvasHeight = $("#mycanvas")[0].height;

    var widthByScale = canvasWidth / worldScale;
    var heightByScale = canvasHeight / worldScale;

    this.init = function() {
        //create the world
        world = new b2World(
            new b2Vec2(0, 0), //gravity
            true //allow sleep
        );

        //setup debug draw
        debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("mycanvas").getContext("2d"));
        debugDraw.SetDrawScale(worldScale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);

        window.setInterval(function() {
            world.Step(
                1 / 60, //frame-rate
                10, //velocity iterations
                10 //position iterations
            );
            world.DrawDebugData();
            world.ClearForces();
        }, 1000 / 60);

    };

    this.setScale = function(newScale) {
        worldScale = newScale;
        debugDraw.SetDrawScale(worldScale);
    };


    this.addLine = function(points) {
        var myline = make_body('line', 'dynamic', {
            x: 0,
            y: 0
        });
        myline.add_fixture('edge', points);
    };

    this.addBorder = function(points) {
        var myborder = make_body('border', 'static', {
            x: 0,
            y: 0
        });
        myborder.add_fixture('border', points);
    };


    this.addObstacle = function(type, shapetype, position, data, restitution, density, friction) {
        var myobstacle = make_body('obstacle', type, position);
        myobstacle.add_fixture(shapetype, data, restitution, density, friction);
    };

    /*  variable 'data' format:
        if shape is a circle: data must be a number (the radius)
        if shape is a polygon: data must be a object's array with properties 'x' and 'y' (its coordinates)
        if shape is a edge/line:
            if length is equal to 3 or 4 then we use a bexier curve.
            if length is 2, we create a simple edge/line
            'data' must be a object's array with properties 'x' and 'y'
    */
    b2Body.prototype.add_fixture = function(shapetype, data, restitution, density, friction) {

        var fixDef = new b2FixtureDef();
        fixDef.density = density || 10;
        fixDef.restitution = restitution || 0;
        fixDef.friction = friction || 0.2;
        var body = this; //FIXME: fix scope

        switch (shapetype) {
            case 'polygon':
                make_polygon(body, fixDef, data);
                break;
            case 'circle':
                make_circle(body, fixDef, data);
                break;
            case 'edge':
                make_line(body, fixDef, data);
                break;
            case 'border':
                make_border(body, fixDef, data);
                break;
        }
    };


    function make_body(id, type, position) {

        //TODO check if it's neccesary div the position by the scale.

        var bodyDef = new b2BodyDef();
        bodyDef.userData = createNewUserData(id);
        if (type === 'static') {
            bodyDef.type = b2Body.b2_staticBody;
        } else { // 'dynamic'
            bodyDef.type = b2Body.b2_dynamicBody;
        }
        bodyDef.position.Set(position.x, position.y);
        return world.CreateBody(bodyDef);
    }




    function make_line(mybody, myFixDef, data) {
        var points = checkPoints(data);
        //Create bezier cuves with OUTLINES
        var vecs = getVecsBezierOutline(new Bezier(points));

        myFixDef.shape = new b2PolygonShape();
        for (var i = 0; i < vecs.length - 1; i++) {
            myFixDef.shape.SetAsEdge(vecs[i], vecs[i+1]);
            mybody.CreateFixture(myFixDef);
        }
    }



    function make_border(mybody, myFixDef, data) {
        var points = scalatePoints(data);
        myFixDef.shape = new b2PolygonShape();

        for (var i = 0; i < points.length - 1; i++) {
            myFixDef.shape.SetAsEdge(points[i], points[i + 1]);
            mybody.CreateFixture(myFixDef);
        }
    }




    function make_polygon(mybody, myFixDef, data) {

        //TODO check if it's neccesary div the polygon size by the scale

        myFixDef.shape = new b2PolygonShape();
        var vecs = [];
        data.forEach(function(elem) {
            vecs.push(new b2Vec2(elem.x, elem.y));
        });
        myFixDef.shape.SetAsArray(vecs, vecs.length);
        mybody.CreateFixture(myFixDef);
    }

    function make_cirlce(mybody, myFixDef, data) {
        var radius = 1;
        if (typeof data === "number")
            radius = data;
        fixDef.shape = new b2CircleShape(radius);
        mybody.CreateFixture(fixDef);
    }

    function scalatePoints(data) {
        var points = [];
        data.forEach(function(elem) {
            points.push({
                x: elem.x / worldScale,
                y: elem.y / worldScale
            });
        });
        return points;
    }

    function checkPoints(data) {
        var points = [];
        scalatePoints(data).forEach(function(elem) {
            points.push(elem.x);
            points.push(elem.y);
        });

        var ndimension = 2; // coordinates x and y.
        if (points.length === 2 * ndimension) {
            /*  Convert a normal line with 2 point into a straight bezier curve.
                A straight bezier curve has the intermediate points within the
                then, i'll duplicate just one point at the end of curve. */
            points = points.concat(points.slice(-ndimension));
        }
        if (points.length > 4 * ndimension) {
            /*  Avoiding incorrect format in variable 'points'.
                We keep with the first four points (are 8 elements) .*/
            points.splice(-4 * ndimension);
        }
        return points;
    }


    function createNewUserData(bodyID) {
        return bodyID + Math.floor(Math.random() * 1000);
    }

    function getVecsBezierOutline(bez) {
        var outline = bez.outline(1);
        var vecs = [];
        (outline.curves).forEach(function(elem) {
            vecs = vecs.concat(getVecsBezier(elem));
        });
        return vecs;
    }

    function getVecsBezier(bez, steps) {
        steps = steps | 1;
        var LUT = bez.getLUT(steps);
        var vecs = [];
        LUT.forEach(function(elem) {
            vecs.push(new b2Vec2(elem.x, elem.y));
        });
        return vecs;
    }


}
