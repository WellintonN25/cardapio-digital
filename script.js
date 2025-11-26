// !!! CONFIGURE SEU NÚMERO AQUI (DDD + NÚMERO) !!!
        const MERCHANT_PHONE = "556899281512"; 

        let cart = [];
        let total = 0;

        function filterMenu(category) {
            const buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active');
                if(btn.innerText.toLowerCase().includes(category)) btn.classList.add('active');
            });

            const allProducts = document.querySelectorAll('.product-card');
            allProducts.forEach(product => {
                if (product.classList.contains(`category-${category}`)) {
                    product.classList.remove('hidden');
                } else {
                    product.classList.add('hidden');
                }
            });
        }

        function addToCart(name, price) {
            cart.push({ name, price });
            total += price;
            if (navigator.vibrate) navigator.vibrate(50);
            updateCartUI();
        }

        function updateCartUI() {
            const cartBar = document.getElementById('cart-bar');
            document.getElementById('cart-count').innerText = `${cart.length} itens`;
            document.getElementById('cart-total').innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
            if (cart.length > 0) {
                cartBar.classList.add('visible');
            } else {
                cartBar.classList.remove('visible');
            }
        }

        function openModal() {
            if (cart.length === 0) return;
            renderCartItems();
            document.getElementById('checkout-modal').classList.add('open');
        }

        function closeModal() {
            document.getElementById('checkout-modal').classList.remove('open');
        }

        document.getElementById('checkout-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('checkout-modal')) closeModal();
        });

        function sendOrder() {
            const name = document.getElementById('client-name').value;
            const address = document.getElementById('client-address').value;
            const payment = document.getElementById('payment-method').value;

            if (name.trim() === "" || address.trim() === "") {
                alert("Por favor, preencha nome e endereço!");
                return;
            }

            let message = `*NOVO PEDIDO APP*\n\n`;
            message += `👤 *Cliente:* ${name}\n`;
            message += `📍 *Local:* ${address}\n`;
            message += `💳 *Pagamento:* ${payment}\n\n`;
            message += `*📝 ITENS:*\n`;

            cart.forEach(item => {
                message += `• ${item.name}\n`;
            });

            const formattedTotal = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            message += `\n💰 *TOTAL: ${formattedTotal}*`;

            const whatsappUrl = `https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(message)}`;
            
            // 1. Abre o WhatsApp
            window.open(whatsappUrl, '_blank');

            // 2. Limpa o carrinho e fecha o modal (Melhoria de UX)
            cart = [];
            total = 0;
            updateCartUI();
            closeModal();
            document.getElementById('client-name').value = "";
            document.getElementById('client-address').value = "";
        }

        // Função para desenhar a lista visual no modal
function renderCartItems() {
    const container = document.getElementById('cart-items-list');
    container.innerHTML = ''; // Limpa a lista anterior

    cart.forEach((item, index) => {
        const row = document.createElement('div');
        row.classList.add('cart-item-row');
        
        // Formata o preço (R$)
        const priceFormatted = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        row.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong> <br>
                <span class="cart-item-price">${priceFormatted}</span>
            </div>
            <button class="btn-remove-item" onclick="removeItem(${index})">
                🗑️ Remover
            </button>
        `;
        container.appendChild(row);
    });
}

// Função para remover o item
function removeItem(index) {
    const item = cart[index];
    
    // Subtrai o valor e remove do array
    total -= item.price;
    cart.splice(index, 1);
    
    // Atualiza tudo
    updateCartUI(); // Atualiza barra inferior
    
    if (cart.length === 0) {
        closeModal(); // Se zerou, fecha o modal
    } else {
        renderCartItems(); // Se ainda tem itens, redesenha a lista
    }
}