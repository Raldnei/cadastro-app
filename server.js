const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com o MySQL (use sua senha: -------)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '34818520',
  database: 'cadastro_db'
});

// Rota para cadastro
app.post('/cadastrar', (req, res) => {
  const { tipo, tamanhoPet, servico, valor, nome, dataNascimento, telefone, cpf } = req.body;

  // Verificar se o CPF já existe
  const checkCpfSql = 'SELECT COUNT(*) AS count FROM usuarios WHERE cpf = ?';
  connection.query(checkCpfSql, [cpf], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Se o CPF já existe, retorna um erro
    if (result[0].count > 0) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }

    // Caso o CPF não exista, realiza o cadastro
    const sql = `
      INSERT INTO usuarios (tipo, tamanhoPet, servico, valor, nome, data_nascimento, telefone, cpf)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    connection.query(sql, [tipo, tamanhoPet, servico, valor, nome, dataNascimento, telefone, cpf], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
    });
  });
});

// Rota para listar os usuários
app.get('/usuarios', (req, res) => {
  const sql = 'SELECT * FROM usuarios';
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Rota para editar um usuário
app.put('/editar-usuario/:cpf', (req, res) => {
  const { cpf } = req.params; // Pegando o CPF da URL
  const { tipo, tamanhoPet, servico, valor, nome, dataNascimento, telefone } = req.body; // Dados para atualizar

  // Verificar se o CPF existe
  const checkCpfSql = 'SELECT COUNT(*) AS count FROM usuarios WHERE cpf = ?';
  connection.query(checkCpfSql, [cpf], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Se o CPF não existe, retorna um erro
    if (result[0].count === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualizar os dados do usuário
    const updateSql = `
      UPDATE usuarios 
      SET tipo = ?, tamanhoPet = ?, servico = ?, valor = ?, nome = ?, data_nascimento = ?, telefone = ?
      WHERE cpf = ?
    `;
    connection.query(updateSql, [tipo, tamanhoPet, servico, valor, nome, dataNascimento, telefone, cpf], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    });
  });
});
// Rota para buscar o usuário por CPF
app.get('/usuarios/:cpf', (req, res) => {
  const cpf = req.params.cpf;
  const sql = 'SELECT * FROM usuarios WHERE cpf = ?';
  connection.query(sql, [cpf], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]); // Retorna o primeiro usuário encontrado
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  });
});

// Inicie o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
