// ===== SISTEMA DE LOGIN =====

// Usuários cadastrados (simulando banco de dados)
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Usuário demo padrão
if (usuarios.length === 0) {
    usuarios.push({
        id: 1,
        nome: "Usuário Demo",
        email: "demo@financeiro.com",
        senha: "123456"
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Variável para controlar se o sistema já foi inicializado
let sistemaInicializado = false;

// Verificar se usuário está logado
function verificarLogin() {
    const usuarioLogado = sessionStorage.getItem("usuarioLogado");
    if (usuarioLogado) {
        const user = JSON.parse(usuarioLogado);
        const userNomeSpan = document.getElementById("userNome");
        if (userNomeSpan) userNomeSpan.textContent = user.nome;
        
        const telaLogin = document.getElementById("telaLogin");
        const telaRegistro = document.getElementById("telaRegistro");
        const telaRecuperar = document.getElementById("telaRecuperar");
        const sistemaPrincipal = document.getElementById("sistemaPrincipal");
        
        if (telaLogin) telaLogin.style.display = "none";
        if (telaRegistro) telaRegistro.style.display = "none";
        if (telaRecuperar) telaRecuperar.style.display = "none";
        if (sistemaPrincipal) sistemaPrincipal.style.display = "block";
        
        // Inicializar o sistema apenas se ainda não foi inicializado
        if (!sistemaInicializado) {
            sistemaInicializado = true;
            // Aguardar um pequeno delay para garantir que o DOM está pronto
            setTimeout(() => {
                if (typeof atualizarTabela === 'function') {
                    atualizarTabela();
                }
            }, 100);
        }
    } else {
        const telaLogin = document.getElementById("telaLogin");
        const sistemaPrincipal = document.getElementById("sistemaPrincipal");
        
        if (telaLogin) telaLogin.style.display = "flex";
        if (sistemaPrincipal) sistemaPrincipal.style.display = "none";
        
        // Resetar a flag quando deslogar
        sistemaInicializado = false;
    }
}

// Função de login
if (document.getElementById("formLogin")) {
    document.getElementById("formLogin").onsubmit = function(e) {
        e.preventDefault();
        
        const email = document.getElementById("loginEmail").value;
        const senha = document.getElementById("loginSenha").value;
        
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);
        
        if (usuario) {
            sessionStorage.setItem("usuarioLogado", JSON.stringify({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }));
            
            // Carregar dados do usuário
            carregarDadosUsuario(usuario.id);
            
            verificarLogin();
        } else {
            alert("❌ E-mail ou senha incorretos!");
        }
    };
}

// Função de registro
if (document.getElementById("formRegistro")) {
    document.getElementById("formRegistro").onsubmit = function(e) {
        e.preventDefault();
        
        const nome = document.getElementById("regNome").value;
        const email = document.getElementById("regEmail").value;
        const senha = document.getElementById("regSenha").value;
        const confirmarSenha = document.getElementById("regConfirmarSenha").value;
        
        if (senha !== confirmarSenha) {
            alert("❌ As senhas não coincidem!");
            return;
        }
        
        if (senha.length < 6) {
            alert("❌ A senha deve ter no mínimo 6 caracteres!");
            return;
        }
        
        const usuarioExistente = usuarios.find(u => u.email === email);
        if (usuarioExistente) {
            alert("❌ Este e-mail já está cadastrado!");
            return;
        }
        
        const novoUsuario = {
            id: Date.now(),
            nome: nome,
            email: email,
            senha: senha
        };
        
        usuarios.push(novoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        
        alert("✅ Conta criada com sucesso! Faça login.");
        mostrarLogin();
    };
}

// Função de recuperar senha
if (document.getElementById("formRecuperar")) {
    document.getElementById("formRecuperar").onsubmit = function(e) {
        e.preventDefault();
        
        const email = document.getElementById("recEmail").value;
        const usuario = usuarios.find(u => u.email === email);
        
        if (usuario) {
            alert(`✅ Um link de recuperação foi enviado para ${email}\n\n(Simulação - Sua senha é: ${usuario.senha})`);
        } else {
            alert("❌ E-mail não encontrado!");
        }
    };
}

// Carregar dados do usuário
function carregarDadosUsuario(userId) {
    const chaveDados = `dados_${userId}`;
    let dadosUsuario = JSON.parse(localStorage.getItem(chaveDados));
    
    if (dadosUsuario) {
        principal = dadosUsuario;
    } else {
        principal = [];
    }
    
    localStorage.setItem("principal", JSON.stringify(principal));
}

// Salvar dados do usuário
function salvarDadosUsuario() {
    const usuarioLogado = sessionStorage.getItem("usuarioLogado");
    if (usuarioLogado) {
        const user = JSON.parse(usuarioLogado);
        const chaveDados = `dados_${user.id}`;
        localStorage.setItem(chaveDados, JSON.stringify(principal));
    }
}

// Sobrescrever a função de salvar original APENAS para dados do usuário
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.call(localStorage, key, value);
    if (key === "principal") {
        salvarDadosUsuario();
    }
};

// Funções de navegação
function mostrarRegistro() {
    const telaLogin = document.getElementById("telaLogin");
    const telaRegistro = document.getElementById("telaRegistro");
    const telaRecuperar = document.getElementById("telaRecuperar");
    
    if (telaLogin) telaLogin.style.display = "none";
    if (telaRegistro) telaRegistro.style.display = "flex";
    if (telaRecuperar) telaRecuperar.style.display = "none";
}

function mostrarLogin() {
    const telaLogin = document.getElementById("telaLogin");
    const telaRegistro = document.getElementById("telaRegistro");
    const telaRecuperar = document.getElementById("telaRecuperar");
    
    if (telaLogin) telaLogin.style.display = "flex";
    if (telaRegistro) telaRegistro.style.display = "none";
    if (telaRecuperar) telaRecuperar.style.display = "none";
}

function mostrarRecuperarSenha() {
    const telaLogin = document.getElementById("telaLogin");
    const telaRegistro = document.getElementById("telaRegistro");
    const telaRecuperar = document.getElementById("telaRecuperar");
    
    if (telaLogin) telaLogin.style.display = "none";
    if (telaRegistro) telaRegistro.style.display = "none";
    if (telaRecuperar) telaRecuperar.style.display = "flex";
}

function logout() {
    sessionStorage.removeItem("usuarioLogado");
    sistemaInicializado = false;
    verificarLogin();
}

// Garantir que o modal não seja aberto automaticamente
document.addEventListener("DOMContentLoaded", function() {
    // Verificar se o modal está visível e fechar se estiver
    const modal = document.getElementById("modalEditar");
    if (modal && modal.style.display === "block") {
        modal.style.display = "none";
    }
    
    // Inicializar verificação de login
    verificarLogin();
});

// Sobrescrever a função abrirModal para garantir que só abra quando chamada
const originalAbrirModal = window.abrirModal;
if (originalAbrirModal) {
    window.abrirModal = function(id) {
        const item = principal.find(i => i.id === id);
        if (!item) return;
        
        document.getElementById("editarId").value = item.id;
        document.getElementById("editarDescricao").value = item.descricao;
        document.getElementById("editarValor").value = item.valor;
        document.getElementById("editarTipo").value = item.tipo;
        document.getElementById("editarBanco").value = item.banco || "";
        document.getElementById("editarModalidade").value = item.modalidade;
        document.getElementById("editarData").value = item.data;
        
        const modal = document.getElementById("modalEditar");
        if (modal) modal.style.display = "block";
    };
}

// Funções de navegação
function mostrarRegistro() {
    document.getElementById("telaLogin").style.display = "none";
    document.getElementById("telaRegistro").style.display = "flex";
    document.getElementById("telaRecuperar").style.display = "none";
}

function mostrarLogin() {
    document.getElementById("telaLogin").style.display = "flex";
    document.getElementById("telaRegistro").style.display = "none";
    document.getElementById("telaRecuperar").style.display = "none";
}

function mostrarRecuperarSenha() {
    document.getElementById("telaLogin").style.display = "none";
    document.getElementById("telaRegistro").style.display = "none";
    document.getElementById("telaRecuperar").style.display = "flex";
}

function logout() {
    sessionStorage.removeItem("usuarioLogado");
    verificarLogin();
}

// Inicializar verificação de login
verificarLogin();// ===== ELEMENTOS =====
const form = document.getElementById("formGasto");
const lista = document.getElementById("listaGastos");
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const tipo = document.getElementById("tipo");
const banco = document.getElementById("banco");
const modalidade = document.getElementById("modalidade");
const data = document.getElementById("data");

const totalEntrada = document.getElementById("totalEntrada");
const totalSaida = document.getElementById("totalSaida");
const saldoFinal = document.getElementById("saldoFinal");

// BENEFICIOS
const vrSaldo = document.getElementById("vrSaldo");
const vaSaldo = document.getElementById("vaSaldo");
const vtSaldo = document.getElementById("vtSaldo");

// FATURA
const faturaNubank = document.getElementById("faturaNubank");
const faturaItau = document.getElementById("faturaItau");
const faturaSantander = document.getElementById("faturaSantander");
const listaFatura = document.getElementById("listaFatura");
const listaBeneficioFiltrado = document.getElementById("listaBeneficioFiltrado");

// MODAL
const modal = document.getElementById("modalEditar");
const formEditar = document.getElementById("formEditar");
const fecharModal = document.querySelector(".fechar-modal");
const btnCancelar = document.querySelector(".btn-cancelar");

// ===== DADOS =====
let principal = JSON.parse(localStorage.getItem("principal")) || [];

// ===== UTILS =====
function formatarMoeda(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getSelecionados(id) {
    return Array.from(document.querySelectorAll(`#${id} input:checked`))
        .map(el => el.value);
}

// ===== FILTROS =====
if (document.getElementById("btnAplicarFiltro")) {
    document.getElementById("btnAplicarFiltro").onclick = atualizarTabela;
}

if (document.getElementById("btnLimparFiltro")) {
    document.getElementById("btnLimparFiltro").onclick = () => {
        document.querySelectorAll("#filtroBanco input, #filtroModalidade input, #filtroTipo input")
            .forEach(i => i.checked = false);
        atualizarTabela();
    };
}

// ===== FUNÇÃO DE FILTRO TOGGLE =====
function toggleFiltros() {
    const container = document.getElementById("filtrosContainer");
    const icone = document.getElementById("iconeFiltro");
    
    if (container && icone) {
        if (container.classList.contains("fechado")) {
            container.classList.remove("fechado");
            icone.textContent = "▼";
        } else {
            container.classList.add("fechado");
            icone.textContent = "▶";
        }
    }
}

// Inicializar filtros como abertos
if (document.getElementById("filtrosContainer")) {
    document.getElementById("filtrosContainer").classList.remove("fechado");
}

// ===== FUNÇÕES DO MODAL =====
function abrirModal(id) {
    const item = principal.find(i => i.id === id);
    if (!item) return;
    
    document.getElementById("editarId").value = item.id;
    document.getElementById("editarDescricao").value = item.descricao;
    document.getElementById("editarValor").value = item.valor;
    document.getElementById("editarTipo").value = item.tipo;
    document.getElementById("editarBanco").value = item.banco || "";
    document.getElementById("editarModalidade").value = item.modalidade;
    document.getElementById("editarData").value = item.data;
    
    modal.style.display = "block";
}

function fecharModalFunc() {
    modal.style.display = "none";
    formEditar.reset();
}

// ===== EDITAR =====
if (formEditar) {
    formEditar.onsubmit = e => {
        e.preventDefault();
        
        const id = parseInt(document.getElementById("editarId").value);
        const index = principal.findIndex(i => i.id === id);
        
        if (index !== -1) {
            principal[index] = {
                id: id,
                descricao: document.getElementById("editarDescricao").value,
                valor: parseFloat(document.getElementById("editarValor").value),
                tipo: document.getElementById("editarTipo").value,
                modalidade: document.getElementById("editarModalidade").value,
                banco: document.getElementById("editarBanco").value || "",
                data: document.getElementById("editarData").value
            };
            
            localStorage.setItem("principal", JSON.stringify(principal));
            atualizarTabela();
            fecharModalFunc();
            
            const btn = formEditar.querySelector('.btn-salvar');
            const textoOriginal = btn.textContent;
            btn.textContent = "✓ Salvo!";
            setTimeout(() => {
                btn.textContent = textoOriginal;
            }, 1000);
        }
    };
}

// Fechar modal
if (fecharModal) fecharModal.onclick = fecharModalFunc;
if (btnCancelar) btnCancelar.onclick = fecharModalFunc;

window.onclick = function(event) {
    if (event.target === modal) {
        fecharModalFunc();
    }
}

// ===== TABELA =====
function atualizarTabela() {
    if (!lista) return;
    lista.innerHTML = "";

    let dados = [...principal];

    const bancos = getSelecionados("filtroBanco");
    const tipos = getSelecionados("filtroTipo");
    const modalidades = getSelecionados("filtroModalidade");

    if (bancos.length) dados = dados.filter(i => bancos.includes(i.banco));
    if (tipos.length) dados = dados.filter(i => tipos.includes(i.tipo));
    if (modalidades.length) dados = dados.filter(i => modalidades.includes(i.modalidade));

    dados.sort((a, b) => new Date(b.data) - new Date(a.data));

    const contador = document.getElementById("contadorResultados");
    if (contador) contador.textContent = `${dados.length} registro(s) encontrado(s)`;

    if (!dados.length) {
        lista.innerHTML = `<tr><td colspan="7">Nenhum registro encontrado</td></tr>`;
        atualizarResumo();
        atualizarBeneficios();
        atualizarFatura();
        return;
    }

    dados.forEach(item => {
        const row = lista.insertRow();
        
        const tipoCor = item.tipo === 'entrada' ? 'style="color: #00b09b; font-weight: bold;"' : 'style="color: #ff416c; font-weight: bold;"';
        const tipoTexto = item.tipo === 'entrada' ? 'Entrada' : 'Saída';
        
        row.innerHTML = `
            <td>${item.descricao}</td>
            <td>${formatarMoeda(item.valor)}</td>
            <td ${tipoCor}>${tipoTexto}</td>
            <td>${item.modalidade}</td>
            <td>${item.banco || "-"}</td>
            <td>${item.data}</td>
            <td class="acao-botoes">
                <button class="editar-btn" onclick="editarItem(${item.id})">✏️ Editar</button>
                <button class="excluir-btn" onclick="remover(${item.id})">🗑️ Excluir</button>
            </td>
        `;
    });

    atualizarResumo();
    atualizarBeneficios();
    atualizarFatura();
}

// ===== FILTRAR BENEFÍCIO (mostra na tabela abaixo) =====
window.filtrarBeneficio = function(beneficio) {
    const lancamentos = principal.filter(item => 
        item.modalidade === beneficio
    ).sort((a, b) => new Date(b.data) - new Date(a.data));
    
    const filtroAtivo = document.getElementById("beneficioFiltroAtivo");
    const listaBeneficio = document.getElementById("listaBeneficioFiltrado");
    
    let nomeBeneficio = '';
    if (beneficio === 'VR') nomeBeneficio = 'Vale Refeição';
    else if (beneficio === 'VA') nomeBeneficio = 'Vale Alimentação';
    else nomeBeneficio = 'Vale Transporte';
    
    filtroAtivo.innerHTML = `📊 Mostrando transações do ${beneficio} - ${nomeBeneficio}`;
    
    if (lancamentos.length === 0) {
        listaBeneficio.innerHTML = `<tr><td colspan="4">Nenhuma transação encontrada para ${beneficio}</td></tr>`;
        return;
    }
    
    listaBeneficio.innerHTML = "";
    lancamentos.forEach(item => {
        const row = listaBeneficio.insertRow();
        const tipoCor = item.tipo === 'entrada' ? 'style="color: #00b09b; font-weight: bold;"' : 'style="color: #ff416c; font-weight: bold;"';
        const tipoTexto = item.tipo === 'entrada' ? 'Entrada' : 'Saída';
        
        row.innerHTML = `
            <td>${item.descricao}</td>
            <td>${formatarMoeda(item.valor)}</td>
            <td ${tipoCor}>${tipoTexto}</td>
            <td>${item.data}</td>
        `;
    });
};

// ===== FILTRAR BANCO CRÉDITO (mostra na tabela de fatura) =====
window.filtrarBancoCredito = function(bancoNome) {
    const compras = principal.filter(item => 
        item.modalidade === "Crédito" && 
        item.tipo === "saida" &&
        item.banco === bancoNome
    ).sort((a, b) => new Date(b.data) - new Date(a.data));
    
    const filtroAtivo = document.getElementById("filtroBancoAtivo");
    const tituloFatura = document.getElementById("tituloFaturaFiltro");
    
    tituloFatura.innerHTML = `💳 Compras no Crédito - ${bancoNome}`;
    filtroAtivo.innerHTML = `📊 Mostrando apenas compras do ${bancoNome}`;
    
    if (compras.length === 0) {
        listaFatura.innerHTML = `<tr><td colspan="5">Nenhuma compra no crédito encontrada para ${bancoNome}</td></tr>`;
        return;
    }
    
    listaFatura.innerHTML = "";
    compras.forEach(item => {
        const row = listaFatura.insertRow();
        row.innerHTML = `
            <td>${item.descricao}</td>
            <td>${formatarMoeda(item.valor)}</td>
            <td>${item.banco || "-"}</td>
            <td>${item.data}</td>
            <td>Crédito</td>
        `;
    });
};

// ===== ADD =====
if (form) {
    form.onsubmit = e => {
        e.preventDefault();

        if (!descricao.value || !valor.value || !tipo.value || !modalidade.value || !data.value) {
            alert("Por favor, preencha todos os campos obrigatórios!");
            return;
        }

        const novo = {
            id: Date.now(),
            descricao: descricao.value,
            valor: parseFloat(valor.value),
            tipo: tipo.value,
            modalidade: modalidade.value,
            banco: banco.value || "",
            data: data.value
        };

        principal.push(novo);
        localStorage.setItem("principal", JSON.stringify(principal));

        form.reset();
        atualizarTabela();
        
        const btn = form.querySelector('button[type="submit"]');
        const textoOriginal = btn.textContent;
        btn.textContent = "Adicionado!";
        setTimeout(() => {
            btn.textContent = textoOriginal;
        }, 1000);
    };
}

// ===== EDITAR ITEM =====
window.editarItem = function(id) {
    abrirModal(id);
};

// ===== REMOVE =====
window.remover = function(id) {
    if (!confirm("Excluir este item?")) return;

    principal = principal.filter(i => i.id !== id);
    localStorage.setItem("principal", JSON.stringify(principal));

    atualizarTabela();
};

// ===== RESUMO (ignorando VR, VA, VT) =====
function atualizarResumo() {
    let entrada = 0, saida = 0;

    principal.forEach(i => {
        // Ignorar VR, VA, VT no resumo geral
        const isBeneficio = (i.modalidade === "VR" || i.modalidade === "VA" || i.modalidade === "VT");
        
        if (!isBeneficio) {
            if (i.tipo === "entrada") entrada += i.valor;
            else if (i.tipo === "saida") saida += i.valor;
        }
    });

    if (totalEntrada) totalEntrada.textContent = formatarMoeda(entrada);
    if (totalSaida) totalSaida.textContent = formatarMoeda(saida);
    if (saldoFinal) saldoFinal.textContent = formatarMoeda(entrada - saida);
}

// ===== BENEFÍCIOS =====
function atualizarBeneficios() {
    let vr = 0, va = 0, vt = 0;

    principal.forEach(i => {
        if (i.modalidade === "VR") {
            if (i.tipo === "entrada") vr += i.valor;
            else if (i.tipo === "saida") vr -= i.valor;
        }
        
        if (i.modalidade === "VA") {
            if (i.tipo === "entrada") va += i.valor;
            else if (i.tipo === "saida") va -= i.valor;
        }
        
        if (i.modalidade === "VT") {
            if (i.tipo === "entrada") vt += i.valor;
            else if (i.tipo === "saida") vt -= i.valor;
        }
    });

    if (vrSaldo) vrSaldo.textContent = formatarMoeda(vr);
    if (vaSaldo) vaSaldo.textContent = formatarMoeda(va);
    if (vtSaldo) vtSaldo.textContent = formatarMoeda(vt);
}

// ===== VARIÁVEIS DE FILTRO DO BENEFÍCIO =====
let beneficioSelecionado = null;
let transacoesOriginais = [];

// ===== FUNÇÃO DE FILTRO TOGGLE DO BENEFÍCIO =====
function toggleFiltrosBeneficio() {
    const container = document.getElementById("filtrosBeneficioContent");
    const icone = document.getElementById("iconeFiltroBeneficio");
    
    if (container && icone) {
        if (container.classList.contains("fechado")) {
            container.classList.remove("fechado");
            icone.textContent = "▼";
        } else {
            container.classList.add("fechado");
            icone.textContent = "▶";
        }
    }
}

// ===== FILTRAR BENEFÍCIO (atualizado) =====
window.filtrarBeneficio = function(beneficio) {
    beneficioSelecionado = beneficio;
    
    transacoesOriginais = principal.filter(item => 
        item.modalidade === beneficio
    ).sort((a, b) => new Date(b.data) - new Date(a.data));
    
    let nomeBeneficio = '';
    if (beneficio === 'VR') nomeBeneficio = 'Vale Refeição';
    else if (beneficio === 'VA') nomeBeneficio = 'Vale Alimentação';
    else nomeBeneficio = 'Vale Transporte';
    
    const filtroAtivo = document.getElementById("beneficioFiltroAtivo");
    if (filtroAtivo) filtroAtivo.innerHTML = `📊 Benefício selecionado: ${beneficio} - ${nomeBeneficio} | Total: ${transacoesOriginais.length} transação(ões)`;
    
    // Limpar filtros ao trocar de benefício
    limparFiltrosBeneficio();
    
    if (transacoesOriginais.length === 0) {
        const listaBeneficio = document.getElementById("listaBeneficioFiltrado");
        if (listaBeneficio) listaBeneficio.innerHTML = `<tr><td colspan="4">Nenhuma transação encontrada para ${beneficio}</td></tr>`;
        return;
    }
    
    atualizarTabelaBeneficio(transacoesOriginais);
};

// ===== APLICAR FILTROS NO BENEFÍCIO =====
function aplicarFiltrosBeneficio() {
    if (!beneficioSelecionado) {
        alert("Primeiro clique em um benefício para filtrar as transações!");
        return;
    }
    
    let dadosFiltrados = [...transacoesOriginais];
    
    // Filtro por data inicial
    const dataInicio = document.getElementById("filtroBeneficioDataInicio").value;
    if (dataInicio) {
        dadosFiltrados = dadosFiltrados.filter(item => item.data >= dataInicio);
    }
    
    // Filtro por data final
    const dataFim = document.getElementById("filtroBeneficioDataFim").value;
    if (dataFim) {
        dadosFiltrados = dadosFiltrados.filter(item => item.data <= dataFim);
    }
    
    // Filtro por valor mínimo
    const valorMin = parseFloat(document.getElementById("filtroBeneficioValorMin").value);
    if (valorMin) {
        dadosFiltrados = dadosFiltrados.filter(item => item.valor >= valorMin);
    }
    
    // Filtro por valor máximo
    const valorMax = parseFloat(document.getElementById("filtroBeneficioValorMax").value);
    if (valorMax) {
        dadosFiltrados = dadosFiltrados.filter(item => item.valor <= valorMax);
    }
    
    // Filtro por descrição
    const descricaoBusca = document.getElementById("filtroBeneficioDescricao").value.toLowerCase();
    if (descricaoBusca) {
        dadosFiltrados = dadosFiltrados.filter(item => 
            item.descricao.toLowerCase().includes(descricaoBusca)
        );
    }
    
    // Filtro por tipo
    const tipoFiltro = document.getElementById("filtroBeneficioTipo").value;
    if (tipoFiltro !== "todos") {
        dadosFiltrados = dadosFiltrados.filter(item => item.tipo === tipoFiltro);
    }
    
    // Ordenação
    const ordenarPor = document.getElementById("filtroBeneficioOrdenar").value;
    switch(ordenarPor) {
        case 'data_desc':
            dadosFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));
            break;
        case 'data_asc':
            dadosFiltrados.sort((a, b) => new Date(a.data) - new Date(b.data));
            break;
        case 'valor_desc':
            dadosFiltrados.sort((a, b) => b.valor - a.valor);
            break;
        case 'valor_asc':
            dadosFiltrados.sort((a, b) => a.valor - b.valor);
            break;
        case 'descricao_asc':
            dadosFiltrados.sort((a, b) => a.descricao.localeCompare(b.descricao));
            break;
        case 'descricao_desc':
            dadosFiltrados.sort((a, b) => b.descricao.localeCompare(a.descricao));
            break;
    }
    
    // Mostrar filtros ativos
    mostrarFiltrosAtivosBeneficio();
    
    // Atualizar tabela
    atualizarTabelaBeneficio(dadosFiltrados);
}

// ===== MOSTRAR FILTROS ATIVOS DO BENEFÍCIO =====
function mostrarFiltrosAtivosBeneficio() {
    const filtrosDiv = document.getElementById("filtrosAtivosBeneficio");
    if (!filtrosDiv) return;
    
    const ativos = [];
    
    const dataInicio = document.getElementById("filtroBeneficioDataInicio").value;
    const dataFim = document.getElementById("filtroBeneficioDataFim").value;
    if (dataInicio || dataFim) {
        ativos.push(`📅 ${dataInicio || 'início'} até ${dataFim || 'hoje'}`);
    }
    
    const valorMin = document.getElementById("filtroBeneficioValorMin").value;
    const valorMax = document.getElementById("filtroBeneficioValorMax").value;
    if (valorMin || valorMax) {
        if (valorMin && valorMax) ativos.push(`💰 Entre ${formatarMoeda(parseFloat(valorMin))} e ${formatarMoeda(parseFloat(valorMax))}`);
        else if (valorMin) ativos.push(`💰 Acima de ${formatarMoeda(parseFloat(valorMin))}`);
        else if (valorMax) ativos.push(`💰 Abaixo de ${formatarMoeda(parseFloat(valorMax))}`);
    }
    
    const descricao = document.getElementById("filtroBeneficioDescricao").value;
    if (descricao) ativos.push(`🔍 "${descricao}"`);
    
    const tipoFiltro = document.getElementById("filtroBeneficioTipo").value;
    if (tipoFiltro !== "todos") {
        ativos.push(`📋 ${tipoFiltro === 'entrada' ? 'Apenas Entradas' : 'Apenas Saídas'}`);
    }
    
    if (ativos.length > 0) {
        filtrosDiv.innerHTML = `🎯 ${ativos.join(' • ')}`;
        filtrosDiv.style.display = "block";
    } else {
        filtrosDiv.innerHTML = '';
        filtrosDiv.style.display = "none";
    }
}

// ===== LIMPAR FILTROS DO BENEFÍCIO =====
function limparFiltrosBeneficio() {
    document.getElementById("filtroBeneficioDataInicio").value = "";
    document.getElementById("filtroBeneficioDataFim").value = "";
    document.getElementById("filtroBeneficioValorMin").value = "";
    document.getElementById("filtroBeneficioValorMax").value = "";
    document.getElementById("filtroBeneficioDescricao").value = "";
    document.getElementById("filtroBeneficioTipo").value = "todos";
    document.getElementById("filtroBeneficioOrdenar").value = "data_desc";
    
    const filtrosDiv = document.getElementById("filtrosAtivosBeneficio");
    if (filtrosDiv) filtrosDiv.innerHTML = "";
    
    if (beneficioSelecionado && transacoesOriginais.length > 0) {
        atualizarTabelaBeneficio(transacoesOriginais);
    }
}

// ===== ATUALIZAR TABELA DO BENEFÍCIO =====
function atualizarTabelaBeneficio(transacoes) {
    const listaBeneficio = document.getElementById("listaBeneficioFiltrado");
    if (!listaBeneficio) return;
    
    listaBeneficio.innerHTML = "";
    
    if (transacoes.length === 0) {
        listaBeneficio.innerHTML = `<tr><td colspan="4">Nenhuma transação encontrada com os filtros aplicados</td></tr>`;
        return;
    }
    
    transacoes.forEach(item => {
        const row = listaBeneficio.insertRow();
        const tipoCor = item.tipo === 'entrada' ? 'style="color: #00b09b; font-weight: bold;"' : 'style="color: #ff416c; font-weight: bold;"';
        const tipoTexto = item.tipo === 'entrada' ? 'Entrada' : 'Saída';
        
        row.innerHTML = `
            <td>${item.descricao}</td>
            <td>${formatarMoeda(item.valor)}</td>
            <td ${tipoCor}>${tipoTexto}</td>
            <td>${item.data}</td>
        `;
    });
}

// ===== INICIALIZAR BOTÕES DOS FILTROS DO BENEFÍCIO =====
if (document.getElementById("btnAplicarFiltroBeneficio")) {
    document.getElementById("btnAplicarFiltroBeneficio").onclick = aplicarFiltrosBeneficio;
}

if (document.getElementById("btnLimparFiltroBeneficio")) {
    document.getElementById("btnLimparFiltroBeneficio").onclick = limparFiltrosBeneficio;
}

// Inicializar filtros do benefício como abertos
document.addEventListener("DOMContentLoaded", function() {
    const filtrosBeneficioContent = document.getElementById("filtrosBeneficioContent");
    if (filtrosBeneficioContent) {
        filtrosBeneficioContent.classList.remove("fechado");
    }
    
    const iconeFiltroBeneficio = document.getElementById("iconeFiltroBeneficio");
    if (iconeFiltroBeneficio) iconeFiltroBeneficio.textContent = "▼";
});


// ===== FATURA (inicial) =====
function atualizarFatura() {
    let nubank = 0, itau = 0, santander = 0;

    if (listaFatura) listaFatura.innerHTML = "";

    const compras = principal.filter(i => i.modalidade === "Crédito" && i.tipo === "saida");

    compras.forEach(i => {
        if (i.banco === "Nubank") nubank += i.valor;
        if (i.banco === "Itaú") itau += i.valor;
        if (i.banco === "Santander") santander += i.valor;

        if (listaFatura) {
            const row = listaFatura.insertRow();
            row.innerHTML = `
                <td>${i.descricao}</td>
                <td>${formatarMoeda(i.valor)}</td>
                <td>${i.banco || "-"}</td>
                <td>${i.data}</td>
                <td>Crédito</td>
            `;
        }
    });

    if (compras.length === 0 && listaFatura) {
        listaFatura.innerHTML = `<tr><td colspan="5">Nenhuma compra no crédito encontrada</td></tr>`;
    }

    if (faturaNubank) faturaNubank.textContent = formatarMoeda(nubank);
    if (faturaItau) faturaItau.textContent = formatarMoeda(itau);
    if (faturaSantander) faturaSantander.textContent = formatarMoeda(santander);
    
    // Reset do título da fatura
    const tituloFatura = document.getElementById("tituloFaturaFiltro");
    const filtroAtivo = document.getElementById("filtroBancoAtivo");
    if (tituloFatura) tituloFatura.innerHTML = "Compras no Crédito (pendentes)";
    if (filtroAtivo) filtroAtivo.innerHTML = "";
}

// ===== ABAS =====
window.trocarAba = function(aba) {
    const abas = document.querySelectorAll(".aba");
    const botoes = document.querySelectorAll(".abas button");
    
    abas.forEach(a => a.classList.remove("ativa"));
    botoes.forEach(b => b.classList.remove("active"));

    const abaId = "aba" + aba.charAt(0).toUpperCase() + aba.slice(1);
    const btnId = "btn" + aba.charAt(0).toUpperCase() + aba.slice(1);
    
    const abaElement = document.getElementById(abaId);
    const btnElement = document.getElementById(btnId);
    
    if (abaElement) abaElement.classList.add("ativa");
    if (btnElement) btnElement.classList.add("active");
    
    if (aba === "beneficios") {
        atualizarBeneficios();
        // Limpar filtro de benefício ao trocar de aba
        const filtroAtivo = document.getElementById("beneficioFiltroAtivo");
        const listaBeneficio = document.getElementById("listaBeneficioFiltrado");
        if (filtroAtivo) filtroAtivo.innerHTML = "";
        if (listaBeneficio) listaBeneficio.innerHTML = "";
    } else if (aba === "fatura") {
        atualizarFatura();
    }
};

// ===== INIT =====
document.addEventListener("DOMContentLoaded", function() {
    console.log("Sistema Financeiro Iniciado!");
    atualizarTabela();
});

// ===== VARIÁVEIS DE FILTRO DA FATURA =====
let bancoSelecionadoFatura = null;
let comprasOriginais = [];

// ===== FUNÇÃO DE FILTRO TOGGLE DA FATURA =====
function toggleFiltrosFatura() {
    const container = document.getElementById("filtrosFaturaContent");
    const icone = document.getElementById("iconeFiltroFatura");
    
    if (container && icone) {
        if (container.classList.contains("fechado")) {
            container.classList.remove("fechado");
            icone.textContent = "▼";
        } else {
            container.classList.add("fechado");
            icone.textContent = "▶";
        }
    }
}

// ===== FUNÇÃO DE FILTRO TOGGLE GERAL (já existente) =====
function toggleFiltros() {
    const container = document.getElementById("filtrosContainer");
    const icone = document.getElementById("iconeFiltro");
    
    if (container && icone) {
        if (container.classList.contains("fechado")) {
            container.classList.remove("fechado");
            icone.textContent = "▼";
        } else {
            container.classList.add("fechado");
            icone.textContent = "▶";
        }
    }
}

// Inicializar os filtros como abertos quando a página carregar
document.addEventListener("DOMContentLoaded", function() {
    // Inicializar filtros da aba geral
    const filtrosContainer = document.getElementById("filtrosContainer");
    if (filtrosContainer) {
        filtrosContainer.classList.remove("fechado");
    }
    
    // Inicializar filtros da aba fatura
    const filtrosFaturaContent = document.getElementById("filtrosFaturaContent");
    if (filtrosFaturaContent) {
        filtrosFaturaContent.classList.remove("fechado");
    }
    
    // Garantir que os ícones estejam corretos
    const iconeFiltro = document.getElementById("iconeFiltro");
    if (iconeFiltro) iconeFiltro.textContent = "▼";
    
    const iconeFiltroFatura = document.getElementById("iconeFiltroFatura");
    if (iconeFiltroFatura) iconeFiltroFatura.textContent = "▼";
});

// Inicializar filtros da fatura como abertos
if (document.getElementById("filtrosContainerFatura")) {
    document.getElementById("filtrosContainerFatura").classList.remove("fechado");
}

// ===== APLICAR FILTROS NA FATURA =====
function aplicarFiltrosFatura() {
    if (!bancoSelecionadoFatura) {
        alert("Primeiro clique em um banco para filtrar as compras!");
        return;
    }
    
    let dadosFiltrados = [...comprasOriginais];
    
    // Filtro por data inicial
    const dataInicio = document.getElementById("filtroDataInicio").value;
    if (dataInicio) {
        dadosFiltrados = dadosFiltrados.filter(item => item.data >= dataInicio);
    }
    
    // Filtro por data final
    const dataFim = document.getElementById("filtroDataFim").value;
    if (dataFim) {
        dadosFiltrados = dadosFiltrados.filter(item => item.data <= dataFim);
    }
    
    // Filtro por valor mínimo
    const valorMin = parseFloat(document.getElementById("filtroValorMin").value);
    if (valorMin) {
        dadosFiltrados = dadosFiltrados.filter(item => item.valor >= valorMin);
    }
    
    // Filtro por valor máximo
    const valorMax = parseFloat(document.getElementById("filtroValorMax").value);
    if (valorMax) {
        dadosFiltrados = dadosFiltrados.filter(item => item.valor <= valorMax);
    }
    
    // Filtro por descrição
    const descricaoBusca = document.getElementById("filtroDescricao").value.toLowerCase();
    if (descricaoBusca) {
        dadosFiltrados = dadosFiltrados.filter(item => 
            item.descricao.toLowerCase().includes(descricaoBusca)
        );
    }
    
    // Ordenação
    const ordenarPor = document.getElementById("filtroOrdenar").value;
    switch(ordenarPor) {
        case 'data_desc':
            dadosFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));
            break;
        case 'data_asc':
            dadosFiltrados.sort((a, b) => new Date(a.data) - new Date(b.data));
            break;
        case 'valor_desc':
            dadosFiltrados.sort((a, b) => b.valor - a.valor);
            break;
        case 'valor_asc':
            dadosFiltrados.sort((a, b) => a.valor - b.valor);
            break;
        case 'descricao_asc':
            dadosFiltrados.sort((a, b) => a.descricao.localeCompare(b.descricao));
            break;
        case 'descricao_desc':
            dadosFiltrados.sort((a, b) => b.descricao.localeCompare(a.descricao));
            break;
    }
    
    // Mostrar filtros ativos
    mostrarFiltrosAtivos();
    
    // Atualizar tabela
    atualizarTabelaFatura(dadosFiltrados);
}

