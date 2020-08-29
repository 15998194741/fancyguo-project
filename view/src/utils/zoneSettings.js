/**
 * 深拷贝
 * @param {Array<object>} obj 需要进行深拷贝处理的数组或s对象
 */
export function deepCopy(obj) {
  // 类型检测
  if (obj === null || typeof obj !== 'object') { return obj; }
	
  // 声明结果变量
  let copy = Array.isArray(obj) ? [] : {};
	
  // 递归执行
  Object.keys(obj).forEach(key => {copy[key] = deepCopy(obj[key]);});
	
  // 返回结果变量
  return copy;
}
