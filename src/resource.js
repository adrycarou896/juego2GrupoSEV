var res = {
    HelloWorld_png : "res/HelloWorld.png",
    boton_jugar_png : "res/boton_jugar.png",
    menu_titulo_png : "res/menu_titulo.png",
    tiles16_png: "res/mapas/tiles16.png",
    mapa1_tmx: "res/mapas/mapa1.tmx",
    jugador_plist: "res/jugador/jugador.plist",
    eevee_plist: "res/pokemon/eevee.plist",
    tiles_mapa: "res/mapas/mapa2.png",
    mapa_tmx: "res/mapas/mapa2.tmx"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}