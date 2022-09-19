# DI 系统

## ProviderStore
1. 依赖仓库，管理所有的依赖项目
2. proverty
   1. provideMap
      1. 已经实例化的依赖
   2. provideSet
      1. 所有依赖
   3. parentProvider
3. method
   1. addProvider
      1. 将依赖项添加到 provideSet
   2. getProvider
      1. 从 store 返回依赖实例
      2. 没有实例化的会先实例化，添加到 provideMap 之后，再返回
   3. detectProvider
      1. 检查 provideSet 有无某个 provider
   4. instanceProvider 和 instance
      1. 执行 provider 的实例化

## InjectionToken
1. 创建令牌（当要注入的类型无法确定时使用）

## Inject

1. 根据令牌寻找依赖