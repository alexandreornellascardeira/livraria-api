import { Sequelize } from "sequelize";
import db from "../repositories/db.js";

const Autor = db.define('autores', {
    autor_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefone: {
        type: Sequelize.DataTypes.STRING(14),
        allowNull: false
    }
});

export default Autor;