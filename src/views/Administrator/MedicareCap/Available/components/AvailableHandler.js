import moment from "moment";
import { MEDICARE_CAP_AMOUNT } from "utils/constants";

class AvailableHandler {
  static columns(main) {
    return [
      { width: 92, name: "actions", header: "Actions" },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "patientCd",
        header: "Client #",
      },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "soc",
        header: "SOC",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "eoc",
        header: "EOC",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "insurance",
        header: "Insurance",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "firstPeriodCap",
        header: "First Period Cap",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "secondPeriodCap",
        header: "Second Period Cap",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "first90Benefit",
        header: "First Benefit",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "second90Benefit",
        header: "Second Benefit",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "third60Benefit",
        header: "Third Benefit",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "fourth60Benefit",
        header: "Fourt Benefit",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "totalDayCare",
        header: "# Day Cares",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "totalClaim",
        header: "Total Claim",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "firstPeriodDays",
        header: "Accumulated First Period Days",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "usedCapFirstPeriod",
        header: "Used Cap First Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "secondPeriodDays",
        header: "Accumulated Second Period Days",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "usedCapSecondPeriod",
        header: "Used Cap Second Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "allowedCapFirstPeriod",
        header: "Allowed Cap First Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "allowedCapSecondPeriod",
        header: "Allowed Cap Second Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "availableCapFirstPeriod",
        header: "Available Cap First Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "availableCapSecondPeriod",
        header: "Available Cap Second Period",
      },
    ];
  }
  static capColumns(main) {
    return [
      { defaultFlex: 1, minWidth: 200, name: "patientCd", header: "Client #" },

      {
        defaultFlex: 1,
        minWidth: 200,
        name: "soc",
        header: "SOC",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "eoc",
        header: "EOC",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "insurance",
        header: "Insurance",
      },
      /*
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "firstPeriodCap",
        header: "First Period Cap",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "secondPeriodCap",
        header: "Second Period Cap",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "first90Benefit",
        header: "First Benefit",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "second90Benefit",
        header: "Second Benefit",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "third60Benefit",
        header: "Third Benefit",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "fourth60Benefit",
        header: "Fourt Benefit",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "totalDayCare",
        header: "# Day Cares",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "totalClaim",
        header: "Total Claim",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "firstPeriodDays",
        header: "Accumulated First Period Days",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "usedCapFirstPeriod",
        header: "Used Cap First Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "secondPeriodDays",
        header: "Accumulated Second Period Days",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "usedCapSecondPeriod",
        header: "Used Cap Second Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "allowedCapFirstPeriod",
        header: "Allowed Cap First Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "allowedCapSecondPeriod",
        header: "Allowed Cap Second Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "availableCapFirstPeriod",
        header: "Available Cap First Period",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "availableCapSecondPeriod",
        header: "Available Cap Second Period",
      },
      */
    ];
  }
  static mapDataV2(items) {
    items.forEach((item) => {
      item.soc = moment(item.soc).format("YYYY-MM-DD");
      const firstPeriod = MEDICARE_CAP_AMOUNT.find(
        (m) =>
          new Date(`${item.soc} 17:00`) >= new Date(`${m.from} 17:00`) &&
          new Date(`${item.soc} 17:00`) <= new Date(`${m.to} 17:00`)
      );
      console.log("[First Period]", firstPeriod);
      //get Diff of last First Period
      const firstStartDt = moment(new Date(`${item.soc} 17:00`));
      const firstEndDt = moment(new Date(`${firstPeriod.to} 17:00`));
      const allowedDays = moment.duration(firstEndDt.diff(firstStartDt));
      const firstPeriodDays = Math.floor(allowedDays.asDays());

      item.firstPeriodCap = firstPeriod.amount;
      const secondYear = moment(new Date(`${firstPeriod.to} 17:00`))
        .add(1, "days")
        .format("YYYY-MM-DD");
      const secondPeriod =
        MEDICARE_CAP_AMOUNT.find(
          (m) =>
            new Date(`${secondYear} 17:00`) >= new Date(`${m.from} 17:00`) &&
            new Date(`${secondYear} 17:00`) <= new Date(`${m.to} 17:00`)
        ) || "";
      item.secondPeriodCap = secondPeriod.amount;
      let currentDay = moment(new Date());
      if (item.eoc) {
        currentDay = moment(item.eoc);
        item.eoc = moment(item.eoc).format("YYYY-MM-DD");
      }
      console.log("[Current Day]", currentDay);
      const socDay = moment(new Date(`${item.soc} 17:00`));
      const diff = moment.duration(currentDay.diff(socDay));
      const dayCares = Math.floor(diff.asDays());
      item.first90Benefit = dayCares;
      const secondPeriodDays = dayCares - firstPeriodDays;
      console.log("[Period]", dayCares, firstPeriodDays, secondPeriodDays);

      if (dayCares >= 90) {
        item.first90Benefit = dayCares / 90 >= 1 ? 90 : dayCares;
      }
      if (dayCares >= 91) {
        item.second90Benefit = dayCares / 180 >= 1 ? 90 : dayCares - 90;
      }
      if (dayCares >= 181) {
        item.third60Benefit = dayCares / 240 >= 1 ? 60 : dayCares - 180;
      }
      if (dayCares >= 241) {
        item.fourth60Benefit = dayCares / 300 >= 1 ? 60 : dayCares - 240;
      }
      item.totalDayCare = dayCares;
      const first60DaysClaim =
        dayCares >= 60
          ? parseFloat(238 * 60).toFixed(2)
          : parseFloat(dayCares * 238).toFixed(2);
      const remainingClaim =
        dayCares >= 60 ? parseFloat(187 * (dayCares - 60)) : 0;
      item.totalClaim = parseFloat(
        parseFloat(first60DaysClaim) + parseFloat(remainingClaim)
      ).toFixed(2);

      if (secondPeriodDays > 0) {
        const first60DaysClaim =
          firstPeriodDays >= 60
            ? parseFloat(238 * 60).toFixed(2)
            : parseFloat(firstPeriodDays * 238).toFixed(2);
        const fistRemainingClaim =
          firstPeriodDays >= 60 ? parseFloat(187 * (firstPeriodDays - 60)) : 0;
        item.usedCapFirstPeriod = parseFloat(
          parseFloat(first60DaysClaim) + parseFloat(fistRemainingClaim)
        ).toFixed(2);
        item.usedCapSecondPeriod = parseFloat(187 * secondPeriodDays).toFixed(
          2
        );
        const firstPctAvailable =
          (firstPeriodDays / dayCares) * item.firstPeriodCap;
        const secondPctAvailable =
          (secondPeriodDays / dayCares) * item.secondPeriodCap;
        item.allowedCapFirstPeriod = parseFloat(firstPctAvailable).toFixed(2);
        item.allowedCapSecondPeriod = parseFloat(secondPctAvailable).toFixed(2);
        item.availableCapFirstPeriod = parseFloat(
          parseFloat(item.allowedCapFirstPeriod) -
            parseFloat(item.usedCapFirstPeriod)
        ).toFixed(2);
        item.availableCapSecondPeriod = parseFloat(
          parseFloat(item.allowedCapSecondPeriod) -
            parseFloat(item.usedCapSecondPeriod)
        ).toFixed(2);
        item.firstPeriodDays = firstPeriodDays;
        item.secondPeriodDays = secondPeriodDays;
        console.log(
          "[Percentage Data1]",
          dayCares,
          firstPeriodDays,
          secondPeriodDays,
          firstPeriodDays / dayCares,
          secondPeriodDays / dayCares,
          firstPctAvailable,
          secondPctAvailable
        );
      } else {
        item.firstPeriodDays = dayCares;
        item.secondPeriodDays = 0.0;
        item.usedCapFirstPeriod = item.totalClaim;
        item.allowedCapFirstPeriod = item.usedCapFirstPeriod;
        item.availableCapFirstPeriod = parseFloat(
          parseFloat(item.firstPeriodCap) - parseFloat(item.usedCapFirstPeriod)
        ).toFixed(2);
        item.usedCapSecondPeriod = 0.0;
        item.allowedCapSecondPeriod = 0.0;
        item.availableCapSecondPeriod = 0.0;
      }
      /*
      if (currentDay <= new Date(`${firstPeriod.from} 17:00`)) {
        // do some trick
      } else {
        // maintain first period
        item.usedCapFirstPeriod = item.totalClaim;
        item.availableCapFirstPeriod = parseFloat(
          parseFloat(item.firstPeriodCap) - parseFloat(item.usedCapFirstPeriod)
        ).toFixed(2);
      }
      */
    });

    return items;
  }
  static mapData(items) {
    items.forEach((item) => {
      item.soc = moment(item.soc).format("YYYY-MM-DD");
      const firstPeriod = MEDICARE_CAP_AMOUNT.find(
        (m) =>
          new Date(`${item.soc} 17:00`) >= new Date(`${m.from} 17:00`) &&
          new Date(`${item.soc} 17:00`) <= new Date(`${m.to} 17:00`)
      );
      console.log("[First Period]", firstPeriod);
      //get Diff of last First Period
      const firstStartDt = moment(new Date(`${item.soc} 17:00`));
      const firstEndDt = moment(new Date(`${firstPeriod.to} 17:00`));
      const allowedDays = moment.duration(firstEndDt.diff(firstStartDt));
      const firstPeriodDays = Math.floor(allowedDays.asDays());

      item.firstPeriodCap = firstPeriod.amount;
      const secondYear = moment(new Date(`${firstPeriod.to} 17:00`))
        .add(1, "days")
        .format("YYYY-MM-DD");
      const secondPeriod =
        MEDICARE_CAP_AMOUNT.find(
          (m) =>
            new Date(`${secondYear} 17:00`) >= new Date(`${m.from} 17:00`) &&
            new Date(`${secondYear} 17:00`) <= new Date(`${m.to} 17:00`)
        ) || "";
      item.secondPeriodCap = secondPeriod.amount;
      let currentDay = moment(new Date());
      if (item.eoc) {
        currentDay = moment(item.eoc);
        item.eoc = moment(item.eoc).format("YYYY-MM-DD");
      }
      console.log("[Current Day]", currentDay);
      const socDay = moment(new Date(`${item.soc} 17:00`));
      const diff = moment.duration(currentDay.diff(socDay));
      const dayCares = Math.floor(diff.asDays());
      item.first90Benefit = dayCares;
      const secondPeriodDays = dayCares - firstPeriodDays;
      console.log("[Period]", dayCares, firstPeriodDays, secondPeriodDays);

      if (dayCares >= 90) {
        item.first90Benefit = dayCares / 90 >= 1 ? 90 : dayCares;
      }
      if (dayCares >= 91) {
        item.second90Benefit = dayCares / 180 >= 1 ? 90 : dayCares - 90;
      }
      if (dayCares >= 181) {
        item.third60Benefit = dayCares / 240 >= 1 ? 60 : dayCares - 180;
      }
      if (dayCares >= 241) {
        item.fourth60Benefit = dayCares / 300 >= 1 ? 60 : dayCares - 240;
      }
      item.totalDayCare = dayCares;
      const first60DaysClaim =
        dayCares >= 60
          ? parseFloat(238 * 60).toFixed(2)
          : parseFloat(dayCares * 238).toFixed(2);
      const remainingClaim =
        dayCares >= 60 ? parseFloat(187 * (dayCares - 60)) : 0;
      item.totalClaim = parseFloat(
        parseFloat(first60DaysClaim) + parseFloat(remainingClaim)
      ).toFixed(2);

      if (secondPeriodDays > 0) {
        const first60DaysClaim =
          firstPeriodDays >= 60
            ? parseFloat(238 * 60).toFixed(2)
            : parseFloat(firstPeriodDays * 238).toFixed(2);
        const fistRemainingClaim =
          firstPeriodDays >= 60 ? parseFloat(187 * (firstPeriodDays - 60)) : 0;
        item.usedCapFirstPeriod = parseFloat(
          parseFloat(first60DaysClaim) + parseFloat(fistRemainingClaim)
        ).toFixed(2);
        item.usedCapSecondPeriod = parseFloat(187 * secondPeriodDays).toFixed(
          2
        );
        const firstPctAvailable =
          (firstPeriodDays / dayCares) * item.firstPeriodCap;
        const secondPctAvailable =
          (secondPeriodDays / dayCares) * item.secondPeriodCap;
        item.allowedCapFirstPeriod = parseFloat(firstPctAvailable).toFixed(2);
        item.allowedCapSecondPeriod = parseFloat(secondPctAvailable).toFixed(2);
        item.availableCapFirstPeriod = parseFloat(
          parseFloat(item.allowedCapFirstPeriod) -
            parseFloat(item.usedCapFirstPeriod)
        ).toFixed(2);
        item.availableCapSecondPeriod = parseFloat(
          parseFloat(item.allowedCapSecondPeriod) -
            parseFloat(item.usedCapSecondPeriod)
        ).toFixed(2);
        item.firstPeriodDays = firstPeriodDays;
        item.secondPeriodDays = secondPeriodDays;
        console.log(
          "[Percentage Data1]",
          dayCares,
          firstPeriodDays,
          secondPeriodDays,
          firstPeriodDays / dayCares,
          secondPeriodDays / dayCares,
          firstPctAvailable,
          secondPctAvailable
        );
      } else {
        item.firstPeriodDays = dayCares;
        item.secondPeriodDays = 0.0;
        item.usedCapFirstPeriod = item.totalClaim;
        item.allowedCapFirstPeriod = item.usedCapFirstPeriod;
        item.availableCapFirstPeriod = parseFloat(
          parseFloat(item.firstPeriodCap) - parseFloat(item.usedCapFirstPeriod)
        ).toFixed(2);
        item.usedCapSecondPeriod = 0.0;
        item.allowedCapSecondPeriod = 0.0;
        item.availableCapSecondPeriod = 0.0;
      }
      /*
      if (currentDay <= new Date(`${firstPeriod.from} 17:00`)) {
        // do some trick
      } else {
        // maintain first period
        item.usedCapFirstPeriod = item.totalClaim;
        item.availableCapFirstPeriod = parseFloat(
          parseFloat(item.firstPeriodCap) - parseFloat(item.usedCapFirstPeriod)
        ).toFixed(2);
      }
      */
    });

    return items;
  }
}
export default AvailableHandler;
