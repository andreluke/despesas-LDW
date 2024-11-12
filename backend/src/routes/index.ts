import { Router } from "express";
import expenses from "./expenses";

const routes = Router()

routes.use("/despesas", expenses);

export default routes