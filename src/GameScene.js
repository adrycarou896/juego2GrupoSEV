var controles = {};
var teclas = [];

var tipoJugador = 1;
var tipoEnemigo = 2;
var tipoGimnasio = 3;
var tipoMostrador = 4;
var tipoSalir = 5;
var tipoDisparo = 6;
var tipoJugadorPokemon = 7;
var tipoDisparoEnemigo = 8;
var tipoCentroPokemon = 9;
var tipoPokeball = 10;

var GameLayer = cc.Layer.extend({
    jugador:null,
    enemigos: [],
    space:null,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    nombre: "GameLayer",
    saleDe: 0,
    ctor:function (jugador, saleDe) {
       this._super();
       var size = cc.winSize;

       this.saleDe = saleDe;

        cc.spriteFrameCache.addSpriteFrames(res.jugador_plist);
        cc.spriteFrameCache.addSpriteFrames(res.eevee_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);
        cc.spriteFrameCache.addSpriteFrames(res.pikachu_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.piplup_idle_plist);

        // Inicializar Space (sin gravedad)
       this.space = new cp.Space();

       //this.depuracion = new cc.PhysicsDebugNode(this.space);
       //this.addChild(this.depuracion, 10);

       this.cargarMapa(jugador);
       this.scheduleUpdate();

        // COLISIONES
        // Zona de escuchadores de colisiones


        this.space.addCollisionHandler(tipoGimnasio, tipoJugador,
            null, null, this.colisionConGimnasio.bind(this), this.finColisionConGimnasio.bind(this));

        this.space.addCollisionHandler(tipoCentroPokemon, tipoJugador,
            null, null, this.colisionConCentroPokemon.bind(this), this.finColisionConCentroPokemon.bind(this));

        //Colisión jugador con enemigo
        this.space.addCollisionHandler(tipoJugador, tipoEnemigo,
            null, null, this.collisionJugadorConEnemigo.bind(this), this.finColisionJugadorConEnemigo.bind(this));

       cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: procesarKeyPressed.bind(this),
            onKeyReleased: procesarKeyReleased.bind(this)
       }, this);

       return true;

    },
    update:function (dt) {

       procesarControles(this.jugador);
       this.jugador.actualizar();

       this.space.step(dt);

       moverCamara(this.jugador, this.getContentSize(), this.mapaAncho, this.mapaAlto, this);

    },

    finColisionJugadorConEnemigo:function(){
        //this.getParent().removeChild(this.menuLuchaLayer)
        //this.menuLuchaLayer = null;
    },

    collisionJugadorConEnemigo:function (arbiter, space){
        var pokemonConVida = this.jugador.pokemonVivos();

        if(pokemonConVida) {
            var shapes = arbiter.getShapes();
            var shapeEnemigo = shapes[1];
            //console.log("tam->"+this.enemigos.length);
            for (var j = 0; j < this.enemigos.length; j++) {
                if (this.enemigos[j].shape == shapeEnemigo) {
                    var layerLucha = new LuchaLayer(this.enemigos[j], this.jugador, this);
                    layerLucha.crearPokemonJugador();
                    this.getParent().addChild(layerLucha);
                    /*if(this.menuLuchaLayer == null){
                        this.menuLuchaLayer = new MenuLuchaLayer(layerLucha.pokemonJugador,layerLucha);
                        this.getParent().addChild(this.menuLuchaLayer);
                    }*/
                    this.jugador.body.p.x = 416;
                    this.jugador.body.p.y = 480;

                }
            }
        }
        else{
            var mensaje = new MensajesLayer(8, this, this.jugador);
            this.getParent().addChild(mensaje);
            mensaje.mostrar();
        }
    },
    cargarMapa:function (jugador) {
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

        var lineasGimnasio = this.mapa.getObjectGroup("Gimnasio");
        var arrayGimnasio = lineasGimnasio.getObjects();
        for (var i = 0; i < arrayGimnasio.length; i++) {
            var limite = arrayGimnasio[i];
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
                shapeLimite.setCollisionType(tipoGimnasio);
                this.space.addStaticShape(shapeLimite);
            }
        }


        var lineasCentroPokemon = this.mapa.getObjectGroup("CentroPokemon");
        var arrayCentroPokemon = lineasCentroPokemon.getObjects();
        for (var i = 0; i < arrayCentroPokemon.length; i++) {
            var limite = arrayCentroPokemon[i];
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
                shapeLimite.setCollisionType(tipoCentroPokemon);
                this.space.addStaticShape(shapeLimite);
            }
        }

        //Jugador
        if(jugador == null) {
            var grupoJugador = this.mapa.getObjectGroup("Jugador");
            var arrayJugador = grupoJugador.getObjects();
            this.jugador = new Jugador(this.space,
                cc.p(arrayJugador[0]["x"], arrayJugador[0]["y"]), this);
        }
        else{
            if(this.saleDe == 1) { //Sale del gimnasio
                this.jugador = new Jugador(this.space,
                    cc.p(775, 750), this);
            }
            else if(this.saleDe == 2) { //Sale del Centro Pokemon
                this.jugador = new Jugador(this.space,
                    cc.p(685, 608), this);
            }
            this.jugador.capturados = jugador.capturados;
        }

        //Enemigos salvajes
        var grupoEnemigosSalvajes = this.mapa.getObjectGroup("EnemigoSalvaje");
        var enemigosSavajesArray = grupoEnemigosSalvajes.getObjects();
        for (var i = 0; i < enemigosSavajesArray.length; i++) {
            var enemigo = new Eevee();
            enemigo.mostrarEnCampo(this.space,
                cc.p(enemigosSavajesArray[i]["x"],enemigosSavajesArray[i]["y"]),this);
            this.enemigos.push(enemigo);
        }
    },


    colisionConGimnasio:function (arbiter, space) {
        this.jugador.entrarGimnasio();
    },


    finColisionConGimnasio:function (arbiter, space) {
        this.getParent().removeChild(this.jugador.layer);
    },

    colisionConCentroPokemon:function (arbiter, space) {
        this.jugador.entrarCentroPokemon();
    },


    finColisionConCentroPokemon:function (arbiter, space) {
        this.getParent().removeChild(this.jugador.layer);
    }

});


