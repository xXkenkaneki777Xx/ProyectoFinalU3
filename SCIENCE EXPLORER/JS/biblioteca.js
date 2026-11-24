function obtenerNombreArea(codigo) {
    for (let i = 0; i < AREAS.length; i++) {
        if (AREAS[i].codigo === codigo) {
            return AREAS[i].codigo + " - " + AREAS[i].nombre;
        }
    }
    return codigo;
}

function buscarDescubrimientoPorId(id) {
    for (let i = 0; i < DESCUBRIMIENTOS.length; i++) {
        if (DESCUBRIMIENTOS[i].id === id) {
            return DESCUBRIMIENTOS[i];
        }
    }
    return null;
}

function inicializarSelectAreasBiblioteca() {
    const select = document.getElementById("filtroAreaBib");
    select.innerHTML = '<option value="TODAS">Todas</option>';
    for (let i = 0; i < AREAS.length; i++) {
        const opt = document.createElement("option");
        opt.value = AREAS[i].codigo;
        opt.textContent = AREAS[i].codigo + " - " + AREAS[i].nombre;
        select.appendChild(opt);
    }
}

function aplicarFiltrosBiblioteca() {
    const texto = document.getElementById("buscarDescubrimiento").value.trim().toLowerCase();
    const area = document.getElementById("filtroAreaBib").value;
    const tipo = document.getElementById("filtroTipoBib").value;
    const orden = document.getElementById("ordenBiblioteca").value;

    const filtrados = [];
    for (let i = 0; i < DESCUBRIMIENTOS.length; i++) {
        const d = DESCUBRIMIENTOS[i];

        if (area !== "TODAS" && d.area !== area) continue;
        if (tipo !== "TODOS" && d.tipo !== tipo) continue;

        if (texto !== "") {
            const enTitulo = d.titulo.toLowerCase().indexOf(texto) !== -1;
            const enProtag = d.protagonistas.toLowerCase().indexOf(texto) !== -1;
            let enEtiqueta = false;
            if (Array.isArray(d.etiquetas)) {
                for (let k = 0; k < d.etiquetas.length; k++) {
                    if (d.etiquetas[k].toLowerCase().indexOf(texto) !== -1) {
                        enEtiqueta = true;
                        break;
                    }
                }
            }
            if (!enTitulo && !enProtag && !enEtiqueta) continue;
        }

        filtrados.push(d);
    }

    if (orden === "anioDesc") {
        filtrados.sort(function (a, b) { return b.anio - a.anio; });
    } else if (orden === "anioAsc") {
        filtrados.sort(function (a, b) { return a.anio - b.anio; });
    } else if (orden === "tituloAZ") {
        filtrados.sort(function (a, b) { return a.titulo.localeCompare(b.titulo, "es"); });
    }

    renderizarDescubrimientos(filtrados);
}

function limpiarFiltrosBiblioteca() {
    document.getElementById("buscarDescubrimiento").value = "";
    document.getElementById("filtroAreaBib").value = "TODAS";
    document.getElementById("filtroTipoBib").value = "TODOS";
    document.getElementById("ordenBiblioteca").value = "anioDesc";
    aplicarFiltrosBiblioteca();
}

