import { Sequelize } from "sequelize";
import db from "../repositories/db.js";

const Venda = db.define('vendas', {
    venda_id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cliente_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    livro_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    valor: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: true,
        unique: false
    },
    data_venda: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        unique: false
    }
});

export default Venda;