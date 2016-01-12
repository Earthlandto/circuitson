function CraftCircuit() {

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

        window.setInterval(update, 1000 / 60);

    };

    this.setScale = function(newScale) {
        worldScale = newScale;
        debugDraw.SetDrawScale(worldScale);
    };

    function update() {
        world.Step(
            1 / 60, //frame-rate
            10, //velocity iterations
            10 //position iterations
        );

        world.DrawDebugData();
        world.ClearForces();
    }



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
        myborder.add_fixture('edge', points);
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

        switch (shapetype) {
            case 'polygon':
                fixDef = make_polygon(fixDef, data);
                this.CreateFixture(fixDef);
                return fixDef;
            case 'circle':
                return (function(fixDef, data) {
                    var radius = 1;
                    if (typeof data === "number")
                        radius = data;
                    fixDef.shape = new b2CircleShape(radius);
                    this.CreateFixture(fixDef);
                    return fixDef;
                })();
            case 'edge':
                fixDef = make_line(fixDef, data);
                this.CreateFixture(fixDef);
                return fixDef;
        }
    };


    function make_body(id, type, position) {

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




    function make_line(myFixDef, data) {
        myFixDef.shape = new b2PolygonShape();
        if (data.length === 2) {
            var v0 = new b2Vec2(data[0].x, data[0].y);
            var v1 = new b2Vec2(data[1].x, data[1].y);
            myFixDef.shape.SetAsEdge(v0, v1);
        } else {
            if (data.length > 4) {
                data.splice(-4);
            }
            var vecs = getVecsBezier(new Bezier(data));
            for (i = 0; i < vecs.length - 1; i++) {
                myFixDef.shape.SetAsEdge(vecs[i], vecs[i + 1]);
            }
        }
        return myFixDef;
    }

    function make_polygon(myFixDef, data) {
        myFixDef.shape = new b2PolygonShape();
        var vecs = [];
        data.forEach(function(elem) {
            vecs.push(new b2Vec2(elem.x, elem.y));
        });
        myFixDef.shape.SetAsArray(vecs, vecs.length);
        return myFixDef;
    }

    function createNewUserData(bodyID) {
        return bodyID + Math.floor(Math.random() * 1000);
    }

    function getVecsBezier(curve, step) {
        step = step | 100;
        var LUT = curve.getLUT();
        var vecs = [];
        LUT.forEach(function(p) {
            var vec = new b2Vec2();
            vec.Set(p.x, p.y);
            vecs.push(vec);
        });
        return vecs;
    }


}