function renderizarDescubrimientos(lista) {
    const grid = document.getElementById("gridDescubrimientos");
    const contador = document.getElementById("contadorResultadosBib");
    const aviso = document.getElementById("avisoVacioBib");

    contador.textContent = lista.length + " de " + DESCUBRIMIENTOS.length + " resultados";
    grid.innerHTML = "";

    if (lista.length === 0) {
        aviso.classList.remove("oculto");
        return;
    }

    aviso.classList.add("oculto");

    for (let i = 0; i < lista.length; i++) {
        const d = lista[i];
        const card = document.createElement("article");
        card.className = "ficha";

        const img = document.createElement("img");
        img.className = "ficha-imagen";
        img.src = d.imagen;
        img.alt = "Ilustración de " + d.titulo;

        const cuerpo = document.createElement("div");
        cuerpo.className = "ficha-cuerpo";

        const titulo = document.createElement("h3");
        titulo.className = "ficha-titulo";
        titulo.textContent = d.titulo;

        const ul = document.createElement("ul");
        ul.className = "ficha-datos";
        ul.innerHTML =
            "<li><strong>Año:</strong> <span>" + d.anio + "</span></li>" +
            "<li><strong>Área:</strong> <span>" + d.area + "</span></li>" +
            "<li><strong>Tipo:</strong> <span>" + d.tipo + "</span></li>";

        const resumen = document.createElement("p");
        resumen.className = "ficha-resumen";
        resumen.textContent = d.resumen;

        const acciones = document.createElement("div");
        acciones.className = "ficha-botones";

        const btnDetalle = document.createElement("button");
        btnDetalle.type = "button";
        btnDetalle.className = "boton boton-principal boton-chico";
        btnDetalle.textContent = "Ver detalle";
        btnDetalle.onclick = function () {
            abrirDetalleDescubrimiento(d.id);
        };

        const btnFav = document.createElement("button");
        btnFav.type = "button";
        btnFav.className = "boton boton-secundario boton-chico";
        btnFav.setAttribute("aria-pressed", esFavorito(d.id) ? "true" : "false");
        btnFav.textContent = esFavorito(d.id) ? "Quitar de favoritos" : "Añadir a favoritos";
        btnFav.onclick = function () {
            alternarFavorito(d.id);
        };

        acciones.appendChild(btnDetalle);
        acciones.appendChild(btnFav);

        cuerpo.appendChild(titulo);
        cuerpo.appendChild(ul);
        cuerpo.appendChild(resumen);
        cuerpo.appendChild(acciones);

        card.appendChild(img);
        card.appendChild(cuerpo);
        grid.appendChild(card);
    }
}

function abrirDetalleDescubrimiento(id) {
    const d = buscarDescubrimientoPorId(id);
    if (!d) return;

    const modal = document.getElementById("modalDetalle");
    const cuerpo = document.getElementById("cuerpoModal");
    cuerpo.innerHTML = "";

    const img = document.createElement("img");
    img.className = "modal-imagen";
    img.src = d.imagen;
    img.alt = "Ilustración de " + d.titulo;

    const h3 = document.createElement("h3");
    h3.id = "modalTitulo";
    h3.textContent = d.titulo + " (" + d.anio + ")";

    const dl = document.createElement("dl");
    dl.className = "modal-datos";

    function agregarCampoDL(etiqueta, valor) {
        const dt = document.createElement("dt");
        dt.textContent = etiqueta;
        const dd = document.createElement("dd");
        dd.textContent = valor;
        dl.appendChild(dt);
        dl.appendChild(dd);
    }

    agregarCampoDL("Área", obtenerNombreArea(d.area));
    agregarCampoDL("Tipo", d.tipo);
    agregarCampoDL("Protagonistas", d.protagonistas);
    agregarCampoDL("Estado de madurez", d.estadoMadurez);
    agregarCampoDL("Resumen", d.resumen);
    agregarCampoDL("Problema", d.problema);
    agregarCampoDL("Explicación", d.explicacion);
    agregarCampoDL("Impacto", d.impacto);

    if (d.limitaciones) {
        agregarCampoDL("Limitaciones", d.limitaciones);
    }

    if (Array.isArray(d.etiquetas) && d.etiquetas.length > 0) {
        agregarCampoDL("Etiquetas", d.etiquetas.join(", "));
    }

    const dtFuente = document.createElement("dt");
    dtFuente.textContent = "Fuente (" + d.fechaConsulta + ")";
    const ddFuente = document.createElement("dd");
    const enlace = document.createElement("a");
    enlace.href = d.fuenteURL;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = d.fuenteTitulo;
    ddFuente.appendChild(enlace);
    dl.appendChild(dtFuente);
    dl.appendChild(ddFuente);

    const btnFav = document.createElement("button");
    btnFav.type = "button";
    btnFav.className = "boton boton-secundario";
    btnFav.setAttribute("aria-pressed", esFavorito(d.id) ? "true" : "false");
    btnFav.style.marginTop = "16px";
    btnFav.textContent = esFavorito(d.id) ? "Quitar de favoritos" : "Añadir a favoritos";
    btnFav.onclick = function () {
        alternarFavorito(d.id);
    };

    cuerpo.appendChild(img);
    cuerpo.appendChild(h3);
    cuerpo.appendChild(dl);
    cuerpo.appendChild(btnFav);

    modal.classList.remove("oculto");
    document.getElementById("btnCerrarModal").focus();
}

function cerrarModal() {
    document.getElementById("modalDetalle").classList.add("oculto");
}

