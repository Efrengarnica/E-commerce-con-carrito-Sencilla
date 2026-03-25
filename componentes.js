//Función que muestra el navbar.
export function obtenerNavbar(estaActivoCarrito){
    let navbar = '';
    if(estaActivoCarrito){
        navbar = `
            <header>
                <div class="logo-ecommerce">
                    <img class="iconos" src="./assets/baby-stroller-solid-svgrepo-com(1).svg" alt="logo ropa">
                    <h4 id = "h4-logo">Ecommerce</h4>
                </div>
                <div class="logo-carrito">
                    <a href="./carrito.html"><img class="iconos" src="./assets/purchase-svgrepo-com(1).svg" alt="carrito"></a>
                </div>
            </header>
        `
    } else {
        navbar = ` 
            <header>
                <div class="logo-ecommerce">
                     <a href="./index.html"> <img class="iconos" src="./assets/baby-stroller-solid-svgrepo-com(1).svg" alt="logo ropa"></a>
                    <h4 id = "h4-logo">Ecommerce</h4>
                </div>
            </header>
        `
    }
    return navbar
}//obtenerNavbar()

//Función para importar el footer
export function obtenerFooter(){
    let footer = `
        <footer>
            <a href="#"><img class="iconos" src="./assets/icons8-facebook.svg" alt="Icono Facebook"> </a>
            <a href="#"><img class="iconos" src="./assets/icons8-instagram.svg" alt="Icono Instagram"></a>
            <a href="#"><img class="iconos" src="./assets/icons8-tiktok.svg" alt="Icono Tiktok"></a>
            <a href="#"><img class="iconos" src="./assets/icons8-whatsapp.svg" alt="Icono WhatsApp"></a>
        </footer>
    `;
    return footer
}//obtenerFooter()