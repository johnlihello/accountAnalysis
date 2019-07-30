const database = require('../../database/database');
let costs;

/**
 * user data access object class
 */
export default class CostsDAO {
  /**
   * get cost data from collection
   */
  static async getCosts() {
    try {
      costs = await database.getCollection('costs');
      return await costs.find().toArray();
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  };

  /**
   * get cost data from collection by month and yeat
   * @param {month} month - month string
   * @param {year} year - year string
   */
  static async getCostsByMonthAndYear(month, year) {
    try {
      costs = await database.getCollection('costs');
      console.log(`/${year}${month}/`);
      return await costs.find({日期: {$in: /^${year}${month}/}}).toArray();
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  };


  /**
   * get cost data from collection by date
   * @param {date} date - date string
   */
  static async getCostsByDate(date) {
    try {
      costs = await database.getCollection('costs');
      return await costs.find({日期: parseInt(date)});
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  };
}
