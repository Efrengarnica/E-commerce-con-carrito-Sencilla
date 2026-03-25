//Importando el navabar y el footer.
import { obtenerNavbar } from "./componentes.js";
import { obtenerFooter } from "./componentes.js";

//Manipulación del DOM.
const containerPrincipal = document.getElementById('container-carrito-id');

//Inyectando el Navbar y el Footer.
containerPrincipal.insertAdjacentHTML("afterbegin", obtenerNavbar(false));
containerPrincipal.insertAdjacentHTML("beforeend", obtenerFooter());

//La idea es traer las cosas del local storage y presentarlas en mi carrito
//Tambien la idea es que cada vez que se modifique el local storage mi carrito se modifique.
//También la idea es que mi carrito se modifique con los botones que le voy a presentar.










/* 

Métodos para manipular el LOCALSTORAGE.

1.localStorage.setItem('tema', 'oscuro');

2.const tema = localStorage.getItem('tema');

3.localStorage.removeItem('tema');

4.localStorage.clear();

5.localStorage.setItem('usuario', JSON.stringify(usuario));

6. const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));


*/






















//Funcion que se ocupará para sumar o restar elementos de mi carrito de compra
/* function modificarCarrito(id, operacion = "suma") {
    if(operacion === "suma"){
        if (carrito.has(id)) {
            carrito.get(id).cantidadProducto += 1;
        }else {
            carrito.set(id,{ ...productosDiccionarioMap.get(id), "cantidadProducto": 1});
        }
    } else {
        if(carrito.get(id).cantidadProducto === 1) {
            carrito.delete(id);
        } else if(carrito.get(id).cantidadProducto > 0) {
            carrito.get(id).cantidadProducto -= 1;
        }     
    }
    renderizarCarrito();
}//modificarCarrito

function eliminarElementoCarrito(id) {
    carrito.delete(id);
    renderizarCarrito();
}//eliminarElementoCarrito

//Solo se pone en marcha cuando se empieza a modificar el carrito
function renderizarCarrito() {
    divCarrito.innerHTML = "";
    if(carrito.size === 0){
        divCarrito.insertAdjacentHTML("beforeend",`
                <div class="icon-mensaje-vacio">
                    <p>Tu carrito está vacio</p>
                    <div class="carrito-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                    </div>
                </div>
            `);
    }else{
        carrito.values().forEach( valor => {
            let filaCarrito = ` 
                        <div class="fila-carrito">
                            <div class="fila-carrito-columna-imagen">
                                <img src=${valor.image} alt=${valor.title} class ="imagen-carrito">
                            </div>
                            <div class="fila-carrito-columna-texto">
                                <div class="fila-carrito-columna-texto-arriba">
                                    <div class="contenedor-texto-carrito"><p class ="texto-carrito">${valor.title}</p></div>
                                    <p class ="texto-carrito precio-carrito ">MXN ${((valor.price)*(valor.cantidadProducto)).toFixed(2)}</p>
                                    <p class ="texto-carrito">${valor.cantidadProducto} pz</p>
                                </div>
                                <div class="fila-carrito-columna-texto-abajo">
                                    <button type="button" onclick="modificarCarrito(${valor.id}, 'resta')" class="botones-carrito"><svg class="iconos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg></button>
                                    <button type="button" onclick="modificarCarrito(${valor.id})" class="botones-carrito"><svg class="iconos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg></button>
                                    <button type="button" onclick="eliminarElementoCarrito(${valor.id})" class="botones-carrito"><svg class="iconos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>
                                </div>
                            </div>
                        </div>
                        `
            divCarrito.insertAdjacentHTML("beforeend", filaCarrito);
        });
    }
    renderizarTotalCarrito();
}//renderizarCarrito

//Se pone en marcha cada vez que se renderiza el carrito.
function renderizarTotalCarrito() {
    if (carrito.size > 0){
        totalCarrito.innerHTML = "";
        let cantidadTotalAPagar = 0;
        carrito.values().forEach( valor => {
            const cantidadTotalPorProducto = (valor.price)*(valor.cantidadProducto);
            cantidadTotalAPagar += cantidadTotalPorProducto;
        });
        totalCarrito.insertAdjacentHTML("beforeend", `
            <div class="totalCarrito-fila-precio">
                <div class="totalCarrito-fila-precio-letras">
                    <p class="precio-carrito">Total</p>
                    <p class="texto-IVA">IVA incluido</p>
                </div>
                <div class="totalCarrito-fila-precio-dinero">
                    <p class="precio-carrito">MXN ${cantidadTotalAPagar.toFixed(2)}</p>
                </div>
            </div>
            <div class="totalCarrito-fila-boton">
                <button type="button" class ="boton-pagar-carrito" id="idBotonRealizarCompra" onClick="realizarCompra()">Realizar compra</button>
            </div>
        `);
    } else {
        totalCarrito.innerHTML = "";
    }
}//renderizarTotalCarrito

//Función que ayuda a presentar un mensaje al usuario una vez que confirma su compra
function realizarCompra() {
    divCarrito.innerHTML="";
    totalCarrito.innerHTML="";
    carrito.clear();
    const compraRealizada = `
        <div class="ordenDeCompra">
            <p>Su compra fue exitosa</p>
            <svg class="carrito-icon-exito" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
            <p>Agregue otros productos para realizar otro pedido</p>
        </div>
    `
    divCarrito.insertAdjacentHTML("beforeend",compraRealizada);
}//realizarCompra */