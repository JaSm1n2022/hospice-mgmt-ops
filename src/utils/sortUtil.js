/* eslint-disable no-underscore-dangle */

class SortUtil {
  /**
   * @param {String | Date} date -
   * @param {Boolean} withDay -
   * @returns {String} -  Aug 6, 2007
   */
  static sortByAsc(data, attr, isAsc) {
    if (!isAsc) {
      data.sort((a, b) => {
        this._a = a[attr]?.toLowerCase() || "";
        this._b = b[attr]?.toLowerCase() || "";
        if (this._a < this._b) {
          return -1;
        }
        if (this._a > this._b) {
          return 1;
        }
        return 0;
      });
    } else if (isAsc) {
      data.sort((a, b) => {
        this._a = a[attr]?.toLowerCase() || "";
        this._b = b[attr]?.toLowerCase() || "";
        if (this._a > this._b) {
          return -1;
        }
        if (this._a < this._b) {
          return 1;
        }
        return 0;
      });
    }
    return data;
  }
}
export default SortUtil;
