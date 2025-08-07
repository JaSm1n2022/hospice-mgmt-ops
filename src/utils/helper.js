/* eslint-disable no-underscore-dangle */
const { customAlphabet } = require("nanoid");

// Define the characters to be used for the ID generation
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Create a custom ID generator with the specified alphabet and length

import moment from "moment";
class Helper {
  /**
   * @param {String | Date} date -
   * @param {Boolean} withDay -
   * @returns {String} -  Aug 6, 2007
   */

  static calculateDaysInStorage(soc, eoc) {
    console.log("[SOC]", soc, eoc);
    const start = moment(soc);
    const end = eoc ? moment(eoc) : moment();
    const diff = moment.duration(end.diff(start));

    return Math.floor(diff.asDays(), 10);
  }
  static generateRecordId() {
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return customAlphabet(alphabet, 8);
  }
  static getCurrentDateInYYYYMMDD() {
    const currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();

    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  }
  static formatDateRangeByCriteriaV2(selectedMenu, mode) {
    let dateFrom = this.getCurrentDateInYYYYMMDD();
    let dateTo = this.getCurrentDateInYYYYMMDD();

    dateFrom = moment(`${dateFrom}T00:00:00.000Z`);
    dateTo = moment(`${dateTo}T00:00:00.000Z`);
    const fmt = "YYYY-MM-DD"; // do not change as backend accepts this format
    let date1 = null;
    let date2 = null;
    if (mode === "created") {
      dateTo.add(1, "days").utc().format(fmt);
    }
    switch (selectedMenu) {
      case "Today":
      case "today":
        date1 = dateFrom.utc().format(fmt);

        date2 = date1;
        break;
      case "Tomorrow":
      case "tomorrow":
        date2 = dateFrom.add(1, "days").utc().format(fmt);
        date1 = dateTo.add(1, "days").utc().format(fmt);
        break;
      case "Yesterday":
      case "yesterday":
        date1 = dateFrom.subtract(1, "days").utc().format(fmt);
        date2 = dateTo.subtract(1, "days").utc().format(fmt);
        break;
      case "This week":
      case "thisWeek":
        date1 = dateFrom.startOf("week").add(1, "days").format(fmt);

        date2 = dateTo.endOf("week").add(1, "days").format(fmt);
        break;
      case "Last week":
      case "lastWeek":
        date1 = dateFrom
          .subtract(1, "week")
          .startOf("week")
          .add(1, "days")
          .format(fmt);
        date2 = dateTo
          .subtract(1, "week")
          .endOf("week")
          .add(1, "days")
          .format(fmt);
        break;
      case "Last month":
      case "lastMonth":
        date1 = dateFrom.subtract(1, "month").startOf("month").format(fmt);
        date2 = dateTo.utc().format(fmt);
        break;
      case "This month":
      case "thisMonth":
        date1 = dateFrom.startOf("month").format(fmt);
        date2 = dateTo.endOf("month").format(fmt);
        break;
      case "ytd":
      case "YTD":
        date1 = dateFrom.startOf("year").format(fmt);
        date2 = dateTo.utc().format(fmt);
        break;
      case "Last 90 days":
      case "last90Days":
        date1 = dateFrom.subtract(90, "days").utc().format(fmt);
        date2 = dateTo.utc().format(fmt);
        break;
      case "Last 30 days":
      case "last30Days":
        date1 = dateFrom.subtract(30, "days").utc().format(fmt);
        date2 = dateTo.utc().format(fmt);
        break;
      case "Last 7 days":
      case "last7Days":
        date1 = dateFrom.subtract(7, "days").utc().format(fmt);
        date2 = dateTo.utc().format(fmt);
        break;
      case "Next 90 days":
      case "next90Days":
        date2 = dateTo.add(90, "days").utc().format(fmt);
        date1 = dateFrom.utc().format(fmt);
        break;
      case "Next 30 days":
      case "next30Days":
        date2 = dateTo.add(30, "days").utc().format(fmt);
        date1 = dateFrom.utc().format(fmt);
        break;
      case "Next 7 days":
      case "next7Days":
        date2 = dateTo.add(7, "days").utc().format(fmt);
        date1 = dateFrom.utc().format(fmt);
        break;

      case "custom":
        // do nothing
        // for custom, check onClickApplyDate()
        break;
      default:
        break;
    }

    return { from: date1, to: date2 };
  }

  static formatExcelReport(availableCols, data) {
    let results = [];
    for (const rec of data) {
      const jsonObj = {};
      for (const col of availableCols) {
        if (col.header && !["actions"].includes(col.name)) {
          jsonObj[col.header] = rec[col.name];
        }
      }
      results.push(jsonObj); //
    }
    return results;
  }

  static getDaysInMonth() {
    const ytd = [];
    const currentMonth = moment(new Date()).format("MM");
    for (let i = 0; i < 11; i++) {
      if (parseInt(i) < parseInt(currentMonth)) {
        const mom = new moment();
        mom.set("month", i); // 0-indexed, so 3 --> 4 --> April

        const days = mom.daysInMonth();
        const aDays = Array.from({ length: days }, (_, i) => i + 1);
        const m = i < 9 ? `0${i + 1}` : i + 1;
        ytd.push({
          from: `${moment(new Date()).format("YYYY")}-${m}-01`,
          to: `${moment(new Date()).format("YYYY")}-${m}-${
            aDays[aDays.length - 1]
          }`,
        });
      }
    }

    return ytd;
  }
  /*
  static getDaysInMonth() {
    const cal2023 = [
      // { from: "2023-01-01", to: "2023-01-31" },
      // { from: "2023-02-01", to: "2023-02-28" },
      // { from: "2023-03-01", to: "2023-03-31" },
      // { from: "2023-04-01", to: "2023-04-30" },
      // { from: "2023-05-01", to: "2023-05-31" },
      // { from: "2023-06-01", to: "2023-06-30" },
      // { from: "2023-07-01", to: "2023-07-31" },
      { from: "2023-08-01", to: "2023-08-31" },
      { from: "2023-09-01", to: "2023-09-30" },
      { from: "2023-10-01", to: "2023-10-31" },
      { from: "2023-11-01", to: "2023-11-30" },
      { from: "2023-12-01", to: "2023-12-31" },
      { from: "2024-01-01", to: "2024-01-31" },
      { from: "2024-02-01", to: "2024-02-29" },
      { from: "2024-03-01", to: "2024-03-31" },
      { from: "2024-04-01", to: "2024-04-30" },
      //     { from: "2024-04-01", to: "2024-04-30" },
      //    { from: "2024-05-01", to: "2024-05-31" },
    ];

    return cal2023;
  }
  */
  static formatReportDateAxisCategory(value) {
    const [y, m, d] = value.split("-");
    if (m === "01") {
      return `Jan ${y}`;
    }
    if (m === "02") {
      return `Feb ${y}`;
    }
    if (m === "03") {
      return `Mar ${y}`;
    }
    if (m === "04") {
      return `Apr ${y}`;
    }
    if (m === "05") {
      return `May ${y}`;
    }
    if (m === "06") {
      return `Jun ${y}`;
    }
    if (m === "07") {
      return `Jul ${y}`;
    }
    if (m === "08") {
      return `Aug ${y}`;
    }
    if (m === "09") {
      return `Sep ${y}`;
    }
    if (m === "10") {
      return `Oct ${y}`;
    }
    if (m === "11") {
      return `Nov ${y}`;
    }
    if (m === "12") {
      return `Dec ${y}`;
    }
    return value;
  }
}

export default Helper;
