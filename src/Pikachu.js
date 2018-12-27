var vida = 10;
var nivel = 1;

var Pikachu = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacion:null,
    ctor:function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#pikachu_quieto_01.png");
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

        this.shape.setFriction(1);
        this.shape.setElasticity(0);

        // forma dinamica
        this.space.addShape(this.shape);

        // ejecutar la animación
        this.animacion = this.aQuietoAbajo;

        //Animaciones

        //---------
        
        layer.addChild(this.sprite,10);

    },
    actualizar:function(){

    }
});
