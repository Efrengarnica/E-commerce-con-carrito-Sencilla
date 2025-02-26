const divProductos = document.getElementById("listaProductos");
const divCarrito = document.getElementById("carrito");
const totalCarrito = document.getElementById("totalCarrito");
const divfiltros = document.getElementById("fila-filtros");
const divLadoCarrito = document.getElementById("id-lado-carrito");
const inputDiv = document.getElementById("search");

let productos = null;
let productosDiccionarioMap = null;
let carrito = new Map();
let arregloCategorias = null;
let productosOrdenadosPorCategoria = new Map();

//Esta función async trae los productos de una Api, los almacena en distintos tipos de datos para nuestra conveniencia y renderiza los primeros valores en la página web.
async function obtenerProductos() {
    try {
      const responseProductos = await fetch('https://fakestoreapi.com/products'); 
      if (!responseProductos.ok) {
        throw new Error('Error en la solicitud de productos: ' + responseProductos.status);
      }
      productos = await responseProductos.json(); 
      //Renderiza y regresa los productos ordenados por su id, se guardan en un map().
      productosDiccionarioMap=renderizarProductos(productos);
      //Ordena los productos por medio de su categoria y los guarda en un map.
      ordenarProductosPorCategoria();

      const responseCategorias = await fetch('https://fakestoreapi.com/products/categories');
      if(!responseCategorias.ok) {
        throw new Error('Error en la solicitud de categorías: ' + responseCategorias.status);
      }
      arregloCategorias = await responseCategorias.json();
      //Renderiza los botones de categorías
      renderizarCategorias(arregloCategorias);

    } catch (error) {
      console.error('Hubo un problema con la petición:', error);
    }
}//obtenerProductos

//Pone en marcha la función async
obtenerProductos(); 

function renderizarCategorias(arreglo) {
    arreglo.push("all");
    arreglo.forEach(categoria => {
        divfiltros.insertAdjacentHTML("beforeend", `  
                            <button class="categorias" type="button" onClick="presentarProductosAplicandoCategoria(\`${categoria}\`)">${categoria}</button>
            `)
    });
}//renderizarCategorias

function renderizarProductos(arreglo) {
    const productosDiMap= new Map();
    arreglo.forEach(element => {
        const tarjeta = crearTarjeta(element.image, element.title, element.price, element.category, element.id);
        divProductos.insertAdjacentHTML("afterbegin", tarjeta);
        productosDiMap.set(element.id, element);
    });
    return productosDiMap;
}//renderizarProductos

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
}//crearTarjeta

//Funcion que se ocupará para sumar o restar elementos de mi carrito de compra
function modificarCarrito(id, operacion = "suma") {
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

//Debes de tener cuidado aquí ya que estás usando un arreglo que puede no llegar a existir, deberias de crear la función y que esta reciba un arreglo y después mandarla a llamar
//Esta función me ayuda a crear un map, que servirá para buscar de manera mas eficiente los productos por su categoria.
function ordenarProductosPorCategoria(){
    productos.forEach(producto => {
        if(productosOrdenadosPorCategoria.has(producto.category)){
            productosOrdenadosPorCategoria.get(producto.category).push(producto);
        }else {
            productosOrdenadosPorCategoria.set(producto.category,[producto]);
        }
    });
}//ordenarProductosPorCategoria

//Mediante una categoria y mi map busco los objetos que tengan esa categoria de manera eficiente.
function presentarProductosAplicandoCategoria(categoria) {
    inputDiv.value = "";
    if(categoria==="all" && divProductos.childElementCount!==(productos.length+1)){
        divProductos.innerHTML="";
        const tarjetaRelleno = `
                <div class="tarjeta" style="visibility: hidden;">
                    <img src="./assets/OIP (5).jpg" alt="Chamarra" class="imagen-tarjeta">
                    <h2>Producto Uno</h2>
                    <h3>$ 100</h3>
                    <h3>Chamarra</h3>
                    <p>Muy flexible, recomendada para cuando hace frio.</p>
                </div>
        `
        divProductos.insertAdjacentHTML("afterbegin",tarjetaRelleno);
        productos.forEach(producto => {
            const tarjeta = crearTarjeta(producto.image, producto.title, producto.price, producto.category, producto.id);
            divProductos.insertAdjacentHTML("afterbegin",tarjeta);
        });
        return;
    }
    const arregloARenderizar = productosOrdenadosPorCategoria.get(categoria);
    if(arregloARenderizar){
        divProductos.innerHTML="";
        arregloARenderizar.forEach(producto => {
            const tarjeta = crearTarjeta(producto.image, producto.title, producto.price, producto.category, producto.id);
            divProductos.insertAdjacentHTML("afterbegin",tarjeta);
        });
    }
}//presentarProductosAplicandoCategoria

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
}//realizarCompra

//Funcion NO eficiente para crear un buscador, solo se buscan similitudes mediante el title.
function buscarMedianteBuscador(arregloResultadoBusqueda) {
    if(arregloResultadoBusqueda.length===0){
        divProductos.innerHTML="";
        divProductos.insertAdjacentHTML("afterbegin",`
            <p class="sinCoincidencias">Sin coincidencias</p>
            `);
        return;
    }
    divProductos.innerHTML="";
    const tarjetaRelleno = `
            <div class="tarjeta" style="visibility: hidden;">
                <img src="./assets/OIP (5).jpg" alt="Chamarra" class="imagen-tarjeta">
                <h2>Producto Uno</h2>
                <h3>$ 100</h3>
                <h3>Chamarra</h3>
                <p>Muy flexible, recomendada para cuando hace frio.</p>
            </div>
    `
    divProductos.insertAdjacentHTML("afterbegin",tarjetaRelleno);
    arregloResultadoBusqueda.forEach(producto => {
        const tarjeta = crearTarjeta(producto.image, producto.title, producto.price, producto.category, producto.id);
        divProductos.insertAdjacentHTML("afterbegin",tarjeta);
    });
}//buscarMedianteBuscador

//Esto es algo nuevo que aprendí, hay un addEventListener "input" que cada vez que el usuario cambia el valor del input se ejecuta lo que hay dentro.
inputDiv.addEventListener("input", function(event){
    const query = event.target.value.toLowerCase();  
    const resultados = productos.filter(producto => producto.title.toLowerCase().includes(query));
    buscarMedianteBuscador(resultados);
    });