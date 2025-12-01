// CONFIGURAÇÃO
const MERCHANT_PHONE = "556899281512"; 

// --- BASE DE DADOS (ARRAY DE OBJETOS) ---
const menuItens = [
    {
        id: 1,
        name: "Frango ao molho",
        desc: "Generosa porção de frango ao molho, servido com arroz branco soltinho, feijão carioca temperado e farofa crocante da casa.",
        price: 15.00,
        image: "https://images.pexels.com/photos/8948980/pexels-photo-8948980.jpeg",
        category: "comidas"
    },
    {
        id: 2,
        name: "Milanesa de frango",
        desc: "Tiras de frango empanadas e fritas na hora. Super crocantes, ideais para petiscar.",
        price: 18.00,
        image: "https://images.pexels.com/photos/262973/pexels-photo-262973.jpeg",
        category: "comidas"
    },
    {
        id: 3,
        name: "Bisteca de boi",
        desc: "Corte selecionado, temperado com alho fresco e sal, frito até ficar douradinho por fora e macio por dentro.",
        price: 18.00,
        image: "https://plus.unsplash.com/premium_photo-1695658519271-56e79516e030?q=80&w=870&auto=format&fit=crop",
        category: "comidas"
    },
    {
        id: 4,
        name: "Bife acebolado",
        desc: "Aquele almoço que todo mundo ama. Bife acebolado feito na hora, servido com arroz soltinho, feijão caseiro, farofa e salada.",
        price: 20.00,
        image: "https://images.pexels.com/photos/34831917/pexels-photo-34831917.jpeg",
        category: "comidas"
    },
    {
        id: 5,
        name: "Alcatra",
        desc: "Alcatra de padrão superior, preparada para preservar sua suculência natural.",
        price: 20.00,
        image: "https://images.unsplash.com/photo-1612871689353-cccf581d667b?q=80&w=387&auto=format&fit=crop",
        category: "comidas"
    },
    {
        id: 6,
        name: "File de Frango",
        desc: "A união ideal entre leveza e sabor em um preparo extremamente suculento.",
        price: 20.00,
        image: "https://images.pexels.com/photos/5769375/pexels-photo-5769375.jpeg",
        category: "comidas"
    },
    {
        id: 7,
        name: "Tambaqui Frito",
        desc: "Fritura leve e sequinha, realçando a nobreza e a maciez deste clássico.",
        price: 20.00,
        image: "https://images.unsplash.com/photo-1676700310614-600f2aa255ef?q=80&w=1452&auto=format&fit=crop",
        category: "comidas"
    },
    {
        id: 8,
        name: "Filé com fritas",
        desc: "O clássico elevado à perfeição: corte nobre suculento acompanhado de batatas douradas e crocantes.",
        price: 25.00,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=870&auto=format&fit=crop",
        category: "comidas"
    },
    {
        id: 9,
        name: "Parmegiana de carne",
        desc: "O clássico elevado à perfeição: corte nobre suculento acompanhado de batatas douradas e crocantes.",
        price: 25.00,
        image: "https://images.pexels.com/photos/34831930/pexels-photo-34831930.jpeg",
        category: "comidas"
    },
    {
        id: 10,
        name: "Coca-Cola Lata",
        desc: "350ml bem gelada.",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600",
        category: "bebidas"
    },
    {
        id: 11,
        name: "Suco de laranja",
        desc: "Suco de laranja natural.",
        price: 6.00,
        image: "https://images.pexels.com/photos/3603/healthy-breakfast-orange-juice-health.jpg",
        category: "bebidas"
    }
];

// Variáveis Globais
let cart = [];
let total = 0;

// --- 1. RENDERIZAÇÃO OTIMIZADA (Fragment) ---
const renderMenu = () => {
    const menuContainer = document.getElementById('menu');
    // Cria o fragmento (memória virtual)
    const fragment = document.createDocumentFragment();

    menuItens.forEach(item => {
        // Cria o elemento principal do card
        const card = document.createElement('div');
        // Adiciona as classes necessárias (incluindo a categoria para o filtro funcionar)
        card.className = `product-card category-${item.category}`;
        
        // Monta o HTML interno usando Template String
        // Nota: Mantivemos onclick="addToCart..." para compatibilidade
        card.innerHTML = `
            <img
                src="${item.image}"
                alt="${item.name}"
                class="product-img"
                loading="lazy"
                decoding="async"
            />
            <div class="product-info">
                <h3 class="product-title">${item.name}</h3>
                <p class="product-desc">${item.desc}</p>
                <div class="price-row">
                    <span class="price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                    <button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">
                        Adicionar
                    </button>
                </div>
            </div>
        `;
        
        // Adiciona o card ao fragmento
        fragment.appendChild(card);
    });

    // Injeta tudo no DOM de uma vez só (Performance pura!)
    menuContainer.appendChild(fragment);
};


