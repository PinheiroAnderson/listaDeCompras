let total = 0

// Referências aos elementos
const listaDeCompras = document.getElementById('lista-de-compras')
const valorTotal = document.getElementById('valor-total')
const nomeItemInput = document.getElementById('nome-item')
const botaoAdicionar = document.getElementById('adicionar-item')
const botaoFinalizar = document.getElementById('finalizar-compra')
const historicoCompras = document.getElementById('historico-compras')

// Função para atualizar o valor total
function atualizarTotal() {
    total = 0
    const itens = document.querySelectorAll('#lista-de-compras li')
    
    itens.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]')
        if (checkbox.checked) {
            const preco = parseFloat(item.querySelector('.preco').value)
            const quantidade = parseInt(item.querySelector('.quantidade').value)
            total += preco * quantidade
        }
    })
    
    valorTotal.innerText = total.toFixed(2)
}

// Função para adicionar um item na lista
function adicionarItem(nome) {
    const li = document.createElement('li')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = false

    checkbox.addEventListener('change', atualizarTotal)

    // Campos para editar preço e quantidade
    const precoInput = `<span>R$ <input type="number" class="preco text-input" step="0.01" placeholder="" disabled></span>`
    const quantidadeInput = `<span>Qtd: <input type="number" class="quantidade text-input" placeholder="" disabled></span>`
    const editarButton = `<button class="editar-item">Editar</button>`

    li.innerHTML = `${nome} ${precoInput} ${quantidadeInput} ${editarButton}`
    li.prepend(checkbox)

    // Adicionar event listeners para inputs editáveis e botão de editar
    const precoInputElement = li.querySelector('.preco');
    const quantidadeInputElement = li.querySelector('.quantidade');

    precoInputElement.addEventListener('input', atualizarTotal)
    quantidadeInputElement.addEventListener('input', atualizarTotal)

    li.querySelector('.editar-item').addEventListener('click', () => {
        const preco = parseFloat(precoInputElement.value) || 0
        const quantidade = parseInt(quantidadeInputElement.value) || 1
        precoInputElement.disabled = !precoInputElement.disabled
        quantidadeInputElement.disabled = !quantidadeInputElement.disabled
        li.querySelector('.editar-item').textContent = precoInputElement.disabled ? 'Editar' : 'Salvar'
        if (precoInputElement.disabled) {
            atualizarTotal()
        }
    })

    listaDeCompras.appendChild(li)
}

// Lidar com o botão de adicionar novo item
botaoAdicionar.addEventListener('click', () => {
    const nome = nomeItemInput.value

    if (nome) {
        adicionarItem(nome)
        nomeItemInput.value = ''
    } else {
        alert('O nome do item é obrigatório!')
    }
})

// Função para finalizar a compra e salvar no localStorage
botaoFinalizar.addEventListener('click', () => {
    if (total > 0) {
        // Obter a data atual
        const date = new Date()
        const dataAtual = date.toLocaleDateString('pt-BR') // Formato: DD/MM/AAAA

        // Salvar o valor e a data no localStorage
        const comprasAnteriores = JSON.parse(localStorage.getItem('historicoCompras')) || []
        comprasAnteriores.push({ data: dataAtual, valor: total })
        localStorage.setItem('historicoCompras', JSON.stringify(comprasAnteriores))

        // Atualizar o valor total na tela
        valorTotal.innerText = total.toFixed(2)

        // Limpar a lista de compras atual
        listaDeCompras.innerHTML = ''

        // Atualizar histórico de compras
        mostrarHistoricoCompras()
    } else {
        alert('Por favor, selecione pelo menos um item.')
    }
})

// Função para exibir o histórico de compras
function mostrarHistoricoCompras() {
    const comprasAnteriores = JSON.parse(localStorage.getItem('historicoCompras')) || []
    historicoCompras.innerHTML = ''

    comprasAnteriores.forEach(compra => {
        const li = document.createElement('li')
        li.textContent = `${compra.data}: R$ ${compra.valor.toFixed(2)}`
        historicoCompras.appendChild(li)
    });
}

// Função para alternar o tema
function toggleTema() {
    const body = document.body
    const btn = document.querySelector('.btnTema')

    if (body.classList.contains('light-theme')) {
        body.classList.replace('light-theme', 'dark-theme')
        btn.textContent = 'Tema claro'
    } else {
        body.classList.replace('dark-theme', 'light-theme')
        btn.textContent = 'Tema escuro'
    }
}

// Carregar o histórico ao iniciar
mostrarHistoricoCompras()
