import { Fn, ProviderConfig } from "../model";
import "reflect-metadata";
import { ANNOTATIONS } from "../util";

export class ProviderStore {
  
  private provideMap: Map<any, any>;
  private provideSet: Set<ProviderConfig>;
  private parentProvider: ProviderStore | null;
  constructor(
    parentProvider: ProviderStore | null,
    providerList?: ProviderConfig[]
  ) {
    this.provideMap = new Map();
    this.provideSet = new Set();
    this.parentProvider = parentProvider;
    if (providerList?.length) {
      providerList.forEach(provider => {
        this.addProvider(provider);
      });
    }
  }

  addProvider(provider: ProviderConfig) {
    this.provideSet.add(formatProvider(provider));
  }

  getProvider<T>(key: Fn<T> | ProviderConfig): T {
    const targetProvider = this.detectProvider(key as ProviderConfig);
    if (targetProvider) {
      let providerInstance = this.provideMap.get(targetProvider.provider);
      if (!providerInstance) {
        this.instanceProvider([targetProvider]);
        providerInstance = this.provideMap.get(targetProvider.provider)
      }

      return providerInstance;

    } else {
      return this.parentProvider!.getProvider(key);
    }
  }

  private detectProvider(provider: ProviderConfig) {
    const currentproviderList = Array.from(this.provideSet);
    const formatedProvider = formatProvider(provider);
    const targetProvider = currentproviderList.find(item => item.provider === formatedProvider.provider || item.provider === formatedProvider);
    if (targetProvider) {
      return targetProvider;
    } else if (!targetProvider && !this.parentProvider) {
      const providerName = formatedProvider.provider ? formatedProvider.provider.name : formatedProvider.provider._desc;
      throw new Error(`Cannot instanize ${providerName} service, please add ${providerName} to the provider list.`);
    } else if (!targetProvider && this.parentProvider) {
      // ???
      return targetProvider;
    }
  }

  private instanceProvider(providerList: ProviderConfig[]) {
    const sortList = this.sort(providerList);

    sortList.forEach(item => {
      const prototype = typeof item.provider === 'function'
        ? item.provider.prototype
        : Object.getPrototypeOf(item.provider);
      if (!prototype[ANNOTATIONS].check) {
        throw new Error('cannot find ' + item.provider);
      }

      // 执行实例化
      this.provideMap.set(item.provider, this.getProviderInstance(item));
    });
  }

  private getProviderInstance(provider: ProviderConfig) {
    let value;
    if (provider.useClass) {
      value = this.instance(provider.useClass)
    } else if (provider.useValue) {
      value = provider.useValue;
    } else if (provider.useExist) {
      value = this.provideMap.get(provider.provider);
    }

    return value;
  }

  private instance(fn: Fn<any>) {
    let args = Reflect.getMetadata('design:paramtypes', fn) || [];

    const relayedProviders = args.map((arg: any) => {
      let dicfg = this.detectProvider(arg);

      if (arg.prototype[ANNOTATIONS].check) {
        let inst = this.provideMap.get(dicfg?.provider);
        if (!inst) {
          inst = this.getProviderInstance(dicfg as ProviderConfig);
          this.provideMap.set(dicfg?.provider, inst);
        }
        return inst;
      } else {
        throw new Error('cannot find provide:' + arg.prototype[ANNOTATIONS]);
      }
    });

    return new fn(...relayedProviders);
  }

  private sort(providerList: ProviderConfig[]): ProviderConfig[] {
    const normal: ProviderConfig[] = [],
          useValue: ProviderConfig[] = [],
          useClass: ProviderConfig[] = [],
          useExist: ProviderConfig[] = [];
    
    providerList.forEach(item => {
      if (item.useClass) useClass.push(item);
      if (item.useValue) useValue.push(item);
      if (item.useExist) useExist.push(item);
    });
    return normal.concat(useExist, useValue, useClass);
  }
}

export const formatProvider = (provider: ProviderConfig): ProviderConfig => {
  if (typeof provider === 'function') {
    return {
      provider: provider,
      useClass: provider
    }
  } else {
    return provider;
  }
}