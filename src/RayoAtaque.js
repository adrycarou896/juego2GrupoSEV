var RayoAtaque = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    posicion: null,
    activo: false,
    ctor:function (gameLayer, posicion) {
        this.posicion = posicion;
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#rayo_01.png");
        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);
        this.body.setPos(posicion);
        //body.w_limit = 0.02;
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        // Se añade el cuerpo al espacio
        gameLayer.space.addBody(this.body);

        // forma 16px más pequeña que la imagen original
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width - 16,
            this.sprite.getContentSize().height - 16);
        this.shape.setCollisionType(tipoDisparo);
        // forma dinamica
        gameLayer.space.addShape(this.shape);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);


        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 4; i++) {
            var str = "rayo_0"+i+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.05);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        //this.aCaminar = actionAnimacionBucle;
        //this.aCaminar.retain();

        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);

        // Impulso inicial
        this.body.applyImpulse(cp.v(0, 0), cp.v(0, 0));

        this.gameLayer = gameLayer;

    },
    actualizar: function (){
        this.body.vx = 0;
    },
    eliminar: function (){
        // quita la forma
        this.gameLayer.space.removeShape(this.shape);

        // quita el sprite
        this.gameLayer.removeChild(this.sprite);
    }

});
