

var Pokeball = cc.Class.extend({
    space:null,
    spaceAnterior:null,
    sprite:null,
    spriteAnterior:null,
    shape:null,
    shapeAnterior:null,
    body:null,
    bodyAnterior:null,
    layer:null,
    layerAnterior:null,
    animacion_capturando:null,
    animacion:null,
    animacion_volando: null,
    ctor:function (space, posicion, layer) {

        // Inicializar Space
        this.space = space;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#pokeball_volando.png");


        // Cuerpo dinamico, NO le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        // Se añade el cuerpo al espacio
        this.space.addBody(this.body);

        // forma
        // forma 16px más pequeña que la imagen original
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width - 16,
            this.sprite.getContentSize().height - 16);

        this.shape.setCollisionType(tipo);

        // forma dinamica
        this.space.addShape(this.shape);
        layer.addChild(this.sprite,10);


        var framesAnimacion = [];
        for (var i = 1; i <= 6; i++) {
            var str = "pokeball_volando" + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.5);
        this.animacion_volando =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.animacion = this.animacion_volando;
        this.sprite.runAction(this.animacion);

        this.body.applyImpulse(cp.v(500, 350), cp.v(10, 15));



    },
    actualizar:function(){
        this.body.vx = 300
    },
    cambiarAModoCaptura:function (space, posicion, layer) {

        this.space = space;
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#pokeball_1.png");


        // Cuerpo dinamico, NO le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);

        this.body.setPos(posicion);
        //body.w_limit = 0.02;
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        // Se añade el cuerpo al espacio
        this.space.addBody(this.body);

        // forma
        // forma 16px más pequeña que la imagen original
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width - 16,
            this.sprite.getContentSize().height - 16);

        // forma dinamica
        this.space.addShape(this.shape);
        layer.addChild(this.sprite,10);


        var framesAnimacion = [];
        for (var i = 1; i <= 6; i++) {
            var str = "pokeball_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.15);
        this.animacion_capturando =
            new cc.RepeatForever(new cc.Animate(animacion));



        this.animacion = this.animacion_capturando;
        //this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);


    },
});
