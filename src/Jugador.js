var derecha = 1;
var izquierda = 2;
var arriba = 3;
var abajo = 4;

var estadoCaminando = 0;

var Jugador = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    orientacion:abajo,
    aQuietoAbajo:null,
    aQuietoIzquierda:null,
    aQuietoDerecha:null,
    aQuietoArriba:null,
    aDerecha:null,
    aIzquierda:null,
    aArriba:null,
    aAbajo:null,
    animacion:null, // Actual
    estado: estadoCaminando,
    capturados: [],

    ctor:function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#jugador_quieto_01.png");
        // Cuerpo dinamico, SI le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);
        /*this.body = new cp.Body(5, cp.momentForBox(1,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height));*/

        this.body.setPos(posicion);
        //this.body.w_limit = 0.02;
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        // Se añade el cuerpo al espacio
        this.space.addBody(this.body);

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoJugador);

        this.shape.setFriction(1);
        this.shape.setElasticity(0);

        // forma dinamica
        this.space.addShape(this.shape);

        // Crear animación - quieto abajo
        var framesAnimacion = [];

        var str = "jugador_quieto_01.png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.aQuietoAbajo =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - quieto izquierda
        var framesAnimacion = [];

        var str = "jugador_quieto_02.png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.aQuietoIzquierda =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - quieto derecha
        var framesAnimacion = [];

        var str = "jugador_quieto_03.png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.aQuietoDerecha =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - quieto arriba
        var framesAnimacion = [];

        var str = "jugador_quieto_04.png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.aQuietoArriba =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - derecha
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "jugador_derecha_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.aDerecha =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - izquierda
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "jugador_izquierda_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.aIzquierda =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - arriba
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "jugador_arriba_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.aArriba =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - abajo
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "jugador_abajo_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.aAbajo =
            new cc.RepeatForever(new cc.Animate(animacion));

        // ejecutar la animación
        this.animacion = this.aQuietoAbajo;

        layer.addChild(this.sprite,10);

    },
    actualizar:function(){
        switch ( this.estado ){
            case estadoCaminando:
                if ( this.body.vx > 0.001){
                    this.orientacion = derecha;
                    if ( this.animacion != this.aDerecha){
                        this.animacion = this.aDerecha;
                        this.sprite.stopAllActions();
                        this.sprite.runAction(this.animacion);
                    }
                } else if (this.body.vx < -0.001){
                    this.orientacion = izquierda;
                    if ( this.animacion != this.aIzquierda){
                        this.animacion = this.aIzquierda;
                        this.sprite.stopAllActions();
                        this.sprite.runAction(this.animacion);
                    }
                } else if ( this.body.vy > 0.001){
                    this.orientacion = arriba;
                    if ( this.animacion != this.aArriba){
                        this.animacion = this.aArriba;
                        this.sprite.stopAllActions();
                        this.sprite.runAction(this.animacion);
                    }
                } else if (this.body.vy < -0.001){
                    this.orientacion = abajo;
                    if ( this.animacion != this.aAbajo){
                        this.animacion = this.aAbajo;
                        this.sprite.stopAllActions();
                        this.sprite.runAction(this.animacion);
                    }
                }
                else {
                    if(this.orientacion == arriba){
                        this.animacion = this.aQuietoArriba;
                    }
                    else if(this.orientacion == izquierda){
                        this.animacion = this.aQuietoIzquierda;
                    }
                    else if(this.orientacion == derecha){
                        this.animacion = this.aQuietoDerecha;
                    }
                    else{
                        this.animacion = this.aQuietoAbajo;
                    }
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
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
    },


    entrarGimnasio(){
        var pokemonNivel2 = 0;
        for(var i= 0; i<this.capturados.length; i++){
            if(this.capturados[i].nivel >= 2 )
                pokemonNivel2 ++;
        }

        if(pokemonNivel2 >= 2){
            //Todo
        }
        else{

        }
    }

});
