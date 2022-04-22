function validarEnviaUrl(){
    var input = document.getElementById('enviaUrl').value;
    document.getElementById("impSenha").innerHTML = "<strong>input: </strong> " + input;
    
    // if (condition) {
        
    // }

    if(input.match(/^(?:https?:\/\/)?(w{3}\.)?[\w_-]+((\.\w{2,}){1,2})(\/([\w\._-]+\/?)*(\?[\w_-]+=[^\?\/&]*(\&[\w_-]+=[^\?\/&]*)*)?)?$/gm)){
        console.log("contem url");
        newPost()
    }
}


function newPost(){ //* BOTAO ENVIAR

    console.log("New post")
    let url = document.getElementById('enviaUrl').value;
    console.log("NOSSA url",url);
    let post = {url};
    console.log("POST URL", post)

    const options = {
        method:"POST",
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(post)
    }
    fetch("http://localhost:8080/new", options).then(res =>{
        console.log("response new",res)
        console.log(posts)
        setTimeout(() => {
            updatePosts()
        }, 5000);
    })
    // enviar();
    console.log("ANTES DO DELETE url",url);
    delete url;
    console.log("DELETE url",url);


}
 


//* esta dando erro ao ser chamado!
function updatePosts(){
    let promise = fetch('http://localhost:8080/all', {method: 'get'})
    .then(res => {
        return res.json();
    }).then(json => {
        console.log(json)

        let postElements = '';

        let postsItem = json;
        console.log("Update PostsItem: ",postsItem)
        

        // postsItem.forEach((post)=>{
        postsItem.forEach(()=>{
            let postElement = `
            <div id="postsItem" class="container ">
                <div id="ft">
                    <img src="${postsItem[1]}">
                </div>
                <div id="texto">
                    <h5 class="card-title">${postsItem[0]}</h5>
                </div>
            </div>
            `
            postElements = postElement;
        })
        document.getElementById("posts").innerHTML = postElements;
    
    }) 
}








//! Não estamos usando para funcionalidade


// // esperando alguem se conectar
// const socket = io.connect();

// // Escutando e esperando receber 'resposta'
// socket.on('resposta', () => {
//     console.log('resposta recebida')
// })

// function enviar(){
//     // emit -> enviando 'mensagem' para o back
//     socket.emit('mensagem')
// }