// ===== MOSTRAR FILTROS ATIVOS (melhorado) =====
function mostrarFiltrosAtivos() {
    const filtrosDiv = document.getElementById("filtrosAtivosFatura");
    if (!filtrosDiv) return;
    
    const ativos = [];
    
    const dataInicio = document.getElementById("filtroDataInicio").value;
    if (dataInicio) ativos.push(`📅 Data: ${dataInicio}${document.getElementById("filtroDataFim").value ? ` até ${document.getElementById("filtroDataFim").value}` : ''}`);
    else if (document.getElementById("filtroDataFim").value) {
        ativos.push(`📅 Até ${document.getElementById("filtroDataFim").value}`);
    }
    
    const valorMin = document.getElementById("filtroValorMin").value;
    const valorMax = document.getElementById("filtroValorMax").value;
    if (valorMin && valorMax) {
        ativos.push(`💰 Entre ${formatarMoeda(parseFloat(valorMin))} e ${formatarMoeda(parseFloat(valorMax))}`);
    } else if (valorMin) {
        ativos.push(`💰 Acima de ${formatarMoeda(parseFloat(valorMin))}`);
    } else if (valorMax) {
        ativos.push(`💰 Abaixo de ${formatarMoeda(parseFloat(valorMax))}`);
    }
    
    const descricao = document.getElementById("filtroDescricao").value;
    if (descricao) ativos.push(`🔍 "${descricao}"`);
    
    if (ativos.length > 0) {
        filtrosDiv.innerHTML = `🎯 ${ativos.join(' • ')}`;
        filtrosDiv.style.display = "block";
    } else {
        filtrosDiv.innerHTML = '';
        filtrosDiv.style.display = "none";
    }
}

