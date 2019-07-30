import jwt from 'jsonwebtoken';
import CostsDAO from '../dao/costsDAO';
import { type } from 'os';

/**
 * cost single data class
 */
export class Cost {
  /**
   * class initializer
   * @param {*} param0
   */
  constructor({moneyType, cost, category, subCategrory, date, payType, time, uid=0} = {}) {
    this.moneyType = moneyType;
    this.cost = cost;
    this.category = category;
    this.subCategrory = subCategrory;
    this.date = date;
    this.payType = payType;
    this.time = time;
    this.uid = uid;
  }
}
/**
 * cost controller class
 */
export default class CostController {
  /**
   * get all data from collection
   * @param {*} req
   * @param {*} res
   */
  static async getAllData(req, res) {
    try {
      const month = req.query.month;
      const year = req.query.year;
      const data = await CostsDAO.getCostsByMonthAndYear(month, year);
      console.log(data);
      // const dataDict = {};
      // const dateString = year.toString() + month.toString();
      // data.forEach((element) => {
      //   if (element['日期'].toString().substring(0, 6) === dateString) {
      //     let currentPrice = dataDict[element['日期']];
      //     if (isNaN(currentPrice)) {
      //       currentPrice = 0;
      //     };
      //     currentPrice += element['金額'];
      //     dataDict[element['日期']] = currentPrice;
      //   };
      // });
      res.json({data});
    } catch (e) {
      console.log(e);
      res.status(500).json({error: e});
    }
  };

  /**
   * get account date by date
   * @param {req} req
   * @param {res} res
   */
  static async getDataByDate(req, res) {
    try {
      const date = req.query.date;
      console.log(date);
      const costs = await CostsDAO.getCostsByDate(date);
      const dataList = await costs.toArray();
      res.json({dataList});
    } catch (e) {
      console.log(e);
      res.status(500).json({error: e});
    }
  };
}
