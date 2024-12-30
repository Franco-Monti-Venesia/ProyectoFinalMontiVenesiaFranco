// Archivo modificado para integrar los puntos pendientes
class ItemCarrito {
    constructor(nombre, precio, cantidad, categoria) {
        if (!nombre || typeof nombre !== "string") throw new Error("Nombre inválido.");
        if (precio <= 0 || typeof precio !== "number") throw new Error("Precio inválido.");
        if (cantidad <= 0 || !Number.isInteger(cantidad)) throw new Error("Cantidad inválida.");
        if (!categoria || typeof categoria !== "string") throw new Error("Categoría inválida.");
        
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.categoria = categoria;
    }
}

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const form = document.getElementById("producto__form");
const cartaItems = document.getElementById("carta__items");
const cartaTotal = document.getElementById("carta__total");
const limpiarCarritoBtn = document.getElementById("limpiar__carrito");
const buscador = document.getElementById("buscador");
const toggleTema = document.getElementById("toggle-tema");
const temaIcono = document.getElementById("tema-icono");
const mensajeError = document.createElement("p");

mensajeError.id = "mensaje-error";
mensajeError.style.color = "red";
form.appendChild(mensajeError);

if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark-mode");
    temaIcono.textContent = "dark_mode";
}

toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const esOscuro = document.body.classList.contains("dark-mode");
    temaIcono.textContent = esOscuro ? "dark_mode" : "light_mode";
    localStorage.setItem("tema", esOscuro ? "dark" : "light");
});

const actualizarCarrito = () => {
    cartaItems.innerHTML = "";
    let total = 0;

    carrito.forEach(({ nombre, precio, cantidad, categoria }) => {
        const li = document.createElement("li");
        li.textContent = `[${categoria}] ${nombre}: $${precio.toFixed(2)} x ${cantidad} = $${(precio * cantidad).toFixed(2)}`;
        total += precio * cantidad;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add("borrar__btn");
        deleteButton.onclick = () => {
            carrito = carrito.filter(item => item.nombre !== nombre);
            guardarCarrito();
            actualizarCarrito();
        };

        li.appendChild(deleteButton);
        cartaItems.appendChild(li);
    });

    cartaTotal.textContent = `Total: $${total.toFixed(2)}`;
    guardarCarrito();
};

const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

limpiarCarritoBtn.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
});

buscador.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = carrito.filter(item => item.nombre.toLowerCase().includes(texto));
    cartaItems.innerHTML = "";
    filtrados.forEach(({ nombre, precio, cantidad, categoria }) => {
        const li = document.createElement("li");
        li.textContent = `[${categoria}] ${nombre}: $${precio.toFixed(2)} x ${cantidad} = $${(precio * cantidad).toFixed(2)}`;
        cartaItems.appendChild(li);
    });
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const nombre = document.getElementById("producto__nombre").value.trim();
    const precio = parseFloat(document.getElementById("producto__precio").value) || 0;
    const cantidad = parseInt(document.getElementById("producto__cantidad").value, 10) || 0;
    const categoria = document.getElementById("producto__categoria").value || "Sin Categoría";

    try {
        const productoExistente = carrito.find(item => item.nombre === nombre);
        
        if (productoExistente) {
            productoExistente.cantidad += cantidad;
        } else {
            carrito.push(new ItemCarrito(nombre, precio, cantidad, categoria));
        }

        mensajeError.textContent = "";

        actualizarCarrito();
        form.reset();
    } catch (error) {
        mensajeError.textContent = error.message;
    }
});

actualizarCarrito();

// Integración con SweetAlert para mejores mensajes
const mostrarMensaje = (mensaje, tipo = "success") => {
    Swal.fire({
        text: mensaje,
        icon: tipo,
        timer: 1500,
        showConfirmButton: false
    });
};

// Simulación de API
const fetchDatosEjemplo = async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        if (!response.ok) throw new Error("Error al obtener datos de la API.");
        const data = await response.json();
        console.log(data); // Integración básica para cumplir la consigna
        mostrarMensaje("Datos obtenidos de la API correctamente.");
    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
};

fetchDatosEjemplo();