// ===== LIMPAR FILTROS DA FATURA =====
function limparFiltrosFatura() {
    document.getElementById("filtroDataInicio").value = "";
    document.getElementById("filtroDataFim").value = "";
    document.getElementById("filtroValorMin").value = "";
    document.getElementById("filtroValorMax").value = "";
    document.getElementById("filtroDescricao").value = "";
    document.getElementById("filtroOrdenar").value = "data_desc";
    
    const filtrosDiv = document.getElementById("filtrosAtivosFatura");
    if (filtrosDiv) filtrosDiv.innerHTML = "";
    
    if (bancoSelecionadoFatura && comprasOriginais.length > 0) {
        atualizarTabelaFatura(comprasOriginais);
    }
}

// ===== ATUALIZAR TABELA DA FATURA =====
function atualizarTabelaFatura(compras) {
    if (!listaFatura) return;
    listaFatura.innerHTML = "";
    
    if (compras.length === 0) {
        listaFatura.innerHTML = `<tr><td colspan="5">Nenhuma compra encontrada com os filtros aplicados</td></tr>`;
        return;
    }
    
    compras.forEach(item => {
        const row = listaFatura.insertRow();
        row.innerHTML = `
            <td>${item.descricao}</td>
            <td style="color: #ff416c; font-weight: bold;">${formatarMoeda(item.valor)}</td>
            <td>${item.banco || "-"}</td>
            <td>${item.data}</td>
            <td>Crédito</td>
        `;
    });
}

