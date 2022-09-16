import { ANNOTATIONS } from "../util"

// 标记注入类
export function Injectable () {
  return (target: new (...args: any) => any) => {
    target.prototype[ANNOTATIONS] = {
      check: true
    }
    return target;
  }
}