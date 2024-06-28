import express from "express";
import vendaController from "../controllers/venda.controller.js";

const router = express.Router();

router.post("/", vendaController.createVenda);
router.get("/", vendaController.getVendas);
router.get("/:id", vendaController.getVenda);
router.delete("/:id", vendaController.deleteVenda);
router.put("/", vendaController.updateVenda);
 
router.use((err, req, res, next) => {
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({ error: err.message });
    next();
});

export default router;