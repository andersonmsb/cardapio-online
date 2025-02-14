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

let cart = []

// abrir modal carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal()
    cartModal.style.display = "flex"
})

//fechar modal clicando fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// botao fechar modal
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        // adicionar no carrinho
        addToCart(name, price)
    }
})

// função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        // se item exister aumenta quantidade + 1
        existingItem.qtd += 1
        addCart()
    }else{
        cart.push({
            name,
            price,
            qtd: 1,
        })
        addCart()
    }

    updateCartModal()

}

// função para alerta
function addCart(){
    Toastify({
        text: "Adicionado ao carrinho",
        duration: 600,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {background: "#22C55E",},
    }).showToast()
}

// atualiza carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = ""
    let total = 0 

    cart.forEach(item  => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Quantidade: ${item.qtd}</p>
                <p>Valor: ${item.price.toFixed(2)}</p>
                <p class="font-medium mt-2">Total: R$ ${(item.price*item.qtd).toFixed(2)}</p>
            </div>

            <button class="remove-cart-btn" data-name="${item.name}">
                Remover
            </button>
            
        </div>
        `

        total += item.price * item.qtd
        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length
}

// função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

// remover item do carrinho
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)
    if(index !== -1){
        const item = cart[index]

        if(item.qtd > 1){
            item.qtd -= 1
            updateCartModal()
            return
        }
        cart.splice(index, 1)
        updateCartModal()
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }


})

// finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkOpen()
    if(!isOpen){
        Toastify({
            text: "O restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {background: "#ef4444",},
        }).showToast()

        return
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    // enviar pedido para api Whats
    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: (${item.qtd}) Preço: R$${item.price}                                                         `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "18981312797"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()
})

// verificar hora e manipular card horario
function checkOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22 // true = restaurante aberto 
}

const spanItem = document.getElementById("date-span")
const isOpen = checkOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}