function procesarKeyPressed(keyCode){
    var posicion = teclas.indexOf(keyCode);
    if ( posicion == -1 ) {
        teclas.push(keyCode);
        switch (keyCode ){
            case 39:
                // ir derecha
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
}


function procesarKeyReleased(keyCode){
    var posicion = teclas.indexOf(keyCode);
    teclas.splice(posicion, 1);
    switch (keyCode){
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
}

function procesarControles(jugador){
    jugador.moverX(controles.moverX);
    jugador.moverY(controles.moverY);
}

function moverCamara(jugador, contentSize, mapaAncho, mapaAlto, layer){

    // Mover cámara
    var posicionXCamara = jugador.body.p.x - contentSize.width/2;
    var posicionYCamara = jugador.body.p.y - contentSize.height/2;

    if ( posicionXCamara < 0 ){
        posicionXCamara = 0;
    }
    if ( posicionXCamara > mapaAncho - contentSize.width ){
        posicionXCamara = mapaAncho - contentSize.width;
    }

    if ( posicionYCamara < 0 ){
        posicionYCamara = 0;
    }
    if ( posicionYCamara > mapaAlto - contentSize.height ){
        posicionYCamara = mapaAlto - contentSize.height ;
    }

    layer.setPosition(cc.p( - posicionXCamara , - posicionYCamara));
}


function procesarKeyReleasedInscripcionTorneo(keyCode){
    var posicion = teclas.indexOf(keyCode);
    teclas.splice(posicion, 1);
    switch (keyCode){
        case 83://s
            console.log("has pulsado siiiiiiiii");
            this.getParent().addChild(new TorneoLayer(this.jugador));
            //Todo
            break;
        case 78: //n
            console.log("has pulsado nooooooo");
            //Todo
            break;
    }
}


var LayerInscripcionTorneo = cc.Layer.extend({
    space: null,
    nombre: "LayerInscripcionTorneo",
    jugador: null,
    ctor:function (jugador) {
        this._super();
        var size = cc.winSize;

        // Fondo
        var spriteFondoTitulo= new cc.Sprite(res.mensaje_inscripcion_torneo);
        // Asigno posición central
        spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2));

        this.jugador = jugador;

        // Añado Sprite a la escena
        this.addChild(spriteFondoTitulo);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: procesarKeyReleasedInscripcionTorneo.bind(this),
            onKeyReleased: procesarKeyReleasedInscripcionTorneo.bind(this)
        }, this);


        return true;
    }

});


var LayerSolicitarCuracion = cc.Layer.extend({
    space: null,
    nombre: "LayerSolicitarCuracion",
    jugador: null,
    layer: null,
    ctor:function (jugador) {
        this._super();
        var size = cc.winSize;

        this.jugador = jugador;
        this.layer = this.jugador.layer;

        // Fondo
        var spriteFondoTitulo= new cc.Sprite(res.mensaje_curar_pokemon);
        // Asigno posición central
        spriteFondoTitulo.setPosition(cc.p(550, 375-spriteFondoTitulo.height/2));

        // Añado Sprite a la escena
        this.addChild(spriteFondoTitulo);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.procesarKeyReleasedSolicitarCuracion.bind(this),
            onKeyReleased: this.procesarKeyReleasedSolicitarCuracion.bind(this)
        }, this);


        return true;
    },

    procesarKeyReleasedSolicitarCuracion: function(keyCode){
    var posicion = teclas.indexOf(keyCode);
    teclas.splice(posicion, 1);
    switch (keyCode){
        case 83://s
            this.jugador.curarPokemon();
            var mensaje = new MensajesLayer(3, this, this.jugador);
            this.getParent().addChild(mensaje);
            this.getParent().removeChild(this);
            mensaje.mostrar();
            break;
        case 78: //n
            var mensaje = new MensajesLayer(4, this, this.jugador);
            this.getParent().addChild(mensaje);
            this.getParent().removeChild(this);
            mensaje.mostrar();
            break;
    }
}

});