// ===== FILTRAR BANCO CRÉDITO (atualizado) =====
window.filtrarBancoCredito = function(bancoNome) {
    bancoSelecionadoFatura = bancoNome;
    
    comprasOriginais = principal.filter(item => 
        item.modalidade === "Crédito" && 
        item.tipo === "saida" &&
        item.banco === bancoNome
    ).sort((a, b) => new Date(b.data) - new Date(a.data));
    
    const tituloFatura = document.getElementById("tituloFaturaFiltro");
    const filtroAtivo = document.getElementById("filtroBancoAtivo");
    
    if (tituloFatura) tituloFatura.innerHTML = `💳 Compras no Crédito - ${bancoNome}`;
    if (filtroAtivo) filtroAtivo.innerHTML = `📊 Banco selecionado: ${bancoNome} - Total de ${comprasOriginais.length} compra(s)`;
    
    // Limpar filtros ao trocar de banco
    limparFiltrosFatura();
    
    if (comprasOriginais.length === 0) {
        listaFatura.innerHTML = `<tr><td colspan="5">Nenhuma compra no crédito encontrada para ${bancoNome}</td></tr>`;
        return;
    }
    
    atualizarTabelaFatura(comprasOriginais);
};

// ===== BOTÕES DE FILTRO DA FATURA =====
if (document.getElementById("btnAplicarFiltroFatura")) {
    document.getElementById("btnAplicarFiltroFatura").onclick = aplicarFiltrosFatura;
}