// --- INICIALIZAÇÃO ---
window.addEventListener('load', () => {
    // 1. Renderiza o cardápio
    renderMenu();
    
    // 2. Aplica o filtro inicial (apenas comidas)
    filterMenu('comidas');

    // 3. Carrega dados salvos
    try {
        const savedName = localStorage.getItem('meuCardapio_nome');
        const savedAddress = localStorage.getItem('meuCardapio_endereco');
        if (savedName) document.getElementById('client-name').value = savedName;
        if (savedAddress) document.getElementById('client-address').value = savedAddress;
    } catch (e) { console.log("Erro LocalStorage", e); }
});


// --- LÓGICA DO SISTEMA ---

// 2. Filtro de Categorias
const filterMenu = (category) => {
    // Atualiza botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        // Verifica se o texto do botão contém a categoria
        if(btn.innerText.toLowerCase().includes(category)) btn.classList.add('active');
    });

    // Atualiza visibilidade dos produtos
    document.querySelectorAll('.product-card').forEach(product => {
        if (product.classList.contains(`category-${category}`)) {
            product.classList.remove('hidden');
        } else {
            product.classList.add('hidden');
        }
    });
}

// 3. Adicionar ao Carrinho
const addToCart = (name, price) => {
    cart.push({ name, price });
    total += price;
    try { if (navigator.vibrate) navigator.vibrate(50); } catch(e){}
    updateCartUI();
}

// 4. Atualizar Visual do Carrinho
const updateCartUI = () => {
    const cartBar = document.getElementById('cart-bar');
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    
    if(countEl) countEl.innerText = `${cart.length} itens`;
    if(totalEl) totalEl.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (cartBar) {
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
const removeItem = (index) => {
    const item = cart[index];
    total -= item.price;
    if (total < 0) total = 0;
    
    cart.splice(index, 1);
    updateCartUI();
    
    if (cart.length === 0) {
        closeModal();
    } else {
        renderCartItems();
        updateTotalModal();
    }
}

// 6. Renderizar Lista no Modal
const renderCartItems = () => {
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
const openModal = () => {
    if (cart.length === 0) return;
    renderCartItems();
    
    const modal = document.getElementById('checkout-modal');
    if(modal) modal.classList.add('open');
    
    const cartBar = document.getElementById('cart-bar');
    if(cartBar) cartBar.classList.remove('visible');

    updateTotalModal();
}

const closeModal = () => {
    const modal = document.getElementById('checkout-modal');
    if(modal) modal.classList.remove('open');
    updateCartUI();
}

// 8. Atualizar Total no Botão (Com/Sem Entrega)
const updateTotalModal = () => {
    const deliveryOption = document.querySelector('input[name="delivery-type"]:checked').value;
    let finalTotal = total;

    if (deliveryOption === 'entrega') {
        finalTotal += 5.00; 
    }

    const formattedTotal = finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.querySelector('.btn-confirm').innerText = `Enviar Pedido (${formattedTotal})`;
}

// 9. Enviar Pedido
const sendOrder = () => {
    const nameEl = document.getElementById('client-name');
    const addrEl = document.getElementById('client-address');
    const payEl = document.getElementById('payment-method');
    const deliveryOption = document.querySelector('input[name="delivery-type"]:checked').value;

    const name = nameEl ? nameEl.value : "";
    const address = addrEl ? addrEl.value : "";
    const payment = payEl ? payEl.value : "Pix";

    if (name.trim() === "" || (deliveryOption === 'entrega' && address.trim() === "")) {
        alert("Por favor, preencha seus dados corretamente!");
        return;
    }

    try {
        localStorage.setItem('meuCardapio_nome', name);
        localStorage.setItem('meuCardapio_endereco', address);
    } catch(e) {}

    let finalTotal = total;
    let deliveryMessage = ""; 

    if (deliveryOption === 'entrega') {
        finalTotal += 5.00;
        deliveryMessage = `🛵 *Frete:* + R$ 5,00 (Incluso)\n📍 *Endereço:* ${address}`;
    } else {
        deliveryMessage = `🥡 *Tipo:* Retirada no Balcão (Grátis)`;
    }

    let message = `*NOVO PEDIDO*\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `${deliveryMessage}\n`;
    message += `💳 *Pagamento:* ${payment}\n\n`;
    message += `*📝 ITENS:*\n`;

    cart.forEach(item => {
        message += `• ${item.name}\n`;
    });

    const formattedTotal = finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    message += `\n💰 *TOTAL FINAL: ${formattedTotal}*`;

    window.open(`https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(message)}`, '_blank');

    cart = [];
    total = 0;
    updateCartUI();
    closeModal();
}