var LayerGimnasio = cc.Layer.extend({
    jugador:null,
    space:null,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    nombre: "LayerGimnasio",
    personaMostrador: null,


    ctor:function (jugador, prohibido) {
        this._super();
        var size = cc.winSize;

        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();

        // Fondo
        if(prohibido) {
            this.spriteFondo = cc.Sprite.create(res.fondo_mensaje_prohibido_gimnasio);
            this.spriteFondo.setPosition(cc.p(size.width - (Math.abs(jugador.body.p.x - size.width)) - (this.spriteFondo.width),
                size.height - (Math.abs(size.height - jugador.body.p.y)) + this.spriteFondo.height));
            this.addChild(this.spriteFondo);
        }
        else{

            cc.spriteFrameCache.addSpriteFrames(res.jugador_plist);

            this.cargarMapaGimnasio(jugador);
            this.scheduleUpdate();

            this.space.addCollisionHandler(tipoSalir, tipoJugador,
                null, null, this.colisionSalirGimnasio.bind(this), this.finColisionSalirGimnasio.bind(this));

            this.space.addCollisionHandler(tipoMostrador, tipoJugador,
                null, null, this.colisionConMostrador.bind(this), this.finColisionConMostrador.bind(this));

            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: procesarKeyPressed.bind(this),
                onKeyReleased: procesarKeyReleased.bind(this)
            }, this);
        }

        return true;

    },


    colisionConMostrador:function(){
        this.jugador.inscribirTorneo();
        this.jugador.inscribirTorneo();
    },

    finColisionConMostrador:function(){
        this.getParent().removeChild(this.jugador.layerInscripcionTorneo);
        this.jugador.layerInscripcionTorneo = null;
    },

    colisionSalirGimnasio:function(){

        var layer =  new GameLayer(this.jugador, 1);
        this.jugador.layer.getParent().addChild(layer);
        this.jugador.layer.getParent().removeChild(this.jugador.layer);

    },


    finColisionSalirGimnasio:function(){

    },


    update:function (dt) {
        procesarControles(this.jugador);
        this.jugador.actualizar();

        this.space.step(dt);

        moverCamara(this.jugador, this.getContentSize(), this.mapaAncho, this.mapaAlto, this);

    },


    cargarMapaGimnasio:function(jugador){
        this.mapa = new cc.TMXTiledMap(res.mapa_gimnasio);
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

        var lineasMostrador = this.mapa.getObjectGroup("Mostrador");
        var arrayMostrador = lineasMostrador.getObjects();
        for (var i = 0; i < arrayMostrador.length; i++) {
            var limite = arrayMostrador[i];
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
                shapeLimite.setCollisionType(tipoMostrador);
                this.space.addStaticShape(shapeLimite);
            }
        }

        var lineasSalir = this.mapa.getObjectGroup("Salir");
        var arraySalir = lineasSalir.getObjects();
        for (var i = 0; i < arraySalir.length; i++) {
            var limite = arraySalir[i];
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
                shapeLimite.setCollisionType(tipoSalir);
                this.space.addStaticShape(shapeLimite);
            }
        }

        //Jugador
        var grupoJugador = this.mapa.getObjectGroup("Jugador");
        var arrayJugador = grupoJugador.getObjects();
        this.jugador = new Jugador(this.space,
            cc.p(arrayJugador[0]["x"],arrayJugador[0]["y"]), this);
        this.jugador.capturados = jugador.capturados;



    }

});


var CentroPokemonLayer = cc.Layer.extend({
    jugador:null,
    space:null,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    nombre: "CentroPokemonLayer",
    ctor:function (jugador) {

        this._super();

        this.space = new cp.Space();
        this.jugador = jugador;

        this.cargarMapaCentroPokemon(jugador);
        this.scheduleUpdate();

        this.space.addCollisionHandler(tipoMostrador, tipoJugador,
            null, null, this.colisionConMostrador.bind(this), this.finColisionConMostrador.bind(this));

        this.space.addCollisionHandler(tipoSalir, tipoJugador,
            null, null, this.colisionSalirCentroPokemon.bind(this), this.finColisionSalirCentroPokemon.bind(this));

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: procesarKeyPressed.bind(this),
            onKeyReleased: procesarKeyReleased.bind(this)
        }, this);


    },

    update:function (dt) {
        procesarControles(this.jugador);
        this.jugador.actualizar();

        this.space.step(dt);

        moverCamara(this.jugador, this.getContentSize(), this.mapaAncho, this.mapaAlto, this);

    },


    cargarMapaCentroPokemon:function(jugador){

        this.mapa = new cc.TMXTiledMap(res.mapa_centro_pokemon);

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

        var lineasMostrador = this.mapa.getObjectGroup("Mostrador");
        var arrayMostrador = lineasMostrador.getObjects();
        for (var i = 0; i < arrayMostrador.length; i++) {
            var limite = arrayMostrador[i];
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
                shapeLimite.setCollisionType(tipoMostrador);
                this.space.addStaticShape(shapeLimite);
            }
        }

        var lineasSalir = this.mapa.getObjectGroup("Salir");
        var arraySalir = lineasSalir.getObjects();
        for (var i = 0; i < arraySalir.length; i++) {
            var limite = arraySalir[i];
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
                shapeLimite.setCollisionType(tipoSalir);
                this.space.addStaticShape(shapeLimite);
            }
        }

        //Jugador
        var grupoJugador = this.mapa.getObjectGroup("Jugador");
        var arrayJugador = grupoJugador.getObjects();
        this.jugador = new Jugador(this.space,
            cc.p(arrayJugador[0]["x"],arrayJugador[0]["y"]), this);
        this.jugador.capturados = jugador.capturados;

        //Enfermera
        var grupoEnfermera = this.mapa.getObjectGroup("Enfermera");
        var arrayEnfermera = grupoEnfermera.getObjects();

        this.spriteEnfermera = cc.Sprite.create(res.nurse_png);
        this.spriteEnfermera.setPosition(cc.p(arrayEnfermera[0]["x"],arrayEnfermera[0]["y"]));
        this.spriteEnfermera.setScale( 0.60 );
        this.addChild(this.spriteEnfermera);

    },

    colisionConMostrador:function(){
        this.jugador.solicitarCuracion();
    },

    finColisionConMostrador:function(){
        this.getParent().removeChild(this.jugador.layerSolicitarCuracion);
        this.jugador.layerSolicitarCuracion = null;
    },

    colisionSalirCentroPokemon:function(){

        var layer =  new GameLayer(this.jugador, 2);
        this.jugador.layer.getParent().addChild(layer);
        this.jugador.layer.getParent().removeChild(this.jugador.layer);

    },

    finColisionSalirCentroPokemon:function(){

    },



});

