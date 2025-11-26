  // CONFIGURAÇÃO
        const MERCHANT_PHONE = "556899281512"; 

        // Variáveis Globais
        let cart = [];
        let total = 0;

        // 1. Carregar dados salvos ao iniciar
        window.addEventListener('load', () => {
            try {
                const savedName = localStorage.getItem('meuCardapio_nome');
                const savedAddress = localStorage.getItem('meuCardapio_endereco');
                if (savedName) document.getElementById('client-name').value = savedName;
                if (savedAddress) document.getElementById('client-address').value = savedAddress;
            } catch (e) { console.log("Erro LocalStorage", e); }
        });

        // 2. Filtro de Categorias
        function filterMenu(category) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                if(btn.innerText.toLowerCase().includes(category)) btn.classList.add('active');
            });

            document.querySelectorAll('.product-card').forEach(product => {
                if (product.classList.contains(`category-${category}`)) {
                    product.classList.remove('hidden');
                } else {
                    product.classList.add('hidden');
                }
            });
        }

        // 3. Adicionar ao Carrinho
        function addToCart(name, price) {
            cart.push({ name, price });
            total += price;
            try { if (navigator.vibrate) navigator.vibrate(50); } catch(e){}
            updateCartUI();
        }

        // 4. Atualizar Visual do Carrinho
        function updateCartUI() {
            const cartBar = document.getElementById('cart-bar');
            const countEl = document.getElementById('cart-count');
            const totalEl = document.getElementById('cart-total');
            
            // Proteção se o HTML foi alterado
            if(countEl) countEl.innerText = `${cart.length} itens`;
            if(totalEl) totalEl.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            if (cartBar) {
                // Mostra a barra se tiver itens E o modal estiver fechado
                const modal = document.getElementById('checkout-modal');
                const isModalOpen = modal && modal.classList.contains('open');
                
                if (cart.length > 0 && !isModalOpen) {
                    cartBar.classList.add('visible');
                } else {
                    cartBar.classList.remove('visible');
                }
            }
        }

        // 5. Remover Item
        function removeItem(index) {
            const item = cart[index];
            total -= item.price;
            cart.splice(index, 1);
            updateCartUI();
            if (cart.length === 0) closeModal();
            else renderCartItems();
        }

        // 6. Renderizar Lista no Modal
        function renderCartItems() {
            const container = document.getElementById('cart-items-list');
            if (!container) return;
            
            container.innerHTML = '';
            if (cart.length === 0) return;

            cart.forEach((item, index) => {
                const row = document.createElement('div');
                row.classList.add('cart-item-row');
                const priceFormatted = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                
                row.innerHTML = `
                    <div class="cart-item-info">
                        <strong>${item.name}</strong>
                        <span class="cart-item-price">${priceFormatted}</span>
                    </div>
                    <button class="btn-remove-item" onclick="removeItem(${index})">🗑️</button>
                `;
                container.appendChild(row);
            });
        }

        // 7. Abrir/Fechar Modal
        function openModal() {
            if (cart.length === 0) return;
            renderCartItems();
            
            const modal = document.getElementById('checkout-modal');
            if(modal) modal.classList.add('open');
            
            // Esconde a barra ao abrir o modal
            const cartBar = document.getElementById('cart-bar');
            if(cartBar) cartBar.classList.remove('visible');
        }

        function closeModal() {
            const modal = document.getElementById('checkout-modal');
            if(modal) modal.classList.remove('open');
            updateCartUI(); // Isso traz a barra de volta automaticamente
        }

        // 8. Enviar Pedido
        function sendOrder() {
            const nameEl = document.getElementById('client-name');
            const addrEl = document.getElementById('client-address');
            const payEl = document.getElementById('payment-method');
            
            const name = nameEl ? nameEl.value : "";
            const address = addrEl ? addrEl.value : "";
            const payment = payEl ? payEl.value : "Pix";

            if (name.trim() === "" || address.trim() === "") {
                alert("Por favor, preencha nome e endereço!");
                return;
            }

            // Salvar no LocalStorage
            try {
                localStorage.setItem('meuCardapio_nome', name);
                localStorage.setItem('meuCardapio_endereco', address);
            } catch(e) {}

            let message = `*NOVO PEDIDO*\n\n👤 *Cliente:* ${name}\n📍 *Local:* ${address}\n💳 *Pagamento:* ${payment}\n\n*📝 ITENS:*\n`;
            cart.forEach(item => { message += `• ${item.name}\n`; });
            
            const formattedTotal = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            message += `\n💰 *TOTAL: ${formattedTotal}*`;

            window.open(`https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
            
            // Resetar
            cart = [];
            total = 0;
            updateCartUI();
            closeModal();
        }