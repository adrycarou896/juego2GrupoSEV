var parado = 1;
var luchando = 2;
var enCaptura = 3;

var Eevee = cc.Class.extend({
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
    animacion_idle:null,
    animacion:null,
    nivel: 1,
    estado: parado,
    vida: 100,
    vidaCompleta: 100,
    posicion: null,
    defensa: 3,
    dentroPokeball: false,
    name: "Eevee",
    ctor:function () {

    },
    actualizar:function(){

    },
    mostrarEnCampo:function(space, posicion, layer){
        this.posicion = posicion;
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#eevee_01.png");

        this.incluirEnVista(space, posicion, layer);

        layer.addChild(this.sprite,10);

        //Guardamos los datos
        this.spriteAnterior = this.sprite;
        this.spaceAnterior = this.space;
        this.layerAnterior = this.layer;
        this.bodyAnterior = this.body;
        this.shapeAnterior = this.shape;
    },
    mostrar(space, posicion, layer){

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#eevee_espalda_01.png");

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
        for (var i = 1; i <= 1; i++) {
            var str = "eevee_espalda_0" + i + ".png";
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

    ataque1:function(layer){
        return new BolaFuegoAtaque(layer,cc.p(230,115), this, 2)
    },

    ataque2:function(layer){
        return new BolaFuegoAtaque(layer,cc.p(230,115), this, 2)
    },
    mostrarSiEsEnemigo:function (space, posicion, layer) {
        this.sprite = new cc.PhysicsSprite("#eevee_idle_01.png");

        this.incluirEnVista(space,posicion,layer);

        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "eevee_idle_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.5);
        this.animacion_idle =
            new cc.RepeatForever(new cc.Animate(animacion));

        layer.addChild(this.sprite,10);

        this.animacion = this.animacion_idle;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);

    },
    cambiarAModoLucha:function(){
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "eevee_idle_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.5);
        this.animacion_idle =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.animacion = this.animacion_idle;
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacion);
    },
    incluirEnVista:function(space, posicion, layer){
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

    },
    subirNivel:function(){
        if(this.nivel < 3) {
            this.nivel ++;
            return true;
        }
        return false;
    },
    impactadoSiEsEnemigo:function(disparo){
        var framesAnimacion = [];
        for (var i = 3; i <= 4; i++) {
            var str = "eevee_idle_0" + i + ".png";
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
    },
    impactado:function(disparo){
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "eevee_espalda_0" + i + ".png";
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
    },
    cambiarAAnimacionDeLucha:function(){
        var framesAnimacion = [];
        for (var i = 1; i <= 1; i++) {
            var str = "eevee_espalda_0" + i + ".png";
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

        this.sprite = this.spriteAnterior;
        this.space = this.spaceAnterior;
        this.layer = this.layerAnterior;
        console.log("layerAnterior fin modo lucha: " + this.layerAnterior.nombre);
        this.body = this.bodyAnterior;
        this.shape = this.shapeAnterior;
        this.space.removeShape(this.shape);
        this.layer.removeChild(this.sprite);
    }
});
