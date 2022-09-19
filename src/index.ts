import { Injectable, InjectionToken, Injector } from "./di/decorator";
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

const K = new InjectionToken('K');

const providerStore = new ProviderStore(null, [
  { provider: Test, useClass: Test },
  { provider: H, useClass: H },
  { provider: H, useExist: Test},
  { provider: K, useValue: {a: 1} },
]);

console.log(providerStore)

const inject = new Injector(providerStore);
console.log(inject.get(K));
