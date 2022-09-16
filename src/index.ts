import { Injectable } from "./di/decorator";
import { ProviderStore } from "./di/providerStore";

@Injectable()
class H {
  constructor() {}
  hi() {}
}
  

@Injectable()
class Test {
  constructor(
    private h: H,
    private str: string
  ) {}

  say() {
    console.log('hello');
  }
}

const providerStore = new ProviderStore(null, [{
  provider: Test,
  useClass: Test
}, {
  provider: H,
  useClass: H
}]);

// console.log(providerStore)

// const inst = providerStore.getProvider(Test);
// console.log(inst)