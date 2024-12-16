class Row {
    constructor(name, bday) {
        this.name = name;
        this.bday = bday;
    }
}

class Database {

    constructor() {
        this.rows = {};
    }

    async select() {
        return this.rows;
    }

    async insert(id, name, bday) {
        this.rows[id] = new Row(name, bday);
    }

    async update(id, name, bday) {
        this.rows[id].name = name;
        this.rows[id].bday = bday;
    }

    async delete(id) {
        let row = {};
        row['id'] = id;
        row['name'] = this.rows[id].name;
        row['bday'] = this.rows[id].bday;
        delete this.rows[id];
        return row;
    }

}

db = new Database();
db.insert(18, "liza", "18.18.2018");
module.exports = db;
