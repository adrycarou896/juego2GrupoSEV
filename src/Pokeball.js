var capturando = 1;
var volando = 2;
var cerrada = 3;

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
    estado : volando,
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

        this.shape.setCollisionType(tipoPokeball);

        // forma dinamica
        this.space.addShape(this.shape);
        layer.addChild(this.sprite,10);


        var framesAnimacion = [];
        for (var i = 1; i <= 1; i++) {
            var str = "pokeball_" + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacion_volando =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.animacion = this.animacion_volando;
        this.sprite.runAction(this.animacion);

        this.body.applyImpulse(cp.v(500, 150), cp.v(10, 15));


    },
    actualizar:function(){
        if(this.estado == volando) {
            this.body.vx = 500;
            this.body.vy = 150;
        }
    },


    cambiarAModoCaptura:function (space, posicion, layer) {

        this.space = space;

        this.body = new cp.Body(Infinity, Infinity);

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        this.estado = capturando;

        var framesAnimacion = [];
        for (var i = 2; i <= 7; i++) {
            var str = "pokeball_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.15);
        this.animacion_capturando =
            new cc.RepeatForever(new cc.Animate(animacion));


        this.animacion = this.animacion_capturando;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);
    },



    cambiarAModoAtrapaPokemon: function(space, position, layer){
        this.space = space;

        var sprite = new cc.PhysicsSprite("#pokeball_cerrada.png");

        this.sprite = sprite;

        this.body = new cp.Body(Infinity, Infinity);

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        this.estado = cerrada;

        var framesAnimacion = [];
        for (var i = 2; i <= 7; i++) {
            var str = "pokeball_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.15);
        this.animacion_capturando =
            new cc.RepeatForever(new cc.Animate(animacion));


        this.animacion = this.animacion_capturando;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);
    }
});
