const PORT = 8080;
const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

//? scoketIo
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io')(server);

const io = socketIo;


let posts = [];

if (posts.length >= 1) {
  console.log("posts",posts)
}

app.use("/",express.static(path.join(__dirname, 'client')))

app.get("/all", (req,res) => {
    res.type("json");
    // res.send(posts);
    res.send(infoArray);

})

app.get("/posts", (req,res) => {
    res.type("json");
    res.send(posts);
    
})

app.post("/new", bodyParser.json(), (req,res) => {
    let url = req.body.url;
    posts.push({url});
    res.send("URL adicionada")
    console.log(posts)
    run()
    
})

server.listen(PORT, () => {
  console.log("running")
})

async function run(){
    let url = posts[0].url; //? obtem url
    posts.shift();


    let textoInput = url;
    console.log("site url", textoInput);

    // let text = "How are you doing today?";
    const myArray = textoInput.split(" ");
    let somenteURL = myArray[0];
    console.log("a url separada do resto::",somenteURL)



    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.goto(somenteURL);

    
        infoArray = [ ];
        infoObjeto = { }; //* TESTE


        const title = await page.evaluate(() => {

         const ogTitle = document.querySelector('meta[property="og:title"]');
         if (ogTitle != null && ogTitle.content.length > 0) {return ogTitle.content;}
         const twitterTitle = document.querySelector('meta[name="twitter:title"]');
         if (twitterTitle != null && twitterTitle.content.length > 0) {return twitterTitle.content;}
         const docTitle = document.title;
         if (docTitle != null && docTitle.length > 0) {return docTitle;}
         const h1 = document.querySelector("h1").innerHTML;
         if (h1 != null && h1.length > 0) {return h1;}
         const h2 = document.querySelector("h2").innerHTML;
         if (h2 != null && h2.length > 0) {return h2;}
         return null;
        });
        console.log('OLA O TITULO:',title);
        // infoArray.push(title);//! TRANSFORMAR EM OBJETO
        infoObjeto.title = title; //? TESTE OBJETO

                    //* ***** */

        const imgIcon = await page.evaluate(() => {

        const iconImg = document.head.querySelector('link[rel="icon"]')
        if(iconImg != null){
            return iconImg.href;
        }      
        const shortcutIconImg = document.head.querySelector('link[rel="shortcut icon"]')
        if(shortcutIconImg != null){
            return shortcutIconImg.href;
        }
        const twitterImg = document.querySelector('meta[name="twitter:image"]')
           if(twitterImg != null){
               return twitterImg.content;
           }
        const ogImg = document.querySelector('meta[property="og:image"]')//...
           if(ogImg != null){
               return ogImg.content;
           }
        const imgRelLink = document.querySelector('link[rel="image_src"]')
           if(imgRelLink != null){
               return imgRelLink.href;
           }
        });
        console.log('OLHA A IMAGEM:',imgIcon);
        // infoArray.push(imgIcon);//! TRANSFORMAR EM OBJETO
        infoObjeto.image = imgIcon; //? TESTE OBJETO



        await browser.close();
        
        //! POR O OBETO NO ARRAY

        infoArray.push(infoObjeto.title, infoObjeto.image) //? TESTE
        
        console.log("info do Objeto", infoObjeto);

        console.log("info do array",infoArray); //* PASSA POR AQUI PARA ATUALIZAR 

        setTimeout(() => {
          infoArray = [ ];
          console.log("infoArray vazio: ",infoArray)
        }, 5000);

        return infoArray;
        // return infoObjeto;

};





//! Não estamos usando para funcionalidade

//* Escuta o front end
//? connection -> se alguem se conectou na aba
io.on('connection',(socket) => {
  console.log('Nova Conexão')

  //? on -> escutando e esperando chegar a 'mensagem'
  socket.on('mensagem', () => {
      console.log("mensgem recebida")
      //? emit -> enviando 'resposta para o front end'
      io.emit('resposta');
  })

})