var parado = 1;
var luchando = 2;

var Eevee = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacion_idle:null,
    animacion:null,
    nivel: 1,
    estado: parado,
    ctor:function (space, posicion, layer) {

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#eevee_01.png");

        this.incluirEnVista(space,posicion,layer);

        layer.addChild(this.sprite,10);

    },
    actualizar:function(){

    },
    cambiarAModoLucha:function (space, posicion, layer) {

        // Crear Sprite - Cuerpo y forma
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

        //this.sprite.stopAllActions();
        //this.sprite.runAction(this.animacion);

    }
});
