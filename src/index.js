import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";


const app = express();
const port = 3030;

app.use(cors())

app.use(express.json());

app.listen(port, () => console.log(`server iniciado${port}`));

let alunos = [];
let contador = 1;

app.post("/criar", async (req, res) => {
  const senha = req.body.senha;
  const email= req.body.email
  const senhaCripto = await bcrypt.hash(senha, 10);

  const estudante = {
    id: contador,
    nome: req.body.nome,
    email: req.body.email,
    senha: senhaCripto,
  };
 
  const verificarConta = alunos.find((estudante) => estudante.email === email);
  if (verificarConta) {
    res.status(404).send("Conta já existente!");
  } else {
    res.status(201).send("Sua conta foi criada com sucesso!");
    alunos.push(estudante);
    contador++;
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  const aluno = alunos.find((estudante) => estudante.email === email);
  const senhaCripto = await bcrypt.hash(senha, 10);

  if (aluno) {
    bcrypt.compare(senha, senhaCripto, (error, result) => {
      if (result) {
        res
          .status(200)
          .json({ sucess: true, msg: "Login realizado com sucesso!" });
      } else {
        res.status(404).json({ sucess: false, msg: "Senha incorreta!" });
      }
    });
  } else {
    res.status(404).send("Senha ou email incorreto!");
  }
});

app.get("/usuariosregistrados", (req, res) => {
    res.status(200).json(alunos)
})

let recados = []
let contadorRecados= 1
app.post("/recados/:email", (req, res) => {

   const mensagem ={
     id: contadorRecados,
     titulo: req.body.titulo,
     descricao: req.body.descricao,
   }
   recados.push(mensagem)
   res.status(201).json("Recado enviado!")
   contadorRecados++
})

//app.get("/verRecados/:email", (req, res) => {
  //res.status(200).json(recados)
//})


/*app.get('/verRecados/:email', (req, res) => {
  try {
      if (recados.length === 0) {
          return res.status(400).send({ message: 'Não tem recados' })
      }

      const limit = parseInt(req.query.limit)

      const offset = parseInt(req.query.offset)

      const itensPorPagina = Math.floor(Math.random() * offset)

      const produtosPaginados = recados.slice(
        itensPorPagina,
        itensPorPagina + limit
      )

      res.status(200).json({
          success: true,
          message: 'Recados retornados com sucesso',
          data: produtosPaginados,
          recados: recados.length,
          paginaAtual: Math.floor(itensPorPagina / limit) + 1,
          totalPaginas: Math.ceil(recados.length / limit),
          quantidadePorPagina: limit,
      })

  } catch (error) {
      res.status(500).send({ message: 'Erro interno' })
  }
})*/


app.get("/verRecados", (req, res) => {
  try {
    if (recados.length === 0) {
      return res
        .status(400)
        .send({ recados: "Você deve adicionar ao menos 1 recado" });
    }
    
    console.log("entrou")
    //const email = req.params.email

    const limit = parseInt(req.query.limit);
    
    const offset = parseInt(req.query.offset);

    const itemOffset = offset - 1;

    const msgOffset = recados.slice(itemOffset, itemOffset + limit);

    res.status(200).json({
      success: true,
      message: 'Recados retornados com sucesso',
      data: msgOffset,
      recados: recados.length,
      paginaAtual: Math.floor(itemOffset/ limit) + 1,
      totalPaginas: Math.ceil(recados.length / limit),
      quantidadePorPagina: limit,
  })




  } catch (error)
   {
    console.log("SOCORRO")
    return res.status(500).send({ recados: "erro no interno" });
  }
});




























app.put("/atualizarRecados/:email/:id", (req, res) => {
      
  const id = parseInt(req.params.id)

  const filtradosRecados = recados.filter((recado) => recado.id === id)
  
  
  
  if (filtradosRecados.length === 0) {
    res.status(404).send("Recado não encontrado!")
    return;
  } 
    filtradosRecados.forEach((recado) =>{
    recado.titulo = req.body.titulo
    recado.descricao = req.body.descricao  
  })
   
  res.status(200).send("Recado atualizado com sucesso!")
});
   
  app.delete("/deletar/:email/:id",(req, res) =>{
    const id = parseInt(req.params.id)

    const filtrados = recados.filter((recado) => recado.id === id)

    if(filtrados.length === 0){
      res.status(404).send("Recado não encontrado!")
      return;

    }
    recados = recados.filter((recado) => recado.id !== id)
    res.status(200).send("Recado deletado com sucesso!")
  })
  