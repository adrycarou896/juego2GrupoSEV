var controles = {};
var teclas = [];

var tipoJugador = 1;
var tipoEnemigo = 2;
var tipoGimnasio = 3;
var tipoMostrador = 4;
var tipoSalirGimnasio = 5;
var tipoDisparo = 6;
//var tipoEnemigoDerecha = 4;
//var tipoEnemigoIzquierda = 5;

var GameLayer = cc.Layer.extend({
    jugador:null,
    enemigos: [],
    space:null,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    nombre: "GameLayer",
    ctor:function (jugador) {
       this._super();
       var size = cc.winSize;

       cc.spriteFrameCache.addSpriteFrames(res.jugador_plist);
       cc.spriteFrameCache.addSpriteFrames(res.eevee_plist);
       cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);
       cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);
        cc.spriteFrameCache.addSpriteFrames(res.pikachu_idle_plist);

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

        //Colisión jugador con enemigo
        this.space.addCollisionHandler(tipoJugador, tipoEnemigo,
            null, null, this.collisionJugadorConEnemigo.bind(this), null);

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
    collisionJugadorConEnemigo:function (arbiter, space){
        var shapes = arbiter.getShapes();
        var shapeEnemigo = shapes[1];
        //console.log("tam->"+this.enemigos.length);
        for (var j = 0; j < this.enemigos.length; j++) {
            if (this.enemigos[j].shape == shapeEnemigo) {
                var layerLucha = new LuchaLayer(this.enemigos[j], this.jugador, this);
                layerLucha.crearPokemonJugador();
                this.getParent().addChild(layerLucha);
                this.getParent().addChild(new MenuLuchaLayer(layerLucha.pokemonJugador,layerLucha));
            }
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

        //Jugador
        if(jugador == null) {
            var grupoJugador = this.mapa.getObjectGroup("Jugador");
            var arrayJugador = grupoJugador.getObjects();
            this.jugador = new Jugador(this.space,
                cc.p(arrayJugador[0]["x"], arrayJugador[0]["y"]), this);
        }
        else{
            this.jugador = new Jugador(this.space,
                cc.p(775, 750), this);
            this.jugador.capturados = jugador.capturados;
        }

        //Enemigos salvajes
        var grupoEnemigosSalvajes = this.mapa.getObjectGroup("EnemigoSalvaje");
        var enemigosSavajesArray = grupoEnemigosSalvajes.getObjects();
        for (var i = 0; i < enemigosSavajesArray.length; i++) {
            var enemigo = new Eevee(this.space,
                cc.p(enemigosSavajesArray[i]["x"],enemigosSavajesArray[i]["y"]),this);
            this.enemigos.push(enemigo);
        }
    },


    colisionConGimnasio:function (arbiter, space) {
        this.jugador.entrarGimnasio();
    },


    finColisionConGimnasio:function (arbiter, space) {
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
            console.log("has pulsado siiiiiiiii")
            break;
        case 78: //n
            console.log("has pulsado nooooooo")
            break;
    }
}

var LayerInscripcionTorneo = cc.Layer.extend({
    space: null,
    nombre: "LayerInscripcionTorneo",
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Fondo
        var spriteFondoTitulo= new cc.Sprite(res.mensaje_inscripcion_torneo);
        // Asigno posición central
        spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2));

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

            this.space.addCollisionHandler(tipoSalirGimnasio, tipoJugador,
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
    },

    finColisionConMostrador:function(){
        this.getParent().removeChild(this.jugador.layerInscripcionTorneo);
        this.jugador.layerInscripcionTorneo = null;
    },

    colisionSalirGimnasio:function(){

        var layer =  new GameLayer(this.jugador);
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
                shapeLimite.setCollisionType(tipoSalirGimnasio);
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
    tiempoDisparoEnemigo:0,
    ctor:function (enemigo, jugador, layer) {
        this._super();
        var size = cc.winSize;

        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();

        this.jugador = jugador;
        this.layer = layer;
        console.log("nombre de la layer: " +  this.layer.nombre);

        cc.spriteFrameCache.addSpriteFrames(res.pikachu_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.eevee_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.disparo_jugador_plist);
        cc.spriteFrameCache.addSpriteFrames(res.bola_fuego_plist);

        this.seleccionarPokemonAtaque();

        this.enemigo = enemigo;


        // Fondo
        this.spriteFondo = cc.Sprite.create(res.fondo_lucha_1);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale( size.width / this.spriteFondo.width );
        this.addChild(this.spriteFondo);

        this.enemigo.cambiarAModoLucha(this.space, cc.p(600,210), this);

        this.scheduleUpdate();

        //Colisión jugador con enemigo
        this.space.addCollisionHandler(tipoDisparo, tipoEnemigo,
            null, null, this.collisionDisparoConEnemigo.bind(this), this.finColisionDisparoConEnemigo.bind(this));

        return true;

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
            if ("Pikachu" == this.pokemonJugador.name) {
                this.pokemonJugador.mostrar(this.space, cc.p(230, 115), this);
                return true;
            }
        }
        else{
            return false;
        }
    },
    finColisionDisparoConEnemigo:function(){
        if(this.pokemonJugador.vida <= 0){
            var layerLucha = new LuchaLayer(this.enemigo, this.jugador, this.layer);
            var opcion = layerLucha.crearPokemonJugador();
            this.getParent().addChild(layerLucha);

            if(!opcion){
                var mensaje = new MensajesLayer(2, layerLucha);
                this.getParent().addChild(mensaje);
                mensaje.mostrar();
            }
            else {

                //Aviso cambio de pokemon
                var mensaje = new MensajesLayer(1, layerLucha, opcion);
                this.getParent().addChild(mensaje);
                mensaje.mostrar();

            }
            this.getParent().removeChild(this);
        }
        else {
            this.getParent().addChild(new MenuLuchaLayer(this.pokemonJugador, this));
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
        }
        this.formasEliminar = [];

        if (this.tiempoEfecto > 0){
            this.tiempoEfecto = this.tiempoEfecto - dt;

        }
        if (this.tiempoEfecto < 0) {
            this.enemigo.cambiarAAnimacionDeLucha();
            this.tiempoEfecto = 0;
            this.tiempoDisparoEnemigo = 1;
        }

        if(this.tiempoDisparoEnemigo > 0){
            this.tiempoDisparoEnemigo = this.tiempoDisparoEnemigo - dt;
        }
        if(this.tiempoDisparoEnemigo < 0){
            this.disparosEnemigo.push(new BolaFuegoAtaque(this,this.enemigo.body.getPos()));
            this.tiempoDisparoEnemigo = 0;
        }
    },
    cargarMapa:function () {

    },
    collisionDisparoConEnemigo:function (arbiter, space){
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[0]);
        this.enemigo.impactado();
        this.tiempoEfecto = 1;
        console.log("COLISIONNN");
    }

});


