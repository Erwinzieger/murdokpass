// Variables globales para almacenar las respuestas
let frase_usuario = '';
let ano_usuario = '';
let nombre_usuario = '';
let caracter_usuario = '';
let contrasena_final = '';

document.querySelector('.button').addEventListener('click', function () {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const generador = document.querySelector('#generador');

    header.style.transition = 'opacity 1s';
    main.style.transition = 'opacity 1s';
    header.style.opacity = '0';
    main.style.opacity = '0';

    setTimeout(() => {
        header.style.display = 'none';
        main.style.display = 'none';
        generador.style.display = 'block';
        
        setTimeout(() => {
            generador.classList.add('show');
        }, 100);
    }, 1000);
});

function efectoTransicion(callback) {
    const contenedorActual = document.querySelector('.paso-container:not([style*="display: none"]), main');
    
    if (contenedorActual) {
        contenedorActual.style.transition = 'opacity 0.5s';
        contenedorActual.style.opacity = '0';
        
        setTimeout(() => {
            if (callback) callback();
            
            setTimeout(() => {
                const contenedorNuevo = document.querySelector('.paso-container:not([style*="display: none"])');
                if (contenedorNuevo) {
                    contenedorNuevo.style.opacity = '1';
                }
            }, 100);
        }, 500);
    } else {
        if (callback) callback();
    }
}

// Validar Frase
function validarFrase() {
    const input = document.getElementById('frase-input').value.toLowerCase().trim();
    
    if (!input) {
        mostrarError('frase-error', '¡Error!: Debe ingresar una frase.');
        return;
    }

    const palabras = input.split(/\s+/);
    
    // CAMBIO: Ahora requiere MÍNIMO 4 palabras
    if (palabras.length < 4 || palabras.length > 5) {
        mostrarError('frase-error', '¡Error!: Debe ingresar entre 4 y 5 PALABRAS!');
        return;
    }

    const soloLetras = palabras.every(palabra => /^[a-záéíóúüñ]+$/i.test(palabra));
    if (!soloLetras) {
        mostrarError('frase-error', '¡Error!: ¡Solo debe ingresar PALABRAS sin números ni caracteres especiales!');
        return;
    }

    frase_usuario = palabras.map(palabra => palabra[0].toLowerCase()).join('');
    ocultarError('frase-error');
    
    // APLICAR EFECTO DE TRANSICIÓN
    efectoTransicion(() => {
        siguientePaso('paso1', 'paso2');
    });
}

//Validar Año
function validarAno() {
    const input = document.getElementById('ano-input').value.trim();
    
    if (!input) {
        mostrarError('ano-error', '¡Error!: Debe ingresar un año.');
        return;
    }

    if (!/^\d{4}$/.test(input)) {
        mostrarError('ano-error', '¡Error!: Debe ingresar un año válido de 4 DÍGITOS ¡Sin letras!');
        return;
    }

    ano_usuario = input;
    ocultarError('ano-error');
    
    // APLICAR EFECTO DE TRANSICIÓN
    efectoTransicion(() => {
        siguientePaso('paso2', 'paso3');
    });
}

//Validar Nombre y Apellido
function validarNombre() {
    const input = document.getElementById('nombre-input').value.trim();
    
    if (!input) {
        mostrarError('nombre-error', '¡Error!: Debe ingresar un nombre y apellido.');
        return;
    }

    const palabras = input.split(/\s+/);
    
    if (palabras.length !== 2) {
        if (palabras.length > 2) {
            mostrarError('nombre-error', '¡Error!: Solo se debe ingresar un SOLO NOMBRE y un SOLO APELLIDO.');
        } else {
            mostrarError('nombre-error', '¡Error!: Debe ingresar tanto el nombre como el apellido.');
        }
        return;
    }

    const soloLetras = palabras.every(palabra => /^[a-záéíóúüñ]+$/i.test(palabra));
    if (!soloLetras) {
        mostrarError('nombre-error', '¡Error!: No se permiten NÚMEROS o CARACTERES ESPECIALES.');
        return;
    }

    nombre_usuario = palabras.map(palabra => palabra[0].toUpperCase()).join('');
    ocultarError('nombre-error');
    
    // APLICAR EFECTO DE TRANSICIÓN
    efectoTransicion(() => {
        siguientePaso('paso3', 'paso4');
    });
}

