const database = require('../database/database');

const filename = 'script/AndroMoney.xlsx';
const XLSX = require('xlsx');
const workbook = XLSX.readFile(filename);
const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2',……]
const worksheet = workbook.Sheets[sheetNames[0]];
const range = XLSX.utils.decode_range(worksheet['!ref']);
range.s.r = 1;
worksheet['!ref'] = XLSX.utils.encode_range(range);
tableJson = XLSX.utils.sheet_to_json(worksheet);


(
  async () => {
    try {
      const costs = await database.getCollection('costs');
      await costs.insertMany(tableJson);
      await database.closeDB();
    } catch (e) {
      console.error(
          `Unable to establish a collection handle in csv table: ${e}`,
      );
    }
  }
)();

