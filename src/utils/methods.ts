export const generateArray = <T>(
  start: number,
  end: number,
  callback: (index: number) => T
) => {
  const array: T[] = [];
  for (let index = start; index <= end; index++) {
    array.push(callback(index));
  }
  return array;
};

interface DateFormatMap {
  "M+": number;
  "d+": number;
  "h+": number;
  "m+": number;
  "s+": number;
  "q+": number;
  S: number;
}

/**
 * @description: 格式化时间
 * @param {Date} date
 * @param {string} fmt "yyyy-MM-dd hh:mm:ss:S q"
 * @return {string}
 */
export const formatDate = (date: Date, fmt: string) => {
  date = new Date(date);
  if (isNaN(date.valueOf())) return "";
  const o: DateFormatMap = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  const regRes = new RegExp("y+").exec(fmt);
  if (regRes?.length) {
    fmt = fmt.replace(
      regRes[0],
      date
        .getFullYear()
        .toString()
        .substring(4 - regRes[0].length)
    );
  }

  for (let k in o) {
    const regRes = new RegExp(k).exec(fmt);
    if (regRes?.length) {
      fmt = fmt.replace(
        regRes[0],
        regRes[0].length === 1
          ? o[k]
          : ("00" + o[k]).substring(o[k].toString().length)
      );
    }
  }

  return fmt;
};
