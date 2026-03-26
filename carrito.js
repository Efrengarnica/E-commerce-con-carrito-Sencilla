//Importando el navabar y el footer.
import { obtenerNavbar } from "./componentes.js";
import { obtenerFooter } from "./componentes.js";

//Manipulación del DOM.
const containerPrincipal = document.getElementById('container-carrito-id');
const carritoCompras = document.getElementById("carritoId");
const resultadoFinal = document.getElementById("resultado-final-id");

//Inyectando el Navbar y el Footer.
containerPrincipal.insertAdjacentHTML("afterbegin", obtenerNavbar(false));
containerPrincipal.insertAdjacentHTML("beforeend", obtenerFooter());

//La idea es traer las cosas del local storage y presentarlas en mi carrito
//Tambien la idea es que cada vez que se modifique el local storage mi carrito se modifique.
//También la idea es que mi carrito se modifique con los botones que le voy a presentar.

//Cuando cargue la pagina traer lo que hay en el local, si hay lo guardas y lo presentas sino no presentar el mensaje de carrito vacio
function cargandoCarrito(){
    if(!localStorage.getItem("carritoDeCompras") || localStorage.getItem("carritoDeCompras") === "{}"){
        carritoCompras.innerHTML = "";
        let mensaje = `
            <div class = "mensaje-vacio"><h3>Tu carrito está vacio</h3></div>
        `;
        carritoCompras.insertAdjacentHTML("afterbegin", mensaje);
    } else {
        carritoCompras.innerHTML = "";
        let tarjeta = "";
        let localStorageProductos = JSON.parse(localStorage.getItem("carritoDeCompras"));
        for(let producto in localStorageProductos){
            tarjeta = `
                <div class="productos-en-carrito">
                    <div class="contenedor-imagen-de-producto-carrito ">
                        <img src=${localStorageProductos[producto].image} alt="Imagen de producto" class= "imagen-Tarjeta-Cart">
                    </div>
                    <div class="contenedor-botones-carrito"> 
                            <img src="./assets/plus-svgrepo-com.svg" alt="Icono suma" class="iconos-carrito" onclick=agregarAcarrito(${producto})>
                            <img src="./assets/minus-svgrepo-com.svg" alt="Icono resta" class="iconos-carrito" onclick=disminuirDeCarrito(${producto})>
                            <img src="./assets/trash-blank-alt-svgrepo-com.svg" alt="Icono basura" class="iconos-carrito" onclick=eliminarDeCarrito(${producto})>
                    </div>
                    <div class="contenedor-info-de-producto-carrito">
                        <p class="tarjeta-nombre-producto">${localStorageProductos[producto].title}</p>
                        <p class="tarjeta-cantidad-piezas">Piezas: ${localStorageProductos[producto].cantidadProducto}</p>
                        <p class="tarjeta-precio">El precio unitario es: $ ${(localStorageProductos[producto].price).toFixed(2)}</p>
                        <p class="tarjeta-total">Total: $ ${(localStorageProductos[producto].price*localStorageProductos[producto].cantidadProducto).toFixed(2)}</p>
                    </div>
                </div>
            `;
            carritoCompras.insertAdjacentHTML("beforeend", tarjeta)
        }
    }
}//cargandoCarrito

//Se inicia.
cargandoCarrito();
mostrarTotalCarrito();

//En JS si las llaves son números entonces si recorres o modificas el objeto se reacomodan en orden de los números
//Aquí por suerte lo agregue como ""id"" lo que hace que no se reordenen.
//Función para sumar a mi carrito.
function agregarAcarrito(id){
    let carroActual = JSON.parse(localStorage.getItem("carritoDeCompras"));
    carroActual[`"${id}"`]["cantidadProducto"] += 1;
    localStorage.setItem("carritoDeCompras", JSON.stringify(carroActual));
    cargandoCarrito();
    mostrarTotalCarrito();
}//agregarAcarrito

//Función para restar a mi carrito.
function disminuirDeCarrito(id){
    let carroActual = JSON.parse(localStorage.getItem("carritoDeCompras"));
    if(carroActual[`"${id}"`]["cantidadProducto"]===1){
        eliminarDeCarrito(id);
    }else {
        carroActual[`"${id}"`]["cantidadProducto"] -= 1;
        localStorage.setItem("carritoDeCompras", JSON.stringify(carroActual));
        cargandoCarrito();
    }
    mostrarTotalCarrito();
}//disminuirDeCarrito

//Función para eliminar un elemto de mi carrito.
function eliminarDeCarrito(id){
    let carroActual = JSON.parse(localStorage.getItem("carritoDeCompras"));
    delete carroActual[`"${id}"`];
    localStorage.setItem("carritoDeCompras", JSON.stringify(carroActual));
    cargandoCarrito();
    mostrarTotalCarrito();
}//eliminarDeCarrito

//Función que me ayuda a mostrar el total de carrito.
function mostrarTotalCarrito(){
    let total = 0;
    let carroActual = JSON.parse(localStorage.getItem("carritoDeCompras"));
    if(!carroActual){
        resultadoFinal.innerHTML="";
        resultadoFinal.insertAdjacentHTML("afterbegin", `<p class = "total-a-pagar">Total a pagar: $ 0</p> 
            <button type="button" class="boton-finalizar-compra" onclick=limpiarLocalStorage()>Finalizar compra</button>`);
        return;
    }
    for(let producto in carroActual){
        total += (carroActual[producto].price)*(carroActual[producto].cantidadProducto) ;
    }
    let tarjetaTotal= `<p class = "total-a-pagar">Total a pagar: $ ${total.toFixed(2)}</p> 
        <button type="button" class="boton-finalizar-compra" onclick=limpiarLocalStorage()>Finalizar compra</button>`;
    resultadoFinal.innerHTML="";
    resultadoFinal.insertAdjacentHTML("afterbegin", tarjetaTotal);
}//mostrarTotalCarrito

//Limpiar carrito del local Storage.
function limpiarLocalStorage(){
    localStorage.clear();
    cargandoCarrito();
    mostrarTotalCarrito();
}

//Lo usamos ya que usamos type module en la importación en el html.
window.agregarAcarrito = agregarAcarrito;
window.eliminarDeCarrito = eliminarDeCarrito;
window.disminuirDeCarrito = disminuirDeCarrito;
window.mostrarTotalCarrito = mostrarTotalCarrito;
window.limpiarLocalStorage = limpiarLocalStorage;