var LuchaLayer = cc.Layer.extend({
    jugador:null,
    enemigo:null,
    space:null,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    pokemonJugador: null,
    disparosJugador: [],
    disparosEnemigo: [],
    layer: null,
    nombre: "LuchaLayer",
    formasEliminar: [],
    tiempoEfecto:0,
    tiempoEfectoPokemonJugador:0,
    tiempoDisparoEnemigo:0,
    tiempoAtaquePokemonJugador:0,
    menu: null,
    pokeball: null,
    mensaje: null,
    vidaPokemonJugadorLayer: null,
    vidaEnemigoLayer: null,
    ctor:function (enemigo, jugador, layer) {
        this._super();
        var size = cc.winSize;

        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();

        this.jugador = jugador;
        this.layer = layer;

        cc.spriteFrameCache.addSpriteFrames(res.pikachu_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.eevee_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.disparo_jugador_plist);
        cc.spriteFrameCache.addSpriteFrames(res.bola_fuego_izquierda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.bola_fuego_derecha_plist);
        cc.spriteFrameCache.addSpriteFrames(res.pokeball_plist);
        cc.spriteFrameCache.addSpriteFrames(res.pokeball_volando_plist);
        cc.spriteFrameCache.addSpriteFrames(res.rayo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.bola_agua_plist);
        cc.spriteFrameCache.addSpriteFrames(res.charco_agua_plist);
        cc.spriteFrameCache.addSpriteFrames(res.piplup_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.pokeball_cerrada_plist);
        cc.spriteFrameCache.addSpriteFrames(res.pokeball_abierta_plist);
        cc.spriteFrameCache.addSpriteFrames(res.eevee_espalda_plist);


        this.seleccionarPokemonAtaque();

        this.enemigo = enemigo;

        // Fondo
        this.spriteFondo = cc.Sprite.create(res.fondo_lucha_1);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale( size.width / this.spriteFondo.width );
        this.addChild(this.spriteFondo);

        this.enemigo.mostrarSiEsEnemigo(this.space, cc.p(600,210), this);

        this.scheduleUpdate();

        //Colisión disparo jugador con enemigo
        this.space.addCollisionHandler(tipoDisparo, tipoEnemigo,
            null, null, this.collisionDisparoConEnemigo.bind(this), this.finColisionDisparoConEnemigo.bind(this));

        //Colision disparo enemigo con jugador
        this.space.addCollisionHandler(tipoDisparoEnemigo, tipoJugadorPokemon,
            null, null, this.collisionDisparoEnemigoConJugadorPokemon.bind(this), this.finColisionDisparoConEnemigo.bind(this));

        //Colisión pokeball con enemigo
        this.space.addCollisionHandler(tipoPokeball, tipoEnemigo,
            null, null, this.colisionPokeballEnemigo.bind(this), this.finColisionPokeballEnemigo.bind(this));

        if(this.pokemonJugador != null) {
            this.menu = new MenuLuchaLayer(this.pokemonJugador, this);
            this.addChild(this.menu);
        }


        return true;

    },

    colisionPokeballEnemigo: function(){
        this.removeChild(this.enemigo.sprite);
        this.pokeball.cambiarAModoCaptura(this.space, cc.p(600, 210), this);
        this.enemigo.dentroPokeball = true;
    },

    finColisionPokeballEnemigo: function(){

    },

    seleccionarPokemonAtaque:function(){
        for (var i = 0; i < this.jugador.capturados.length; i++) {
            if (this.jugador.capturados[i].vida > 0) {
                this.pokemonJugador = this.jugador.capturados[i];
                break;
            }
        }
    },
    crearPokemonJugador:function(){
        if(this.pokemonJugador != null) {
            //if ("Pikachu" == this.pokemonJugador.name || "Piplup" == this.pokemonJugador.name ) {
                this.pokemonJugador.mostrar(this.space, cc.p(230, 115), this);
                return true;
            //}
        }
        else{
            return false;
        }
    },
    collisionDisparoConEnemigo:function (arbiter, space){

        var shapes = arbiter.getShapes();
        for (var j = 0; j < this.disparosJugador.length; j++) {
            if (this.disparosJugador[j].shape == shapes[0]) {
                if (this.disparosJugador[j] instanceof RayoAtaque && !this.disparosJugador[j].activo) {
                    this.disparosJugador[j].activo = true;
                    this.tiempoAtaquePokemonJugador = 1;
                }
                else if(this.disparosJugador[j] instanceof CharcoAguaAtaque && !this.disparosJugador[j].activo){
                    this.disparosJugador[j].activo = true;
                    this.tiempoAtaquePokemonJugador = 2;
                }
            }
        }
        if (this.tiempoAtaquePokemonJugador == 0) {
            this.formasEliminar.push(shapes[0]);
            this.enemigo.impactadoSiEsEnemigo(this.disparosJugador[0]);
            this.tiempoEfecto = 1;
        }


    },
    finColisionDisparoConEnemigo:function(){

        if(this.enemigo.vida <= 0){
            this.crearPokeball();
            this.enemigo.estado = enCaptura;
        }
        else {
            if (this.pokemonJugador.vida <= 0) {
                if(this.menu != null){
                    this.getParent().removeChild(this.menu);
                }

                var layerLucha = new LuchaLayer(this.enemigo, this.jugador, this.layer);
                var opcion = layerLucha.crearPokemonJugador();
                this.getParent().addChild(layerLucha);

                if (!opcion) {
                    if(this.menu != null){
                        this.removeChild(this.menu);
                    }
                    var mensaje = new MensajesLayer(2, layerLucha, this.jugador);
                    this.getParent().addChild(mensaje);
                    mensaje.mostrar();
                } else {
                    //Aviso cambio de pokemon
                    var mensaje = new MensajesLayer(1, layerLucha, this.jugador);
                    this.getParent().addChild(mensaje);
                    mensaje.mostrar();

                }
                this.getParent().removeChild(this);
            } else {
                if (this.menu == null && this.enemigo.vida > 0) {
                    this.menu = new MenuLuchaLayer(this.pokemonJugador, this);
                    this.getParent().addChild(this.menu);
                }
            }
        }
    },
    update:function (dt) {
        for(i=0; i < this.disparosJugador.length; i++){
            this.disparosJugador[i].actualizar();
        }
        for(i=0; i < this.disparosEnemigo.length; i++){
            this.disparosEnemigo[i].actualizar();
        }

        this.space.step(dt);

        // Eliminar formas:
        for (var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var j = 0; j < this.disparosJugador.length; j++) {
                if (this.disparosJugador[j].shape == shape) {
                    this.disparosJugador[j].eliminar();
                    this.disparosJugador.splice(j, 1);
                }
            }

            for (var j = 0; j < this.disparosEnemigo.length; j++) {
                if (this.disparosEnemigo[j].shape == shape) {
                    this.disparosEnemigo[j].eliminar();
                    this.disparosEnemigo.splice(j, 1);
                }
            }
        }
        this.formasEliminar = [];

        if(this.pokeball != null) {
            this.pokeball.actualizar();
            if (this.pokeball.estado == llena) {
                this.pokeball.cambiarAModoCerrada(this.space, cc.p(600, 210), this);
                if(this.pokeball.finAnimaciones <= 0){
                    if(this.mensaje == null) {
                        this.mensaje = new MensajesLayer(6, this, this.jugador);
                        this.getParent().addChild(this.mensaje);
                        this.mensaje.mostrar();
                    }
                }

            }
            else if (this.pokeball.estado == vacia) {
                this.pokeball.cambiarAModoAbierta(this.space, cc.p(600, 210), this);
                if(this.pokeball.finAnimaciones <= 0){
                    if(this.mensaje == null) {
                        this.mensaje = new MensajesLayer(7, this, this.jugador);
                        this.getParent().addChild(this.mensaje);
                        this.mensaje.mostrar();
                    }
                }
            }
        }

        if (this.tiempoEfecto > 0){
            this.tiempoEfecto = this.tiempoEfecto - dt;

        }
        if (this.tiempoEfecto < 0) {
            this.enemigo.cambiarAModoLucha();
            this.tiempoEfecto = 0;
            this.tiempoDisparoEnemigo = 1;
        }

        if(this.tiempoDisparoEnemigo > 0){
            this.tiempoDisparoEnemigo = this.tiempoDisparoEnemigo - dt;
        }
        if(this.tiempoDisparoEnemigo < 0){
            if(!this.enemigo.dentroPokeball){
                this.disparosEnemigo.push(new BolaFuegoAtaque(this,cc.p(550, 210), this.enemigo, 1));
            }
            this.tiempoDisparoEnemigo = 0;
        }

        if (this.tiempoEfectoPokemonJugador > 0){
            this.tiempoEfectoPokemonJugador = this.tiempoEfectoPokemonJugador - dt;

        }
        if (this.tiempoEfectoPokemonJugador < 0) {
            this.pokemonJugador.cambiarAAnimacionDeLucha();
            this.tiempoEfectoPokemonJugador = 0;
        }

        if (this.tiempoAtaquePokemonJugador > 0){
            this.tiempoAtaquePokemonJugador = this.tiempoAtaquePokemonJugador - dt;

        }
        if (this.tiempoAtaquePokemonJugador < 0) {
            this.tiempoAtaquePokemonJugador = 0;
        }

        if(this.vidaPokemonJugadorLayer != null)
            this.removeChild(this.vidaPokemonJugadorLayer);
        if(this.vidaEnemigoLayer != null)
            this.removeChild(this.vidaEnemigoLayer);
        if(this.pokemonJugador != null) {
            this.vidaPokemonJugadorLayer = new VidaLayer(this, this.pokemonJugador);
            this.addChild(this.vidaPokemonJugadorLayer);
            this.vidaPokemonJugadorLayer.actualizar();
        }

        this.vidaEnemigoLayer = new VidaLayer(this, this.enemigo);
        this.addChild(this.vidaEnemigoLayer);
        this.vidaEnemigoLayer.actualizar();
    },
    cargarMapa:function () {

    },
    collisionDisparoEnemigoConJugadorPokemon:function (arbiter, space){
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[0]);
        this.pokemonJugador.impactado(this.disparosEnemigo[0]);
        this.tiempoEfectoPokemonJugador = 1;
    },

    crearPokeball:function(){
        if(this.pokeball == null)
            this.pokeball = new Pokeball(this.space, cc.p(300,150), this, this.enemigo);
    }

});


