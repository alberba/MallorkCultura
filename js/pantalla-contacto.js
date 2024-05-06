/**
 * Función que se encarga de crear la pantalla de contacto
 */
function crearContacto() {
    window.scrollTo(0, 0);
    $("header > div").remove();
    $("header").append(crearDiv("overlay header-image")
        .append(crearImg("img/main.webp","Fotografía de dos monumentos de Es Baluard","imagen-overlay"))
        .append(crearDiv("texto-main-page texto-overlay m-0")
            .append($("<h1>").addClass("mu-0 mb-4").html("MallorkCultura"))
            .append(crearP({texto: "Planifica tu ruta ya"}))
        )
    );
    $("main").empty();
    $("main").attr("class","contenedor-principal contacto");
    $("main").append(crearH2("¿Quiénes somos?"))
            .append(crearHr);
    let div = crearDiv("contenedor-contacto my-5");
    componentes.forEach(componente => {
        let comp = crearTarjetaContacto(componente);
        comp.find("img:first").addClass("imagen-contacto");
        div.append(comp);
    });
    $("main").append(div);
    $("main").append(crearDiv("contenedor-logo-uib my-5")
                        .append(crearH2(" como estudiantes de "))
                        .append(crearImg("img/logo_UIB.webp", "Logo de la UIB","my-5")
                                .on("click",function(){window.open("https://uib.cat")})
                            )
                );
}

/**
 * Función que se encarga de crear una tarjeta de contacto
 * @param {Object} componente Objeto JSON con la información del contacto
 * @returns {JQuery<HTMLElement>} Un elemento article con la información del contacto
 */
function crearTarjetaContacto(componente) {
    return crearArticle("componente")
        .append(crearImg(componente.image.contentUrl,componente.image.description))
        .append(crearHeader("titulo-componente-card")
                .append(crearH4(" " + componente.familyName)
                            .prepend(crearSpan("apellidos-contacto", componente.givenName))
                )
            )
        .append(crearDiv()
                    .append(crearA("mailto:"+componente.email, "enlace-contacto", "")
                        .append(crearImg("img/svg/icono-correo.svg","Icono de correo"))
                    )
            );
}