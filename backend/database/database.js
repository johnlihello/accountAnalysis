const mongoProduction = require('mongodb').MongoClient;
// const mongoDevelopment = require('mongo-mock').MongoClient;
const config = require('../config.js');

const mongo = mongoProduction;
// if (process.env.NODE_ENV === 'production') {
//     mongo = mongoProduction;
// } else if (process.env.NODE_ENV === 'development') {
//     mongo = mongoDevelopment;
//     mongo.persist = 'mongoMockDB.js';
// }

/**
 * database initialize connection class
 */
class Database {
  /**
   * initialization
   * @param {dbName} dbName
   */
  constructor(dbName) {
    this.databaseName = dbName;
  }

  /**
   * database setter
   * @param {value} value
   */
  set databaseName(value) {
    this._dbName = value;
    this._client = undefined;
    this._db = undefined;
    this.getDB();
  }

  /**
   * get database connection
   * @return {this._db} - database connection
   */
  async getDB() {
    if (this._client === undefined || this._db === undefined) {
      try {
        this._client = await mongo.connect(config.MONGO_URL, {useNewUrlParser: true});
        this._db = await this._client.db(this._dbName);
        return this._db;
      } catch (error) {
        console.log(`connnected ${config.MONGO_URL} error`);
      }
    }
    return this._db;
  }

  /**
   * get table collection
   * @param {collectionName} collectionName
   * @return {collection} - table connection
   */
  async getCollection(collectionName) {
    if (this._client === undefined || this._db === undefined) {
      await this.getDB();
    }
    const collection = this._db.collection(collectionName);
    return collection;
  }

  /**
   * close database
   */
  async closeDB() {
    await this._client.close();
    this._client = undefined;
    this._db = undefined;
  }
}

const database = new Database(config.MONGO_DATABASE_NAME);

module.exports = database;
