var parado = 1;
var luchando = 2;

var Eevee = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacion:null,
    estado: parado,
    ctor:function (space, posicion, layer) {

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#eevee_01.png");
        this.incluirEnVista(space,posicion,layer);

    },
    actualizar:function(){

    },
    cambiarAModoLucha:function (space, posicion, layer) {

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#eevee_ataque_01.png");
        this.incluirEnVista(space,posicion,layer);

    },
    incluirEnVista:function(space, posicion, layer){
        this.space = space;
        this.layer = layer;

        // Cuerpo dinamico, SI le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);

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

        //Animaciones

        //---------

        layer.addChild(this.sprite,10);
    }
});
