var DragonAtaque = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    eficacia: 50,
    pokemon: null,
    orientacion: 1,
    ctor:function (gameLayer, posicion, pokemon) {

        this.pokemon = pokemon;

        this.sprite = new cc.PhysicsSprite("#ataque_dialga_1.png");

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

        this.shape.setCollisionType(tipoDisparoEnemigo);

        // forma dinamica
        gameLayer.space.addShape(this.shape);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);


        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 3; i++) {
            var str = "ataque_dialga_" +i+".png";
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


        this.body.applyImpulse(cp.v(-500, -350), cp.v(10, 45));

        this.gameLayer = gameLayer;

    },
    daño: function(){
        return this.eficacia*this.pokemon.nivel;
    },
    actualizar: function (){
        this.body.vx = -500;
    },
    eliminar: function (){
        // quita la forma
        this.gameLayer.space.removeShape(this.shape);

        // quita el sprite
        this.gameLayer.removeChild(this.sprite);
    }

});
