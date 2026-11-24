let idDestacadoActual = null;

function actualizarContadoresInicio() {
    document.getElementById("contadorDescubrimientos").textContent = String(DESCUBRIMIENTOS.length);
    document.getElementById("contadorCientificos").textContent = String(CIENTIFICOS.length);
    document.getElementById("contadorExperimentos").textContent = "3";
}

function inicializarTemasDestacados() {
    const botonesTema = document.querySelectorAll("#tarjetasTematicas .tarjeta-tema");

    for (let i = 0; i < botonesTema.length; i++) {
        const btn = botonesTema[i];
        const codigo = btn.getAttribute("data-area");

        btn.onclick = function () {
            if (!codigo) return;
            limpiarFiltrosBiblioteca();
            document.getElementById("filtroAreaBib").value = codigo;
            aplicarFiltrosBiblioteca();
            document.getElementById("descubrimientos").scrollIntoView({ behavior: "smooth" });
        };
    }
}

function renderizarDestacado(ficha) {
    idDestacadoActual = ficha.id;
    document.getElementById("destacadoTitulo").textContent = ficha.titulo;
    document.getElementById("destacadoAnio").textContent = String(ficha.anio);
    document.getElementById("destacadoArea").textContent = obtenerNombreArea(ficha.area);
    document.getElementById("destacadoTipo").textContent = ficha.tipo;
    document.getElementById("destacadoProtagonista").textContent = ficha.protagonistas;
    document.getElementById("destacadoResumen").textContent = ficha.resumen;
}

function mostrarOtroDestacado() {
    const btn = document.getElementById("btnMostrarOtro");
    if (DESCUBRIMIENTOS.length < 2) {
        btn.disabled = true;
        return;
    }

    const candidatos = [];
    for (let i = 0; i < DESCUBRIMIENTOS.length; i++) {
        if (DESCUBRIMIENTOS[i].id !== idDestacadoActual) {
            candidatos.push(DESCUBRIMIENTOS[i]);
        }
    }

    const elegido = candidatos[Math.floor(Math.random() * candidatos.length)];
    renderizarDestacado(elegido);
}

function toggleMenu() {
    const check = document.getElementById("check");
    if (check) {
        check.checked = !check.checked;
    }
}

function cerrarMenuMovil() {
    const check = document.getElementById("check");
    if (check) {
        check.checked = false;
    }
}

function actualizarEnlaceActivo() {
    const secciones = document.querySelectorAll("section[id]");
    const enlaces = document.querySelectorAll(".encabezado a[href^='#']");
    let actual = "inicio";

    for (let i = 0; i < secciones.length; i++) {
        const rect = secciones[i].getBoundingClientRect();
        if (rect.top <= 160) {
            actual = secciones[i].id;
        }
    }

    for (let j = 0; j < enlaces.length; j++) {
        const href = enlaces[j].getAttribute("href");
        if (href === "#" + actual) {
            enlaces[j].classList.add("active");
        } else {
            enlaces[j].classList.remove("active");
        }
    }
}

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        const modal = document.getElementById("modalDetalle");
        if (modal && !modal.classList.contains("oculto")) {
            cerrarModal();
        }
        cerrarMenuMovil();
    }
});

window.addEventListener("scroll", actualizarEnlaceActivo);

document.addEventListener("DOMContentLoaded", function () {
    cargarBitacora();
    actualizarContadoresInicio();
    inicializarTemasDestacados();

    if (DESCUBRIMIENTOS.length > 0) {
        const inicial = DESCUBRIMIENTOS[Math.floor(Math.random() * DESCUBRIMIENTOS.length)];
        renderizarDestacado(inicial);
    }

    inicializarSelectAreasBiblioteca();
    aplicarFiltrosBiblioteca();

    inicializarSelectDisciplinas();
    filtrarCientificos();

    inicializarLaboratorio();

    inicializarSelectAreasCrono();
    filtrarCronologia();

    iniciarIntentoQuiz();

    poblarSelectDescubrimientosNota();
    renderizarFavoritosBitacora();
    renderizarNotasBitacora();
    actualizarEnlaceActivo();
});