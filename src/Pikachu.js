var parado = 1;
var luchando = 2;

var Pikachu = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacion_idle:null,
    animacion:null,
    nivel: 1,
    estado: parado,
    vida: 100,
    name: "Pikachu",
    defensa: 40,
    ataques: ["Rayo", "Chispazo"],
    ctor:function () {

    },
    mostrar(space, posicion, layer){
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#pikachu_idle_01.png");

        this.space = space;
        this.layer = layer;

        // Cuerpo dinamico, SI le afectan las fuerzas
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
        this.shape.setCollisionType(tipoJugadorPokemon);
        this.shape.setFriction(1);
        this.shape.setElasticity(0);

        // forma dinamica
        this.space.addShape(this.shape);

        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "pikachu_idle_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.5);
        this.animacion =
            new cc.RepeatForever(new cc.Animate(animacion));
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);

        layer.addChild(this.sprite,10);
    },
    impactado:function(disparo){
        var framesAnimacion = [];
        for (var i = 3; i <= 4; i++) {
            var str = "pikachu_idle_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.05);
        this.animacion =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);

        this.vida -= disparo.daño();

    },

    subirNivel:function(){
        if(this.nivel < 3) {
            this.nivel ++;
            return true;
        }
        return false;
    },


    cambiarAAnimacionDeLucha:function(){
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "pikachu_idle_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.5);
        this.animacion =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);
    },
    ataque1:function(layer){
        return new RayoAtaque(layer,cc.p(553,263), this);
    },
    ataque2:function(layer){
        return new DisparoPikachuRayo(layer,cc.p(230,115), this);
    },
    actualizar:function(){

    }
});
