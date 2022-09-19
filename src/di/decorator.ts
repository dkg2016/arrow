import { ANNOTATIONS } from "../util"
import { ProviderStore } from "./providerStore";

// 标记注入类
export function Injectable () {
  return (target: new (...args: any) => any) => {
    target.prototype[ANNOTATIONS] = {
      check: true
    }
    return target;
  }
}

@Injectable()
export class InjectionToken {
  constructor(
    protected _desc: string
  ) {}

  toString() {
    return `InjectionToken ${this._desc}`
  }
}


export class Injector {
  constructor(
    private store: ProviderStore
  ) {}

  get(provider: any) {
    return this.store.getProvider(provider);
  }
}