const { Sequelize, DataTypes, Model } = require('sequelize');

// Для подключения к базе данных требуется объект
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './SEK.db',
    define: {
        timestamps: false
    }
});

class Turtle extends Model {}
class Weapon extends Model {}
class Pizza extends Model {}

async function createModels() {

    await Weapon.init(
        {
            id: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,    // автоматически увеличивает значение
                primaryKey: true,   // это первичный ключ таблицы
                allowNull: false    // значение не может быть нулевым
            },
            name: {
                type: DataTypes.STRING,     // сопоставляется с VARCHAR2 
                allowNull: false
            },
            dps: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Weapon',
        }
    );

    await Pizza.init(
        {
            id: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            calories: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            test: {
                type: DataTypes.INTEGER,
                defaultValue: 5
            }
        },
        {
            sequelize,
            modelName: 'Pizza',
        }
    );

    await Turtle.init(
        {
            id: { 
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            color: {
                type: DataTypes.STRING,
                allowNull: true
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: true
            },
        },
        {
            sequelize,
            modelName: 'Turtle',
        }
    );

    await Weapon.hasMany(Turtle, {
        foreignKey: "weapon_id",
    })
    await Pizza.hasMany(Turtle, {
        foreignKey: "favorite_pizza_id",
    });
    await Pizza.hasMany(Turtle, {
        foreignKey: "second_favorite_pizza_id",
    });

    await Weapon.sync({ force: true });
    await Pizza.sync({ force: true });
    await Turtle.sync({ force: true });


    await Weapon.create({ name: 'shotgun', dps: 40 });
    await Weapon.create({ name: 'spear', dps: 30 });
    await Weapon.create({ name: 'crossbow', dps: 50 });
    await Weapon.create({ name: 'artillery', dps: 10 });

    await Pizza.create({ name: 'Cheese Pizza', calories: 1000 })
    await Pizza.create({ name: 'Veggie Pizza', calories: 500 })
    await Pizza.create({ name: 'Pepperoni Pizza', calories: 1000 })
    await Pizza.create({ name: 'Meat Pizza', calories: 1800 })

    await Turtle.create({ 
        name: 'Leonardo', 
        color: 'blue', 
        image: 'file:///D:/sem6/Internet_programming/labs/lab7/node_7/images/leonardo.png', 
        weapon_id: 1,
        favorite_pizza_id: 1,
        second_favorite_pizza_id: 2
    });
    await Turtle.create({ 
        name: 'Raphael', 
        color: 'red', 
        image: 'file:///D:/sem6/Internet_programming/labs/lab7/node_7/images/raphael.png', 
        weapon_id: 2,
        favorite_pizza_id: 1,
        second_favorite_pizza_id: 3
    });
    await Turtle.create({ 
        name: 'Donatello', 
        color: 'purple', 
        image: 'file:///D:/sem6/Internet_programming/labs/lab7/node_7/images/donatello.png', 
        weapon_id: 4,
        favorite_pizza_id: 3,
        second_favorite_pizza_id: 2
    });
    await Turtle.create({ 
        name: 'Michelangelo', 
        color: 'orange', 
        image: 'file:///D:/sem6/Internet_programming/labs/lab7/node_7/images/michelangelo.png', 
        weapon_id: 3,
        favorite_pizza_id: 4,
        second_favorite_pizza_id: 1
    });
}

createModels();