var TorneoLayer = cc.Layer.extend({
    jugador:null,
    enemigo:null,
    space:null,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    pokemonJugador: null,
    enemigos: [],
    disparosJugador: [],
    disparosEnemigo: [],
    nombre: "TorneoLayer",
    formasEliminar: [],
    tiempoEfecto:0,
    tiempoEfectoPokemonJugador:0,
    tiempoDisparoEnemigo:0,
    tiempoAtaquePokemonJugador:0,
    tiempoLanzarAtaqueEnemigo:0,
    menu: null,
    pokeball: null,
    mensaje: null,
    menuLuchaLayer: null,
    ctor:function (jugador) {
        this._super();
        var size = cc.winSize;

        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();

        cc.spriteFrameCache.addSpriteFrames(res.pikachu_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.eevee_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.eevee_espalda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.disparo_jugador_plist);
        cc.spriteFrameCache.addSpriteFrames(res.bola_fuego_izquierda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.bola_fuego_derecha_plist);
        cc.spriteFrameCache.addSpriteFrames(res.rayo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.bola_agua_plist);
        cc.spriteFrameCache.addSpriteFrames(res.charco_agua_plist);
        cc.spriteFrameCache.addSpriteFrames(res.piplup_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.charizar_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.charizar_ataque1_plist);

        // Fondo
        this.spriteFondo = cc.Sprite.create(res.fondo_lucha_5);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale( size.width / this.spriteFondo.width );
        this.addChild(this.spriteFondo);

        this.jugador = jugador;

        this.enemigos.push(new Charizar());
        this.enemigo = this.enemigos[0];
        this.enemigo.mostrarSiEsEnemigo(this.space, cc.p(600,210), this);

        this.seleccionarPokemon();

        this.mostrarPokemonJugador();

        this.scheduleUpdate();

        //Colisión disparo jugador con enemigo
        this.space.addCollisionHandler(tipoDisparo, tipoEnemigo,
            null, null, this.collisionDisparoConEnemigo.bind(this), this.finColisionDisparoConEnemigo.bind(this));

        //Colision disparo enemigo con jugador
        this.space.addCollisionHandler(tipoDisparoEnemigo, tipoJugadorPokemon,
            null, null, this.collisionDisparoEnemigoConJugadorPokemon.bind(this), this.finColisionDisparoConEnemigo.bind(this));

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: this.procesarKeyReleasedSeleccionAtaque.bind(this)
        }, this);

        return true;

    },
    seleccionarPokemon:function(){
        for (var i = 0; i < this.jugador.capturados.length; i++) {
            if (this.jugador.capturados[i].vida > 0) {
                this.pokemonJugador = this.jugador.capturados[i];
                break;
            }
        }
    },
    mostrarPokemonJugador:function(){
        if(this.pokemonJugador != null) {
            //if ("Pikachu" == this.pokemonJugador.name || "Piplup" == this.pokemonJugador.name) {
                this.pokemonJugador.mostrar(this.space, cc.p(230, 115), this);
                return true;
            //}
        }
        else{
            return false;
        }
    },
    collisionDisparoConEnemigo:function (arbiter, space){

        if(this.enemigo.vida <= 0){
            console.log("Enemigo derrotadoooo");
            var mensaje = new MensajesLayer(5, this, this.jugador);
            this.getParent().addChild(mensaje);
            mensaje.mostrar();
            //this.getParent().removeChild(this);
        }
        else {
            var shapes = arbiter.getShapes();
            for (var j = 0; j < this.disparosJugador.length; j++) {
                if (this.disparosJugador[j].shape == shapes[0]) {
                    if (this.disparosJugador[j] instanceof RayoAtaque && !this.disparosJugador[j].activo) {
                        this.disparosJugador[j].activo = true;
                        this.tiempoAtaquePokemonJugador = 1;
                    }
                    else if(this.disparosJugador[j] instanceof CharcoAguaAtaque && !this.disparosJugador[j].activo){
                        this.disparosJugador[j].activo = true;
                        this.tiempoAtaquePokemonJugador = 2;
                    }
                }
            }
            if (this.tiempoAtaquePokemonJugador == 0) {
                this.formasEliminar.push(shapes[0]);
                this.enemigo.impactadoSiEsEnemigo(this.disparosJugador[0]);
                this.tiempoEfecto = 1;
            }
        }
    },
    finColisionDisparoConEnemigo:function(){
        if(this.pokemonJugador.vida <= 0){
            if(this.menu != null){
                this.getParent().removeChild(this.menu);
            }
            var layerTorneo = new TorneoLayer(this.jugador);
            var opcion = layerTorneo.mostrarPokemonJugador();
            this.getParent().addChild(layerTorneo);

            if (!opcion) {
                if(this.menu != null){
                    this.removeChild(this.menu);
                }
                var mensaje = new MensajesLayer(2, layerTorneo, this.jugador);
                this.getParent().addChild(mensaje);
                mensaje.mostrar();
            } else {
                //Aviso cambio de pokemon
                var mensaje = new MensajesLayer(1, layerTorneo, this.jugador);
                this.getParent().addChild(mensaje);
                mensaje.mostrar();

            }
            this.getParent().removeChild(this);
        }
        else if(this.enemigo.vida <= 0){
            console.log("Enemigo derrotadoooo");
            //var mensaje = new MensajesLayer(5, this, this.jugador);
            //this.getParent().addChild(mensaje);
            //mensaje.mostrar();
        }
        else {
            if (this.menu == null && this.enemigo.vida > 0) {
                this.menu = new MenuLuchaLayer(this.pokemonJugador, this);
                this.getParent().addChild(this.menu);
            }
        }
    },
    update:function (dt) {
        for(i=0; i < this.disparosJugador.length; i++){
            this.disparosJugador[i].actualizar();
        }
        for(i=0; i < this.disparosEnemigo.length; i++){
            this.disparosEnemigo[i].actualizar();
        }

        this.space.step(dt);

        // Eliminar formas:
        for (var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var j = 0; j < this.disparosJugador.length; j++) {
                if (this.disparosJugador[j].shape == shape) {
                    this.disparosJugador[j].eliminar();
                    this.disparosJugador.splice(j, 1);
                }
            }

            for (var j = 0; j < this.disparosEnemigo.length; j++) {
                if (this.disparosEnemigo[j].shape == shape) {
                    this.disparosEnemigo[j].eliminar();
                    this.disparosEnemigo.splice(j, 1);
                }
            }
        }
        this.formasEliminar = [];

        if (this.tiempoEfecto > 0){
            this.tiempoEfecto = this.tiempoEfecto - dt;

        }
        if (this.tiempoEfecto < 0) {
            this.enemigo.cambiarAModoLucha();
            this.tiempoEfecto = 0;
            this.tiempoDisparoEnemigo = 1;
        }

        if(this.tiempoDisparoEnemigo > 0){
            this.tiempoDisparoEnemigo = this.tiempoDisparoEnemigo - dt;
        }
        if(this.tiempoDisparoEnemigo < 0){
            this.enemigo.cambiarAAnimacionDeAtaque();
            this.disparosEnemigo.push(new BolaFuegoAtaque(this,cc.p(550, 210), this.pokemonJugador, 1));
            this.tiempoDisparoEnemigo = 0;
            this.tiempoLanzarAtaqueEnemigo = 1;
        }

        if (this.tiempoLanzarAtaqueEnemigo > 0){
            this.tiempoLanzarAtaqueEnemigo = this.tiempoLanzarAtaqueEnemigo - dt;

        }
        if (this.tiempoLanzarAtaqueEnemigo < 0) {
            this.enemigo.cambiarAModoLucha();
            this.tiempoLanzarAtaqueEnemigo = 0;
        }

        if (this.tiempoEfectoPokemonJugador > 0){
            this.tiempoEfectoPokemonJugador = this.tiempoEfectoPokemonJugador - dt;

        }
        if (this.tiempoEfectoPokemonJugador < 0) {
            this.pokemonJugador.cambiarAAnimacionDeLucha();
            this.tiempoEfectoPokemonJugador = 0;
        }

        if (this.tiempoAtaquePokemonJugador > 0){
            this.tiempoAtaquePokemonJugador = this.tiempoAtaquePokemonJugador - dt;

        }
        if (this.tiempoAtaquePokemonJugador < 0) {
            this.tiempoAtaquePokemonJugador = 0;
        }
    },
    cargarMapa:function () {

    },
    collisionDisparoEnemigoConJugadorPokemon:function (arbiter, space){
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[0]);
        for (var j = 0; j < this.disparosEnemigo.length; j++) {
            if (this.disparosEnemigo[j].shape == shapes[0]) {
                this.pokemonJugador.impactado(this.disparosEnemigo[j]);
            }
        }
        this.tiempoEfectoPokemonJugador = 1;
        console.log("COLISION DISPARO ENEMIGO CON JUGADOR");
    },
    procesarKeyReleasedSeleccionAtaque:function (keyCode){
        var posicion = teclas.indexOf(keyCode);
        teclas.splice(posicion, 1);
        switch (keyCode){
            case 49://1
                //this.layer.disparosJugador.push(new RayoAtaque(this.layer,cc.p(230,115)));
                //this.layer.disparosJugador.push(new RayoAtaque(this.layer,cc.p(590,275)));
                //this.layer.disparosJugador.push(new RayoAtaque(this.layer,cc.p(590,275)));
                this.disparosJugador.push(this.pokemonJugador.ataque1(this));//Limites para que el rayo haga efecto
                //this.pokemonJugador.vida = 0;
                //var disparo = new DisparoPikachuRayo(this.layer,cc.p(230,115),this.pokemonJugador);
                //this.layer.disparosJugador.push(disparo);

                //this.getParent().removeChild(this);
                //this.layer.menu = null;
                break;
            case 50: //2
                this.disparosJugador.push(this.pokemonJugador.ataque2(this));
                //this.getParent().removeChild(this);
                //this.layer.menu = null;
                break;
        }
    }

});


