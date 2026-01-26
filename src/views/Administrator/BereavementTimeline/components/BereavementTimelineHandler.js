import moment from "moment";

class BereavementTimelineHandler {
  /**
   * Map patient data and calculate bereavement milestones
   * Only includes patients with death discharge within 13 months
   */
  static mapData(items) {
    return items
      .filter((item) => {
        // Only include patients with death discharge
        const hasDeathDischarge =
          item.eoc &&
          item.eoc_discharge &&
          (item.eoc_discharge === "Death Discharge" ||
            item.eoc_discharge.toLowerCase().includes("death"));

        if (!hasDeathDischarge) return false;

        // Determine date of death (prefer new_hospice_dod, fallback to eoc)
        const dateOfDeath = item.new_hospice_dod || item.eoc;
        if (!dateOfDeath) return false;

        // Only include patients within 13 months post-death
        const deathDate = moment(dateOfDeath);
        const today = moment();
        const monthsSinceDeath = today.diff(deathDate, "months", true);

        return monthsSinceDeath <= 13;
      })
      .map((item) => {
        const dateOfDeath = item.new_hospice_dod || item.eoc;
        const deathDate = moment(dateOfDeath);

        // Calculate all bereavement milestones
        const milestones = this.calculateMilestones(deathDate, item);

        return {
          ...item,
          patientName: `${item.fn || ""} ${item.ln || ""}`.trim(),
          dateOfDeath: deathDate.format("YYYY-MM-DD"),
          monthsSinceDeath: moment().diff(deathDate, "months", true),
          milestones,
          bereavementCompleted: this.checkBereavementCompleted(milestones, item),
        };
      })
      .sort((a, b) => {
        // Sort by date of death (most recent first)
        return moment(b.dateOfDeath).diff(moment(a.dateOfDeath));
      });
  }

  /**
   * Calculate all bereavement milestones for a patient
   */
  static calculateMilestones(deathDate, patient) {
    const milestones = [];

    // Month 0: Bereavement Card (7-14 days post death)
    milestones.push({
      month: 0,
      name: "Bereavement Card",
      dueDate: moment(deathDate).add(10, "days").format("YYYY-MM-DD"), // Middle of 7-14 day range
      dueDateRange: "7-14 days",
      completed: patient.bereavement_month_0 || false,
      status: this.getMilestoneStatus(
        moment(deathDate).add(10, "days"),
        patient.bereavement_month_0
      ),
    });

    // Month 1: Follow-up Bereavement Card (30-40 days post death)
    milestones.push({
      month: 1,
      name: "Follow-up Bereavement Card",
      dueDate: moment(deathDate).add(35, "days").format("YYYY-MM-DD"), // Middle of 30-40 day range
      dueDateRange: "30-40 days",
      completed: patient.bereavement_month_1 || false,
      status: this.getMilestoneStatus(
        moment(deathDate).add(35, "days"),
        patient.bereavement_month_1
      ),
    });

    // Month 3: Check-in Card or Letter (90 days post death)
    milestones.push({
      month: 3,
      name: "Check-in Card or Letter",
      dueDate: moment(deathDate).add(90, "days").format("YYYY-MM-DD"),
      dueDateRange: "90 days",
      completed: patient.bereavement_month_3 || false,
      status: this.getMilestoneStatus(
        moment(deathDate).add(90, "days"),
        patient.bereavement_month_3
      ),
    });

    // Month 6: Mid-Year Support Card (6 months post death)
    milestones.push({
      month: 6,
      name: "Mid-Year Support Card",
      dueDate: moment(deathDate).add(6, "months").format("YYYY-MM-DD"),
      dueDateRange: "6 months",
      completed: patient.bereavement_month_6 || false,
      status: this.getMilestoneStatus(
        moment(deathDate).add(6, "months"),
        patient.bereavement_month_6
      ),
    });

    // Month 9: Supportive Outreach (9 months post death)
    milestones.push({
      month: 9,
      name: "Supportive Outreach (Card or Call)",
      dueDate: moment(deathDate).add(9, "months").format("YYYY-MM-DD"),
      dueDateRange: "9 months",
      completed: patient.bereavement_month_9 || false,
      status: this.getMilestoneStatus(
        moment(deathDate).add(9, "months"),
        patient.bereavement_month_9
      ),
    });

    // Month 12: Anniversary Card (1 year post death)
    milestones.push({
      month: 12,
      name: "Anniversary Card",
      dueDate: moment(deathDate).add(1, "year").format("YYYY-MM-DD"),
      dueDateRange: "1 year",
      completed: patient.bereavement_month_12 || false,
      status: this.getMilestoneStatus(
        moment(deathDate).add(1, "year"),
        patient.bereavement_month_12
      ),
    });

    // Month 13: Closure/Transition Letter (13 months post death)
    milestones.push({
      month: 13,
      name: "Closure/Transition Letter",
      dueDate: moment(deathDate).add(13, "months").format("YYYY-MM-DD"),
      dueDateRange: "13 months",
      completed: patient.bereavement_month_13 || false,
      status: this.getMilestoneStatus(
        moment(deathDate).add(13, "months"),
        patient.bereavement_month_13
      ),
    });

    return milestones;
  }

  /**
   * Determine milestone status based on due date and completion
   */
  static getMilestoneStatus(dueDate, completed) {
    if (completed) return "completed";

    const today = moment();
    const dueMoment = moment(dueDate);
    const daysUntil = dueMoment.diff(today, "days");

    if (daysUntil < 0) {
      return "overdue";
    } else if (daysUntil <= 7) {
      return "urgent";
    } else if (daysUntil <= 14) {
      return "upcoming";
    } else {
      return "scheduled";
    }
  }

  /**
   * Check if all bereavement milestones are completed or bereavement is closed
   */
  static checkBereavementCompleted(milestones, patient) {
    // If bereavement_closed is true, mark as completed
    if (patient.bereavement_closed) {
      return true;
    }
    // Otherwise, check if all milestones are completed
    return milestones.every((m) => m.completed);
  }

  /**
   * Calculate days until due date
   */
  static calculateDaysUntil(dueDate) {
    const today = moment();
    const dueMoment = moment(dueDate);
    return dueMoment.diff(today, "days");
  }
}

export default BereavementTimelineHandler;
