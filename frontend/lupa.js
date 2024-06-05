const lupa = document.querySelector('#lupa')
let cont = 0
lupa.addEventListener('click', () =>{
    if(cont % 2 == 0){
        document.querySelector('#search-input').style.display = 'inline-block'
        ++cont
    }else{
        document.querySelector('#search-input').style.display = 'none'
        ++cont
    }
})