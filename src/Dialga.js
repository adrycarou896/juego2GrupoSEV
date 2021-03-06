var parado = 1;
var luchando = 2;

var Dialga = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacion_idle:null,
    animacion_ataque:null,
    animacion:null,
    nivel: 4,
    estado: parado,
    vida: 200,
    vidaCompleta: 200,
    posicion: null,
    defensa: 3,
    ctor:function () {

    },
    mostrarSiEsEnemigo:function(space, posicion, layer){
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#dialga_idle_01.png");

        this.space = space;
        this.layer = layer;

        // Cuerpo dinamico, NO le afectan las fuerzas
        this.body = new cp.Body(Infinity, Infinity);

        this.body.setPos(cc.p(600, 300));
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
        for (var i = 1; i <= 17; i++) {
            if(i<10)
                var str = "dialga_idle_0" + i + ".png";
            else
                var str = "dialga_idle_" + i + ".png";

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
    impactadoSiEsEnemigo:function(disparo){
        console.log("ES IMPACTADOO");
        var framesAnimacion = [];
        for (var i = 17; i <= 18; i++) {
            var str = "dialga_idle_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.05);
        this.animacion_idle =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.animacion = this.animacion_idle;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);

        this.vida -= disparo.daño();
        //this.vida =0;
    },
    cambiarAAnimacionDeAtaque:function(){
        /*var framesAnimacion = [];
        for (var i = 1; i <= 3; i++) {
            var str = "charizar_ataque1_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        for (var i = 2; i <= 2; i++) {
            var str = "charizar_ataque1_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacion_ataque =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.animacion = this.animacion_ataque;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);*/
    },
    cambiarAModoLucha:function(){
        var framesAnimacion = [];
        for (var i = 1; i <= 17; i++) {
            if(i<10)
                var str = "dialga_idle_0" + i + ".png";
            else
                var str = "dialga_idle_" + i + ".png";

            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacion_idle =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.animacion = this.animacion_idle;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);
    },
    finModoLucha:function () {
        this.space.removeShape(this.shape);
        this.layer.removeChild(this.sprite);
    }
});
