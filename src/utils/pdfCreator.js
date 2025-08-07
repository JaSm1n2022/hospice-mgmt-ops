class PdfCreator {
  /**
   * @param {String | Date} date -
   * @param {Boolean} withDay -
   * @returns {String} -  Aug 6, 2007
   */

  static calculateDaysInStorage(soc, eoc) {
    const start = moment(soc);
    const end = eoc ? moment(eoc) : moment();
    const diff = moment.duration(end.diff(start));

    return Math.floor(diff.asDays(), 10);
  }
  static generateRecordId() {
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return customAlphabet(alphabet, 8);
  }
}

export default PdfCreator;
