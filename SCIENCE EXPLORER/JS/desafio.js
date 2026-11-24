let preguntasIntento = [];
let indiceActual = 0;
let opcionSeleccionada = null;
let confirmadaActual = false;
let respuestasUsuario = [];

function mezclarArreglo(origen) {
    const copia = origen.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = copia[i];
        copia[i] = copia[j];
        copia[j] = temp;
    }
    return copia;
}

function iniciarIntentoQuiz() {
    const barajada = mezclarArreglo(PREGUNTAS);
    preguntasIntento = barajada.slice(0, 10);
    indiceActual = 0;
    opcionSeleccionada = null;
    confirmadaActual = false;
    respuestasUsuario = [];

    document.getElementById("resumenQuiz").classList.add("oculto");
    document.getElementById("contenedorQuiz").classList.remove("oculto");
    renderizarPreguntaActual();
}

function renderizarPreguntaActual() {
    const q = preguntasIntento[indiceActual];
    opcionSeleccionada = null;
    confirmadaActual = false;

    document.getElementById("progresoQuiz").textContent = "Pregunta " + (indiceActual + 1) + " de 10";
    document.getElementById("enunciadoQuiz").textContent = q.enunciado;
    document.getElementById("retroalimentacionQuiz").textContent = "Selecciona una opción y pulsa Confirmar respuesta.";

    const btnConfirmar = document.getElementById("btnConfirmarRespuesta");
    const btnSiguiente = document.getElementById("btnSiguientePregunta");
    btnConfirmar.disabled = false;
    btnSiguiente.disabled = true;
    btnSiguiente.textContent = indiceActual === 9 ? "Ver resultados" : "Siguiente";

    const contOpciones = document.getElementById("opcionesQuiz");
    contOpciones.innerHTML = "";

    for (let i = 0; i < q.opciones.length; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opcion";
        btn.textContent = q.opciones[i];
        btn.onclick = function () {
            if (confirmadaActual) return;
            opcionSeleccionada = i;
            const todos = contOpciones.querySelectorAll(".opcion");
            for (let k = 0; k < todos.length; k++) {
                todos[k].classList.remove("seleccionada");
            }
            btn.classList.add("seleccionada");
        };
        contOpciones.appendChild(btn);
    }
}

function confirmarRespuesta() {
    if (confirmadaActual) return;
    if (opcionSeleccionada === null) {
        document.getElementById("retroalimentacionQuiz").textContent = "Selecciona una opción antes de confirmar.";
        return;
    }

    confirmadaActual = true;
    const q = preguntasIntento[indiceActual];
    const esCorrecta = opcionSeleccionada === q.indiceCorrecto;

    respuestasUsuario.push({
        pregunta: q,
        elegida: opcionSeleccionada,
        correcta: esCorrecta
    });

    const todos = document.getElementById("opcionesQuiz").querySelectorAll(".opcion");
    for (let i = 0; i < todos.length; i++) {
        todos[i].disabled = true;
    }

    document.getElementById("btnConfirmarRespuesta").disabled = true;
    document.getElementById("btnSiguientePregunta").disabled = false;

    const retro = document.getElementById("retroalimentacionQuiz");
    retro.textContent = (esCorrecta ? "Respuesta correcta (+10 pts). " : "Respuesta incorrecta (0 pts). ") + q.explicacion;
}

function siguientePregunta() {
    if (!confirmadaActual) return;
    if (indiceActual < 9) {
        indiceActual++;
        renderizarPreguntaActual();
    } else {
        mostrarResultadosQuiz();
    }
}

function mostrarResultadosQuiz() {
    let aciertos = 0;
    for (let i = 0; i < respuestasUsuario.length; i++) {
        if (respuestasUsuario[i].correcta) aciertos++;
    }

    const errores = 10 - aciertos;
    const puntaje = aciertos * 10;
    const porcentaje = aciertos * 10;

    let rango = "Sigue explorando";
    if (puntaje >= 80) {
        rango = "Excelente dominio";
    } else if (puntaje >= 50) {
        rango = "Buen progreso";
    }

    document.getElementById("contenedorQuiz").classList.add("oculto");
    const resumen = document.getElementById("resumenQuiz");
    resumen.innerHTML = "";
    resumen.classList.remove("oculto");

    const h3 = document.createElement("h3");
    h3.textContent = "Resultado: " + puntaje + " / 100 puntos (" + porcentaje + "%)";

    const pRango = document.createElement("p");
    pRango.textContent = "Retroalimentación: " + rango + " | Aciertos: " + aciertos + " | Errores: " + errores;

    const ul = document.createElement("ul");
    for (let i = 0; i < respuestasUsuario.length; i++) {
        const item = respuestasUsuario[i];
        const li = document.createElement("li");
        li.textContent = (i + 1) + ". " + item.pregunta.enunciado +
            " — Tu respuesta: " + item.pregunta.opciones[item.elegida] +
            " | Correcta: " + item.pregunta.opciones[item.pregunta.indiceCorrecto];
        ul.appendChild(li);
    }

    const btnNuevo = document.createElement("button");
    btnNuevo.type = "button";
    btnNuevo.className = "boton boton-principal";
    btnNuevo.textContent = "Nuevo intento";
    btnNuevo.onclick = iniciarIntentoQuiz;

    resumen.appendChild(h3);
    resumen.appendChild(pRango);
    resumen.appendChild(ul);
    resumen.appendChild(btnNuevo);
}