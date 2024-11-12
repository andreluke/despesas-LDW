import { Router } from "express";
import controller from "../controllers/ExpenseController";

const router = Router();

router.post("/", controller.create);
router.get("/", controller.get);
router.get("/total", controller.getTotal);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;