import moment from "moment";

/**
 * Reusable utility to calculate current benefit period for a patient
 * Can be used across the application and for batch updates
 */
class BenefitPeriodCalculator {
  /**
   * Calculate the current benefit period for a patient
   * @param {Object} patient - Patient object with soc, eoc, admitted_benefits_period
   * @returns {number} Current benefit period number
   */
  static getCurrentBenefitPeriod(patient) {
    if (!patient || !patient.soc) return null;

    const socDate = moment(patient.soc);
    const admittedBenefit = parseInt(patient.admitted_benefits_period || 1);

    // Determine the comparison date (EOC if exists, otherwise today)
    const comparisonDate = patient.eoc ? moment(patient.eoc) : moment();

    // Calculate all benefit periods starting from admitted benefit
    const benefitPeriods = this.calculateBenefitPeriods(socDate, admittedBenefit);

    // Find which benefit period the comparison date falls into
    const currentBenefit = this.findCurrentBenefit(benefitPeriods, comparisonDate, admittedBenefit);

    return currentBenefit;
  }

  /**
   * Calculate all benefit periods starting from SOC
   * @param {Moment} socDate - Start of care date
   * @param {number} admittedBenefit - Admitted benefit period number
   * @returns {Array} Array of benefit period objects
   */
  static calculateBenefitPeriods(socDate, admittedBenefit) {
    const periods = [];
    let currentDate = moment(socDate);

    // We need to calculate enough periods to cover potential EOC dates
    // Start from admitted benefit and calculate extra periods
    const totalPeriodsToCalculate = admittedBenefit + 10;

    for (let i = admittedBenefit; i <= totalPeriodsToCalculate; i++) {
      let daysInPeriod = 0;

      if (i === 1 || i === 2) {
        // First and second benefit periods: 90 days each
        daysInPeriod = 90;
      } else {
        // Third and subsequent benefit periods: 60 days each
        daysInPeriod = 60;
      }

      const endDate = moment(currentDate).add(daysInPeriod - 1, "days");

      periods.push({
        benefitNumber: i,
        startDate: currentDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        daysInPeriod: daysInPeriod,
      });

      // Next period starts the day after this period ends
      currentDate = moment(endDate).add(1, "days");
    }

    return periods;
  }

  /**
   * Find which benefit period a given date falls into
   * @param {Array} periods - Array of benefit period objects
   * @param {Moment} comparisonDate - Date to check
   * @param {number} admittedBenefit - Admitted benefit period number (minimum)
   * @returns {number} Benefit period number
   */
  static findCurrentBenefit(periods, comparisonDate, admittedBenefit) {
    for (let period of periods) {
      const periodStart = moment(period.startDate);
      const periodEnd = moment(period.endDate);

      // Check if comparisonDate falls within this period (inclusive)
      if (
        comparisonDate.isSameOrAfter(periodStart, "day") &&
        comparisonDate.isSameOrBefore(periodEnd, "day")
      ) {
        return period.benefitNumber;
      }
    }

    // If we've gone past all calculated periods, return the last one
    // This ensures current benefit is always >= admitted benefit
    return periods[periods.length - 1].benefitNumber;
  }

  /**
   * Batch calculate current benefits for multiple patients
   * @param {Array} patients - Array of patient objects
   * @returns {Array} Array of patients with computed current_benefits field
   */
  static batchCalculateCurrentBenefits(patients) {
    return patients.map((patient) => ({
      ...patient,
      current_benefits: this.getCurrentBenefitPeriod(patient),
    }));
  }

  /**
   * Get benefit period details for a patient
   * @param {Object} patient - Patient object
   * @returns {Object} Detailed benefit period information
   */
  static getBenefitPeriodDetails(patient) {
    if (!patient || !patient.soc) return null;

    const currentBenefit = this.getCurrentBenefitPeriod(patient);
    const socDate = moment(patient.soc);
    const admittedBenefit = parseInt(patient.admitted_benefits_period || 1);
    const periods = this.calculateBenefitPeriods(socDate, admittedBenefit);

    const currentPeriod = periods.find((p) => p.benefitNumber === currentBenefit);

    return {
      currentBenefitNumber: currentBenefit,
      admittedBenefitNumber: admittedBenefit,
      currentPeriodStart: currentPeriod ? currentPeriod.startDate : null,
      currentPeriodEnd: currentPeriod ? currentPeriod.endDate : null,
      daysInCurrentPeriod: currentPeriod ? currentPeriod.daysInPeriod : null,
      hasEOC: !!patient.eoc,
      eocDate: patient.eoc || null,
    };
  }
}

export default BenefitPeriodCalculator;
