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
        header: "First FY Cap",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "secondPeriodCap",
        header: "Second FY Cap",
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
        header: "Accumulated First FY Days",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "usedCapFirstPeriod",
        header: "Used Cap First FY",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "secondPeriodDays",
        header: "Accumulated Second FY Days",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "usedCapSecondPeriod",
        header: "Used Cap Second FY",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "allowedCapFirstPeriod",
        header: "Allowed Cap First FY",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "allowedCapSecondPeriod",
        header: "Allowed Cap Second FY",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "availableCapFirstPeriod",
        header: "Available Cap First FY",
      },
      {
        defaultFlex: 1,
        minWidth: 200,
        name: "availableCapSecondPeriod",
        header: "Available Cap Second FY",
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

  static calculateFiscalYearProjection(items) {
    // Get fiscal year end date
    const currentDate = moment();
    const currentYear = currentDate.year();
    const fiscalYearEnd = moment(`${currentYear}-09-30`);
    if (currentDate.isAfter(fiscalYearEnd)) {
      fiscalYearEnd.add(1, "year");
    }

    // Process active patients (project to 09/30)
    const activePatients = items.filter((item) => !item.eoc);

    // Process death discharge patients with available cap (include current available cap)
    const deathDischargePatients = items.filter((item) => {
      if (!item.eoc) return false;

      // Check if death discharge and within the target fiscal year
      const isDeathDischarge = item.eoc_discharge === "Death Discharge";
      const eocDate = moment(item.eoc, "YYYY-MM-DD");
      const fyStart = moment(fiscalYearEnd).subtract(1, "year").add(1, "day");
      const isWithinFY = eocDate.isSameOrAfter(fyStart) && eocDate.isSameOrBefore(fiscalYearEnd);

      // Check if has available cap
      const totalAvailableCap = parseFloat(item.availableCapFirstPeriod || 0) +
                                 parseFloat(item.availableCapSecondPeriod || 0);

      return isDeathDischarge && isWithinFY && totalAvailableCap > 0;
    });

    // Map active patients with projections
    const activeProjections = activePatients.map((item) => {
      const projection = { ...item };
      projection.isActiveProjection = true;
      projection.fiscalYearEnd = fiscalYearEnd.format("YYYY-MM-DD");

      // Calculate days from current date to fiscal year end
      const daysToFYEnd = fiscalYearEnd.diff(currentDate, "days");
      projection.remainingDaysToFYEnd = daysToFYEnd;

      // Calculate projected total days by FY end
      const socDate = moment(item.soc);
      const projectedTotalDays = fiscalYearEnd.diff(socDate, "days");
      projection.projectedTotalDays = projectedTotalDays;

      // Calculate projected claim by FY end using same rate structure
      const first60DaysClaim =
        projectedTotalDays >= 60
          ? parseFloat(238 * 60).toFixed(2)
          : parseFloat(projectedTotalDays * 238).toFixed(2);
      const remainingClaim =
        projectedTotalDays >= 60 ? parseFloat(187 * (projectedTotalDays - 60)) : 0;
      projection.projectedTotalClaim = parseFloat(
        parseFloat(first60DaysClaim) + parseFloat(remainingClaim)
      ).toFixed(2);

      // Calculate projected claim for the remaining days only
      const additionalDays = daysToFYEnd;
      projection.projectedAdditionalClaim = parseFloat(187 * additionalDays).toFixed(2);

      // Determine which fiscal period we're in
      const firstPeriod = MEDICARE_CAP_AMOUNT.find(
        (m) =>
          new Date(`${item.soc} 17:00`) >= new Date(`${m.from} 17:00`) &&
          new Date(`${item.soc} 17:00`) <= new Date(`${m.to} 17:00`)
      );

      if (firstPeriod) {
        const firstEndDt = moment(new Date(`${firstPeriod.to} 17:00`));
        const projectedFirstPeriodDays = Math.min(
          projectedTotalDays,
          firstEndDt.diff(socDate, "days")
        );
        const projectedSecondPeriodDays = Math.max(0, projectedTotalDays - projectedFirstPeriodDays);

        projection.projectedFirstPeriodDays = projectedFirstPeriodDays;
        projection.projectedSecondPeriodDays = projectedSecondPeriodDays;

        // Calculate projected used cap for each period
        if (projectedSecondPeriodDays > 0) {
          const first60Days =
            projectedFirstPeriodDays >= 60
              ? parseFloat(238 * 60).toFixed(2)
              : parseFloat(projectedFirstPeriodDays * 238).toFixed(2);
          const firstRemaining =
            projectedFirstPeriodDays >= 60
              ? parseFloat(187 * (projectedFirstPeriodDays - 60))
              : 0;
          projection.projectedUsedCapFirstPeriod = parseFloat(
            parseFloat(first60Days) + parseFloat(firstRemaining)
          ).toFixed(2);
          projection.projectedUsedCapSecondPeriod = parseFloat(
            187 * projectedSecondPeriodDays
          ).toFixed(2);

          // Calculate projected allowed cap
          const firstPctAvailable =
            (projectedFirstPeriodDays / projectedTotalDays) * item.firstPeriodCap;
          const secondPctAvailable =
            (projectedSecondPeriodDays / projectedTotalDays) * item.secondPeriodCap;
          projection.projectedAllowedCapFirstPeriod = parseFloat(firstPctAvailable).toFixed(2);
          projection.projectedAllowedCapSecondPeriod = parseFloat(secondPctAvailable).toFixed(2);

          // Calculate projected available cap
          projection.projectedAvailableCapFirstPeriod = parseFloat(
            parseFloat(projection.projectedAllowedCapFirstPeriod) -
              parseFloat(projection.projectedUsedCapFirstPeriod)
          ).toFixed(2);
          projection.projectedAvailableCapSecondPeriod = parseFloat(
            parseFloat(projection.projectedAllowedCapSecondPeriod) -
              parseFloat(projection.projectedUsedCapSecondPeriod)
          ).toFixed(2);
        } else {
          projection.projectedUsedCapFirstPeriod = projection.projectedTotalClaim;
          projection.projectedAllowedCapFirstPeriod = projection.projectedTotalClaim;
          projection.projectedAvailableCapFirstPeriod = parseFloat(
            parseFloat(item.firstPeriodCap) - parseFloat(projection.projectedTotalClaim)
          ).toFixed(2);
          projection.projectedUsedCapSecondPeriod = 0.0;
          projection.projectedAllowedCapSecondPeriod = 0.0;
          projection.projectedAvailableCapSecondPeriod = 0.0;
        }

        // Calculate total projected available cap
        projection.projectedTotalAvailableCap = parseFloat(
          parseFloat(projection.projectedAvailableCapFirstPeriod) +
            parseFloat(projection.projectedAvailableCapSecondPeriod)
        ).toFixed(2);
      }

      return projection;
    });

    // Map death discharge patients (no projection, just current available cap)
    const deathDischargeProjections = deathDischargePatients.map((item) => {
      const projection = { ...item };
      projection.isDeathDischarge = true;
      projection.fiscalYearEnd = fiscalYearEnd.format("YYYY-MM-DD");

      // For death discharge, we don't project - we use current values
      projection.projectedTotalDays = item.totalDayCare;
      projection.projectedTotalClaim = item.totalClaim;
      projection.projectedFirstPeriodDays = item.firstPeriodDays;
      projection.projectedSecondPeriodDays = item.secondPeriodDays;
      projection.projectedUsedCapFirstPeriod = item.usedCapFirstPeriod;
      projection.projectedUsedCapSecondPeriod = item.usedCapSecondPeriod;
      projection.projectedAllowedCapFirstPeriod = item.allowedCapFirstPeriod;
      projection.projectedAllowedCapSecondPeriod = item.allowedCapSecondPeriod;
      projection.projectedAvailableCapFirstPeriod = item.availableCapFirstPeriod;
      projection.projectedAvailableCapSecondPeriod = item.availableCapSecondPeriod;
      projection.projectedTotalAvailableCap = parseFloat(
        parseFloat(item.availableCapFirstPeriod || 0) +
          parseFloat(item.availableCapSecondPeriod || 0)
      ).toFixed(2);
      projection.remainingDaysToFYEnd = 0; // Already discharged
      projection.projectedAdditionalClaim = "0.00";

      return projection;
    });

    // Combine active projections and death discharge patients
    return [...activeProjections, ...deathDischargeProjections];
  }
}
export default AvailableHandler;
