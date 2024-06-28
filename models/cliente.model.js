import { Sequelize } from "sequelize";
import db from "../repositories/db.js";

const Cliente = db.define('clientes', {
    cliente_id: {
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
    senha: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    telefone: {
        type: Sequelize.DataTypes.STRING(14),
        allowNull: false,
        unique: false
    },
    endereco: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    cep: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
    }
});

export default Cliente;