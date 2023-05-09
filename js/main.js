const originalListOfSuggestions=[
    'SELECT','FROM','WHERE','JOIN','ON','=','<','>', 'AND', 'IN', 'NOT IN','<=', '>=', '<>','</>']
words=$()
let globalselectPart=undefined
let globalFromPart=undefined
let globalJoinPart=undefined
let globalJoinOnPart=undefined
let globalWherePart=undefined
let where = false
$('#mainInput').on('input', function () {
    let words=$(this).val().split(' ')
    let lastWord=words[words.length-1].toUpperCase().trim()
    let listSugestions =lastWord !== '' ? originalListOfSuggestions.filter((e) => e.startsWith(lastWord)) :[]
    let suggestions=$('#commands')
    suggestions.html('')
    for(let e of listSugestions) {
        suggestions.append($(`<li onclick="changingInput('${e}')">`).append(`${e}`))
    }
    if(listSugestions.length === 0) {
        $('#commands').hide()
    }
    else {
        $('#commands').show()
    }
})

function upper() {
    $("#validated-message").hide()
    $('#mainInput').val($('#mainInput').val().toUpperCase())
}
function changingInput(value) {
    $('#mainInput').val( $('#mainInput').val().trim())
    let words=$('#mainInput').val().split(' ')
    let lastWord=words[words.length-1].toUpperCase().trim()
    let newVal=($('#mainInput').val().slice(0,$('#mainInput').val().toUpperCase().lastIndexOf(lastWord))).trim() + ' ' + value
    $('#mainInput').val(newVal + ' ')
    $('#commands').hide()
    $('#mainInput').focus()
}
function validation() {
    let test=validatingText()
    if(!test) {
        $("#validated-message").show()
        $("#validated-message").html('invalida')
        $("#validated-message").show()
        alert('ESTA  QUERY ESTA INVALIDA')
    }else{
        $("#validated-message").show()
        $("#validated-message").html('valida')
        $("#validated-message").show()
        alert('deu bom!')
    }
    console.log('select')
    console.log(globalselectPart)
    console.log('from')
    console.log(globalFromPart)
    console.log('join')
    console.log(globalJoinPart);
    console.log('joinOn')
    console.log(globalJoinOnPart);
    console.log('where')
    console.log(globalWherePart);
}