if (document.getElementById("btnLimparFiltroFatura")) {
    document.getElementById("btnLimparFiltroFatura").onclick = limparFiltrosFatura;
}

// ===== ATUALIZAR FATURA (modificada para não interferir nos filtros) =====
function atualizarFatura() {
    let nubank = 0, itau = 0, santander = 0;
    
    const compras = principal.filter(i => i.modalidade === "Crédito" && i.tipo === "saida");
    
    compras.forEach(i => {
        if (i.banco === "Nubank") nubank += i.valor;
        if (i.banco === "Itaú") itau += i.valor;
        if (i.banco === "Santander") santander += i.valor;
    });
    
    if (faturaNubank) faturaNubank.textContent = formatarMoeda(nubank);
    if (faturaItau) faturaItau.textContent = formatarMoeda(itau);
    if (faturaSantander) faturaSantander.textContent = formatarMoeda(santander);
    
    // Se não há banco selecionado, mostrar todas as compras
    if (!bancoSelecionadoFatura) {
        const tituloFatura = document.getElementById("tituloFaturaFiltro");
        const filtroAtivo = document.getElementById("filtroBancoAtivo");
        if (tituloFatura) tituloFatura.innerHTML = "Compras no Crédito (pendentes)";
        if (filtroAtivo) filtroAtivo.innerHTML = "";
        
        if (listaFatura) {
            listaFatura.innerHTML = "";
            compras.forEach(item => {
                const row = listaFatura.insertRow();
                row.innerHTML = `
                    <td>${item.descricao}</td>
                    <td style="color: #ff416c; font-weight: bold;">${formatarMoeda(item.valor)}</td>
                    <td>${item.banco || "-"}</td>
                    <td>${item.data}</td>
                    <td>Crédito</td>
                `;
            });
            
            if (compras.length === 0) {
                listaFatura.innerHTML = `<tr><td colspan="5">Nenhuma compra no crédito encontrada</td></tr>`;
            }
        }
    }
}