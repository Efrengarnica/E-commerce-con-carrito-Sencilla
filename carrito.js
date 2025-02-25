const divProductos = document.getElementById("listaProductos");
const divCarrito = document.getElementById("carrito");
const totalCarrito = document.getElementById("totalCarrito");
let productos = null;
let productosDiccionarioMap = null;
let carrito = new Map();

async function obtenerProductos() {
    try {
      const response = await fetch('https://fakestoreapi.com/products'); 
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.status);
      }
      productos = await response.json(); 
      productosDiccionarioMap=renderizarProductos(productos);
    } catch (error) {
      console.error('Hubo un problema con la petición:', error);
    }
}

obtenerProductos(); 

function renderizarProductos(arreglo) {
    const productosDiMap= new Map();
    arreglo.forEach(element => {
        const tarjeta = crearTarjeta(element.image, element.title, element.price, element.category, element.id);
        divProductos.insertAdjacentHTML("afterbegin",tarjeta);
        productosDiMap.set(element.id, element);
    });
    return productosDiMap;
}

function crearTarjeta(imagen, titulo, precio, categoria, id) {
    const tarjeta = `
        <div class="tarjeta">
            <img src=${imagen} alt="${titulo}" class="imagen-tarjeta">
            <h2 class="titulo-tarjeta">${titulo}</h2>
            <h3>MXN ${precio}</h3>
            <h3 class = "categoria-tarjeta">${categoria}</h3>
            <button type="button" id="${id}" onclick="modificarCarrito(${id})" class="boton-agregar-carrito">Agregar a carrito</button>
        </div>
    `
    return tarjeta;
}

function modificarCarrito(id, operacion = "suma") {
    if(operacion === "suma"){
        if (carrito.has(id)) {
            carrito.get(id).cantidadProducto += 1;
        }else {
            carrito.set(id,{ ...productosDiccionarioMap.get(id), "cantidadProducto": 1})
        }
    } else {
        if(carrito.get(id).cantidadProducto === 1) {
            carrito.delete(id)
        } else if(carrito.get(id).cantidadProducto > 0) {
            carrito.get(id).cantidadProducto -= 1;
        }     
    }
    renderizarCarrito();
}

function eliminarElementoCarrito(id){
    carrito.delete(id)
    renderizarCarrito();
}

function renderizarCarrito(){
    divCarrito.innerHTML = "";
    carrito.values().forEach( valor => {
        let filaCarrito = ` 
                    <div class="fila-carrito">
                        <div class="fila-carrito-columna-imagen">
                            <img src=${valor.image} alt=${valor.title} class ="imagen-carrito">
                        </div>
                        <div class="fila-carrito-columna-texto">
                            <div class="fila-carrito-columna-texto-arriba">
                                <div class="contenedor-texto-carrito"><p class ="texto-carrito">${valor.title}</p></div>
                                <p class ="texto-carrito precio-carrito ">MXN ${(valor.price)*(valor.cantidadProducto)}</p>
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
        divCarrito.insertAdjacentHTML("beforeend",filaCarrito)
    });
    renderizarTotalCarrito();
}

function renderizarTotalCarrito() {
    if (carrito.size > 0){
        totalCarrito.innerHTML = "";
        let cantidadTotalAPagar = 0;
        carrito.values().forEach( valor => {
            const cantidadTotalPorProducto = (valor.price)*(valor.cantidadProducto)
            cantidadTotalAPagar += cantidadTotalPorProducto;
        });
        totalCarrito.insertAdjacentHTML("beforeend", `
            <div class="totalCarrito-fila-precio">
                <div class="totalCarrito-fila-precio-letras">
                    <p class="precio-carrito">Total</p>
                    <p class="texto-IVA">IVA incluido</p>
                </div>
                <div class="totalCarrito-fila-precio-dinero">
                    <p class="precio-carrito">MXN ${cantidadTotalAPagar}</p>
                </div>
            </div>
            <div class="totalCarrito-fila-boton">
                <button type="button" class ="boton-agregar-carrito">Tramitar pedido</button>
            </div>
        `)
    } else {
        totalCarrito.innerHTML = "";
    }
}