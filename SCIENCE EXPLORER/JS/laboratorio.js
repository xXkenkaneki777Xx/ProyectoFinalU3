function calcularOhm() {
    const inputV = document.getElementById("ohmV");
    const inputR = document.getElementById("ohmR");
    const out = document.getElementById("ohmResultado");

    let v = Number(inputV.value);
    let r = Number(inputR.value);

    if (Number.isNaN(v) || v < 1) v = 1;
    if (v > 24) v = 24;
    if (Number.isNaN(r) || r < 1) r = 1;
    if (r > 20) r = 20;

    inputV.value = v;
    inputR.value = r;

    const corriente = v / r;
    out.textContent = "Corriente I = " + corriente.toFixed(2) + " A (V = " + v + " V, R = " + r + " Ω)";
}

function resetOhm() {
    document.getElementById("ohmV").value = 12;
    document.getElementById("ohmR").value = 4;
    calcularOhm();
}

function calcularMRU() {
    const inputVel = document.getElementById("mruVel");
    const inputTiempo = document.getElementById("mruTiempo");
    const out = document.getElementById("mruResultado");

    let vel = Number(inputVel.value);
    let tiempo = Number(inputTiempo.value);

    if (Number.isNaN(vel) || vel < 0) vel = 0;
    if (vel > 150) vel = 150;
    if (Number.isNaN(tiempo) || tiempo < 0) tiempo = 0;
    if (tiempo > 10) tiempo = 10;

    inputVel.value = vel;
    inputTiempo.value = tiempo;

    const distancia = vel * tiempo;
    out.textContent = "Distancia = " + distancia.toFixed(2) + " km (" + vel + " km/h × " + tiempo + " h)";
}

function resetMRU() {
    document.getElementById("mruVel").value = 60;
    document.getElementById("mruTiempo").value = 2;
    calcularMRU();
}

function calcularAuto() {
    const inputVel = document.getElementById("autoVel");
    const inputDist = document.getElementById("autoDist");
    const out = document.getElementById("autoResultado");
    const visual = document.getElementById("autoVisual");

    let velKmh = Number(inputVel.value);
    let dist = Number(inputDist.value);

    if (Number.isNaN(velKmh) || velKmh < 0) velKmh = 0;
    if (velKmh > 120) velKmh = 120;
    if (Number.isNaN(dist) || dist < 0) dist = 0;
    if (dist > 150) dist = 150;

    inputVel.value = velKmh;
    inputDist.value = dist;

    const velMs = velKmh / 3.6;
    const seguridad = 2 * velMs;

    let estado = "";
    let explicacion = "";
    let colorBarra = "#22c55e";

    if (velKmh === 0) {
        estado = "DETENIDO";
        explicacion = "La velocidad es 0 km/h (prioridad de regla de vehículo detenido).";
        colorBarra = "#94a3b8";
    } else if (dist <= seguridad) {
        estado = "DETENER";
        explicacion = "La distancia (" + dist + " m) es menor o igual a la distancia de seguridad (" + seguridad.toFixed(2) + " m).";
        colorBarra = "#ef4444";
    } else if (dist <= 1.5 * seguridad) {
        estado = "REDUCIR";
        explicacion = "La distancia (" + dist + " m) está dentro de 1.5 veces la seguridad (" + (1.5 * seguridad).toFixed(2) + " m).";
        colorBarra = "#f59e0b";
    } else {
        estado = "CONTINUAR";
        explicacion = "La distancia (" + dist + " m) supera 1.5 veces la distancia de seguridad (" + (1.5 * seguridad).toFixed(2) + " m).";
        colorBarra = "#22c55e";
    }

    const porcentaje = Math.min(100, Math.round((dist / 150) * 100));
    visual.innerHTML = '<div style="width:' + porcentaje + '%;height:14px;border-radius:8px;background:' + colorBarra + ';margin-top:10px;"></div>';
    out.textContent = "Estado: " + estado + " | Seguridad: " + seguridad.toFixed(2) + " m | " + explicacion;
}

function resetAuto() {
    document.getElementById("autoVel").value = 60;
    document.getElementById("autoDist").value = 80;
    calcularAuto();
}

function inicializarLaboratorio() {
    resetOhm();
    resetMRU();
    resetAuto();
}