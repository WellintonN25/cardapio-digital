
        // !!! CONFIGURE SEU NÚMERO AQUI (DDD + NÚMERO) !!!
        const MERCHANT_PHONE = "556899281512"; 

        let cart = [];
        let total = 0;

        // --- 1. CARREGAR DADOS (Versão Segura) ---
        window.addEventListener('load', () => {
            try {
                const savedName = localStorage.getItem('cardapio_nome');
                const savedAddress = localStorage.getItem('cardapio_endereco');
                
                const nameInput = document.getElementById('client-name');
                const addressInput = document.getElementById('client-address');

                if (savedName && nameInput) nameInput.value = savedName;
                if (savedAddress && addressInput) addressInput.value = savedAddress;
            } catch (e) {
                console.log("Erro ao carregar dados salvos:", e);
            }
        });

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
            
            // Tenta vibrar, se não der, ignora
            try { if (navigator.vibrate) navigator.vibrate(50); } catch(e){}
            
            updateCartUI();
        }

        function updateCartUI() {
            const cartBar = document.getElementById('cart-bar');
            const countEl = document.getElementById('cart-count');
            const totalEl = document.getElementById('cart-total');
            const modal = document.getElementById('checkout-modal');

            // Atualiza textos se os elementos existirem
            if(countEl) countEl.innerText = `${cart.length} itens`;
            if(totalEl) totalEl.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            // Lógica da barra flutuante (Com proteção anti-erro)
            if (cartBar) {
                if (cart.length > 0) {
                    // Se o modal existe e está aberto, esconde a barra. Se não, mostra.
                    if (modal && modal.classList.contains('open')) {
                        cartBar.classList.remove('visible');
                    } else {
                        cartBar.classList.add('visible');
                    }
                } else {
                    cartBar.classList.remove('visible');
                }
            }
        }

        // --- FUNÇÕES DA JANELA DE PEDIDO ---
        function openModal() {
            if (cart.length === 0) return;
            
            renderCartItems();
            
            const modal = document.getElementById('checkout-modal');
            const cartBar = document.getElementById('cart-bar');

            if (modal) modal.classList.add('open');
            if (cartBar) cartBar.classList.remove('visible'); // Esconde a barra
        }

        function closeModal() {
            const modal = document.getElementById('checkout-modal');
            const cartBar = document.getElementById('cart-bar');

            if (modal) modal.classList.remove('open');

            // Se ainda tiver itens, traz a barra de volta
            if (cart.length > 0 && cartBar) {
                cartBar.classList.add('visible');
            }
        }

        // --- ENVIAR PEDIDO ---
        function sendOrder() {
            const nameInput = document.getElementById('client-name');
            const addressInput = document.getElementById('client-address');
            const paymentInput = document.getElementById('payment-method');

            // Proteção caso os inputs não existam
            const name = nameInput ? nameInput.value : "Não informado";
            const address = addressInput ? addressInput.value : "Não informado";
            const payment = paymentInput ? paymentInput.value : "Dinheiro";

            if (name.trim() === "" || address.trim() === "") {
                alert("Por favor, preencha nome e endereço!");
                return;
            }

            // Salvar dados
            localStorage.setItem('cardapio_nome', name);
            localStorage.setItem('cardapio_endereco', address);

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
            window.open(whatsappUrl, '_blank');

            // Limpa carrinho
            cart = [];
            total = 0;
            updateCartUI();
            closeModal();
        }

        function renderCartItems() {
            const container = document.getElementById('cart-items-list');
            if (!container) return; // Se não tiver a lista no HTML, para aqui

            container.innerHTML = '';

            if (cart.length === 0) {
                container.innerHTML = '<div style="text-align:center; color:#999; padding:20px;">Seu carrinho está vazio 😢</div>';
                return;
            }

            cart.forEach((item, index) => {
                const row = document.createElement('div');
                row.classList.add('cart-item-row');
                
                const priceFormatted = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                row.innerHTML = `
                    <div class="cart-item-info">
                        <strong>${item.name}</strong>
                        <span class="cart-item-price">${priceFormatted}</span>
                    </div>
                    <button class="btn-remove-item" onclick="removeItem(${index})" title="Remover item">
                        🗑️
                    </button>
                `;
                container.appendChild(row);
            });
        }

        function removeItem(index) {
            const item = cart[index];
            total -= item.price;
            cart.splice(index, 1);
            updateCartUI();
            
            if (cart.length === 0) {
                closeModal();
            } else {
                renderCartItems();
            }
        }
        
        // Listener global para fechar modal ao clicar fora (com verificação)
        const modalEl = document.getElementById('checkout-modal');
        if (modalEl) {
            modalEl.addEventListener('click', (e) => {
                if (e.target === modalEl) closeModal();
            });
        }
