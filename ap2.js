const tamanhoPopulacao = 200;
const taxaMutacao = 0.01;
const geracoes = 10; 


let cidades = [
    [-5, -5],
    [-2, -3],
    [3, -3],
    [-3, -2],
    [1, 0],
    [4, 2],
    [5, 5],
    [2, 4],
    [-1, 4],
    [-5, 5]
];

// Calculo da distancia entre as duas cidades
function calcularDistanciaEntrePontos(cidadeA, cidadeB) {
    return Math.sqrt(Math.pow((cidadeB[0] - cidadeA[0]), 2) + Math.pow((cidadeB[1] - cidadeA[1]), 2));
}

// Criação do individuo = caminho
function criarIndividuo() {
    let individuo = [];
    let listaCidades = JSON.parse(JSON.stringify(cidades)); 
    while (listaCidades.length > 0) {
        const cidadeEscolhida = Math.floor(Math.random() * listaCidades.length);
        individuo.push(listaCidades[cidadeEscolhida]);
        listaCidades.splice(cidadeEscolhida, 1); 
    }
    return individuo;
}

// Funcao para calcular a aptidao do inviiduo = distancia do caminho total
function aptidao(individuo) {
    let distancia = 0.0;
    for (let i = 0; i < individuo.length; i++) {
        let proximoIndice = (i + 1) % individuo.length; 
        distancia += calcularDistanciaEntrePontos(individuo[i], individuo[proximoIndice]);
    }
    return 1 / distancia; 
}

// Funcao para criar população = criar uma população com varios caminhos = individuos 
function criarPopulacao(tamanho) {
    const populacao = [];
    for (let i = 0; i < tamanho; i++) {
        populacao.push(criarIndividuo());
    }
    return populacao;
}

// Função seleção
function selecao(populacao) {
    const selecionados = [];
    populacao.forEach(individuo => {
        const pontos = aptidao(individuo);
        for (let i = 0; i < Math.floor(pontos * 100); i++) {
            selecionados.push(individuo);
        }
    });
    return [escolhaAleatoria(selecionados), escolhaAleatoria(selecionados)];
}

// Função de cruzamento = combina dois individuos para criar um novo caminho 
function cruzamento(individuo1, individuo2) {
    const pontoDeCorte = Math.floor(Math.random() * individuo1.length);
    const filho = individuo1.slice(0, pontoDeCorte);
    const resto = individuo2.filter(cidade => !filho.includes(cidade)); 
    return filho.concat(resto);
}

// Função de mutação = 2 cidades aleatórias
function mutacao(individuo) {
    if (Math.random() < taxaMutacao) {
        const indice1 = Math.floor(Math.random() * individuo.length);
        const indice2 = Math.floor(Math.random() * individuo.length);
        // Troca duas cidades
        [individuo[indice1], individuo[indice2]] = [individuo[indice2], individuo[indice1]];
    }
    return individuo;
}

// Escolha aleatoria
function escolhaAleatoria(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Função principal do algoritmo genético
function algoritmoGenetico() {
    let populacao = criarPopulacao(tamanhoPopulacao);
    let melhorIndividuo = null;
    let melhorAptidao = 0;
    let melhorDistancia = Infinity;

    for (let geracao = 0; geracao < geracoes; geracao++) {
        populacao.sort((a, b) => aptidao(b) - aptidao(a));

        const atualAptidao = aptidao(populacao[0]);
        const atualDistancia = 1 / atualAptidao; 

        if (atualAptidao > melhorAptidao) {
            melhorAptidao = atualAptidao;
            melhorIndividuo = populacao[0];
            melhorDistancia = atualDistancia;
        }

        
        console.log(`Geração: ${geracao}, Distância: ${atualDistancia}`);

        
        const novaPopulacao = [];
        while (novaPopulacao.length < tamanhoPopulacao) {
            const [individuo1, individuo2] = selecao(populacao);
            let filho = cruzamento(individuo1, individuo2);
            filho = mutacao(filho);
            novaPopulacao.push(filho);
        }
        populacao = novaPopulacao;
    }

    //finall
    const percursoFinal = [...melhorIndividuo, melhorIndividuo[0]];
    console.log(`Melhor percurso final: ${percursoFinal.map(c => `(${c[0]}, ${c[1]})`).join(' -> ')}`);
    console.log(`Distância final: ${melhorDistancia}`);
}

algoritmoGenetico();
