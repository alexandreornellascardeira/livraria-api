import express from "express";
import autorController from "../controllers/autor.controller.js";

const router = express.Router();

router.post("/", autorController.createAutor);
router.get("/", autorController.getAutors);
router.get("/:id", autorController.getAutor);
router.delete("/:id", autorController.deleteAutor);
router.put("/", autorController.updateAutor);

router.use((err, req, res, next) => {
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({ error: err.message });
    next();
});

export default router;