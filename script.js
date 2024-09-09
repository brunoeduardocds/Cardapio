const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

cartBtn.addEventListener("click", ()=>{
    updateCartModal()
    cartModal.style.display= "flex"
})

closeModalBtn.addEventListener("click", ()=>{
    cartModal.style.display= "none"
})

menu.addEventListener("click", (evt)=>{
    let parentButton = evt.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price")) 
        //console.log(name);
        //console.log(price);
        addTocart(name,price);
    }    
})
//Adicionar no carrinho

//Função para adicionar no carrinho

function addTocart(name,price) {
    //alert("O item foi " + name + " e o preço é "+ price +" R$")

    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        // Se o item já existe, aumente apenas a quantidade + 1

        existingItem.quantity += 1;
        return;
    }else{
        cart.push({
        name,
        price,
        quantity: 1,
    })
    }

    updateCartModal()    
}
//Atualiza o carrinho

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        //console.log(item);

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `        
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class = "font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>            
            <button class= "remove-from-cart-btn" data-name = "${item.name}">
                 Remover
            </button>            
        </div>
        ` 
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement)        
    })
     cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
     });

     cartCounter.innerHTML = cart.length;
}
//Função para remover o itém do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
        
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500")
    }
})
// Finalizar pedido
checkoutBtn.addEventListener("click", function () {
    if (!checkrestaurantOpen()) {
        Toastify({
            text: "Ops, restaurante fechado!",
            duration: 3000,     
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #ef4444, #008000)",              
            },
            onClick: function(){} // Callback after click
          }).showToast();
          return;
    
    }
    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Enviar pedido para api Whats
    const cartItems = cart.map((item) => {
        return(
            `Item: ${item.name} Quantidade: ${item.quantity} Preço: R$ ${item.price} |`
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = "5581985388307"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];// para limpar carrinho
    updateCartModal();
} )

//Verificar a hora e manipular o card horário

function checkrestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 0 && hora < 24;
    // true = restaurante está aberto
}
const spanItem = document.getElementById("date-span")
const isOpen = checkrestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}