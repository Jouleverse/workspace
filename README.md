# 简介

本知识库用于管理Jouleverse的核心工作和激励机制。Core work package management and incentive for proof-of-working-hours (PoWh).

参与核心工作的人被称为“核心贡献者”（core contributors）列表和参与方法，请参见 [Core Contributors](core-contributors.md)

# 目标和原则

目标：

通过20%释放的J，完全地、定向地向核心贡献者分发，换来核心价值创造，即J价值的持续增加。更进一步的，通过核心价值创造，撬动80%的生态价值增量，促进J价值的指数级增长。

原则：
* 按劳分配
* 关注价值增量

要做的：
* 加法：持续引入创造价值增量的工作
* 减法：持续优化去除不能带来价值增量的工作或不合理机制

参考阅读：[如何为Jouleverse做贡献并获得激励](https://how.jouleverse.com/#!incentive/how-to-contribute-to-jouleverse.md)

# 工作包管理机制

1. 工作包的编号：WP-xxx （其中 xxx 是一个数字，在创建 github issue 时自动生成）
2. 每个工作包对应一个唯一的 github issue，位置在 Jouleverse / workspace / Issues，使用 github 管理
3. 工作包的生命周期：
    1. 提议（此时创建issue，获得编号xx
    2. PoWh委员会初审（提出修改建议，提议人修改【多轮】；必要时须邀请相关专家顾问提供意见），而后提交议会（CGC）审议、批准
    3. 委员会修订 Work Package Specs，纳入该新工作包
    4. 委员会监督执行（配合每月激励机制）
   
目前active的工作包及其规范，请参见 [Work Package Specs](work-package-specs.mediawiki)

历史工作量统计及激励发放数据表：

 **统计月份** | **统计人** | **审计人** | **执行人** | **执行日期**
 -|-|-|-|-
[2022.10-2023.8](data/powh-data-202210-to-202308.mediawiki) | 教链 | | 教链 | 2023
[2023.9](data/powh-data-202309.mediawiki) | 教链 | | 教链 | 2023.12.5
[2023.10](data/powh-data-202310.mediawiki) | Koant | | 教链 | 2023.12.10
[2023.11](data/powh-data-202311.mediawiki) | 岑云 | | 教链 | 2024.1.19
[2023.12](data/powh-data-202312.mediawiki) | Koant | | 教链 | 2024.1.30
[2024.01](data/powh-data-202401.mediawiki) | 教链 | | 教链 | 2024.2.16
[2024.02](data/powh-data-202402.mediawiki) | 星际 | | 教链 | 2024.4.3
[2024.03](data/powh-data-202403.mediawiki) | 岑云| | Koant | 2024.5.29
[2024.04](data/powh-data-202404.mediawiki) | Koant | | 教链 | 2024.6.5
[2024.05](data/powh-data-202405.mediawiki) | 剪云为裳 | | Koant | 2024.7.16
[2024.06](data/powh-data-202406.mediawiki) | 福 | | 谢勇 | 2024.9.2
[2024.07](data/powh-data-202407.mediawiki) | 煜歌 | | Jeff | 2024.10.17
[2024.08](data/powh-data-202408.mediawiki) | 教链 | | Koant | 2024.12.1
[2024.09](data/powh-data-202409.mediawiki) | 星际 | Koant | Koant | 2025.04.02
[2024.10](data/powh-data-202410.mediawiki) | Koant | cijin | Koant | 2025.04.02
[2024.11](data/powh-data-202411.mediawiki) | 明海云 | Koant | Koant | 2025.04.02
[2024.12](data/powh-data-202412.mediawiki) | 剪云为裳 | Koant | Koant | 2025.04.02
[2025.01](data/powh-data-202501.mediawiki) | cijin | Koant | - | -
[2025.02](data/powh-data-202502.mediawiki) | cijin | Koant | -  | -
[2025.03](data/powh-data-202503.mediawiki) | 剪云为裳 | Koant | - | -
[2025.04](data/powh-data-202505.mediawiki) | 微尘 | Koant | - | -
[2025.05](data/powh-data-202506.mediawiki) | 微尘 | Koant | - | -
[2025.06](data/powh-data-202507.mediawiki) | 微尘 | Koant | - | -

# 预算机制和空投执行指南

1. 自2024.5 PoWh起，采用Timelock合约控制创世金库中20%的core部分，并约束预算释放，每月1200万J，合约算法写死，不可修改、调整。
2. Timelock core合约暂挂钩[「创世金库多签合约」](https://github.com/jouleverse/genesis-treasury/)控制，即，每月须由「创世金库多签合约」向Timelock core合约提交预算动用申请。数量上限则受释放量约束。未来core的治理进一步成型，且进化到链上治理后，可考虑废弃「创世金库多签合约」，改由core governance合约与Timelock core交互。
3. 空投发放暂仍由 PoWh委员会 - 执行组 负责从Timelock core接收预算拨付并执行空投发放工作。未来可能考虑编写更高级的空投合约等。

目前，PoWh委员会 - 执行组 如何执行空投发放工作呢？可参考以下步骤进行：

> 第一步，合约工具 => WJ => depositTo：address填接收WJ的地址，勾选Dry Run，点击执行，获取calldata(1) 例如：0xb760faf9000000000000000000000000b313c0de794f530ab08e0a71c31ee022e875fe76

> 第二步，合约工具 => Timelock核心 => queueTransaction：target填WJ合约的地址(0x7fba9BB966189Db8C4fE33B7bf67Bfa24203c6AD)，value填划拨预算(wei)的数量(例如：1200万J = 12000000000000000000000000)，signature留空（一定要留空，什么都别填，不要填空格或""），data填写第一步得到的calldata(1)，eta填2天后的一个时间戳(区块浏览器首页查看一下最新区块的时间戳，比如1720676751，加上60小时——多加12h留给其他多签人操作——对应的秒数216000，得到1720676751 + 60 * 3600 = 1720892751)，勾选Dry Run，点击执行，获得calldata(2) 例如：0x3a66f9010000000000000000000000007fba9bb966189db8c4fe33b7bf67bfa24203c6ad00000000000000000000000000000000000000000009ed194db19b238c00000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000006692bd4f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024b760faf9000000000000000000000000b313c0de794f530ab08e0a71c31ee022e875fe7600000000000000000000000000000000000000000000000000000000

> 第三步，合约工具 => 创世金库(多签) => submitTransaction：destination填Timelock核心的合约地址(0x628beb88dD440A8c5e4cC89Ab33a041f521e4323)，value填0，data填第二步得到的calldata(2)，不要勾选Dry Run，点击执行，在弹出的Metamask中确认签名上链。在合约工具控制台中，找到多签提交上链后，返回的事务编号。

> 上链成功后，通过创世金库(多签)的 transactions 方法 + 刚刚提交的多签事务编号，查询提交的数据，是否与第二步的数据匹配。

> 记录下事务编号，以及Timelock核心合约地址的Joule余额，在群里通知其他多签人在12小时内通过 合约工具 => 创世金库(多签) => confirmTransaction + 事务编号 确认该事务。

多签成功执行后，可以使用timelock核心合约的queuedTransactions方法，输入排队的事务hash，看看状态是不是 true （已排队），确认一下排队状态。其中，事务hash可以用timelock核心合约的getTransactionHash方法，输入第二步提交排队的参数，就可以算出哈希值。

这时候预算申请就已经进入排队等待了。第二步的参数务必记牢。在日历上订一个延时到期时间的闹钟，提醒自己，到期后，继续向下操作第四步。

> 第四步，60小时之后，申请执行预算拨款。合约工具 => Timelock核心 => executeTransaction。各参数填入与第二步完全一致的参数！注意必须完全一致！勾选Dry run，点击执行，获得calldata(4)

> 第五步，合约工具 => 创世金库(多签) => submitTransaction：destination填Timelock核心的合约地址(0x628beb88dD440A8c5e4cC89Ab33a041f521e4323)，value填0，data填第四步得到的calldata(4)，不要勾选Dry Run，点击执行，在弹出的Metamask中确认签名上链。在合约工具控制台中，找到多签提交上链后，返回的事务编号。

> 上链成功后，通过创世金库(多签)的 transactions 方法 + 刚刚提交的多签事务编号，查询提交的数据，是否与第四步的数据匹配。

> 记录下事务编号，以及Timelock核心合约地址的Joule余额，在群里通知其他多签人在12小时内通过 合约工具 => 创世金库(多签) => confirmTransaction + 事务编号 确认该事务。

> 待最后一位多签人确认完成后，检查事务是否已成功执行。若成功执行，检查timelock核心合约地址的Joule余额，是否扣减了正确的数量。以及检查WJ接收地址是否收到了正确数量的WJ。

> 各项数值检查确认无误后，更新github 创世金库记账表，登记该笔预算支出。


# PoWh委员会

| *届* | *任期开始* | *任期结束* | *成员* |
|-|-|-|-|
| 1 | 2023 | - | 1. 教链 2. Koant 3. 岑云 |
| 2 | - | - | 标准组：教链, Koant, 岑云 <br> 统计组：剪云为裳，星际，岑云，Koant，教链 <br> 执行组：Koant，教链 |
| 3 | 2025.3 | - | 审计组：Koant, 此今, 教链 <br> 执行组：Koant，Jeff，谢勇，教链 |

说明：
- 明确powh repo（即本workspace repo )的最高权限由maintainers执掌。采取core民主产生。目前的maintainers有三位：Koant，此今，教链
- 【审计组】（由本repo的maintainers担任）负责review（审查）所有的PR贡献内容（主要是每月统计数据），无误后merge（合并），提交给执行组执行WJ发放
- 【执行组】（由创世多签钱包的多签人担任）负责从core timelock里申请预算，执行WJ发放工作，更新预算使用和发放情况到github相应页面进行存档公示
- 不再设置专门的【统计组】，开放参与，轮值
- 原【标准组】撤销，相关工作（负责吸收标准优化意见，编辑文档，提交CGC审议通过）由maintainers担当起来

委员会的工作职责：
1. 激励机制的梳理和审查、优化，持续剔除低价值工作，突出高价值工作，并确保分配机制与价值创造成正比例
2. 每月按既定PoWh计算标准统计工作量（工时数），提交议会（CGC，包括核心贡献者及其他J投票权持有者）review & approve后定稿
3. 按照定稿的统计工作量执行激励的发放

委员会的任免和改组：由CGC掌握此项权力

# 工作语言

简体中文，英文

# 版权

CC0
