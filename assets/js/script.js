const evento = document.getElementById('send');
const enviarFormulario =() =>{
    let nombre = document.getElementById('nombres').value;
    //let apellido = document.getElementById('apellidos').value;
    let mensaje = document.getElementById('mensaje').value;

    let numero= 51922059066;
    var win = window.open(`https://wa.me/${numero}?text=Hola%20mi%20nombre%20es%20${nombre}
    , Asunto:%20${mensaje}`,'_blank');
}
evento.addEventListener('click',enviarFormulario)