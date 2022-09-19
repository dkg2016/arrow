
export interface Fn<T> extends Function {
  new(...args: any): T
}

export interface ProviderConfig {
  provider: any;
  useValue?: object;
  useClass?: Fn<any>;
  useExist?: any;
}