var VidaLayer = cc.Layer.extend({
    space: null,
    mapaAncho: 0,
    mapaAlto: 0,
    layer: null,
    nombre: "VidaLayer",
    pokemon: null,
    ctor: function(layer, pokemon){
        this._super();

        this.space = new cp.Space();
        this.layer = layer;
        this.pokemon = pokemon;

        return true;
    },
    actualizar:function(){

        switch (this.pokemon.nivel) {
            case 1:
                this.spriteNivel = cc.Sprite.create(res.nivel_1);
                this.spriteNivel.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40));
                break;
            case 2:
                this.spriteNivel = cc.Sprite.create(res.nivel_2);
                this.spriteNivel.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40));
                break;
            case 3:
                this.spriteNivel = cc.Sprite.create(res.nivel_3);
                this.spriteNivel.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40));
                break;
            case 4:
                this.spriteNivel = cc.Sprite.create(res.nivel_4);
                this.spriteNivel.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40));
                break;
        }

        var vida = (this.pokemon.vida*100)/this.pokemon.vidaCompleta;

        if(vida <= 0){
            this.spriteVida = cc.Sprite.create(res.vida_0);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }
        else if(vida > 0 && vida < 10){
            this.spriteVida = cc.Sprite.create(res.vida_10);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }
        else if(vida >= 10 && vida < 20){
            this.spriteVida = cc.Sprite.create(res.vida_20);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }
        else if(vida >= 20 && vida < 30){
            this.spriteVida = cc.Sprite.create(res.vida_30);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }
        else if(vida >= 30 && vida < 40){
            this.spriteVida = cc.Sprite.create(res.vida_40);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }
        else if(vida >= 40 && vida < 50){
            this.spriteVida = cc.Sprite.create(res.vida_50);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }
        else if(vida >= 50 && vida < 60){
            this.spriteVida = cc.Sprite.create(res.vida_60);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }
        else if(vida >= 60 && vida < 70){
            this.spriteVida = cc.Sprite.create(res.vida_70);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }
        else if(vida >= 70 && vida < 80){
            this.spriteVida = cc.Sprite.create(res.vida_80);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }
        else if(vida >= 80 && vida < 90){
            this.spriteVida = cc.Sprite.create(res.vida_90);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }
        else if(vida >= 90){
            this.spriteVida = cc.Sprite.create(res.vida_100);
            this.spriteVida.setPosition(cc.p(this.pokemon.body.p.x + 130,this.pokemon.body.p.y - 40 -this.spriteNivel.height));
        }

        this.addChild(this.spriteNivel);
        this.addChild(this.spriteVida);

    }
});