var MensajesLayer = cc.Layer.extend({
    space: null,
    mapaAncho: 0,
    mapaAlto: 0,
    layer: null,
    nombre: "MensajesLayer",
    mensaje: 0,
    ctor: function (mensaje, layer) {
        this._super();

        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();
        this.layer = layer;
        this.mensaje = mensaje;
        return true;

    },
    mostrar: function(){
        switch (this.mensaje) {
            case 1:
                this.spriteFondo = cc.Sprite.create(res.mensaje_pokemon_caido_combate);
                break;
            case 2:
                this.spriteFondo = cc.Sprite.create(res.mensaje_pokemon_derrotados);
                break;

        }

        this.spriteFondo.setPosition(cc.p(650,75));
        this.addChild(this.spriteFondo);

        setTimeout(this.eliminar.bind(this), 3000);


    },
    eliminar: function(){
        switch (this.mensaje) {
            case 1:
                this.getParent().removeChild(this);
                this.layer.getParent().addChild(new MenuLuchaLayer(this.layer.pokemonJugador,this.layer));
                break;
            case 2:
                this.layer.enemigo.finModoLucha();
                this.layer.layer.jugador.body.p.x = 416;
                this.layer.layer.jugador.body.p.y = 480;
                this.getParent().removeChild(this.layer);
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

        // Fondo
        this.spriteFondo = cc.Sprite.create(res.mensaje_ataques_pikachu);
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
                console.log("Ejecutando ataqueeeee: " +  this.pokemonJugador.ataques[0]);
                this.layer.disparosJugador.push(new DisparoJugador(this.layer,cc.p(230,115)));
                //this.layer.pokemonJugador.vida = 0;
                this.getParent().removeChild(this);
                break;
            case 50: //2
                console.log("Ejecutando ataqueeeee: " +  this.pokemonJugador.ataques[1]);
                this.layer.disparosJugador.push(new DisparoJugador(this.layer,cc.p(230,115)));
                this.getParent().removeChild(this);
                break;
            case 27: //esc
                this.layer.enemigo.finModoLucha();
                this.layer.layer.jugador.body.p.x = 416;
                this.layer.layer.jugador.body.p.y = 480;
                this.getParent().removeChild(this.layer);
                this.getParent().removeChild(this);
        }
    }

});



var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer(null);
        this.addChild(layer);
    }
});
