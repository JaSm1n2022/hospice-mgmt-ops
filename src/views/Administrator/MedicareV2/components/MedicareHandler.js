import moment from "moment";
import { MEDICARE_CAP_AMOUNT } from "utils/constants";
import hospiceRates from "utils/data/hospice_rates.json";

class MedicareHandler {
  // Get rates for a specific state, county, and date
  static getRatesForLocation(state, county, socDate) {
    const socMoment = moment(socDate);

    // Find the matching rate entry
    const rateEntry = hospiceRates.find((rate) => {
      const rateStart = moment(rate.start_date);
      const rateEnd = moment(rate.end_date);
      return (
        rate.state === state &&
        rate.county === county &&
        socMoment.isSameOrAfter(rateStart) &&
        socMoment.isSameOrBefore(rateEnd)
      );
    });

    if (rateEntry) {
      return {
        rhc_days_1_60: rateEntry.rates_national.rhc_days_1_60,
        rhc_days_61_plus: rateEntry.rates_national.rhc_days_61_plus,
        aggregate_cap: rateEntry.aggregate_cap,
        fy: rateEntry.fy,
      };
    }

    // Fallback to default rates if not found
    return {
      rhc_days_1_60: 238, // Old hardcoded rate
      rhc_days_61_plus: 187, // Old hardcoded rate
      aggregate_cap: null,
      fy: null,
    };
  }

  // Calculate claim amount based on days and rates
  static calculateClaim(days, rates) {
    if (days <= 0) return 0;

    if (days <= 60) {
      return parseFloat(days * rates.rhc_days_1_60).toFixed(2);
    } else {
      const first60Claim = parseFloat(60 * rates.rhc_days_1_60).toFixed(2);
      const remainingClaim = parseFloat(
        (days - 60) * rates.rhc_days_61_plus
      ).toFixed(2);
      return parseFloat(
        parseFloat(first60Claim) + parseFloat(remainingClaim)
      ).toFixed(2);
    }
  }

