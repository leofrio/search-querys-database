const originalListOfSuggestions=[
    'SELECT','FROM','WHERE','JOIN','ON','=','<','>', 'AND', 'IN', 'NOT IN','<=', '>=', '<>','</>']
words=$()
let globalselectPart=undefined
let globalFromPart=undefined
let globalJoinPart=undefined
let globalJoinOnPart=undefined
let globalWherePart=undefined
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
    }
    else {
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
    const selectRegex=/^\s*(\*|\b(?!(?:FROM|SELECT|JOIN|ON|AND|WHERE|IN|NOT)\b)[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?(?:,\s*[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?)*?)\s*$/gi
    const selectPart=selectClause.match(selectRegex)
    if(!selectPart) {
        return false
    }
    console.log(selectPart[0]);
    globalselectPart=selectPart[0]
    const fromRegex=/^(?!\d)\s?(?!FROM$|SELECT$|JOIN$|ON$|AND$|WHERE$|IN$|NOT$)(?!.*[^-_a-zA-Z0-9\s]).*[a-zA-Z][-_a-zA-Z0-9]*$/gi
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
        if(!joinClause.match(/^(?!\d)\s?(?!FROM$|SELECT$|JOIN$|ON$|AND$|WHERE$|IN$|NOT$)(?!.*[^-_a-zA-Z0-9\s]).*[a-zA-Z][-_a-zA-Z0-9]*$/gi)) {
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

    }
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
