import { Request, Response } from 'express';
import Expense from '../models/Expense';

class ExpenseController {
  // Criar uma nova despesa
  public async create(req: Request, res: Response): Promise<void> {
    const { description, amount, date } = req.body;
    try {
      const expense = new Expense({ description, amount, date });
      await expense.save();
      res.status(201).json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar despesa', error });
    }
  }

  // Listar todas as despesas
  public async get(req: Request, res: Response): Promise<void> {
    try {
      const expenses = await Expense.find();
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar despesas', error });
    }
  }

  // Atualizar uma despesa
  public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { description, amount, date } = req.body;
    try {
      const updatedExpense = await Expense.findByIdAndUpdate(
        id,
        { description, amount, date },
        { new: true }
      );
      res.status(200).json(updatedExpense);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar despesa', error });
    }
  }

  // Excluir uma despesa
  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await Expense.findByIdAndDelete(id);
      res.status(204).json({ message: 'Despesa removida com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir despesa', error });
    }
  }

  // Obter o total de despesas
  public async getTotal(req: Request, res: Response): Promise<void> {
    try {
      const total = await Expense.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      res.status(200).json({ total: total[0]?.total || 0 });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao calcular o total de despesas', error });
    }
  }
}

export default new ExpenseController();
