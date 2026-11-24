const CLAVE_FAVORITOS = "scienceExplorerFavoritos";
const CLAVE_NOTAS = "scienceExplorerNotas";

let favoritos = [];
let notas = [];
let avisoCorrupcionMostrado = false;

function cargarBitacora() {
    favoritos = leerStorageSeguro(CLAVE_FAVORITOS, "array");
    notas = leerStorageSeguro(CLAVE_NOTAS, "array");

    const limpios = [];
    for (let i = 0; i < favoritos.length; i++) {
        const id = favoritos[i];
        if (typeof id === "string" && buscarDescubrimientoPorId(id) && limpios.indexOf(id) === -1) {
            limpios.push(id);
        }
    }
    favoritos = limpios;

    const notasValidas = [];
    for (let i = 0; i < notas.length; i++) {
        const n = notas[i];
        if (n && typeof n.id === "string" && typeof n.titulo === "string" && typeof n.texto === "string") {
            notasValidas.push(n);
        }
    }
    notas = notasValidas;

    const avisoEl = document.getElementById("mensajeRecuperacionBitacora");
    if (avisoCorrupcionMostrado && avisoEl) {
        avisoEl.textContent = "Se detectaron datos dañados o con formato inesperado en la bitácora local; se recuperó el estado de forma segura.";
        avisoEl.classList.remove("oculto");
    }
}

function leerStorageSeguro(clave, tipoEsperado) {
    try {
        const raw = localStorage.getItem(clave);
        if (raw === null) {
            return tipoEsperado === "array" ? [] : {};
        }
        const parsed = JSON.parse(raw);
        if (tipoEsperado === "array" && !Array.isArray(parsed)) {
            avisoCorrupcionMostrado = true;
            return [];
        }
        return parsed;
    } catch (error) {
        avisoCorrupcionMostrado = true;
        return tipoEsperado === "array" ? [] : {};
    }
}

function guardarFavoritosStorage() {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
}

function guardarNotasStorage() {
    localStorage.setItem(CLAVE_NOTAS, JSON.stringify(notas));
}

function esFavorito(idDescubrimiento) {
    return favoritos.indexOf(idDescubrimiento) !== -1;
}

function alternarFavorito(idDescubrimiento) {
    if (!buscarDescubrimientoPorId(idDescubrimiento)) {
        return;
    }
    const idx = favoritos.indexOf(idDescubrimiento);
    if (idx === -1) {
        favoritos.push(idDescubrimiento);
    } else {
        favoritos.splice(idx, 1);
    }
    guardarFavoritosStorage();
    renderizarFavoritosBitacora();
    aplicarFiltrosBiblioteca();
    if (!document.getElementById("modalDetalle").classList.contains("oculto")) {
        abrirDetalleDescubrimiento(idDescubrimiento);
    }
}

function renderizarFavoritosBitacora() {
    const cont = document.getElementById("listaFavoritosBitacora");
    cont.innerHTML = "";

    if (favoritos.length === 0) {
        const p = document.createElement("p");
        p.className = "estado-vacio";
        p.textContent = "Aún no tienes descubrimientos guardados en favoritos.";
        cont.appendChild(p);
        return;
    }

    for (let i = 0; i < favoritos.length; i++) {
        const ficha = buscarDescubrimientoPorId(favoritos[i]);
        if (!ficha) continue;

        const item = document.createElement("article");
        item.className = "favorito";

        const titulo = document.createElement("h4");
        titulo.textContent = ficha.id + " - " + ficha.titulo;

        const area = document.createElement("p");
        area.textContent = "Área: " + obtenerNombreArea(ficha.area);

        const acciones = document.createElement("div");
        acciones.className = "nota-botones";

        const btnDetalle = document.createElement("button");
        btnDetalle.type = "button";
        btnDetalle.className = "boton boton-principal boton-chico";
        btnDetalle.textContent = "Ver detalle";
        btnDetalle.onclick = function () {
            abrirDetalleDescubrimiento(ficha.id);
        };

        const btnQuitar = document.createElement("button");
        btnQuitar.type = "button";
        btnQuitar.className = "boton boton-secundario boton-chico";
        btnQuitar.textContent = "Quitar de favoritos";
        btnQuitar.onclick = function () {
            alternarFavorito(ficha.id);
        };

        acciones.appendChild(btnDetalle);
        acciones.appendChild(btnQuitar);
        item.appendChild(titulo);
        item.appendChild(area);
        item.appendChild(acciones);
        cont.appendChild(item);
    }
}

function poblarSelectDescubrimientosNota() {
    const select = document.getElementById("notaDescubrimiento");
    select.innerHTML = '<option value="">Ninguno</option>';

    for (let i = 0; i < DESCUBRIMIENTOS.length; i++) {
        const opt = document.createElement("option");
        opt.value = DESCUBRIMIENTOS[i].id;
        opt.textContent = DESCUBRIMIENTOS[i].id + " - " + DESCUBRIMIENTOS[i].titulo;
        select.appendChild(opt);
    }
}

