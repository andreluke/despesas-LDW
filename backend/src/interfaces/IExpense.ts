import { Document } from "mongoose";

export interface IExpense extends Document {
    description: string;
    amount: number;
    date: Date;
  }