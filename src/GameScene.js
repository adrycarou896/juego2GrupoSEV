var controles = {};
var teclas = [];

var tipoJugador = 1;
var tipoEnemigo = 2;
var tipoEnemigoDerecha = 4;
var tipoEnemigoIzquierda = 5;

var GameLayer = cc.Layer.extend({
    jugador:null,
    enemigos: [],
    space:null,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    ctor:function () {
       this._super();
       var size = cc.winSize;

       cc.spriteFrameCache.addSpriteFrames(res.jugador_plist);
       cc.spriteFrameCache.addSpriteFrames(res.eevee_plist);
       cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);

       // Inicializar Space (sin gravedad)
       this.space = new cp.Space();

       //this.depuracion = new cc.PhysicsDebugNode(this.space);
       //this.addChild(this.depuracion, 10);

       this.cargarMapa();
       this.scheduleUpdate();

        // COLISIONES
        // Zona de escuchadores de colisiones

        // Colisión Suelo y Jugador
        //this.space.addCollisionHandler(tipoLimite, tipoJugador,
         //   null, null, this.collisionSueloConJugador.bind(this), this.finCollisionSueloConJugador.bind(this));

        //Colisión jugador con enemigo
        this.space.addCollisionHandler(tipoJugador, tipoEnemigo,
            null, null, this.collisionJugadorConEnemigo.bind(this), null);

       cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.procesarKeyPressed.bind(this),
            onKeyReleased: this.procesarKeyReleased.bind(this)
       }, this);

       return true;

    },
    update:function (dt) {

       this.procesarControles();
       this.jugador.actualizar();

        this.space.step(dt);

       // Mover cámara
       var posicionXCamara = this.jugador.body.p.x - this.getContentSize().width/2;
       var posicionYCamara = this.jugador.body.p.y - this.getContentSize().height/2;

       if ( posicionXCamara < 0 ){
          posicionXCamara = 0;
       }
       if ( posicionXCamara > this.mapaAncho - this.getContentSize().width ){
          posicionXCamara = this.mapaAncho - this.getContentSize().width;
       }

       if ( posicionYCamara < 0 ){
           posicionYCamara = 0;
       }
       if ( posicionYCamara > this.mapaAlto - this.getContentSize().height ){
           posicionYCamara = this.mapaAlto - this.getContentSize().height ;
       }

       this.setPosition(cc.p( - posicionXCamara , - posicionYCamara));

    },
    collisionJugadorConEnemigo:function (arbiter, space){
        console.log("COLISION CON ENEMIGO");
        var shapes = arbiter.getShapes();
        var enemigo = shapes[1];
    },
    cargarMapa:function () {
       this.mapa = new cc.TMXTiledMap(res.mapa);
       // Añadirlo a la Layer
       this.addChild(this.mapa);
       // Ancho del mapa
       this.mapaAncho = this.mapa.getContentSize().width;
       this.mapaAlto = this.mapa.getContentSize().height;

        // Solicitar los objeto dentro de la capa Limites
        var grupoLimites = this.mapa.getObjectGroup("Limites");
        var limitesArray = grupoLimites.getObjects();

        // Los objetos de la capa limites
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < limitesArray.length; i++) {
              var limite = limitesArray[i];
              var puntos = limite.polylinePoints;
              for(var j = 0; j < puntos.length - 1; j++){
                  var bodyLimite = new cp.StaticBody();

                  var shapeLimite = new cp.SegmentShape(bodyLimite,
                      cp.v(parseInt(limite.x) + parseInt(puntos[j].x),
                          parseInt(limite.y) - parseInt(puntos[j].y)),
                      cp.v(parseInt(limite.x) + parseInt(puntos[j + 1].x),
                          parseInt(limite.y) - parseInt(puntos[j + 1].y)),
                      1);

                  shapeLimite.setFriction(1);
                  shapeLimite.setElasticity(0);
                  this.space.addStaticShape(shapeLimite);
              }
        }

        //Jugador
        var grupoJugador = this.mapa.getObjectGroup("Jugador");
        var arrayJugador = grupoJugador.getObjects();
        this.jugador = new Jugador(this.space,
            cc.p(arrayJugador[0]["x"],arrayJugador[0]["y"]), this);

        //Enemigos salvajes
        var grupoEnemigosSalvajes = this.mapa.getObjectGroup("EnemigoSalvaje");
        var enemigosSavajesArray = grupoEnemigosSalvajes.getObjects();
        for (var i = 0; i < enemigosSavajesArray.length; i++) {
            var enemigo = new Eevee(this.space,
                cc.p(enemigosSavajesArray[i]["x"],enemigosSavajesArray[i]["y"]),this);
            this.enemigos.push(enemigo);
        }
    },
    procesarKeyPressed:function(keyCode){
        var posicion = teclas.indexOf(keyCode);
        if ( posicion == -1 ) {
            teclas.push(keyCode);
            switch (keyCode ){
                case 39:
                    // ir derecha
                    console.log("controles.moverX = 1");
                    controles.moverX = 1;
                    break;
                case 37:
                    // ir izquierda
                    controles.moverX = -1;
                    break;
                case 38:
                    // ir arriba
                    controles.moverY = 1;
                    break;
                case 40:
                    // ir abajo
                    controles.moverY = -1;
                    break;
            }
        }
    },
    procesarKeyReleased(keyCode){
        var posicion = teclas.indexOf(keyCode);
        teclas.splice(posicion, 1);
        switch (keyCode ){
            case 39:
                if ( controles.moverX == 1){
                    controles.moverX = 0;
                }
                break;
            case 37:
                if ( controles.moverX == -1){
                    controles.moverX = 0;
                }
                break;
            case 38:
                if ( controles.moverY == 1){
                    controles.moverY = 0;
                }
                break;
            case 40:
                if ( controles.moverY == -1){
                    controles.moverY = 0;
                }
                break;
        }
    },


    procesarControles:function(){
        this.jugador.moverX(controles.moverX);
        this.jugador.moverY(controles.moverY);
    }
});



var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