function guardarNota(evento) {
    evento.preventDefault();

    const idEdit = document.getElementById("notaEditId").value.trim();
    const titulo = document.getElementById("notaTitulo").value.trim();
    const texto = document.getElementById("notaTexto").value.trim();
    const descId = document.getElementById("notaDescubrimiento").value;
    const errorEl = document.getElementById("errorNota");

    if (titulo.length < 3 || titulo.length > 80) {
        errorEl.textContent = "El título debe tener entre 3 y 80 caracteres.";
        return;
    }
    if (texto.length < 10 || texto.length > 500) {
        errorEl.textContent = "El texto de la nota debe tener entre 10 y 500 caracteres.";
        return;
    }

    errorEl.textContent = "";

    if (idEdit) {
        for (let i = 0; i < notas.length; i++) {
            if (notas[i].id === idEdit) {
                notas[i].titulo = titulo;
                notas[i].texto = texto;
                notas[i].descubrimientoId = descId || null;
                break;
            }
        }
    } else {
        const nuevaNota = {
            id: "NOTA-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
            fechaCreacion: new Date().toLocaleString("es-MX"),
            timestamp: Date.now(),
            titulo: titulo,
            texto: texto,
            descubrimientoId: descId || null
        };
        notas.push(nuevaNota);
    }

    guardarNotasStorage();
    cancelarEdicionNota();
    renderizarNotasBitacora();
}

function iniciarEdicionNota(idNota) {
    for (let i = 0; i < notas.length; i++) {
        if (notas[i].id === idNota) {
            document.getElementById("notaEditId").value = notas[i].id;
            document.getElementById("notaTitulo").value = notas[i].titulo;
            document.getElementById("notaTexto").value = notas[i].texto;
            document.getElementById("notaDescubrimiento").value = notas[i].descubrimientoId || "";
            document.getElementById("tituloFormNota").textContent = "Editar Nota";
            document.getElementById("btnGuardarNota").textContent = "Guardar cambios";
            document.getElementById("btnCancelarEdicion").classList.remove("oculto");
            document.getElementById("errorNota").textContent = "";
            document.getElementById("notaTitulo").focus();
            return;
        }
    }
}

function cancelarEdicionNota() {
    document.getElementById("formNota").reset();
    document.getElementById("notaEditId").value = "";
    document.getElementById("tituloFormNota").textContent = "Nueva Nota";
    document.getElementById("btnGuardarNota").textContent = "Guardar Nota";
    document.getElementById("btnCancelarEdicion").classList.add("oculto");
    document.getElementById("errorNota").textContent = "";
}

function eliminarNota(idNota) {
    const confirmar = confirm("¿Seguro que deseas eliminar esta nota?");
    if (!confirmar) {
        return;
    }

    const restantes = [];
    for (let i = 0; i < notas.length; i++) {
        if (notas[i].id !== idNota) {
            restantes.push(notas[i]);
        }
    }
    notas = restantes;
    guardarNotasStorage();

    if (document.getElementById("notaEditId").value === idNota) {
        cancelarEdicionNota();
    }
    renderizarNotasBitacora();
}

function renderizarNotasBitacora() {
    const cont = document.getElementById("listaNotasBitacora");
    cont.innerHTML = "";

    if (notas.length === 0) {
        const p = document.createElement("p");
        p.className = "estado-vacio";
        p.textContent = "No hay notas registradas todavía.";
        cont.appendChild(p);
        return;
    }

    const ordenadas = notas.slice().sort(function (a, b) {
        return (b.timestamp || 0) - (a.timestamp || 0);
    });

    for (let i = 0; i < ordenadas.length; i++) {
        const n = ordenadas[i];
        const card = document.createElement("article");
        card.className = "nota";

        const h4 = document.createElement("h4");
        h4.textContent = n.titulo;

        const cuerpo = document.createElement("p");
        cuerpo.textContent = n.texto;

        const fecha = document.createElement("small");
        fecha.textContent = "Creada: " + n.fechaCreacion;

        card.appendChild(h4);
        card.appendChild(cuerpo);
        card.appendChild(fecha);

        if (n.descubrimientoId) {
            const ficha = buscarDescubrimientoPorId(n.descubrimientoId);
            if (ficha) {
                const rel = document.createElement("p");
                rel.textContent = "Descubrimiento relacionado: " + ficha.titulo;
                card.appendChild(rel);
            }
        }

        const acciones = document.createElement("div");
        acciones.className = "nota-botones";

        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.className = "boton boton-principal boton-chico";
        btnEditar.textContent = "Editar";
        btnEditar.onclick = function () {
            iniciarEdicionNota(n.id);
        };

        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.className = "boton boton-secundario boton-chico";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = function () {
            eliminarNota(n.id);
        };

        acciones.appendChild(btnEditar);
        acciones.appendChild(btnEliminar);
        card.appendChild(acciones);
        cont.appendChild(card);
    }
}

function borrarMiBitacora() {
    const seguro = confirm("¿Deseas borrar todos tus favoritos y notas de Science Explorer en este navegador?");
    if (!seguro) {
        return;
    }
    favoritos = [];
    notas = [];
    localStorage.removeItem(CLAVE_FAVORITOS);
    localStorage.removeItem(CLAVE_NOTAS);
    cancelarEdicionNota();
    renderizarFavoritosBitacora();
    renderizarNotasBitacora();
    aplicarFiltrosBiblioteca();
}