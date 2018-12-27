var controles = {};
var teclas = [];

var GameLayer = cc.Layer.extend({
    caballero:null,
    space:null,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    ctor:function () {
       this._super();
       var size = cc.winSize;

       cc.spriteFrameCache.addSpriteFrames(res.jugador_plist);

       // Inicializar Space (sin gravedad)
       this.space = new cp.Space();
       /**
       this.depuracion = new cc.PhysicsDebugNode(this.space);
       this.addChild(this.depuracion, 10);
       **/

       this.cargarMapa();
       this.scheduleUpdate();

       this.caballero = new Jugador(this.space,
              cc.p(50,150), this);

       cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.procesarKeyPressed.bind(this),
            onKeyReleased: this.procesarKeyReleased.bind(this)
       }, this);

       return true;

    },
    update:function (dt) {
       this.space.step(dt);
       this.procesarControles();
       this.caballero.actualizar();

       // Mover cámara
       var posicionXCamara = this.caballero.body.p.x - this.getContentSize().width/2;
       var posicionYCamara = this.caballero.body.p.y - this.getContentSize().height/2;

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
    cargarMapa:function () {
       this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
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
    },
    procesarKeyPressed:function(keyCode){
        console.log("procesarKeyPressed "+keyCode);
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
        console.log("procesarKeyReleased "+keyCode);
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
        this.caballero.moverX(controles.moverX);
        this.caballero.moverY(controles.moverY);
    }
});



var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
