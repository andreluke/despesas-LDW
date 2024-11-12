import request from 'supertest';
import app from '../index'; // Certifique-se de que você exporta o `app` do seu servidor
import mongoose from 'mongoose';
import Expense from '../models/Expense';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente de .env.dev
dotenv.config({ path: '.env.dev' });

describe('Testes de Integração - Rotas de Despesas', () => {
  // Executado antes de cada teste
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      // Conectar ao banco de dados de testes
      await mongoose.connect(process.env.MONGO_URI_TEST || '');
    }
  });
  
  // Limpar a coleção de despesas após cada teste
  afterEach(async () => {
    await Expense.deleteMany({});
  });
  
  // Fechar a conexão após todos os testes
  afterAll(async () => {
    await mongoose.connection.close();
  });
  

  it('Deve criar uma nova despesa (POST /)', async () => {
    const expenseData = {
      description: 'Compra de supermercado',
      amount: 150.5,
      date: '2023-11-10',
    };

    const response = await request(app).post('/despesas').send(expenseData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.description).toBe(expenseData.description);
    expect(response.body.amount).toBe(expenseData.amount);
  });

  it('Deve listar todas as despesas (GET /)', async () => {
    // Inserir uma despesa manualmente no banco
    await Expense.create({ description: 'Aluguel', amount: 800, date: '2023-11-01' });

    const response = await request(app).get('/despesas');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe('Aluguel');
  });

  it('Deve calcular o total de despesas (GET /total)', async () => {
    // Inserir várias despesas manualmente no banco
    await Expense.create([
      { description: 'Aluguel', amount: 800, date: '2023-11-01' },
      { description: 'Mercado', amount: 150.5, date: '2023-11-05' },
    ]);

    const response = await request(app).get('/despesas/total');

    expect(response.status).toBe(200);
    expect(response.body.total).toBeCloseTo(950.5);
  });

  it('Deve atualizar uma despesa existente (PUT /:id)', async () => {
    const expense = await Expense.create({ description: 'Transporte', amount: 50, date: '2023-11-10' });

    const updatedData = { description: 'Transporte público', amount: 55 };
    const response = await request(app).put(`/despesas/${expense._id}`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.description).toBe(updatedData.description);
    expect(response.body.amount).toBe(updatedData.amount);
  });

  it('Deve deletar uma despesa existente (DELETE /:id)', async () => {
    const expense = await Expense.create({ description: 'Transporte', amount: 50, date: '2023-11-10' });

    const response = await request(app).delete(`/despesas/${expense._id}`);

    expect(response.status).toBe(204);

    // Verificar se a despesa foi removida
    const deletedExpense = await Expense.findById(expense._id);
    expect(deletedExpense).toBeNull();
  });
});
