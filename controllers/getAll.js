const csv = require("csvtojson");
const path = require("path");

const csvFilePath = path.join(__dirname, "../datas/users1.csv");
const csvFilePath2 = path.join(__dirname, "../datas/users2.csv");
const getAll = async (_, res, next) => {
  let ar = [];
  try {
    const result = await csv({
      noheader: false,
      delimiter: [",", "||", "$"],
    }).fromFile(csvFilePath);
    const result2 = await csv({
      noheader: false,
      delimiter: [",", "||", "$"],
    }).fromFile(csvFilePath2);
    ar = [...result, ...result2];
    function makeNeedFormClientsList({
      first_name,
      last_name,
      phone,
      amount,
      date,
      cc,
    }) {
      const normalizedPhoneFirstPart = phone.slice(6, 9);
      const normalizedPhoneSecondPart = phone.slice(10, 14);
      const normalizedPhone = `+380${normalizedPhoneFirstPart}${normalizedPhoneSecondPart}`;
      const normolizedCc = cc.slice(3, 8);
      const normolizedArOfDate = date.split("/");
      function toNormolizedDate(array) {
        let newArOfDate = [];
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          if (index === 0 && element.length === 1) {
            let num = 0 + element;
            newArOfDate.push(num);
          }
          if (index === 0 && element.length >= 2) {
            newArOfDate.push(element);
          }
          if (index === 1 && element.length === 1) {
            let num = 0 + element;
            newArOfDate.push(num);
          }
          if (index === 1 && element.length >= 2) {
            newArOfDate.push(element);
          }
          if (index === 2 && element.length === 4) {
            newArOfDate.push(element);
          }
        }
        return newArOfDate;
      }
      const normolizedDate = toNormolizedDate(normolizedArOfDate)
        .reverse()
        .join("/");

      const client = {
        name: `${first_name} ${last_name}`,
        phone: normalizedPhone,
        person: {
          firstName: first_name,
          lastName: last_name,
        },
        amount: Number(amount),
        date: normolizedDate,
        costCenterNum: normolizedCc,
      };
      return client;
    }
    const newList = ar.map((item) => makeNeedFormClientsList(item));

    res.json({
      status: "success",
      code: 200,
      data: {
        newList,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = getAll;
