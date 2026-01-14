import moment from "moment";

class RecertificationTimelineHandler {
  static mapData(items) {
    return items.map((item) => {
      const soc = moment(item.soc);
      const admittedBenefitsPeriod = parseInt(
        item.admitted_benefits_period || 1
      );

      // Calculate recertification dates, passing patient data for prior hospice consideration
      const recertifications = this.calculateRecertifications(
        soc,
        admittedBenefitsPeriod,
        item
      );

      // Get the current recertification (the one we should display)
      const currentRecert = this.getCurrentRecertification(recertifications);

      // Determine actual benefit period to display (may be higher than admitted if completed)
      const displayBenefitPeriod = currentRecert
        ? currentRecert.benefitPeriod
        : admittedBenefitsPeriod;

      return {
        ...item,
        patientName: `${item.fn || ""} ${item.ln || ""}`.trim(),
        socDate: soc.format("YYYY-MM-DD"),
        admittedBenefitsPeriod,
        displayBenefitPeriod,
        recertifications,
        currentRecertification: currentRecert,
        daysUntilNextRecert: currentRecert
          ? this.calculateDaysUntil(currentRecert.dueDate)
          : null,
      };
    });
  }

  static getCurrentRecertification(recertifications) {
    if (!recertifications || recertifications.length === 0) return null;

    // Find the first non-completed recertification
    const nextRecert = recertifications.find((r) => r.status !== "completed");

    // If all are completed, calculate the next benefit period
    if (!nextRecert) {
      const lastRecert = recertifications[recertifications.length - 1];
      const nextBenefitPeriod = lastRecert.benefitPeriod + 1;
      const nextStartDate = moment(lastRecert.dueDate).add(1, "days");

      // Determine days for next period: 90 days for benefit 1 & 2, 60 days for 3+
      let daysInNextPeriod = 60;
      if (nextBenefitPeriod === 1 || nextBenefitPeriod === 2) {
        daysInNextPeriod = 90;
      }

      const nextDueDate = moment(nextStartDate).add(daysInNextPeriod, "days");

      return {
        benefitPeriod: nextBenefitPeriod,
        startDate: nextStartDate.format("YYYY-MM-DD"),
        dueDate: nextDueDate.format("YYYY-MM-DD"),
        daysInPeriod: daysInNextPeriod,
        status: this.getRecertStatus(nextDueDate),
      };
    }

    return nextRecert;
  }

  static calculateRecertifications(socDate, admittedBenefitPeriod, patient = null) {
    const recerts = [];
    let currentDate = moment(socDate);

    // Start from the admitted benefit period and calculate a few more periods
    // This ensures if admitted benefit is 14, we calculate periods 14, 15, 16, etc.
    const periodsToCalculate = 6; // Calculate 6 periods ahead

    // Check if patient has prior hospice days to account for
    // prior_last_day_care represents days used in the last benefit period at prior hospice
    const priorDaysUsed = patient?.prior_last_day_care || patient?.lastDayCare || 0;
    const hasPriorHospice = patient?.is_prior_hospice || patient?.isPriorHospice || false;

    for (let i = 0; i < periodsToCalculate; i++) {
      const benefitNumber = admittedBenefitPeriod + i;
      let daysToAdd = 0;

      if (benefitNumber === 1 || benefitNumber === 2) {
        // First and second benefit periods: 90 days each
        daysToAdd = 90;
      } else {
        // Third and subsequent benefit periods: 60 days each
        daysToAdd = 60;
      }

      // For the first benefit period at this hospice (admitted benefit period),
      // subtract days already used at prior hospice if benefits are continuing
      if (benefitNumber === admittedBenefitPeriod && hasPriorHospice && priorDaysUsed > 0) {
        daysToAdd = Math.max(1, daysToAdd - priorDaysUsed);
      }

      const dueDate = moment(currentDate).add(daysToAdd, "days");

      recerts.push({
        benefitPeriod: benefitNumber,
        startDate: currentDate.format("YYYY-MM-DD"),
        dueDate: dueDate.format("YYYY-MM-DD"),
        daysInPeriod: daysToAdd,
        priorDaysUsed: benefitNumber === admittedBenefitPeriod && hasPriorHospice ? priorDaysUsed : 0,
        status: this.getRecertStatus(dueDate),
      });

      // Next period starts the day after the due date
      currentDate = moment(dueDate).add(1, "days");
    }

    return recerts;
  }

  static getRecertStatus(dueDate) {
    const today = moment();
    const dueMoment = moment(dueDate);
    const daysUntil = dueMoment.diff(today, "days");

    if (daysUntil < 0) {
      return "completed";
    } else if (daysUntil <= 7) {
      return "urgent";
    } else if (daysUntil <= 14) {
      return "upcoming";
    } else {
      return "scheduled";
    }
  }

  static calculateDaysUntil(dueDate) {
    const today = moment();
    const dueMoment = moment(dueDate);
    return dueMoment.diff(today, "days");
  }
}

export default RecertificationTimelineHandler;
