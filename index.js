//Importando el navbar
import { obtenerNavbar } from './componentes.js';
import { obtenerFooter } from './componentes.js';

//Manipulación del DOM
const divProductos = document.getElementById("listaProductos");
const divfiltros = document.getElementById("fila-filtros");
const inputDiv = document.getElementById("search");
const containerPrincipal = document.getElementById("container-id");

//Inyectando el navbar y el footer
containerPrincipal.insertAdjacentHTML("afterbegin", obtenerNavbar(true));
containerPrincipal.insertAdjacentHTML('beforeend', obtenerFooter());

//Variables que necesito para encontrar las cosas mas rapido.
let productos = null;
let productosDiccionarioMap = null;
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

//Toma las categorías de la api e inserta botones es una fila con cada categoría.
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
function modificarCarrito(id) {
    //Primer paso para usar LocalStorage es definir a mi carrito cuando se cargue todo.
    let carritoDeCompras = {};
    //Antes de iniciar cosas hay que preguntar si ya hay un carrito, si hay habrá que modificarlo, sino hay que crearlo.
    if(!localStorage.getItem("carritoDeCompras")){
        carritoDeCompras[`"${id}"`]={...productosDiccionarioMap.get(id), "cantidadProducto": 1};
    } else {
        //Primero traer lo que hay en el carrito del localStorage
        carritoDeCompras =JSON.parse(localStorage.getItem('carritoDeCompras'))
        //Preguntar si existe el artículo que quiero ingresar, si existe sumarle uno si fijarlo en el carrito.
        if(`"${id}"` in carritoDeCompras){
            carritoDeCompras[`"${id}"`]["cantidadProducto"] +=1;
        } else {
            carritoDeCompras[`"${id}"`]={...productosDiccionarioMap.get(id), "cantidadProducto": 1};
        }
    }
    localStorage.setItem('carritoDeCompras', JSON.stringify(carritoDeCompras));
}//modificarCarrito;

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

//Parches, estos son necesarios ya que mi script lo uno con mi html de type module entonces el onclik ya no puede leer las funciones en mi script.
//Lo hice type module ya que era la única manera de que leyera el navbar que viene de otro script.
//La ide para futua+ras cosas es estar usando addEvent para escuchar al contenedor que tendrá todos los botones en vez de usar onclick.
window.presentarProductosAplicandoCategoria = presentarProductosAplicandoCategoria;
window.modificarCarrito = modificarCarrito;

/* 

Métodos para manipular el LOCALSTORAGE

1.localStorage.setItem('tema', 'oscuro');

2.const tema = localStorage.getItem('tema');

3.localStorage.removeItem('tema');

4.localStorage.clear();

5.localStorage.setItem('usuario', JSON.stringify(usuario));

6. const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));

*/