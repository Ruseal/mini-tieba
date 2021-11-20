import formatDate from './format-date'

export default (time) => {
  let timer = new Date().getTime() - new Date(time).getTime();
  let date = new Date(new Date(time).getTime());
  if (timer > 1000 * 60 * 60 * 24) {
    return formatDate(date, "yyyy-MM-dd");
  } else {
    if (timer > 1000 * 60 * 60) {
      return ~~(timer / 1000 / 60 / 60) + "小时前";
    } else if (timer > 1000 * 60) {
      return ~~(timer / 1000 / 60) + "分钟前";
    } else {
      return "刚刚";
    }
  }

}