  static mapData(items) {
    items.forEach((item) => {
      item.soc = moment(item.soc).format("YYYY-MM-DD");

      // Get rates for this patient (includes aggregate cap)
      const rates = this.getRatesForLocation(item.state, item.county, item.soc);

      const firstPeriod = MEDICARE_CAP_AMOUNT.find(
        (m) =>
          new Date(`${item.soc} 17:00`) >= new Date(`${m.from} 17:00`) &&
          new Date(`${item.soc} 17:00`) <= new Date(`${m.to} 17:00`)
      );

      //get Diff of last First Period
      const firstStartDt = moment(new Date(`${item.soc} 17:00`));
      const firstEndDt = moment(new Date(`${firstPeriod.to} 17:00`));
      const allowedDays = moment.duration(firstEndDt.diff(firstStartDt));
      const firstPeriodDays = Math.floor(allowedDays.asDays());

      // Use aggregate cap from rates JSON if available, otherwise fallback to constants
      item.firstPeriodCap = rates.aggregate_cap || firstPeriod.amount;

      const secondYear = moment(new Date(`${firstPeriod.to} 17:00`))
        .add(1, "days")
        .format("YYYY-MM-DD");
      const secondPeriod =
        MEDICARE_CAP_AMOUNT.find(
          (m) =>
            new Date(`${secondYear} 17:00`) >= new Date(`${m.from} 17:00`) &&
            new Date(`${secondYear} 17:00`) <= new Date(`${m.to} 17:00`)
        ) || "";

      // Get rates for second period if needed
      const secondRates = this.getRatesForLocation(
        item.state,
        item.county,
        secondYear
      );
      item.secondPeriodCap = secondRates.aggregate_cap || secondPeriod.amount;

      // Check if patient has prior hospice
      item.hasPriorHospice = item.is_prior_hospice || false;
      item.priorDayCare = parseFloat(item.prior_day_care || 0);
      item.lastDayCare = parseFloat(item.prior_last_day_care || 0);
      let currentDay = moment(new Date());
      if (item.eoc) {
        currentDay = moment(item.eoc);
        item.eoc = moment(item.eoc).format("YYYY-MM-DD");
      }

      const socDay = moment(new Date(`${item.soc} 17:00`));
      const diff = moment.duration(currentDay.diff(socDay));
      const dayCares = Math.floor(diff.asDays());
      item.first90Benefit = dayCares;
      const secondPeriodDays = dayCares - firstPeriodDays;

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

      // Use admitted_benefits_period from database instead of calculating
      const benefitCount = parseInt(item.admitted_benefits_period || 1);
      item.benefitCount = benefitCount;

      // Check if insurance is traditional medicare (case insensitive)
      const isTraditionalMedicare =
        item.insurance && item.insurance.toLowerCase().includes("traditional");
      item.isTraditionalMedicare = isTraditionalMedicare;

      // Calculate total claim using rates from JSON (rates already fetched at the beginning)
      item.totalClaim = this.calculateClaim(dayCares, rates);

      // Check if prior hospice usage exceeds aggregate cap
      let priorHospiceExceedsAggregateCap = false;
      let priorHospiceClaim = 0;
      let hasCapAvailable = true;

      if (item.hasPriorHospice && item.priorDayCare > 0) {
        priorHospiceClaim = parseFloat(
          this.calculateClaim(item.priorDayCare, rates)
        );
        // If prior hospice claim alone exceeds or equals aggregate cap, no cap available
        if (priorHospiceClaim >= item.firstPeriodCap) {
          priorHospiceExceedsAggregateCap = true;
          hasCapAvailable = false;
        }
      }

      // If prior hospice exceeds aggregate cap, still calculate FY breakdown and show prior hospice apportionment
      if (priorHospiceExceedsAggregateCap) {
        // Include post-discharge days in total apportionment
        const postDischargeDays = parseInt(item.new_hospice_care_day || 0, 10);
        const totalDaysIncludingPrior = dayCares + item.priorDayCare + postDischargeDays;

        // Calculate prior hospice caps using admitted FY's cap and RHC rate
        const priorAllowedCap =
          (item.priorDayCare / totalDaysIncludingPrior) * item.firstPeriodCap;
        item.priorHospiceAllowedCap = parseFloat(priorAllowedCap).toFixed(2);
        item.priorHospiceUsedCap = this.calculateClaim(item.priorDayCare, rates);

        // Calculate prior hospice available cap
        const priorAvailableCap = parseFloat(
          parseFloat(item.priorHospiceAllowedCap) -
            parseFloat(item.priorHospiceUsedCap)
        );

        // If negative, set to zero (don't transfer negative cap)
        item.priorHospiceAvailableCap = priorAvailableCap < 0
          ? "0.00"
          : priorAvailableCap.toFixed(2);

        // Calculate post-discharge (EOC) caps using admitted FY's cap and RHC rate
        if (postDischargeDays > 0) {
          const postDischargeAllowedCap =
            (postDischargeDays / totalDaysIncludingPrior) * item.firstPeriodCap;
          item.postDischargeAllowedCap = parseFloat(postDischargeAllowedCap).toFixed(2);
          item.postDischargeUsedCap = this.calculateClaim(postDischargeDays, rates);
          item.postDischargeAvailableCap = parseFloat(
            parseFloat(item.postDischargeAllowedCap) -
              parseFloat(item.postDischargeUsedCap)
          ).toFixed(2);
          item.postDischargeDays = postDischargeDays;
        } else {
          item.postDischargeAllowedCap = "0.00";
          item.postDischargeUsedCap = "0.00";
          item.postDischargeAvailableCap = "0.00";
          item.postDischargeDays = 0;
        }

        if (secondPeriodDays > 0) {
          // Patient spans two FY periods - calculate used cap for each period using FY-specific rates
          item.firstPeriodDays = firstPeriodDays;
          item.secondPeriodDays = secondPeriodDays;

          // Calculate used cap with FY-specific rates
          item.usedCapFirstPeriod = this.calculateClaim(firstPeriodDays, rates);
          item.usedCapSecondPeriod = this.calculateClaim(secondPeriodDays, secondRates);

          // Calculate apportioned allowed cap for current patient (including prior days in total)
          const firstPctAvailable =
            (firstPeriodDays / totalDaysIncludingPrior) * item.firstPeriodCap;
          const secondPctAvailable =
            (secondPeriodDays / totalDaysIncludingPrior) * item.secondPeriodCap;
          item.allowedCapFirstPeriod = parseFloat(firstPctAvailable).toFixed(2);
          item.allowedCapSecondPeriod = parseFloat(secondPctAvailable).toFixed(2);

          // Calculate current patient's available cap
          const currentAvailableFirst = parseFloat(
            parseFloat(item.allowedCapFirstPeriod) -
              parseFloat(item.usedCapFirstPeriod)
          ).toFixed(2);
          const currentAvailableSecond = parseFloat(
            parseFloat(item.allowedCapSecondPeriod) -
              parseFloat(item.usedCapSecondPeriod)
          ).toFixed(2);

          // Include prior hospice available cap in total (only if positive)
          item.availableCapFirstPeriod = parseFloat(
            parseFloat(currentAvailableFirst) +
              parseFloat(item.priorHospiceAvailableCap)
          ).toFixed(2);
          item.availableCapSecondPeriod = currentAvailableSecond;
        } else {
          // Patient stays within one FY period
          item.firstPeriodDays = dayCares;
          item.secondPeriodDays = 0.0;
          item.usedCapFirstPeriod = item.totalClaim;

          // Calculate apportioned allowed cap for current patient (including prior days in total)
          const allowedCap =
            (dayCares / totalDaysIncludingPrior) * item.firstPeriodCap;
          item.allowedCapFirstPeriod = parseFloat(allowedCap).toFixed(2);

          // Calculate current patient's available cap
          const currentAvailable = parseFloat(
            parseFloat(item.allowedCapFirstPeriod) -
              parseFloat(item.usedCapFirstPeriod)
          ).toFixed(2);

          // Include prior hospice available cap in total (only if positive)
          item.availableCapFirstPeriod = parseFloat(
            parseFloat(currentAvailable) +
              parseFloat(item.priorHospiceAvailableCap)
          ).toFixed(2);

          item.usedCapSecondPeriod = 0.0;
          item.allowedCapSecondPeriod = 0.0;
          item.availableCapSecondPeriod = 0.0;
        }
      } else if (item.hasPriorHospice && item.priorDayCare > 0) {
        // Prior hospice exists but doesn't exceed cap alone
        // Include prior days and post-discharge days in total for apportionment calculation
        const postDischargeDays = parseInt(item.new_hospice_care_day || 0, 10);
        const totalDaysIncludingPrior = dayCares + item.priorDayCare + postDischargeDays;

        // Calculate prior hospice caps using admitted FY's cap and RHC rate
        const priorAllowedCap =
          (item.priorDayCare / totalDaysIncludingPrior) * item.firstPeriodCap;
        item.priorHospiceAllowedCap = parseFloat(priorAllowedCap).toFixed(2);
        item.priorHospiceUsedCap = this.calculateClaim(item.priorDayCare, rates);

        // Calculate prior hospice available cap
        const priorAvailableCap = parseFloat(
          parseFloat(item.priorHospiceAllowedCap) -
            parseFloat(item.priorHospiceUsedCap)
        );

        // If negative, set to zero (don't transfer negative cap)
        item.priorHospiceAvailableCap = priorAvailableCap < 0
          ? "0.00"
          : priorAvailableCap.toFixed(2);

        // Calculate post-discharge (EOC) caps using admitted FY's cap and RHC rate
        if (postDischargeDays > 0) {
          const postDischargeAllowedCap =
            (postDischargeDays / totalDaysIncludingPrior) * item.firstPeriodCap;
          item.postDischargeAllowedCap = parseFloat(postDischargeAllowedCap).toFixed(2);
          item.postDischargeUsedCap = this.calculateClaim(postDischargeDays, rates);
          item.postDischargeAvailableCap = parseFloat(
            parseFloat(item.postDischargeAllowedCap) -
              parseFloat(item.postDischargeUsedCap)
          ).toFixed(2);
          item.postDischargeDays = postDischargeDays;
        } else {
          item.postDischargeAllowedCap = "0.00";
          item.postDischargeUsedCap = "0.00";
          item.postDischargeAvailableCap = "0.00";
          item.postDischargeDays = 0;
        }

        if (secondPeriodDays > 0) {
          // Patient spans two FY periods
          item.firstPeriodDays = firstPeriodDays;
          item.secondPeriodDays = secondPeriodDays;

          // Calculate used cap with FY-specific rates
          item.usedCapFirstPeriod = this.calculateClaim(firstPeriodDays, rates);
          item.usedCapSecondPeriod = this.calculateClaim(secondPeriodDays, secondRates);

          // FY apportionment including prior days in denominator
          const firstPctAvailable =
            (firstPeriodDays / totalDaysIncludingPrior) * item.firstPeriodCap;
          const secondPctAvailable =
            (secondPeriodDays / totalDaysIncludingPrior) * item.secondPeriodCap;
          item.allowedCapFirstPeriod = parseFloat(firstPctAvailable).toFixed(2);
          item.allowedCapSecondPeriod = parseFloat(secondPctAvailable).toFixed(2);

          // Calculate available cap for current patient
          const currentAvailableFirst = parseFloat(
            parseFloat(item.allowedCapFirstPeriod) -
              parseFloat(item.usedCapFirstPeriod)
          ).toFixed(2);
          const currentAvailableSecond = parseFloat(
            parseFloat(item.allowedCapSecondPeriod) -
              parseFloat(item.usedCapSecondPeriod)
          ).toFixed(2);

          // Include prior hospice available cap in total (transfer patient)
          item.availableCapFirstPeriod = parseFloat(
            parseFloat(currentAvailableFirst) +
              parseFloat(item.priorHospiceAvailableCap)
          ).toFixed(2);
          item.availableCapSecondPeriod = currentAvailableSecond;
        } else {
          // Patient stays within one FY period
          item.firstPeriodDays = dayCares;
          item.secondPeriodDays = 0.0;
          item.usedCapFirstPeriod = item.totalClaim;

          // Apportion based on current days vs total days including prior
          const allowedCap =
            (dayCares / totalDaysIncludingPrior) * item.firstPeriodCap;
          item.allowedCapFirstPeriod = parseFloat(allowedCap).toFixed(2);

          // Calculate available cap for current patient
          const currentAvailable = parseFloat(
            parseFloat(item.allowedCapFirstPeriod) -
              parseFloat(item.usedCapFirstPeriod)
          ).toFixed(2);

          // Include prior hospice available cap in total (transfer patient)
          item.availableCapFirstPeriod = parseFloat(
            parseFloat(currentAvailable) +
              parseFloat(item.priorHospiceAvailableCap)
          ).toFixed(2);

          item.usedCapSecondPeriod = 0.0;
          item.allowedCapSecondPeriod = 0.0;
          item.availableCapSecondPeriod = 0.0;
        }
      } else if (secondPeriodDays > 0) {
        // No prior hospice, patient spans two FY periods
        // Include post-discharge days in total for apportionment
        const postDischargeDays = parseInt(item.new_hospice_care_day || 0, 10);
        const totalDaysWithPost = dayCares + postDischargeDays;

        // Calculate claims using FY-specific rates
        item.usedCapFirstPeriod = this.calculateClaim(firstPeriodDays, rates);
        item.usedCapSecondPeriod = this.calculateClaim(secondPeriodDays, secondRates);

        const firstPctAvailable =
          (firstPeriodDays / totalDaysWithPost) * item.firstPeriodCap;
        const secondPctAvailable =
          (secondPeriodDays / totalDaysWithPost) * item.secondPeriodCap;
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

        // Calculate post-discharge (EOC) caps
        if (postDischargeDays > 0) {
          const postDischargeAllowedCap =
            (postDischargeDays / totalDaysWithPost) * item.firstPeriodCap;
          item.postDischargeAllowedCap = parseFloat(postDischargeAllowedCap).toFixed(2);
          item.postDischargeUsedCap = this.calculateClaim(postDischargeDays, rates);
          item.postDischargeAvailableCap = parseFloat(
            parseFloat(item.postDischargeAllowedCap) -
              parseFloat(item.postDischargeUsedCap)
          ).toFixed(2);
          item.postDischargeDays = postDischargeDays;
        } else {
          item.postDischargeAllowedCap = "0.00";
          item.postDischargeUsedCap = "0.00";
          item.postDischargeAvailableCap = "0.00";
          item.postDischargeDays = 0;
        }
      } else {
        // No prior hospice, patient in one FY period
        // Include post-discharge days in total for apportionment
        const postDischargeDays = parseInt(item.new_hospice_care_day || 0, 10);
        const totalDaysWithPost = dayCares + postDischargeDays;

        item.firstPeriodDays = dayCares;
        item.secondPeriodDays = 0.0;
        item.usedCapFirstPeriod = item.totalClaim;

        // If post-discharge days exist, use apportionment
        if (postDischargeDays > 0) {
          const allowedCap = (dayCares / totalDaysWithPost) * item.firstPeriodCap;
          item.allowedCapFirstPeriod = parseFloat(allowedCap).toFixed(2);

          // Calculate post-discharge (EOC) caps
          const postDischargeAllowedCap =
            (postDischargeDays / totalDaysWithPost) * item.firstPeriodCap;
          item.postDischargeAllowedCap = parseFloat(postDischargeAllowedCap).toFixed(2);
          item.postDischargeUsedCap = this.calculateClaim(postDischargeDays, rates);
          item.postDischargeAvailableCap = parseFloat(
            parseFloat(item.postDischargeAllowedCap) -
              parseFloat(item.postDischargeUsedCap)
          ).toFixed(2);
          item.postDischargeDays = postDischargeDays;
        } else {
          // No post-discharge days - patient gets full FY cap
          item.allowedCapFirstPeriod = item.firstPeriodCap;
          item.postDischargeAllowedCap = "0.00";
          item.postDischargeUsedCap = "0.00";
          item.postDischargeAvailableCap = "0.00";
          item.postDischargeDays = 0;
        }

        item.availableCapFirstPeriod = parseFloat(
          parseFloat(item.allowedCapFirstPeriod) - parseFloat(item.usedCapFirstPeriod)
        ).toFixed(2);
        item.usedCapSecondPeriod = 0.0;
        item.allowedCapSecondPeriod = 0.0;
        item.availableCapSecondPeriod = 0.0;
      }

      // EXCEPTION: When benefits is 3 or more WITHOUT prior hospice, available cap = negative of used cap
      // If there IS prior hospice, use the apportionment logic above instead
      if (benefitCount >= 3 && !item.hasPriorHospice) {
        item.availableCapFirstPeriod = parseFloat(
          -parseFloat(item.usedCapFirstPeriod)
        ).toFixed(2);
        if (item.secondPeriodDays > 0) {
          item.availableCapSecondPeriod = parseFloat(
            -parseFloat(item.usedCapSecondPeriod)
          ).toFixed(2);
        }
      }
    });

    return items;
  }
}

export default MedicareHandler;
