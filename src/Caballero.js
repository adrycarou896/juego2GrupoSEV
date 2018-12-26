var derecha = 1;
var izquierda = 2;
var arriba = 3;
var abajo = 4;

var estadoCaminando = 0;

var Caballero = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    orientacion:derecha,
    aQuieto:null,
    aDerecha:null,
    aIzquierda:null,
    aArriba:null,
    aAbajo:null,
    animacion:null, // Actual
    estado: estadoCaminando,
ctor:function (space, posicion, layer) {
    this.space = space;
    this.layer = layer;

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#entrenador_quieto_01.png");
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

    // Crear animación - quieto
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "entrenador_quieto_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.aQuieto =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - derecha
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "entrenador_derecha_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.aDerecha =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - izquierda
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "entrenador_izquierda_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.aIzquierda =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - arriba
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "entrenador_arriba_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.aArriba =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - abajo
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "entrenador_abajo_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.aAbajo =
        new cc.RepeatForever(new cc.Animate(animacion));

    // ejecutar la animación
    this.animacion = this.aQuieto;

    layer.addChild(this.sprite,10);

},
actualizar:function(){
    switch ( this.estado ){
        case estadoCaminando:
            if ( this.body.vx > 0.001){
                if ( this.animacion != this.aDerecha){
                    this.animacion = this.aDerecha;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
            } else if (this.body.vx < -0.001){
                if ( this.animacion != this.aIzquierda){
                    this.animacion = this.aIzquierda;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
            } else if ( this.body.vy > 0.001){
                if ( this.animacion != this.aArriba){
                    this.animacion = this.aArriba;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
            } else if (this.body.vy < -0.001){
                if ( this.animacion != this.aAbajo){
                    this.animacion = this.aAbajo;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
            }
            else {
                if ( this.animacion != this.aQuieto){
                    this.animacion = this.aQuieto;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
            }
        break;
        /** añadir otros estados, disparar, etc **/
    }
},
moverX:function(movimientoX){
       if ( movimientoX > 0){
            if (this.body.vx < 100){
                this.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));
            } else { // vx mayor más de 100
                this.body.vx = 100;
            }
        }
        if ( movimientoX < 0){
            if (this.body.vx > -100){
                this.body.applyImpulse(cp.v(-300, 0), cp.v(0, 0));
            } else { // vx nunca menor que -100
                this.body.vx = -100; //limitado
            }
        }
        if ( movimientoX == 0 ){
            this.body.vx = 0;
        }
},
moverY:function(movimientoY){
        if ( movimientoY > 0){
             if (this.body.vy < 100){
                 this.body.applyImpulse(cp.v(0, 30), cp.v(0, 0));
             } else { // vy mayor más de 100
                 this.body.vy = 100;
             }
        }
        if ( movimientoY < 0){
             if (this.body.vy > -100){
                 this.body.applyImpulse(cp.v(0, -300), cp.v(0, 0));
             } else { // vy nunca menor que -100
                 this.body.vy = -100; //limitado
             }
        }
        if ( movimientoY == 0 ){
             this.body.vy = 0;
        }
}

});
