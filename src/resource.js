var res = {
    HelloWorld_png : "res/HelloWorld.png",
    boton_jugar_png : "res/boton_jugar.png",
    menu_titulo_png : "res/menu_titulo.png",
    jugador_png: "res/jugador/jugador.png",
    jugador_plist: "res/jugador/jugador.plist",
    eevee_png: "res/pokemon/eevee_imagen.png",
    eevee_plist: "res/pokemon/eevee.plist",
    eevee_idle_png: "res/pokemon/eevee_idle.png",
    eevee_idle_plist: "res/pokemon/eevee_idle.plist",
    pikachu_idle_png: "res/pokemon/pikachu_idle.png",
    pikachu_idle_plist: "res/pokemon/pikachu_idle.plist",
    animacion_cuervo_png: "res/animacion_cuervo.png",
    animacion_cuervo_plist: "res/animacion_cuervo.plist",
    caballero_png: "res/jugador/caballero.png",
    caballero_plist: "res/jugador/caballero.plist",
    tiles_mapa: "res/mapas/tiles-mapa.png",
    mapa: "res/mapas/mapa.tmx",
    fondo_lucha_1: "res/fondoLucha/fondo1.png",
    fondo_mensaje_prohibido_gimnasio: "res/fondoMensajes/mensaje_prohibido_gimnasio.png",
    inside_tiles: "res/mapas/inside_tiles.png",
    mapa_gimnasio: "res/mapas/mapa_gimnasio.tmx"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}