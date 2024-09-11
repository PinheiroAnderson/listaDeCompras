let total = 0

// Referências aos elementos
const listaDeCompras = document.getElementById('lista-de-compras')
const valorTotal = document.getElementById('valor-total')
const nomeItemInput = document.getElementById('nome-item')
const precoItemInput = document.getElementById('preco-item')
const quantidadeItemInput = document.getElementById('quantidade-item')
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
function adicionarItem(nome, preco = 0, quantidade = 1, marcado = false) {
    if (!nome) {
        alert("O nome do item é obrigatório!")
        return
    }

    const li = document.createElement('li')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = marcado
    checkbox.dataset.preco = preco
    checkbox.dataset.quantidade = quantidade

    checkbox.addEventListener('change', atualizarTotal)

    const precoInput = `<span>R$ <input type="number" class="preco" value="${preco}" step="0.01" placeholder="Preço"></span>`
    const quantidadeInput = `<span>Qtd: <input type="number" class="quantidade" value="${quantidade}" placeholder="Qtd"></span>`

    li.innerHTML = `${nome} ${precoInput} ${quantidadeInput}`
    li.prepend(checkbox)

    // Adicionar event listeners para inputs editáveis
    li.querySelector('.preco').addEventListener('input', atualizarTotal)
    li.querySelector('.quantidade').addEventListener('input', atualizarTotal)

    listaDeCompras.appendChild(li)
}

// Lidar com o botão de adicionar novo item
botaoAdicionar.addEventListener('click', () => {
    const nome = nomeItemInput.value
    const preco = parseFloat(precoItemInput.value) || 0
    const quantidade = parseInt(quantidadeItemInput.value) || 1

    if (nome) {
        adicionarItem(nome, preco, quantidade)
        nomeItemInput.value = ''
        precoItemInput.value = ''
        quantidadeItemInput.value = '1'
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
