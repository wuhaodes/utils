/**
 * 设置属性监听器
 * 将Page对象传过来
 */
const setWatcher = (page) => { //接收Page传过来的data和watch对象
  let data = page.data;
  let watch = page.watch;
  Object.keys(watch).forEach(key => { //遍历watch对象内的key值
    let keys = key.split('.');
    let newData = data;
    for (let i = 0; i < keys.length - 1; i++) {
      newData = newData[keys[i]];
    }
    let lastKey = keys[keys.length - 1];
    let watchFun = watch[key].handler || watch[key];
    let deep = watch[key].deep;
    observe(newData, lastKey, watchFun, deep, page); //监听data内的key属性，传入watch内对应函数以调用
  })
}
/**
 * 监听属性 并执行监听函数
 * obj==>要监听的对象
 * key==>要监听的属性
 * watchFun==>监听函数
 * deep==>有没有设置深度监听
 * page==>要监听的页面
 */
const observe = (obj, key, watchFun, deep, page) => {
  let val = obj[key];
  if (deep && val != null && typeof val === 'object') {
    Object.keys(val).forEach(childKey => {
      this.observe(val, childKey, watchFun, deep, page);
    })
  }
  let that = this;
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    set: value => {
      watchFun.call(page, value, val); //赋值前调用监听函数 value是新值，val是旧值
      val = value;
      if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
        that.observe(obj, key, watchFun, deep, page);
      }
    },
    get: () => {
      return val;
    }
  })
}
module.exports = {
  setWatcher: setWatcher
}