function validatingText() {
    let userInput=$('#mainInput').val().trim().toUpperCase()
    const regex =/^SELECT\s+(.+?)\s+FROM\s+(.+?)(\s+JOIN\s+(.+?)\s+ON\s+(.+?))?\s*(?:WHERE\s+(.+?))?$/i
    const match = userInput.match(regex);
    if (!match) {
        return false
    }
    const selectClause = match[1];
    const fromClause = match[2];
    const joinClause = match[4];
    const joinOnClause = match[5];
    const whereClause = match[6];
    let cond = match[6];
    console.log('select:');
    console.log(selectClause);
    console.log('from');
    console.log(fromClause);
    console.log('join')
    console.log(joinClause)
    console.log('joinon')
    console.log(joinOnClause)
    console.log('where')
    console.log(whereClause)
    console.log('selectclauseregex');

    if (whereClause) {
        const whereRegex = /^\s*(.+?)\s*=\s*(.+?)\s*$/i;
        const whereMatch = whereClause.match(whereRegex);
        if (whereMatch) {
          const condition = whereMatch[1] + ' = ' + whereMatch[2];
          globalWherePart = condition;
          console.log('where:');
          console.log(condition);
        }
      }

    const selectRegex=/^(\*|\b(?!(?:FROM|SELECT|JOIN|ON|AND|WHERE|IN|NOT)\b)[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?(?:,[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?)*?)$/gi
    const selectPart=selectClause.match(selectRegex)
    console.log(selectPart[0]);
    if(!selectPart) {
        return false
    }
    globalselectPart=selectPart[0]
    const fromRegex=/^(?!FROM$|SELECT$|JOIN$|ON$|AND$|WHERE$|IN$|NOT$)(?!.*[^-_a-zA-Z0-9]).*[a-zA-Z][-_a-zA-Z0-9]*$/gi
    const fromPart=fromClause.match(fromRegex)
    if(!fromPart) {
        return false
    }
    globalFromPart=fromPart[0]
    console.log(match)
    if(joinClause) {
        if(!joinOnClause) {
            return false
        }
        if(!joinClause.match(/^(?!FROM$|SELECT$|JOIN$|ON$|AND$|WHERE$|IN$|NOT$)(?!.*[^-_a-zA-Z0-9]).*[a-zA-Z][-_a-zA-Z0-9]*$/gi)) {
            return false
        }
        let joinPart=[]
        let joinOnPart=[]
        let currentJoinOnClause= joinOnClause
        let currentJoinClause=joinClause
        let joinObject=joinCheck(currentJoinClause,currentJoinOnClause,joinPart,joinOnPart)
        if(!joinObject) {
            alert('query invalida')
            return false
        }
        else {
            joinPart=joinObject.joinPart
            joinOnPart=joinObject.joinOnPart
            joinPart=joinPart.filter((e,i) => { return joinPart.indexOf(e) === i})
            joinOnPart=joinOnPart.filter((element,index) => { return  joinOnPart.indexOf(element) === index})
            globalJoinPart=joinPart
            globalJoinOnPart=joinOnPart
            console.log('join array');
            console.log(joinPart);
            console.log('joinOn array');
            console.log(joinOnPart);
        }
    }
    if(whereClause) {
        let wherePart=[]
        where = true;
    }
    RelationalAlgebra();
    return true

}

function removeDuplicates(arr) {
    return [...new Set(arr)];
}

function joinCheck(currentJoinClause,currentJoinOnClause,joinPart,joinOnPart) {
        joinPart.push(currentJoinClause.trim().toUpperCase())
        let aux=currentJoinOnClause.trim().toUpperCase().indexOf(' JOIN ')
        let currentJoinOn;
        if(aux !==  -1) {
            let joinOn=currentJoinOnClause.slice(0,aux)
            let currentjoinOnPart=joinOn.match(/^(?!FROM$|SELECT$|JOIN|ON$|AND$|WHERE$|IN$|NOT$)([a-zA-Z]+[\w.]*)\s*(=|>|<|<=|>=|<>)\s*([a-zA-Z]+[\w.]*)$/gi)
            if(!currentjoinOnPart || currentjoinOnPart.length >1) {
                return undefined
            }
            joinOnPart.push(currentjoinOnPart[0])
            let nextClause=currentJoinOnClause.slice(aux,currentJoinOnClause.length).trim().toUpperCase()
            if(!nextClause) {
                return undefined
            }
            let nextAux=nextClause.indexOf(' ON ')
            if(nextAux === -1) {
                return undefined
            }
            let nextJoinClause=nextClause.slice(0,nextAux).replace('JOIN','').trim()
            let nextJoinOnClause=nextClause.slice(nextAux,nextClause.length).replace('ON','').trim()
            let nextObject=joinCheck(nextJoinClause,nextJoinOnClause,joinPart,joinOnPart)
            if(!nextObject) {
                return undefined
            }
            joinPart=joinPart.concat(nextObject.joinPart)
            joinOnPart=joinOnPart.concat(nextObject.joinOnPart)
            return  {
                joinPart:joinPart,
                joinOnPart:joinOnPart
            }
        }
        else {
            currentJoinOn=currentJoinOnClause
            let currentjoinOnPart=currentJoinOn.match(/^(?!FROM$|SELECT$|JOIN|ON$|AND$|WHERE$|IN$|NOT$)([a-zA-Z]+[\w.]*)\s*(=|>|<|<=|>=|<>)\s*([a-zA-Z]+[\w.]*)$/gi)
            if(!currentjoinOnPart || currentjoinOnPart.length >1) {
                return undefined
            }
            joinOnPart.push(currentjoinOnPart[0])
            return  {
                joinPart:joinPart,
                joinOnPart:joinOnPart
            }
        }
}

function RelationalAlgebra(){
    const Contas = [
        {idconta: 1, descricao: 'Credicard', tipoconta_idtipoconta: 1, usuario_idusuario: 1 , saldoinicial: 234},
        {idconta: 2, descricao: 'Visa', tipoconta_idtipoconta: 1, usuario_idusuario: 2 , saldoinicial: 5124},
        {idconta: 3, descricao: 'Banco do Nordeste', tipoconta_idtipoconta: 2, usuario_idusuario: 3, saldoinicial: 2134},
        {idconta: 4, descricao: 'Volkscard', tipoconta_idtipoconta: 1, usuario_idusuario: 4 , saldoinicial: 232},
        {idconta: 5, descricao: 'Hipercard', tipoconta_idtipoconta: 1, usuario_idusuario: 5 , saldoinicial: 2345},
        {idconta: 6, descricao: 'Bradesco', tipoconta_idtipoconta: 2, usuario_idusuario: 6 , saldoinicial: 234},
        {idconta: 7, descricao: 'ChicoCard', tipoconta_idtipoconta: 1, usuario_idusuario: 2 , saldoinicial: 5476},
        {idconta: 8, descricao: 'Bitcoin', tipoconta_idtipoconta: 2, usuario_idusuario: 4, saldoinicial: 554},
        {idconta: 9, descricao: 'Palmas', tipoconta_idtipoconta: 1, usuario_idusuario: 2 , saldoinicial: 353},
        {idconta: 10, descricao: 'Itaú', tipoconta_idtipoconta: 2, usuario_idusuario: 1 , saldoinicial: 678},
    ];
    const TipoConta = [
        {idtipoconta: 1, descricao: 'Cartão de crédito'},
        {idtipoconta: 2, descricao: 'Conta corrente'},
    ];
    const TipoMovimento = [
        {idtipomovimento: 1, descmovimentacao: 'Débito'},
        {idtipomovimento: 2, descmovimentacao: 'Crédito'},
    ];
    const Usuario = [
        {idusuario: 1,nome: 'Thanos',logradouro:'Rua Suécia',numero:2330,bairro:'Maraponga',cep:'60000000',uf:'CE',datanascimento:'1910-05-25'},
        {idusuario: 2,nome: 'Saitama',logradouro: 'Trashed area',numero: 12,bairro:'Z City',cep:'68485848',uf:'Z',datanascimento:'2000-06-22'},
        {idusuario: 3,nome: 'Naruto Uzumaki',logradouro:'Distrito Norte',numero:19,bairro:'Silvermoon',cep:'65545665',uf:'CE',datanascimento:'2000-07-23'},
        {idusuario: 4,nome: 'Kakashi Hatake',logradouro:'Vale da Força',numero:23,bairro:'Ogrimar',cep:'68485848',uf:'ce',datanascimento:'2000-08-24'},
        {idusuario: 5,nome: 'Anakim',logradouro:'Vale da Força',numero:33,bairro:'Ogrimar',cep:'68485848',uf:'ce',datanascimento:'2000-08-28'},
        {idusuario: 6,nome: 'Darth Lucas Skywalker',logradouro:'Vale da Força',numero:33,bairro:'Ogrimar',cep:'68485848',uf:'ce',datanascimento:'2000-08-28'},
        {idusuario: 7,nome: 'Minato Namikaze',logradouro:'Av. Santos Dumont',numero:2313,bairro:'Fortaleza',cep:'60000000',uf:'CE',datanascimento:'2000-09-25'},
    ];
    const Categoria = [
       {idcategoria:1, desccategoria:'Salário'},
       {idcategoria:2, desccategoria:'Aluguel'},
       {idcategoria:3, desccategoria:'Academia'},
       {idcategoria:4, desccategoria:'Acessórios'},
       {idcategoria:5, desccategoria:'Almoço'},
       {idcategoria:6, desccategoria:'Animal de Estimação'},
       {idcategoria:7, desccategoria:'Açougue'},
       {idcategoria:8, desccategoria:'Bar/Balada'},
       {idcategoria:9, desccategoria:'Café/lanches'},
       {idcategoria:10, desccategoria:'Celular'},
       {idcategoria:11, desccategoria:'Cinema'},
       {idcategoria:12, desccategoria:'Combustível'},
       {idcategoria:13, desccategoria:'Ônibus'},
       {idcategoria:14, desccategoria:'Condomínio'},
       {idcategoria:15, desccategoria:'Cursos'},
       {idcategoria:16, desccategoria:'Dentista'},
       {idcategoria:17, desccategoria:'Eletrônicos'},
       {idcategoria:18, desccategoria:'Faculdade'},
       {idcategoria:19, desccategoria:'Futebol'},
    ];
    const tabelas = {
        "CONTAS": Contas,
        "TIPOCONTA": TipoConta,
        "TIPOMOVIMENTO": TipoMovimento,
        "USUARIO": Usuario,
        "CATEGORIA": Categoria
    };
    
    // Dados de exemplo - tabela de funcionários
    if(globalFromPart!=undefined){
        
        //Projeção
        function selecionarTabelas(nomesTabelas) {
            const tabelasSelecionadas = [];
            for (const nomeTabela of nomesTabelas) {
              const tabelaSelecionada = tabelas[nomeTabela];
              if (tabelaSelecionada) {
                tabelasSelecionadas.push(tabelaSelecionada);
              }
            }
            return tabelasSelecionadas;
          }
        
        //Seleção  
        function selecionarColunas(tabelas, nomesColunas, condicaoWhere) {
            const colunasSelecionadas = {};
          
            for (const tabela in tabelas) {
              const tabelaSelecionada = tabelas[tabela].map((linha) => {
                const valores = {};
                for (const coluna of nomesColunas) {
                  const colunaLowerCase = coluna.toLowerCase();
                  valores[colunaLowerCase] = linha[colunaLowerCase];
                }
                return valores;
              });
          
              if (condicaoWhere) {
                const condicoes = condicaoWhere.split(" ");
                const coluna = condicoes[0].toLowerCase(); // Manter em letras minúsculas
                const operador = condicoes[1];
                const valor = condicoes.slice(2).join(" ");
              
                tabelaFiltrada = tabelaSelecionada.filter((linha) => {
                  const valorLinha = linha[coluna];
              
                  if (typeof valorLinha === "number" && !isNaN(Number(valor))) {
                    // Comparação numérica
                    switch (operador) {
                      case "=":
                        return valorLinha === Number(valor);
                      case ">":
                        return valorLinha > Number(valor);
                      case "<":
                        return valorLinha < Number(valor);
                      // Adicione outros casos para outros operadores, se necessário
                      default:
                        return false;
                    }
                  } else if (typeof valorLinha === "string" && typeof valor === "string") {
                    // Comparação de strings ignorando o caso
                    return valorLinha.toLowerCase() === valor.toLowerCase();
                  }
              
                  return false;
                });
              }
              
          
              colunasSelecionadas[tabela] = tabelaFiltrada;
            }
          
            return colunasSelecionadas;
          }

    let nomesTabelas = globalFromPart.split(",")
    let nomesCategorias = globalselectPart.split(",")
    console.log(nomesCategorias)

    const tabelasSelecionadas = selecionarTabelas(nomesTabelas);
    

      //Entrada
      if (globalselectPart == "*" && !where) {
        console.log(tabelasSelecionadas);
        console.log(sqlToRelationalAlgebra($('#mainInput').val().trim().toUpperCase()));
      } else if (globalselectPart != "*" && !where){
        const colunasSelecionadas = selecionarColunas(tabelasSelecionadas, nomesCategorias);
        console.log(colunasSelecionadas);
        console.log(sqlToRelationalAlgebra($('#mainInput').val().trim().toUpperCase()));
      } else if (globalselectPart != "*" && where){
        const colunasSelecionadas = selecionarColunas(tabelasSelecionadas, nomesCategorias, globalWherePart);
        console.log(colunasSelecionadas);
        console.log(sqlToRelationalAlgebra($('#mainInput').val().trim().toUpperCase()));
      }
    }
};

function sqlToRelationalAlgebra(sqlQuery) {
    // Extrair as partes relevantes da consulta SQL usando expressões regulares
    const selectRegex = /SELECT(.+?)FROM(.+?)(?:WHERE(.+?))?$/i;
    const [, selectClause, fromClause, whereClause] = sqlQuery.match(selectRegex);
  
    // Processar a cláusula SELECT
    const projection = selectClause.split(',').map((column) => column.trim());
  
    // Processar a cláusula FROM
    const tables = fromClause.split(',').map((table) => table.trim());
  
    // Processar a cláusula WHERE
    const selection = whereClause ? [whereClause.trim()] : [];
  
    // Construa sua expressão de álgebra relacional com base nas partes extraídas
    let algebraExpression = '';
  
    // Projeção
    algebraExpression += ' PROJECTION ' + projection.join(', ');
  
    // Seleção
    if (selection.length > 0) {
      algebraExpression += ' SELECTION ' + selection.join(' AND ');
    }
  
    // Junção de tabelas
    if (tables.length > 1) {
      algebraExpression += ' JOIN ' + tables.join(' JOIN ');
    }
  
    // Retorna a expressão de álgebra relacional resultante
    return algebraExpression;
  }