// Mostrar opciones de caracteres especiales
function mostrarCaracteres() {
    siguientePaso('paso4', 'seleccion-caracter');
}

// Seleccionar caracter especial
function seleccionarCaracter(caracter) {
    caracter_usuario = caracter;
    generarContrasenaFinal();
}

function volverPaso4() {
    siguientePaso('seleccion-caracter', 'paso4');
}

// Generar contraseña final 
function generarContrasenaFinal() {
    // Formato: iniciales_frase + año + iniciales_nombre + caracter_especial
    contrasena_final = frase_usuario + ano_usuario + nombre_usuario + caracter_usuario;
    
    document.getElementById('contrasena-final').textContent = contrasena_final;
    
    // Mostrar resultado final
    if (caracter_usuario) {
        siguientePaso('seleccion-caracter', 'resultado');
    } else {
        siguientePaso('paso4', 'resultado');
    }
}

// Copiar contraseña al portapapeles
function copiarContrasena() {
    navigator.clipboard.writeText(contrasena_final).then(function() {
        alert('¡Contraseña copiada al portapapeles!');
    }, function(err) {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = contrasena_final;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('¡Contraseña copiada al portapapeles!');
    });
}

function reiniciarGenerador() {
    // Resetear todas las variables
    frase_usuario = '';
    ano_usuario = '';
    nombre_usuario = '';
    caracter_usuario = '';
    contrasena_final = '';
    
    // Limpiar todos los inputs
    document.getElementById('frase-input').value = '';
    document.getElementById('ano-input').value = '';
    document.getElementById('nombre-input').value = '';
    
    // Ocultar todos los errores
    ocultarError('frase-error');
    ocultarError('ano-error');
    ocultarError('nombre-error');
    
    // Volver al primer paso
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('paso1').style.display = 'block';
    
    // Ocultar todos los demas pasos
    document.getElementById('paso2').style.display = 'none';
    document.getElementById('paso3').style.display = 'none';
    document.getElementById('paso4').style.display = 'none';
    document.getElementById('seleccion-caracter').style.display = 'none';
}

// FUNCIONES AUXILIARES
function siguientePaso(pasoActual, siguientePaso) {
    document.getElementById(pasoActual).style.display = 'none';
    document.getElementById(siguientePaso).style.display = 'block';
}

function mostrarError(errorId, mensaje) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = mensaje;
    errorElement.style.display = 'block';
}

function ocultarError(errorId) {
    document.getElementById(errorId).style.display = 'none';
}

// Permitir usar Enter para continuar (funcionalidad extra)
document.getElementById('frase-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') validarFrase();
});

document.getElementById('ano-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') validarAno();
});

document.getElementById('nombre-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') validarNombre();
});
// RESTO DE FUNCIONES CON EFECTOS
function mostrarCaracteres() {
    efectoTransicion(() => {
        siguientePaso('paso4', 'seleccion-caracter');
    });
}

function seleccionarCaracter(caracter) {
    caracter_usuario = caracter;
    efectoTransicion(() => {
        generarContrasenaFinal();
    });
}

function volverPaso4() {
    efectoTransicion(() => {
        siguientePaso('seleccion-caracter', 'paso4');
    });
}

function generarContrasenaFinal() {
    contrasena_final = frase_usuario + ano_usuario + nombre_usuario + caracter_usuario;
    document.getElementById('contrasena-final').textContent = contrasena_final;
    
    if (caracter_usuario) {
        siguientePaso('seleccion-caracter', 'resultado');
    } else {
        efectoTransicion(() => {
            siguientePaso('paso4', 'resultado');
        });
    }
}