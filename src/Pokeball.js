var capturando = 1;
var volando = 2;
var llena = 3;
var vacia = 4;

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
    tiempoCaptura: 200,
    enemigo: null,
    llena: null,
    finAnimaciones: 50,
    ctor:function (space, posicion, layer, enemigo) {

        // Inicializar Space
        this.space = space;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#pokeball_volando.png");

        this.enemigo = enemigo;

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
        if(this.estado == capturando){
            if(this.tiempoCaptura <= 0){
                if(this.llena == true)
                    this.estado = llena;
                else
                    this.estado = vacia;
            }
            else{
                if(this.llena == null){
                    this.calcularAtrapa();
                }
            }
            this.tiempoCaptura--;
        }
        if(this.estado == llena || this.estado == vacia){
            this.finAnimaciones--;
        }
    },


    calcularAtrapa:function(){
        if(this.enemigo.vida<= 50){

            if(this.enemigo.vida <= 0){
                this.llena = true;
            }

            else {

                var random = Math.random();

                if (random >= 0)
                    this.llena = true;
                else
                    this.llena = false;
            }
        }
        else
            this.llena = false;
    }
    ,


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



    cambiarAModoCerrada: function(space, posicion, layer){
        this.space = space;

        var sprite = new cc.PhysicsSprite("#pokeball_cerrada.png");

        layer.removeChild(this.sprite);

        this.sprite = sprite;

        this.body = new cp.Body(Infinity, Infinity);

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        var framesAnimacion = [];
        for (var i = 1; i <= 1; i++) {
            var str = "pokeball_cerrada" + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.15);
        this.animacion_capturando =
            new cc.RepeatForever(new cc.Animate(animacion));


        this.animacion = this.animacion_capturando;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);
        layer.addChild(this.sprite);

    },

    cambiarAModoAbierta: function(space, posicion, layer){
        this.space = space;

        var sprite = new cc.PhysicsSprite("#pokeball_abierta.png");

        layer.removeChild(this.sprite);

        this.sprite = sprite;

        this.body = new cp.Body(Infinity, Infinity);

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        var framesAnimacion = [];
        for (var i = 1; i <= 1; i++) {
            var str = "pokeball_abierta" + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.15);
        this.animacion_capturando =
            new cc.RepeatForever(new cc.Animate(animacion));


        this.animacion = this.animacion_capturando;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);
        layer.addChild(this.sprite)
    }
});
