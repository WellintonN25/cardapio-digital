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
    
    // 1. Subtrai o valor do item do total geral
    total -= item.price;
    
    // Evita erros de arredondamento (ex: ficar com -0.0001)
    if (total < 0) total = 0;

    // 2. Remove o item da lista (array)
    cart.splice(index, 1);
    
    // 3. Atualiza a barra do fundo (se ela estivesse visível)
    updateCartUI();
    
    // 4. Lógica de Fechamento ou Atualização
    if (cart.length === 0) {
        closeModal(); // Se ficou vazio, fecha a janela
    } else {
        renderCartItems();  // Redesenha a lista visual (sem o item removido)
        updateTotalModal(); // <--- O SEGREDO: Recalcula o total + frete no botão verde
    }
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
    
    const cartBar = document.getElementById('cart-bar');
    if(cartBar) cartBar.classList.remove('visible');

    // NOVA LINHA: Atualiza o total assim que abre a janela
    updateTotalModal();
}
  

        function closeModal() {
            const modal = document.getElementById('checkout-modal');
            if(modal) modal.classList.remove('open');
            updateCartUI(); // Isso traz a barra de volta automaticamente
        }

        // 8. Enviar Pedido
        
function sendOrder() {
    // 1. Pega os dados dos campos
    const nameEl = document.getElementById('client-name');
    const addrEl = document.getElementById('client-address');
    const payEl = document.getElementById('payment-method');
    
    // Pega a opção de entrega selecionada (Entrega ou Retirada)
    const deliveryOption = document.querySelector('input[name="delivery-type"]:checked').value;

    const name = nameEl ? nameEl.value : "";
    const address = addrEl ? addrEl.value : "";
    const payment = payEl ? payEl.value : "Pix";

    // 2. Validação: Se for entrega, obriga a colocar endereço
    if (name.trim() === "" || (deliveryOption === 'entrega' && address.trim() === "")) {
        alert("Por favor, preencha seus dados corretamente!");
        return;
    }

    // 3. Salva no navegador para a próxima vez
    try {
        localStorage.setItem('meuCardapio_nome', name);
        localStorage.setItem('meuCardapio_endereco', address);
    } catch(e) {}

    // 4. CÁLCULO DO FRETE
    let finalTotal = total;
    let deliveryMessage = ""; // Texto extra que vai no Zap

    if (deliveryOption === 'entrega') {
        finalTotal += 5.00; // Soma os 5 reais
        deliveryMessage = `🛵 *Frete:* + R$ 5,00 (Incluso)\n📍 *Endereço:* ${address}`;
    } else {
        deliveryMessage = `🥡 *Tipo:* Retirada no Balcão (Grátis)`;
    }

    // 5. MONTAGEM DA MENSAGEM DO WHATSAPP
    let message = `*NOVO PEDIDO*\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `${deliveryMessage}\n`; // Aqui entra o aviso do frete e endereço
    message += `💳 *Pagamento:* ${payment}\n\n`;
    message += `*📝 ITENS:*\n`;

    cart.forEach(item => {
        message += `• ${item.name}\n`;
    });

    // Formata o valor total para Dinheiro (R$)
    const formattedTotal = finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    message += `\n💰 *TOTAL FINAL: ${formattedTotal}*`;

    // 6. Envia para o WhatsApp
    // Lembre de conferir se o MERCHANT_PHONE está configurado no topo do seu código
    window.open(`https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(message)}`, '_blank');

    // 7. Limpa tudo após enviar
    cart = [];
    total = 0;
    updateCartUI();
    closeModal();
}



// Função para atualizar o total no botão quando troca a entrega
function updateTotalModal() {
    const deliveryOption = document.querySelector('input[name="delivery-type"]:checked').value;
    let finalTotal = total;

    if (deliveryOption === 'entrega') {
        finalTotal += 5.00; // Taxa de entrega
    }

    const formattedTotal = finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Atualiza o texto do botão de enviar para mostrar o valor real
    document.querySelector('.btn-confirm').innerText = `Enviar Pedido (${formattedTotal})`;
}