// Científicos
function inicializarSelectDisciplinas() {
    const select = document.getElementById("filtroDisciplinaCient");
    select.innerHTML = '<option value="TODAS">Todas</option>';
    const vistas = [];
    for (let i = 0; i < CIENTIFICOS.length; i++) {
        const disc = CIENTIFICOS[i].disciplinaPrincipal;
        if (vistas.indexOf(disc) === -1) {
            vistas.push(disc);
            const opt = document.createElement("option");
            opt.value = disc;
            opt.textContent = disc;
            select.appendChild(opt);
        }
    }
}

function filtrarCientificos() {
    const texto = document.getElementById("buscarCientifico").value.trim().toLowerCase();
    const disc = document.getElementById("filtroDisciplinaCient").value;

    const lista = [];
    for (let i = 0; i < CIENTIFICOS.length; i++) {
        const c = CIENTIFICOS[i];
        if (disc !== "TODAS" && c.disciplinaPrincipal !== disc) continue;
        if (texto !== "" && c.nombre.toLowerCase().indexOf(texto) === -1) continue;
        lista.push(c);
    }

    lista.sort(function (a, b) {
        return a.nombre.localeCompare(b.nombre, "es");
    });

    renderizarCientificos(lista);
}

function restablecerFiltrosCientificos() {
    document.getElementById("buscarCientifico").value = "";
    document.getElementById("filtroDisciplinaCient").value = "TODAS";
    filtrarCientificos();
}

function renderizarCientificos(lista) {
    const grid = document.getElementById("gridCientificos");
    const aviso = document.getElementById("avisoVacioCient");
    grid.innerHTML = "";

    if (lista.length === 0) {
        aviso.innerHTML = "";
        const p = document.createElement("p");
        p.textContent = "No hay perfiles científicos que coincidan con la búsqueda.";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "boton boton-principal";
        btn.textContent = "Restablecer filtros";
        btn.onclick = restablecerFiltrosCientificos;
        aviso.appendChild(p);
        aviso.appendChild(btn);
        aviso.classList.remove("oculto");
        return;
    }

    aviso.classList.add("oculto");

    for (let i = 0; i < lista.length; i++) {
        const c = lista[i];
        const card = document.createElement("article");
        card.className = "cientifico-card";

        const img = document.createElement("img");
        img.src = c.imagen;
        img.alt = "Retrato o ilustración de " + c.nombre;

        const info = document.createElement("div");
        info.className = "cientifico-info";

        const h3 = document.createElement("h3");
        h3.textContent = c.nombre;

        const pDisc = document.createElement("p");
        pDisc.innerHTML = "<strong>Disciplina:</strong> ";
        const spanDisc = document.createElement("span");
        spanDisc.textContent = c.disciplinaPrincipal;
        pDisc.appendChild(spanDisc);

        const pTipo = document.createElement("p");
        pTipo.innerHTML = "<strong>Tipo:</strong> ";
        const spanTipo = document.createElement("span");
        spanTipo.textContent = c.tipoPerfil;
        pTipo.appendChild(spanTipo);

        const pContr = document.createElement("p");
        pContr.textContent = c.aportaciones[0];

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "boton boton-principal boton-chico";
        btn.textContent = "Conocer más";
        btn.onclick = function () {
            mostrarDetalleCientifico(c.id);
        };

        info.appendChild(h3);
        info.appendChild(pDisc);
        info.appendChild(pTipo);
        info.appendChild(pContr);
        info.appendChild(btn);

        card.appendChild(img);
        card.appendChild(info);
        grid.appendChild(card);
    }
}

