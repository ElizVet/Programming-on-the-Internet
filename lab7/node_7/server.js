const fs = require("fs");
const path = require("path");
const express = require("express");
const fileUpload = require('express-fileupload');
const { Sequelize, DataTypes, Model, Op } = require("sequelize");

// Для подключения к базе данных требуется объект
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './SEK.db',
  define: {
      timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

class Turtle extends Model {}
class Weapon extends Model {}
class Pizza extends Model {}

async function initModels() {
    await Weapon.init(
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

    await Weapon.hasMany(Turtle, { // один ко многим
        foreignKey: "weapon_id",
    })
    await Pizza.hasMany(Turtle, {
        foreignKey: "favorite_pizza_id",
    });
    await Pizza.hasMany(Turtle, {
        foreignKey: "second_favorite_pizza_id",
    });

    await Weapon.sync();
    await Pizza.sync();
    await Turtle.sync();
}

initModels();


const app = express();

app.use(express.json()); // автоматического разбора JSON-данных, отправленных в запросе (доступ - через объект request.body)
app.use(fileUpload()); // функциональность загрузки файлов на сервер
app.use(express.static("images")); // "images" как статическая папка, доступная по HTTP
app.use(function(_, response, next) { // ф-я-обработчик для каждого запроса
    response.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/api/turtles", getTurtles);            // вывод всех черепашек
app.get("/api/turtles/:id", getTurtleById);     // вывод черепашки по id

app.post("/api/turtles", postTurtle);     // добавление черепашки
app.put("/api/turtles/:id", putTurtle);   // обновление черепашки
app.put("/api/turtles/:id/favoritePizzaBind", putTurtle);                // привязка 1 пиццы
app.put("/api/turtles/:id/secondFavoritePizzaBind", putTurtle);    // привязка 2 пиццы

app.put("/api/turtles/:id/weaponBind", putTurtle);    // привязка оружия
app.delete("/api/turtles/:id/favoritePizzaUnbind", turtleUnbindFavoritePizza);                     // отвязка 1 пиццы
app.delete("/api/turtles/:id/secondFavoritePizzaUnbind", turtleUnbindSecondFavoritePizza);   // отвязка 2 пиццы
app.delete("/api/turtles/:id/weaponUnbind", turtleUnbindWeapon);    // отвязка оружия
app.delete("/api/turtles/:id", deleteTurtle);   // удаление черепашки


app.get("/api/weapons", getWeapons);
app.get("/api/weapons/:id", getWeaponById);
app.post("/api/weapons", postWeapon);
app.put("/api/weapons/:id", putWeapon);
app.delete("/api/weapons/:id", deleteWeapon);


app.get("/api/pizzas", getPizzas);
app.get("/api/pizzas/:id", getPizzaById);
app.post("/api/pizzas", postPizza);
app.put("/api/pizzas/:id", putPizza);
app.delete("/api/pizzas/:id", deletePizza);

const urlencodedParser = express.urlencoded({extended: false});
app.get("/upload", getUpload);
app.post("/upload", postUpload);

app.put("/api/superfat", putSuperfat);

app.listen(3000);
console.log("http://localhost:3000/");



async function getTurtles(request, response) {
    let turtles;
    if (request.query["favoritePizza"] !== undefined) {
        const favoritePizzaName = request.query["favoritePizza"];
        const pizza = await Pizza.findOne({
            where: {
                name: favoritePizzaName
            }
        });
        turtles = await Turtle.findAll({
            where: {
                favorite_pizza_id: pizza.id
            }
        });
    }
    else {
        turtles = await Turtle.findAll();
    }
    response.json(turtles);
}

async function getTurtleById(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    response.json(turtle);
}

async function postTurtle(request, response) {
    const newTurtle = request.body;
    Turtle.create(newTurtle);
    response.json(request.body);
}

async function putTurtle(request, response) {
    const putData = request.body;
    const putId = parseInt(request.params["id"]);
    await Turtle.update(putData, { 
        where: { 
            id: putId
        } 
    });
    const updatedObject = await Turtle.findOne({
        where: {
            id: putId
        }
    });
    response.json(updatedObject);
}

async function deleteTurtle(request, response) {
    const turtle_id = parseInt(request.params["id"]);
    const turtle = await Turtle.findOne({
        where: {
            id: turtle_id
        }
    });
    Turtle.destroy({
        where: {
            id: turtle_id
        }
    });
    response.json(turtle);
}

async function turtleUnbindFavoritePizza(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    await turtle.update({ favorite_pizza_id: null });
    response.json(turtle);
}

async function turtleUnbindSecondFavoritePizza(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    await turtle.update({ second_favorite_pizza_id: null });
    response.json(turtle);
}

async function turtleUnbindWeapon(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    await turtle.update({ weapon_id: null });
    response.json(turtle);
}




async function getWeapons(request, response) {
    const dpsgt = request.query["dpsgt"] === undefined ? 0 : parseInt(request.query["dpsgt"]);
    const dpslt = request.query["dpslt"] === undefined ? 500 : parseInt(request.query["dpslt"]);
    const weapons = await Weapon.findAll({
        where: {
            dps: {
                [Op.gt]: dpsgt,
                [Op.lt]: dpslt,
            }
        }
    });
    response.json(weapons);
}

async function getWeaponById(request, response) {
    const weapon = await Weapon.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    response.json(weapon);
}

async function postWeapon(request, response) {
    const newWeapon = request.body;
    if (newWeapon.dps > 500) {
        response.json(JSON.stringify({ error: "dps is too high" }));
    }
    else {
        Weapon.create(newWeapon);
        response.json(request.body);
    }
}

async function putWeapon(request, response) {
    const putData = request.body;
    if (putData.dps > 500) {
        response.json({ error: "dps is too high" });
        return;
    }
    const putId = parseInt(request.params["id"]);
    await Weapon.update(putData, { 
        where: { 
            id: putId
        } 
    });
    const updatedObject = await Weapon.findOne({
        where: {
            id: putId
        }
    });
    response.json(updatedObject);
}

async function deleteWeapon(request, response) {
    const weapon_id = parseInt(request.params["id"]);
    const weapon = await Weapon.findOne({
        where: {
            id: weapon_id
        }
    });
    Weapon.destroy({
        where: {
            id: weapon_id
        }
    });
    response.json(weapon);
}




async function getPizzas(request, response) {
    const caloriesgt = request.query["caloriesgt"] === undefined ? 0 : parseInt(request.query["caloriesgt"]);
    const calorieslt = request.query["calorieslt"] === undefined ? 200000 : parseInt(request.query["calorieslt"]);
    const pizzas = await Pizza.findAll({
        where: {
            calories: {
                [Op.gt]: caloriesgt,
                [Op.lt]: calorieslt,
            }
        }
    });
    response.json(pizzas);
}

async function getPizzaById(request, response) {
    const pizza = await Pizza.findOne({
        where: {
            id: parseInt(request.params["id"])
        }
    });
    response.json(pizza);
}

async function postPizza(request, response) {
    const newPizza = request.body;
    if (newPizza.calories > 2000) {
        response.json({ error: "calories is too high" });
    }
    else {
        Pizza.create(newPizza);
        response.json(request.body);
    }
}

async function putPizza(request, response) {
    const putData = request.body;
    if (putData.calories > 2000) {
        response.json({ error: "calories is too high" });
        return;
    }
    const putId = parseInt(request.params["id"]);
    await Pizza.update(putData, { 
        where: { 
            id: putId
        } 
    });
    const updatedObject = await Pizza.findOne({
        where: {
            id: putId
        }
    });
    response.json(updatedObject);
}

async function deletePizza(request, response) {
    const pizza_id = parseInt(request.params["id"]);
    const pizza = await Pizza.findOne({
        where: {
            id: pizza_id
        }
    });
    Pizza.destroy({
        where: {
            id: pizza_id
        }
    });
    response.json(pizza);
}


async function getUpload(request, response) {
    response.sendFile(__dirname + "/html/upload.html");
}

async function postUpload(request, response) {
    const turtle = await Turtle.findOne({
        where: {
            id: request.body.id
        }
    });
    if (turtle === null) {
        return response.sendStatus(400);
    }

    const image = request.files.image;
    if (!image) {
        return response.sendStatus(404);
    }
    const imagePath = __dirname + `\\images\\turtle_${request.body.id}.png`;
    image.mv(imagePath);
    await Turtle.update({ image: "file:///" + imagePath }, { 
        where: { 
            id: request.body.id
        } 
    });
    response.sendStatus(200);
}


async function putSuperfat(request, response) {
    const fatPizzas = await Pizza.findAll({
        where: {
            calories: {
                [Op.gt]: 1500
            }
        }
    });
    fatPizzas.forEach((pizza) => {
        const pizzaName = pizza.name;
        pizza.update({ name: pizzaName + " SUPER FAT!"});
    });
    response.json(fatPizzas);
}