var MensajesLayer = cc.Layer.extend({
    space: null,
    mapaAncho: 0,
    mapaAlto: 0,
    layer: null,
    nombre: "MensajesLayer",
    mensaje: 0,
    jugador: null,
    ctor: function (mensaje, layer, jugador) {
        this._super();

        this.space = new cp.Space();
        this.jugador = jugador;
        this.layer = layer;
        this.mensaje = mensaje;
        return true;

    },
    mostrar: function(){
        switch (this.mensaje) {
            case 1:
                this.spriteFondo = cc.Sprite.create(res.mensaje_pokemon_caido_combate);
                this.spriteFondo.setPosition(cc.p(650,75));
                break;
            case 2:
                this.spriteFondo = cc.Sprite.create(res.mensaje_pokemon_derrotados);
                this.spriteFondo.setPosition(cc.p(650,75));
                break;
            case 3:
                this.spriteFondo = cc.Sprite.create(res.mensaje_pokemon_curados);
                this.spriteFondo.setPosition(cc.p(550, 375-this.spriteFondo.height/2));
                break;
            case 4:
                this.spriteFondo = cc.Sprite.create(res.mensaje_hasta_otra);
                this.spriteFondo.setPosition(cc.p(550, 375-this.spriteFondo.height/2));
                break;
            case 5:
                this.spriteFondo = cc.Sprite.create(res.mensaje_subir_nivel);
                this.spriteFondo.setPosition(cc.p(650, 75));
                break;
            case 6:
                this.spriteFondo = cc.Sprite.create(res.mensaje_atrapa_eevee);
                this.spriteFondo.setPosition(cc.p(650, 75));
                break;
            case 7:
                this.spriteFondo = cc.Sprite.create(res.mensaje_eevee_huido);
                this.spriteFondo.setPosition(cc.p(650, 75));
                break;
            case 8:
                this.spriteFondo = cc.Sprite.create(res.mensaje_curar_antes_combate);
                this.spriteFondo.setPosition(cc.p(450, 150));
                break;

        }


        this.addChild(this.spriteFondo);

        setTimeout(this.eliminar.bind(this), 3000);


    },
    eliminar: function(){
        switch (this.mensaje) {
            case 1:
                this.getParent().removeChild(this);
                if(this.layer.menu == null) {
                    var menu = new MenuLuchaLayer(this.layer.pokemonJugador, this.layer);
                    this.layer.menu = menu;
                    this.layer.getParent().addChild(this.layer.menu);
                }
                break;
            case 2:
                this.layer.enemigo.finModoLucha();
                this.getParent().removeChild(this.layer);
                this.getParent().removeChild(this);
                break;
            case 3: //pokemon curados
                var layer =  new GameLayer(this.jugador, 2);
                this.getParent().addChild(layer);
                this.getParent().removeChild(this.jugador.layer);
                this.getParent().removeChild(this);
                break;
            case 4: //hasta otra
                var layer =  new GameLayer(this.jugador, 2);
                this.getParent().addChild(layer);
                this.getParent().removeChild(this.jugador.layer);
                this.getParent().removeChild(this);
                break;
            case 5:
                this.layer.enemigo.finModoLucha();
                this.layer.getParent().removeChild(this);
                this.layer.getParent().removeChild(this.layer);
                break;
            case 6:
                this.jugador.capturados.push(this.layer.enemigo);
                this.layer.layer.jugador.capturados = this.jugador.capturados;
                if(this.layer.pokemonJugador.subirNivel()){
                    this.layer.mensaje = new MensajesLayer(5, this.layer, this.jugador);
                    this.getParent().addChild(this.layer.mensaje);
                    this.layer.mensaje.mostrar();
                    this.getParent().removeChild(this);
                    break;
                }
                else {
                    this.layer.enemigo.finModoLucha();
                    this.getParent().removeChild(this.layer);
                    this.getParent().removeChild(this);
                    break;
                }

                break;
            case 7:
                this.layer.enemigo.finModoLucha();
                this.getParent().removeChild(this.layer);
                this.getParent().removeChild(this);
                break;
            case 8:
                this.getParent().removeChild(this);
                break;


        }

    },
    update: function (dt) {

    }

});