function mostrarDetalleCientifico(id) {
    let perfil = null;
    for (let i = 0; i < CIENTIFICOS.length; i++) {
        if (CIENTIFICOS[i].id === id) {
            perfil = CIENTIFICOS[i];
            break;
        }
    }
    if (!perfil) return;

    const panel = document.getElementById("panelDetalleCientifico");
    panel.innerHTML = "";
    panel.classList.remove("oculto");

    const h3 = document.createElement("h3");
    h3.textContent = perfil.nombre + " (" + perfil.tipoPerfil + " - " + perfil.periodo + ")";

    const inst = document.createElement("p");
    inst.textContent = "País o institución: " + perfil.paisOInstitucion;

    const bio = document.createElement("p");
    bio.textContent = perfil.biografia;

    const sub = document.createElement("strong");
    sub.textContent = "Aportaciones:";

    const ul = document.createElement("ul");
    for (let i = 0; i < perfil.aportaciones.length; i++) {
        const li = document.createElement("li");
        li.textContent = perfil.aportaciones[i];
        ul.appendChild(li);
    }

    const relBox = document.createElement("div");
    relBox.className = "acciones-sim";
    const relLabel = document.createElement("span");
    relLabel.textContent = "Descubrimientos relacionados: ";
    relBox.appendChild(relLabel);

    for (let i = 0; i < perfil.descubrimientosRelacionados.length; i++) {
        const dId = perfil.descubrimientosRelacionados[i];
        const ficha = buscarDescubrimientoPorId(dId);
        if (ficha) {
            const btnRel = document.createElement("button");
            btnRel.type = "button";
            btnRel.className = "boton boton-secundario boton-chico";
            btnRel.textContent = ficha.titulo;
            btnRel.onclick = function () {
                document.getElementById("descubrimientos").scrollIntoView({ behavior: "smooth" });
                abrirDetalleDescubrimiento(ficha.id);
            };
            relBox.appendChild(btnRel);
        }
    }

    const fuente = document.createElement("p");
    fuente.style.marginTop = "12px";
    const a = document.createElement("a");
    a.href = perfil.fuenteURL;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Referencia documental";
    a.style.color = "var(--amarillo)";
    fuente.appendChild(a);

    panel.appendChild(h3);
    panel.appendChild(inst);
    panel.appendChild(bio);
    panel.appendChild(sub);
    panel.appendChild(ul);
    panel.appendChild(relBox);
    panel.appendChild(fuente);
    panel.scrollIntoView({ behavior: "smooth" });
}

// Línea del tiempo
function inicializarSelectAreasCrono() {
    const select = document.getElementById("filtroAreaCrono");
    select.innerHTML = '<option value="TODAS">Todas</option>';
    for (let i = 0; i < AREAS.length; i++) {
        const opt = document.createElement("option");
        opt.value = AREAS[i].codigo;
        opt.textContent = AREAS[i].codigo + " - " + AREAS[i].nombre;
        select.appendChild(opt);
    }
}

function cumplePeriodo(anio, periodo) {
    if (periodo === "TODOS") return true;
    if (periodo === "ANTES_1950") return anio < 1950;
    if (periodo === "1950_1999") return anio >= 1950 && anio <= 1999;
    if (periodo === "2000_2019") return anio >= 2000 && anio <= 2019;
    if (periodo === "2020_ADELANTE") return anio >= 2020;
    return true;
}

function filtrarCronologia() {
    const area = document.getElementById("filtroAreaCrono").value;
    const periodo = document.getElementById("filtroPeriodoCrono").value;

    const filtrados = [];
    for (let i = 0; i < HITOS.length; i++) {
        const h = HITOS[i];
        if (area !== "TODAS" && h.area !== area) continue;
        if (!cumplePeriodo(h.anio, periodo)) continue;
        filtrados.push(h);
    }

    filtrados.sort(function (a, b) {
        return a.anio - b.anio;
    });

    renderizarCronologia(filtrados);
}

function renderizarCronologia(lista) {
    const cont = document.getElementById("listaCronologia");
    const contador = document.getElementById("contadorHitos");
    const aviso = document.getElementById("avisoVacioCrono");

    contador.textContent = "Hitos visibles: " + lista.length;
    cont.innerHTML = "";

    if (lista.length === 0) {
        aviso.textContent = "Ningún hito cumple con los filtros de área y periodo seleccionados.";
        aviso.classList.remove("oculto");
        return;
    }

    aviso.classList.add("oculto");

    for (let i = 0; i < lista.length; i++) {
        const h = lista[i];
        const item = document.createElement("article");
        item.className = "timeline-item";

        const anioBox = document.createElement("div");
        anioBox.className = "timeline-year";
        anioBox.textContent = String(h.anio);

        const contenido = document.createElement("div");
        contenido.className = "timeline-content";

        const titulo = document.createElement("h3");
        titulo.textContent = h.titulo;

        const meta = document.createElement("p");
        meta.textContent = "Área: " + h.area + " | Tipo: " + h.tipo;

        const res = document.createElement("p");
        res.textContent = h.resumen;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "boton boton-principal boton-chico";
        btn.textContent = "Ver descubrimiento";
        btn.onclick = function () {
            limpiarFiltrosBiblioteca();
            document.getElementById("descubrimientos").scrollIntoView({ behavior: "smooth" });
            abrirDetalleDescubrimiento(h.descubrimientoId);
        };

        contenido.appendChild(titulo);
        contenido.appendChild(meta);
        contenido.appendChild(res);
        contenido.appendChild(btn);

        item.appendChild(anioBox);
        item.appendChild(contenido);
        cont.appendChild(item);
    }
}