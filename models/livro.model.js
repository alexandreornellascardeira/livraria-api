import { Sequelize } from "sequelize";
import db from "../repositories/db.js";

const Livro = db.define('livros', {
    livro_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    autor_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    nome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    valor: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        unique: true
    },
    estoque: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: false
    }
});

export default Livro;