var MenuLuchaLayer = cc.Layer.extend({
    space: null,
    mapaAncho: 0,
    mapaAlto: 0,
    pokemonJugador: null,
    layer: null,
    nombre: "MenuLuchaLayer",
    ctor: function ( pokemonJugador, layer) {
        this._super();
        var size = cc.winSize;

        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();

        this.pokemonJugador = pokemonJugador;
        this.layer = layer;
        
        switch (this.pokemonJugador.name) {
            case "Pikachu":
                this.spriteFondo = cc.Sprite.create(res.mensaje_ataques_pikachu);
                break;
            case "Piplup":
                this.spriteFondo = cc.Sprite.create(res.mensaje_ataques_piplup);
                break;
            case "Eevee":
                this.spriteFondo = cc.Sprite.create(res.mensaje_ataques_eevee);
                break;
        }

        this.spriteFondo.setPosition(cc.p(650,75));
        this.addChild(this.spriteFondo);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: this.procesarKeyReleasedSeleccionAtaque.bind(this)
        }, this);


        return true;

    },
    update: function (dt) {


    },
    procesarKeyReleasedSeleccionAtaque:function (keyCode){
        var posicion = teclas.indexOf(keyCode);
        teclas.splice(posicion, 1);
        switch (keyCode){
            case 49://1
                this.layer.disparosJugador.push(this.pokemonJugador.ataque1(this.layer));//Limites para que el rayo haga efecto
                this.getParent().removeChild(this);
                this.layer.menu = null;
                break;
            case 50: //2
                this.layer.disparosJugador.push(this.pokemonJugador.ataque2(this.layer));
                this.getParent().removeChild(this);
                this.layer.menu = null;
                break;
            case 27: //esc
                this.layer.enemigo.finModoLucha();
                this.layer.layer.getParent().removeChild(this.layer);
                this.getParent().removeChild(this);
                break;
            case 80: //p
                this.layer.crearPokeball();
                this.getParent().removeChild(this);
                break;
        }
    }

});



var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer(null, 0);
        this.addChild(layer);
    }
});
