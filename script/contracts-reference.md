# 合约部署参考

本文档记录了 Jouleverse 主网核心合约的部署信息，供 PoWh 执行人等参考。

## 核心合约地址

| 合约 | 标签 | 地址 | 源码 |
|------|------|------|------|
| WJ (Wrapped Joule) | 核心激励代币 | `0x7fba9BB966189Db8C4fE33B7bf67Bfa24203c6AD` | `WJ.sol` |
| Timelock Core | 核心时间锁 | `0x628beb88dD440A8c5e4cC89Ab33a041f521e4323` | `Timelock.sol` |
| Timelock Eco | 生态时间锁 | `0xbb6b53Fadf85B73258cb6A54F1343Ac4D5F99773` | `Timelock.sol` |
| 创世金库多签 (GT) | 创世金库 | `0x3B717119878E2db1AA7df46F5AdcF9766A01706F` | `multisig-wallet.sol` |

## WJ 合约 ABI

空投脚本和 calldata 生成需要使用 WJ 合约 ABI。WJ 是 ERC20 兼容代币，核心函数：

- `transfer(to, value)` — 转账 WJ
- `balanceOf(account)` — 查询余额
- `depositTo(to)` — 将 J 包装为 WJ 并转入指定地址（payable）
- `withdrawTo(to, value)` — 将 WJ 解包为 J 并转出
- `approve(spender, value)` — 授权

完整 ABI 定义见区块浏览器源码：
- https://jscan.jnsdao.com/scripts/misc/wj.erc20.js

## Timelock Core 合约参数

| 参数 | 值 |
|------|-----|
| 管理员 | 创世金库多签 (`0x3B7171...`) |
| 延迟 (delay) | 172800 秒（2天） |
| 月度预算 (MONTHLY_BUDGET) | 12000000 J (1200万) |
| 宽限期 (GRACE_PERIOD) | 14 天 |

Timelock 核心函数：
- `queueTransaction(target, value, signature, data, eta)` — 排队事务
- `executeTransaction(target, value, signature, data, eta)` — 执行事务
- `cancelTransaction(target, value, signature, data, eta)` — 取消事务
- `getTransactionHash(target, value, signature, data, eta)` — 计算事务哈希
- `queuedTransactions(bytes32 hash)` — 查询排队状态

完整 ABI 见区块浏览器源码：
- https://jscan.jnsdao.com/scripts/misc/timelock.js

## 执行操作地址

| 用途 | 地址 |
|------|------|
| PoWh 执行操作地址 | `0xE64CA0869227e66fFbEe9d2cF395D96289C11c0e` |

## 创世金库多签人

| 多签人 | 权限地址 |
|--------|---------|
| 教链 | `0xB313C0de794F530Ab08e0a71C31Ee022e875Fe76` |
| Jacky | `0xA2029982158382E5f60E7df51593a6309Bc9Ba1c` |
| Koant | `0x3bD7F1E5C4b059a85a7b2F0a91934fB6A28e7104` |
| 谢勇 | `0xb23823CBE3962aed787fAfbc2a5B907c0F4d1489` |
| Jeff | `0x5d1CA5f6506272A81BEdB830a47981ad73eE21BB` |

> 当前多签配置: 3/5（3人确认生效，共5位多签人）

## 地址编码格式

Jouleverse 支持两种地址编码格式：

| 格式 | 说明 | 示例 |
|------|------|------|
| hex | 标准以太坊式 `0x...` | `0x5BF50F2931688F886F46f88D5CEEDE530bB92076` |
| b32 | Bech32m 编码 `j3...` | `j3t06s72f3dz8csm6xlzx4emk72v9mjgrk6p0qxd` |
| full | 汉字编码 `J3...` | `J3前宽百现教数社始议成高A7UM` |

hex ↔ b32 转换工具：`script/jvaddress.js`

```js
// 在浏览器控制台或 Node.js 中：
// hex → b32
decodeJVA("j3t06s72f3dz8csm6xlzx4emk72v9mjgrk6p0qxd").hexAddress
// "0x5bf50f2931688f886f46f88d5ceede530bb92076"

// b32 → hex
encodeJVA("0x5BF50F2931688F886F46f88D5CEEDE530bB92076").b32Address
// "j3t06s72f3dz8csm6xlzx4emk72v9mjgrk6p0qxd"
```

> 注意：空投脚本鼓励使用 b32 格式地址，搭配 `jvaddress.js` 在运行前转换。
