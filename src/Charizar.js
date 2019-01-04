var parado = 1;
var luchando = 2;

var Charizar = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacion_idle:null,
    animacion:null,
    nivel: 3,
    estado: parado,
    vida: 100,
    posicion: null,
    defensa: 3,
    ctor:function (space, posicion, layer) {
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#charizar_idle_01.png");

        this.space = space;
        this.layer = layer;

        // Cuerpo dinamico, NO le afectan las fuerzas
        this.body = new cp.Body(Infinity, Infinity);

        this.body.setPos(posicion);
        //body.w_limit = 0.02;
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        // Se añade el cuerpo al espacio
        this.space.addBody(this.body);

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoEnemigo);

        this.shape.setFriction(1);
        this.shape.setElasticity(0);

        // forma dinamica
        this.space.addShape(this.shape);

        var framesAnimacion = [];
        for (var i = 1; i <= 3; i++) {
            var str = "charizar_idle_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacion_idle =
            new cc.RepeatForever(new cc.Animate(animacion));

        layer.addChild(this.sprite,10);

        this.animacion = this.animacion_idle;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);

    },
    actualizar:function(){

    },
    impactado:function(disparo){
        var framesAnimacion = [];
        for (var i = 1; i <= 1; i++) {
            var str = "charizar_idle_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.05);
        this.animacion_idle =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.animacion = this.animacion_idle;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);

        console.log(this.vida);
        this.vida -= this.recibeDaño(disparo.daño());
        console.log("Vida de Eevee: " + this.vida);
    },
    recibeDaño: function(daño){
        return daño-(this.defensa*this.nivel);
    },
    cambiarAAnimacionDeLucha:function(){
        var framesAnimacion = [];
        for (var i = 1; i <= 1; i++) {
            var str = "charizar_idle_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.5);
        this.animacion_idle =
            new cc.RepeatForever(new cc.Animate(animacion));

        //layer.addChild(this.sprite,10);

        this.animacion = this.animacion_idle;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);
    },
    finModoLucha:function () {

    }
});
