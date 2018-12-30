var parado = 1;
var luchando = 2;

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
    ctor:function (space, posicion, layer) {

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
    actualizar:function(){

    },
    cambiarAModoLucha:function (space, posicion, layer) {

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#eevee_idle_01.png");

        this.incluirEnVista(space, posicion, layer);

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

    },
    finModoLucha:function () {
        this.sprite = this.spriteAnterior;
        this.space = this.spaceAnterior;
        this.layer = this.layerAnterior;
        this.body = this.bodyAnterior;
        this.shape = this.shapeAnterior;
    }
});
