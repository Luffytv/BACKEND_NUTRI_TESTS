const mongoose = require("mongoose");

/*const {MONGO_URI, MONGO_URI_TEST, NODE_ENV } = process.env;
   // Determina qué URI utilizar según el entorno
const connectionString = NODE_ENV === "test" 
? MONGO_URI_TEST 
: MONGO_URI*/

class Database {
  constructor() {
    // Si la instancia de Database no existe, creamos una nueva
    if (!Database.instance) {
      this._connect();
      Database.instance = this;
    }

    // Devolvemos la instancia existente (si ya fue creada)
    return Database.instance;
  }

  _connect() { 
    // Conectarse a MongoDB usando mongoose
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Conectado a MongoDB");
      })
      .catch((error) => {
        console.error("Error conectándose a MongoDB:", error.message);
      });
  }
}

// Creamos una instancia única de Database
const instance = new Database();
Object.freeze(instance); // Congelamos la instancia para evitar modificaciones

module.exports = instance; // Exportamos la instancia para su uso en otros archivos