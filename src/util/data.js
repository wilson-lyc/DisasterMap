import data from '../config/data.json';

/**
 * 根据筛选条件获取灾害数据
 * @param {Object} filter 筛选条件对象，支持以下字段：
 *   - Disaster Type 灾害类型
 *   - Country 国家
 *   - Region 区域
 *   - Start Year 起始年份
 * @returns {Array<Object>} 满足条件的完整数据对象数组
 */
export async function getData(filter = {}) {
  const response = await fetch('/config/data.json');
  const data = await response.json();
  const keys = ['Disaster Type', 'Country', 'Region', 'Start Year'];
  return data.filter(item => {
    return keys.every(key => {
      if (filter[key] === undefined) return true;
      return item[key] === filter[key];
    });
  });
}
