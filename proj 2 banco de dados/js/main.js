const originalListOfSuggestions = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', '=', '<', '>', 'AND', 'IN', 'NOT IN', '<=', '>=', '<>', '</>']
words = $()
let globalselectPart = undefined
let globalFromPart = undefined
let globalJoinPart = undefined
let globalJoinOnPart = undefined
let globalWherePart = undefined
$('#mainInput').on('input', function () {
    let words = $(this).val().split(' ')
    let lastWord = words[words.length - 1].toUpperCase().trim()
    let listSugestions = lastWord !== '' ? originalListOfSuggestions.filter((e) => e.startsWith(lastWord)) : []
    let suggestions = $('#commands')
    suggestions.html('')
    for (let e of listSugestions) {
        suggestions.append($(`<li onclick="changingInput('${e}')">`).append(`${e}`))
    }
    if (listSugestions.length === 0) {
        $('#commands').hide()
    }
    else {
        $('#commands').show()
    }
})
function upper() {
    $("#validated-message").hide();
    const input = $('#mainInput')[0];
    const oldPosition = input.selectionStart;
    $('#mainInput').val($('#mainInput').val().toUpperCase());
    input.selectionStart = oldPosition;
    input.selectionEnd = oldPosition;
}
function changingInput(value) {
    $('#mainInput').val($('#mainInput').val().trim())
    let words = $('#mainInput').val().split(' ')
    let lastWord = words[words.length - 1].toUpperCase().trim()
    let newVal = ($('#mainInput').val().slice(0, $('#mainInput').val().toUpperCase().lastIndexOf(lastWord))).trim() + ' ' + value
    $('#mainInput').val(newVal + ' ')
    $('#commands').hide()
    $('#mainInput').focus()
}
function validation() {
    let test = validatingText()
    if (!test) {
        $("#validated-message").show()
        $("#validated-message").html('invalida')
        $("#validated-message").show()
        alert('ESTA  QUERY ESTA INVALIDA')
    }
    else {
        $("#validated-message").show()
        $("#validated-message").html('valida')
        $("#validated-message").show()
        alert('deu bom!')
        return juncao_e_reducao_tuplas();
    }
    console.log('globalSelect')
    console.log(globalselectPart)
    console.log('globalFrom')
    console.log(globalFromPart)
    console.log('globalJoin')
    console.log(globalJoinPart);
    console.log('globalJoinOn')
    console.log(globalJoinOnPart);
    console.log('globalWhere')
    console.log(globalWherePart);

}
function validatingText() {
    let userInput = $('#mainInput').val().trim().toUpperCase()
    const regex = /^SELECT\s+(.+?)\s+FROM\s+(.+?)(\s+JOIN\s+(.+?)\s+ON\s+(.+?))?\s*(?:WHERE\s+(.+?))?\s?([;])?$/i
    const match = userInput.match(regex);
    if (!match) {
        return false
    }
    let selectClause = match[1];
    let fromClause = match[2];
    let joinClause = match[4];
    let joinOnClause = match[5];
    let whereClause = match[6];
    console.log('select:');
    console.log(selectClause);
    console.log('depois da removeracentos:');
    selectClause = tirarAcento(selectClause)
    console.log(selectClause);
    console.log('from');
    console.log(fromClause);
    console.log('depois da removeracentos:');
    fromClause = tirarAcento(fromClause)
    console.log(fromClause);
    console.log('join')
    console.log(joinClause)
    if (joinClause) {
        console.log('depois da removeracentos:');
        joinClause = tirarAcento(joinClause)
        console.log(joinClause)
    }
    console.log('joinon')
    console.log(joinOnClause)
    if (joinOnClause) {
        console.log('depois da removeracentos:');
        joinOnClause = tirarAcento(joinOnClause)
        console.log(joinOnClause)
    }
    console.log('where')
    console.log(whereClause)
    if (whereClause) {
        console.log('depois da removeracentos:');
        whereClause = tirarAcento(whereClause)
        console.log(whereClause)
    }
    console.log('----------------------------------');
    const selectRegex = /^\s*(\*|\b(?!(?:FROM|SELECT|JOIN|ON|AND|WHERE|IN|NOT)\b)[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?(?:,\s*[a-zA-Z0-9_-]+\s*(?:\.[a-zA-Z0-9_-]+)?)*?)\s*$/gi
    const selectPart = selectClause.match(selectRegex)
    if (!selectPart) {
        return false
    }
    console.log(selectPart[0]);
    globalselectPart = selectPart[0]
    const fromRegex = /^(?!\d)\s?(?!FROM|SELECT|JOIN|ON|AND|WHERE|IN|NOT)(?!.*[^-_a-zA-Z0-9\s]).*[a-zA-Z][-_a-zA-Z0-9]*$/gi
    const fromPart = fromClause.match(fromRegex)
    if (!fromPart) {
        return false
    }
    globalFromPart = fromPart[0]
    console.log(match)
    if (joinClause) {
        if (!joinOnClause) {
            return false
        }
        if (!joinClause.match(/^(?!\d)\s?(?!FROM|SELECT|JOIN|ON|AND|WHERE|IN|NOT)(?!.*[^-_a-zA-Z0-9\s]).*[a-zA-Z][-_a-zA-Z0-9]*$/gi) || joinClause.split(' ').length > 2) {
            return false
        }
        let joinPart = []
        let joinOnPart = []
        let currentJoinOnClause = joinOnClause
        let currentJoinClause = joinClause
        let joinObject = joinCheck(currentJoinClause, currentJoinOnClause, joinPart, joinOnPart)
        if (!joinObject) {
            alert('query invalida')
            return false
        }
        else {
            joinPart = joinObject.joinPart
            joinOnPart = joinObject.joinOnPart
            joinPart = joinPart.filter((e, i) => { return joinPart.indexOf(e) === i })
            joinOnPart = joinOnPart.filter((element, index) => { return joinOnPart.indexOf(element) === index })
            globalJoinPart = joinPart
            globalJoinOnPart = joinOnPart
            console.log('join array');
            console.log(joinPart);
            console.log('joinOn array');
            console.log(joinOnPart);
        }
    }
    if (whereClause) {
        let wherepart = []
        let currentWhereClause = whereClause
        let whereTest = whereCheck(currentWhereClause, wherepart)
        if (!whereTest) {
            return false
        }
        console.log('where part:');
        console.log(wherepart);
        globalWherePart = wherepart
    }
    return true

}
function removeDuplicates(arr) {
    return [...new Set(arr)];
}
function tirarAcento(string1) {
    return string1.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}
function joinCheck(currentJoinClause, currentJoinOnClause, joinPart, joinOnPart) {
    joinPart.push(currentJoinClause.trim().toUpperCase())
    let aux = currentJoinOnClause.trim().toUpperCase().indexOf(' JOIN ')
    let currentJoinOn;
    if (aux !== -1) {
        let joinOn = currentJoinOnClause.slice(0, aux)
        let currentjoinOnPart = joinOn.match(/^(?!FROM|SELECT|JOIN|ON|AND|WHERE|IN|NOT)([a-zA-Z]+[\w.]*)\s*(=|>|<|<=|>=|<>)\s*([a-zA-Z]+[\w.]*)$/gi)
        if (!currentjoinOnPart || currentjoinOnPart.length > 2) {
            return undefined
        }
        joinOnPart.push(currentjoinOnPart[0])
        let nextClause = currentJoinOnClause.slice(aux, currentJoinOnClause.length).trim().toUpperCase()
        if (!nextClause) {
            return undefined
        }
        let nextAux = nextClause.indexOf(' ON ')
        if (nextAux === -1) {
            return undefined
        }
        let nextJoinClause = nextClause.slice(0, nextAux).replace('JOIN', '').trim()
        let nextJoinOnClause = nextClause.slice(nextAux, nextClause.length).replace('ON', '').trim()
        let nextObject = joinCheck(nextJoinClause, nextJoinOnClause, joinPart, joinOnPart)
        if (!nextObject) {
            return undefined
        }
        joinPart = joinPart.concat(nextObject.joinPart)
        joinOnPart = joinOnPart.concat(nextObject.joinOnPart)
        return {
            joinPart: joinPart,
            joinOnPart: joinOnPart
        }
    }
    else {
        currentJoinOn = currentJoinOnClause
        let currentjoinOnPart = currentJoinOn.match(/^(?!FROM|SELECT|JOIN|ON|AND|WHERE|IN|NOT)([a-zA-Z]+[\w.]*)\s*(=|>|<|<=|>=|<>)\s*([a-zA-Z]+[\w.]*)$/gi)
        if (!currentjoinOnPart || currentjoinOnPart.length > 2) {
            return undefined
        }
        joinOnPart.push(currentjoinOnPart[0])
        return {
            joinPart: joinPart,
            joinOnPart: joinOnPart
        }
    }
}
function whereCheck(currentWhereClause, wherePart) {
    let aux = currentWhereClause.trim().toUpperCase().indexOf('AND')
    if (aux !== -1) {
        let originalWhere = currentWhereClause
        currentWhereClause = originalWhere.slice(0, aux).trim().toUpperCase()
        currentWhereClause = currentWhereClause.match(/^(?!FROM|SELECT|JOIN|ON|AND|WHERE)([a-zA-Z]+[\w]*(?:[.]?[a-zA-Z]+[\w]*)?)\s*(?:(=|<=|>=|<>|>|<)\s*([a-zA-Z]+[\w]*(?:[.]?[a-zA-Z]+[\w]*)?|\d+|(?:[']{1}(?:\w*\s*)+[']{1}){1})|\s*(IN|NOT\s*IN)\s*([(]{1}\s*(?:[']{1}\w*[']{1}|\d+){1}(?:(?:\s)*[,]{1}(?:\s)*(?:[']{1}\w*[']{1}|\d+){1})*\s*[)]{1}))$/gi)
        if (!currentWhereClause) {
            return undefined
        }
        console.log(currentWhereClause)
        wherePart.push(currentWhereClause[0]);
        let nextWhereClause = originalWhere.slice(aux, originalWhere.length).replace('AND', '').trim().toUpperCase()
        wherePart = whereCheck(nextWhereClause, wherePart);
        return wherePart;
    } else {
        currentWhereClause = currentWhereClause.match(/^(?!FROM|SELECT|JOIN|ON|AND|WHERE)([a-zA-Z]+[\w]*(?:[.]?[a-zA-Z]+[\w]*)?)\s*(?:(=|<=|>=|<>|>|<)\s*([a-zA-Z]+[\w]*(?:[.]?[a-zA-Z]+[\w]*)?|\d+|(?:[']{1}(?:\w*\s*)+[']{1}){1})|\s*(IN|NOT\s*IN)\s*([(]{1}\s*(?:[']{1}\w*[']{1}|\d+){1}(?:(?:\s)*[,]{1}(?:\s)*(?:[']{1}\w*[']{1}|\d+){1})*\s*[)]{1}))$/gi)
        if (!currentWhereClause) {
            return undefined
        }
        console.log(currentWhereClause)
        wherePart.push(currentWhereClause[0]);
        return wherePart;
    }
}

function juncao_e_reducao_tuplas() {
    if (globalJoinPart === undefined) {
        let resultado_juncao = `PI ${globalselectPart} (SIGMA ${globalWherePart.join(' ^ ')} (${globalFromPart}))`
        return reducao_campos(resultado_juncao);
    }

    let jun = '';
    for (var i = 0; i < globalJoinPart.length; i++) {
        if (i == 0) {
            let replace_table_from = []
            let replace_table_join = []
            for (let j = 0; j < globalWherePart.length; j++) {
                let current_table = globalWherePart[j][0].split(' ')[0].split('.')[0]
                if (current_table === globalFromPart) {
                    replace_table_from.push(globalWherePart[j])
                    delete globalWherePart[j]
                } else if (current_table == globalJoinPart[i]) {
                    replace_table_join.push(globalWherePart[j])
                    delete globalWherePart[j]
                }
            }
            let part_1
            if (replace_table_from.length > 0) {
                part_1 = `(SIGMA ${replace_table_from.join(' ^ ')} (${globalFromPart}))`
            } else {
                part_1 = globalFromPart
            }
            let part_2
            if (replace_table_join.length > 0) {
                part_2 = `(SIGMA ${replace_table_join.join(' ^ ')} (${globalJoinPart[i]}))`
            } else {
                part_2 = globalJoinPart[i]
            }
            jun += `(${part_1} |x| ${globalJoinOnPart[i]} ${part_2})`;
        } else {
            let replace_table_join = []
            for (let j = 0; j < globalWherePart.length; j++) {
                if (globalWherePart[j] === undefined) { continue }
                console.log(globalWherePart)
                let current_table = globalWherePart[j][0].split(' ')[0].split('.')[0]
                if (current_table === globalJoinPart[i]) {
                    replace_table_join.push(globalWherePart[j])
                    delete globalWherePart[j]
                }
            }
            let part_3
            if (replace_table_join.length > 0) {
                part_3 = `(SIGMA ${replace_table_join.join(' ^ ')} (${globalJoinPart[i]}))`
            } else {
                part_3 = globalJoinPart[i]
            }
            jun = jun.replace(/^/, '(')
            jun += ` |x| ${globalJoinOnPart[i]} ${part_3})`
        }
    }
    return reducao_campos(`PI ${globalselectPart} (${jun})`);

}
// SELECT TAB1.NOME, TAB2.SOBRENOME FROM TAB1 JOIN TAB2 ON TAB1.ID = TAB2.ID JOIN TAB3 ON TAB2.AB = TAB3.CD WHERE TAB1.ID > 3 AND TAB1.NOME = 'JOSE' AND TAB2.QQ <> 4 AND TAB3.NAME = ''

function reducao_campos(current) {
    console.log(current)
}