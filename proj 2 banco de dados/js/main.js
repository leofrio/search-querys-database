const originalListOfSuggestions=[
    'SELECT','FROM','WHERE','JOIN','ON','=','<','>', 'AND', 'IN', 'NOT IN','<=', '>=', '<>','</>'] 
words=$()
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
function changingInput(value) { 
    $('#mainInput').val( $('#mainInput').val().trim()) 
    let words=$('#mainInput').val().split(' ') 
    let lastWord=words[words.length-1].toUpperCase().trim()  
    let newVal=($('#mainInput').val().slice(0,$('#mainInput').val().toUpperCase().lastIndexOf(lastWord))).trim() + ' ' + value
    $('#mainInput').val(newVal )
} 