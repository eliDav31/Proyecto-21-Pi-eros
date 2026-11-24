const estado = {
    trabajo: 25,      
    corto: 5,
    largo: 15,
    tipo: "trabajo",  
    segundos: 25 * 60,
    sesiones: 0,
    intervalo: null
};

const nombres = { trabajo: "Trabajo", corto: "Descanso corto", largo: "Descanso largo" };

const tiempo = document.getElementById("tiempo");
const tipo = document.getElementById("tipo");
const contador = document.getElementById("contador");
const btnIniciar = document.getElementById("btnIniciar");
const btnReiniciar = document.getElementById("btnReiniciar");
const formConfig = document.getElementById("formConfig");

function mostrar() {
    const min = String(Math.floor(estado.segundos / 60)).padStart(2, "0");
    const seg = String(estado.segundos % 60).padStart(2, "0");
    tiempo.textContent = min + ":" + seg;
    tipo.textContent = nombres[estado.tipo];
    contador.textContent = estado.sesiones;
    document.body.className = estado.tipo;

    if (estado.intervalo) {
        btnIniciar.textContent = "Pausar";
    } else if (estado.segundos < estado[estado.tipo] * 60) {
        btnIniciar.textContent = "Reanudar";
    } else {
        btnIniciar.textContent = "Iniciar";
    }
}

function sonar() {
    const audio = new AudioContext();
    const oscilador = audio.createOscillator();
    oscilador.connect(audio.destination);
    oscilador.frequency.value = 880;
    oscilador.start();
    oscilador.stop(audio.currentTime + 1);
}

function siguienteSesion() {
    if (estado.tipo === "trabajo") {
        estado.sesiones++;
        estado.tipo = estado.sesiones % 4 === 0 ? "largo" : "corto";
    } else {
        estado.tipo = "trabajo";
    }
    estado.segundos = estado[estado.tipo] * 60;
}

function pausar() {
    clearInterval(estado.intervalo);
    estado.intervalo = null;
}

function iniciar() {
    estado.intervalo = setInterval(function () {
        estado.segundos--;
        if (estado.segundos <= 0) {
            pausar();
            sonar();
            siguienteSesion();
        }
        mostrar();
    }, 1000);
}

btnIniciar.addEventListener("click", function () {
    if (estado.intervalo) {
        pausar();
    } else {
        iniciar();
    }
    mostrar();
});

btnReiniciar.addEventListener("click", function () {
    pausar();
    estado.segundos = estado[estado.tipo] * 60;
    mostrar();
});

formConfig.addEventListener("submit", function (e) {
    e.preventDefault();
    estado.trabajo = Number(document.getElementById("minTrabajo").value);
    estado.corto = Number(document.getElementById("minCorto").value);
    estado.largo = Number(document.getElementById("minLargo").value);
    pausar();
    estado.segundos = estado[estado.tipo] * 60;
    mostrar();
});

mostrar();