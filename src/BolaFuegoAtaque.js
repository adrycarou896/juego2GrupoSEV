var BolaFuegoAtaque = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    eficacia: 20,
    pokemon: null,
    orientacion: 1,
    ctor:function (gameLayer, posicion, pokemon, orientacion) {

        this.pokemon = pokemon;

        this.orientacion = orientacion;

        // Crear Sprite - Cuerpo y forma
        if(this.orientacion == 1)
            this.sprite = new cc.PhysicsSprite("#bola_fuego_1_01.png");
        else
            this.sprite = new cc.PhysicsSprite("#bola_fuego_2_01.png");
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
        if(this.orientacion == 1)
            this.shape.setCollisionType(tipoDisparoEnemigo);
        else
            this.shape.setCollisionType(tipoDisparo);
        // forma dinamica
        gameLayer.space.addShape(this.shape);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);


        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 3; i++) {
            var str = "bola_fuego_" + this.orientacion + "_0"+i+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        //this.aCaminar = actionAnimacionBucle;
        //this.aCaminar.retain();

        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);

        // Impulso inicial
        if(this.orientacion == 1) {//Es enemigo
            this.body.applyImpulse(cp.v(-500, -550), cp.v(10, 15));
        }else{
            this.body.applyImpulse(cp.v(500, 550), cp.v(10, 15));
        }

        this.gameLayer = gameLayer;

    },
    daño: function(){
        return this.eficacia*this.pokemon.nivel;
    },
    actualizar: function (){
        if(this.orientacion == 1) {
            this.body.vx = -500;
        }
        else{
            this.body.vx = 500;
        }
    },
    eliminar: function (){
        // quita la forma
        this.gameLayer.space.removeShape(this.shape);

        // quita el sprite
        this.gameLayer.removeChild(this.sprite);
    }

});
