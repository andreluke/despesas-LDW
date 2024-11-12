import { Schema, model, Document } from 'mongoose';
import { IExpense } from '../interfaces/IExpense';

const expenseSchema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now }
});

const Expense = model<IExpense>('Expense', expenseSchema);

export default Expense;
