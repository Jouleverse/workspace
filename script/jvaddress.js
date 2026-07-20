// Jouleverse Address (JVA) - 地址格式转换库
// 
// 来源：https://jscan.jnsdao.com/scripts/crypto/jvaddress.js
// 功能：b32 ↔ hex 地址转换
// 
// 两种格式：
//   b32  - j3 + 38Base32字符 (40字符，全小写)
//   full - J3 + 15汉字 + 5Base32校验字符 (22字符，全大写)
//
// 核心函数：
//   encodeJVA(hexAddress) → { b32Address, fullAddress, ... }
//   decodeJVA(jvaAddress) → { hexAddress, format, ... }
//   validateJVA(jvaAddress) → { valid, hexAddress, ... }
//   formatJVA(jvaAddress) → formatted display

// ============== 常量定义 ==============

// Bech32使用的Base32字符集（原始）
const BECH32_ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

// 大写Base32字符集（用于full格式）
const BECH32_ALPHABET_UPPER = "QPZRY9X8GF2TVDW0S3JN54KHCE6MUA7L";

// Bech32m常数（与Bech32的唯一区别）
const BECH32M_CONST = 0x2bc830a3;

// Bech32生成多项式
const BECH32_GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

// BIP-39 2048个中文字符表（完整）
const BIP39_CHINESE_CHARS = "的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严首底液官德随病苏失尔死讲配女黄推显谈罪神艺呢席含企望密批营项防举球英氧势告李台落木帮轮破亚师围注远字材排供河态封另施减树溶怎止案言士均武固叶鱼波视仅费紧爱左章早朝害续轻服试食充兵源判护司足某练差致板田降黑犯负击范继兴似余坚曲输修故城夫够送笔船占右财吃富春职觉汉画功巴跟虽杂飞检吸助升阳互初创抗考投坏策古径换未跑留钢曾端责站简述钱副尽帝射草冲承独令限阿宣环双请超微让控州良轴找否纪益依优顶础载倒房突坐粉敌略客袁冷胜绝析块剂测丝协诉念陈仍罗盐友洋错苦夜刑移频逐靠混母短皮终聚汽村云哪既距卫停烈央察烧迅境若印洲刻括激孔搞甚室待核校散侵吧甲游久菜味旧模湖货损预阻毫普稳乙妈植息扩银语挥酒守拿序纸医缺雨吗针刘啊急唱误训愿审附获茶鲜粮斤孩脱硫肥善龙演父渐血欢械掌歌沙刚攻谓盾讨晚粒乱燃矛乎杀药宁鲁贵钟煤读班伯香介迫句丰培握兰担弦蛋沉假穿执答乐谁顺烟缩征脸喜松脚困异免背星福买染井概慢怕磁倍祖皇促静补评翻肉践尼衣宽扬棉希伤操垂秋宜氢套督振架亮末宪庆编牛触映雷销诗座居抓裂胞呼娘景威绿晶厚盟衡鸡孙延危胶屋乡临陆顾掉呀灯岁措束耐剧玉赵跳哥季课凯胡额款绍卷齐伟蒸殖永宗苗川炉岩弱零杨奏沿露杆探滑镇饭浓航怀赶库夺伊灵税途灭赛归召鼓播盘裁险康唯录菌纯借糖盖横符私努堂域枪润幅哈竟熟虫泽脑壤碳欧遍侧寨敢彻虑斜薄庭纳弹饲伸折麦湿暗荷瓦塞床筑恶户访塔奇透梁刀旋迹卡氯遇份毒泥退洗摆灰彩卖耗夏择忙铜献硬予繁圈雪函亦抽篇阵阴丁尺追堆雄迎泛爸楼避谋吨野猪旗累偏典馆索秦脂潮爷豆忽托惊塑遗愈朱替纤粗倾尚痛楚谢奋购磨君池旁碎骨监捕弟暴割贯殊释词亡壁顿宝午尘闻揭炮残冬桥妇警综招吴付浮遭徐您摇谷赞箱隔订男吹园纷唐败宋玻巨耕坦荣闭湾键凡驻锅救恩剥凝碱齿截炼麻纺禁废盛版缓净睛昌婚涉筒嘴插岸朗庄街藏姑贸腐奴啦惯乘伙恢匀纱扎辩耳彪臣亿璃抵脉秀萨俄网舞店喷纵寸汗挂洪贺闪柬爆烯津稻墙软勇像滚厘蒙芳肯坡柱荡腿仪旅尾轧冰贡登黎削钻勒逃障氨郭峰币港伏轨亩毕擦莫刺浪秘援株健售股岛甘泡睡童铸汤阀休汇舍牧绕炸哲磷绩朋淡尖启陷柴呈徒颜泪稍忘泵蓝拖洞授镜辛壮锋贫虚弯摩泰幼廷尊窗纲弄隶疑氏宫姐震瑞怪尤琴循描膜违夹腰缘珠穷森枝竹沟催绳忆邦剩幸浆栏拥牙贮礼滤钠纹罢拍咱喊袖埃勤罚焦潜伍墨欲缝姓刊饱仿奖铝鬼丽跨默挖链扫喝袋炭污幕诸弧励梅奶洁灾舟鉴苯讼抱毁懂寒智埔寄届跃渡挑丹艰贝碰拔爹戴码梦芽熔赤渔哭敬颗奔铅仲虎稀妹乏珍申桌遵允隆螺仓魏锐晓氮兼隐碍赫拨忠肃缸牵抢博巧壳兄杜讯诚碧祥柯页巡矩悲灌龄伦票寻桂铺圣恐恰郑趣抬荒腾贴柔滴猛阔辆妻填撤储签闹扰紫砂递戏吊陶伐喂疗瓶婆抚臂摸忍虾蜡邻胸巩挤偶弃槽劲乳邓吉仁烂砖租乌舰伴瓜浅丙暂燥橡柳迷暖牌秧胆详簧踏瓷谱呆宾糊洛辉愤竞隙怒粘乃绪肩籍敏涂熙皆侦悬掘享纠醒狂锁淀恨牲霸爬赏逆玩陵祝秒浙貌役彼悉鸭趋凤晨畜辈秩卵署梯炎滩棋驱筛峡冒啥寿译浸泉帽迟硅疆贷漏稿冠嫩胁芯牢叛蚀奥鸣岭羊凭串塘绘酵融盆锡庙筹冻辅摄袭筋拒僚旱钾鸟漆沈眉疏添棒穗硝韩逼扭侨凉挺碗栽炒杯患馏劝豪辽勃鸿旦吏拜狗埋辊掩饮搬骂辞勾扣估蒋绒雾丈朵姆拟宇辑陕雕偿蓄崇剪倡厅咬驶薯刷斥番赋奉佛浇漫曼扇钙桃扶仔返俗亏腔鞋棱覆框悄叔撞骗勘旺沸孤吐孟渠屈疾妙惜仰狠胀谐抛霉桑岗嘛衰盗渗脏赖涌甜曹阅肌哩厉烃纬毅昨伪症煮叹钉搭茎笼酷偷弓锥恒杰坑鼻翼纶叙狱逮罐络棚抑膨蔬寺骤穆冶枯册尸凸绅坯牺焰轰欣晋瘦御锭锦丧旬锻垄搜扑邀亭酯迈舒脆酶闲忧酚顽羽涨卸仗陪辟惩杭姚肚捉飘漂昆欺吾郎烷汁呵饰萧雅邮迁燕撒姻赴宴烦债帐斑铃旨醇董饼雏姿拌傅腹妥揉贤拆歪葡胺丢浩徽昂垫挡览贪慰缴汪慌冯诺姜谊凶劣诬耀昏躺盈骑乔溪丛卢抹闷咨刮驾缆悟摘铒掷颇幻柄惠惨佳仇腊窝涤剑瞧堡泼葱罩霍捞胎苍滨俩捅湘砍霞邵萄疯淮遂熊粪烘宿档戈驳嫂裕徙箭捐肠撑晒辨殿莲摊搅酱屏疫哀蔡堵沫皱畅叠阁莱敲辖钩痕坝巷饿祸丘玄溜曰逻彭尝卿妨艇吞韦怨矮歇\";";

// 地址格式常量
const ADDRESS_FORMATS = {
    B32: 'b32',
    FULL: 'full'
};

// ============== 初始化字符映射 ==============

const BECH32_CHARS_ARRAY = BECH32_ALPHABET.split('');
const BECH32_CHAR_TO_VALUE = new Map();
for (let i = 0; i < BECH32_CHARS_ARRAY.length; i++) {
    BECH32_CHAR_TO_VALUE.set(BECH32_CHARS_ARRAY[i], i);
}

const BECH32_CHARS_ARRAY_UPPER = BECH32_ALPHABET_UPPER.split('');
const BECH32_CHAR_TO_VALUE_UPPER = new Map();
for (let i = 0; i < BECH32_CHARS_ARRAY_UPPER.length; i++) {
    BECH32_CHAR_TO_VALUE_UPPER.set(BECH32_CHARS_ARRAY_UPPER[i], i);
}

const BIP39_CHARS_ARRAY = BIP39_CHINESE_CHARS.split('');
const BIP39_CHAR_TO_INDEX = new Map();
for (let i = 0; i < BIP39_CHARS_ARRAY.length; i++) {
    BIP39_CHAR_TO_INDEX.set(BIP39_CHARS_ARRAY[i], i);
}

// ============== 工具函数 ==============

function toUpperBase32(char) {
    const lowerIndex = BECH32_CHAR_TO_VALUE.get(char);
    if (lowerIndex !== undefined) return BECH32_CHARS_ARRAY_UPPER[lowerIndex];
    return char;
}

function toLowerBase32(char) {
    const upperIndex = BECH32_CHAR_TO_VALUE_UPPER.get(char);
    if (upperIndex !== undefined) return BECH32_CHARS_ARRAY[upperIndex];
    return char;
}

function uppercaseFullAddress(fullAddress) {
    if (!fullAddress || fullAddress.length !== 22) return fullAddress;
    const prefix = fullAddress.substring(0, 2).toUpperCase();
    const hanziPart = fullAddress.substring(2, 17);
    const checksumTail = fullAddress.substring(17);
    const checksumUpper = checksumTail.split('').map(toUpperBase32).join('');
    return prefix + hanziPart + checksumUpper;
}

function lowercaseFullAddress(fullAddress) {
    if (!fullAddress || fullAddress.length !== 22) return fullAddress;
    const prefix = fullAddress.substring(0, 2).toLowerCase();
    const hanziPart = fullAddress.substring(2, 17);
    const checksumTail = fullAddress.substring(17);
    const checksumLower = checksumTail.split('').map(toLowerBase32).join('');
    return prefix + hanziPart + checksumLower;
}

function normalizeAddress(address) {
    if (!address || address.length < 2) return address;
    if (address.length === 22) {
        const prefix = address.substring(0, 2).toUpperCase();
        const hanziPart = address.substring(2, 17);
        const checksumTail = address.substring(17).toUpperCase();
        return prefix + hanziPart + checksumTail;
    } else if (address.length === 40) {
        const prefix = address.substring(0, 2).toLowerCase();
        const base32Part = address.substring(2).toLowerCase();
        return prefix + base32Part;
    }
    return address;
}

// ============== 核心Bech32m函数 ==============

function bech32Polymod(values) {
    let chk = 1;
    for (const v of values) {
        const b = chk >> 25;
        chk = ((chk & 0x1ffffff) << 5) ^ v;
        for (let i = 0; i < 5; i++) {
            if ((b >> i) & 1) chk ^= BECH32_GENERATOR[i];
        }
    }
    return chk;
}

function bech32HRPExpand(hrp) {
    const result = [];
    for (let i = 0; i < hrp.length; i++) {
        const c = hrp.charCodeAt(i);
        result.push(c >> 5);
    }
    result.push(0);
    for (let i = 0; i < hrp.length; i++) {
        const c = hrp.charCodeAt(i);
        result.push(c & 31);
    }
    return result;
}

function bech32mCreateChecksum(hrp, data) {
    const values = bech32HRPExpand(hrp).concat(data);
    const polymod = bech32Polymod(values.concat([0, 0, 0, 0, 0, 0])) ^ BECH32M_CONST;
    const checksum = [];
    for (let i = 0; i < 6; i++) {
        checksum.push((polymod >> 5 * (5 - i)) & 31);
    }
    return checksum;
}

function bech32mVerifyChecksum(hrp, data) {
    const values = bech32HRPExpand(hrp).concat(data);
    return bech32Polymod(values) === BECH32M_CONST;
}

// ============== 比特操作工具函数 ==============

function bytesTo5BitArray(bytes) {
    const fiveBits = [];
    let buffer = 0, bits = 0;
    for (const byte of bytes) {
        buffer = (buffer << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            bits -= 5;
            fiveBits.push((buffer >> bits) & 31);
        }
    }
    if (bits > 0) fiveBits.push((buffer << (5 - bits)) & 31);
    return fiveBits;
}

function fiveBitArrayToBits(fiveBits) {
    const bits = [];
    for (const value of fiveBits) {
        for (let i = 4; i >= 0; i--) bits.push((value >> i) & 1);
    }
    return bits;
}

function bitsToBytes(bits) {
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        let byte = 0;
        for (let j = 0; j < 8 && (i + j) < bits.length; j++) byte = (byte << 1) | (bits[i + j] || 0);
        if (bits.length - i < 8) byte <<= (8 - (bits.length - i));
        bytes.push(byte);
    }
    return new Uint8Array(bytes);
}

function fiveBitArrayToBase32(fiveBits, uppercase = false) {
    let result = '';
    const alphabet = uppercase ? BECH32_CHARS_ARRAY_UPPER : BECH32_CHARS_ARRAY;
    for (const value of fiveBits) {
        if (value >= alphabet.length) throw new Error(`5-bit值超出范围: ${value}`);
        result += alphabet[value];
    }
    return result;
}

function base32To5BitArray(base32Str) {
    const fiveBits = [];
    for (const char of base32Str) {
        let value = BECH32_CHAR_TO_VALUE.get(char);
        if (value === undefined) value = BECH32_CHAR_TO_VALUE_UPPER.get(char);
        if (value === undefined) throw new Error(`无效的Base32字符: "${char}"`);
        fiveBits.push(value);
    }
    return fiveBits;
}

function bitsToChinese(bits) {
    const hanziChars = [], hanziIndices = [];
    for (let i = 0; i < bits.length; i += 11) {
        let value = 0;
        const end = Math.min(i + 11, bits.length);
        for (let j = i; j < end; j++) value = (value << 1) | (bits[j] || 0);
        if (end - i < 11) value <<= (11 - (end - i));
        if (value >= BIP39_CHARS_ARRAY.length) throw new Error(`汉字索引超出范围: ${value}`);
        hanziIndices.push(value);
        hanziChars.push(BIP39_CHARS_ARRAY[value]);
    }
    return { text: hanziChars.join(''), indices: hanziIndices, count: hanziChars.length };
}

function chineseToBits(chineseText) {
    const bits = [];
    for (const char of chineseText) {
        const index = BIP39_CHAR_TO_INDEX.get(char);
        if (index === undefined) throw new Error(`无效的汉字字符: "${char}"`);
        for (let i = 10; i >= 0; i--) bits.push((index >> i) & 1);
    }
    return bits;
}

function validateHexAddress(address) {
    if (!address) return { valid: false, error: '地址不能为空' };
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
        return { valid: false, error: '地址格式无效。必须以0x开头，后跟40位十六进制字符。' };
    }
    return { valid: true, address: address.toLowerCase() };
}

// ============== JVA 核心函数 ==============

/**
 * 将以太坊地址编码为JVA格式（同时输出b32和full两种格式）
 * @param {string} hexAddress - 以太坊地址（0x...）
 * @returns {Object} { success, b32Address, fullAddress, ... }
 */
function encodeJVA(hexAddress) {
    const validation = validateHexAddress(hexAddress);
    if (!validation.valid) return { success: false, error: validation.error };

    const address = validation.address;
    try {
        const hex = address.replace('0x', '');
        const addressBytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) addressBytes[i / 2] = parseInt(hex.substr(i, 2), 16);

        const data5Bit = bytesTo5BitArray(addressBytes);
        if (data5Bit.length !== 32) return { success: false, error: `地址转换错误：期望32个5-bit值，得到${data5Bit.length}` };

        const hrp = "j";
        const fullChecksum = bech32mCreateChecksum(hrp, data5Bit);
        if (fullChecksum.length !== 6) return { success: false, error: 'Bech32m校验码计算失败' };

        const combined5Bit = data5Bit.concat(fullChecksum);
        const base32Part = fiveBitArrayToBase32(combined5Bit);
        const b32Address = `j3${base32Part}`;

        const checksumFirst = fullChecksum[0], checksumRest = fullChecksum.slice(1);
        const addressBits = fiveBitArrayToBits(data5Bit);
        for (let i = 4; i >= 0; i--) addressBits.push((checksumFirst >> i) & 1);

        const chineseResult = bitsToChinese(addressBits);
        const checksumTail = fiveBitArrayToBase32(checksumRest, true);
        const fullAddress = `J3${chineseResult.text}${checksumTail}`;

        return {
            success: true,
            hexAddress: address,
            fullAddress: fullAddress,
            b32Address: b32Address,
            dataLength: data5Bit.length,
            checksumLength: fullChecksum.length,
            algorithm: 'bech32m'
        };
    } catch (error) {
        return { success: false, error: `编码失败: ${error.message}` };
    }
}

/**
 * 解码JVA地址（自动检测格式）为以太坊地址（0x...）
 * @param {string} jvaAddress - b32 (j3...) 或 full (J3汉字...) 格式
 * @returns {Object} { success, hexAddress, format, ... }
 */
function decodeJVA(jvaAddress) {
    try {
        if (typeof jvaAddress !== 'string') return { success: false, error: '地址必须是字符串' };
        jvaAddress = jvaAddress.trim();

        const prefix = jvaAddress.substring(0, 2).toLowerCase();
        if (prefix !== 'j3') return { success: false, error: '地址必须以j3或J3开头' };

        let format;
        if (jvaAddress.length === 40) format = ADDRESS_FORMATS.B32;
        else if (jvaAddress.length === 22) format = ADDRESS_FORMATS.FULL;
        else return { success: false, error: `地址长度无效：期望22或40字符，得到${jvaAddress.length}` };

        if (format === ADDRESS_FORMATS.B32) {
            const base32Part = jvaAddress.substring(2).toLowerCase();
            const combined5Bit = base32To5BitArray(base32Part);
            const data5Bit = combined5Bit.slice(0, 32);
            const receivedChecksum = combined5Bit.slice(32);

            if (!bech32mVerifyChecksum("j", data5Bit.concat(receivedChecksum))) {
                return { success: false, error: 'Bech32m校验码验证失败' };
            }

            const addressBytes = bitsToBytes(fiveBitArrayToBits(data5Bit));
            let hexAddress = '0x';
            for (let i = 0; i < addressBytes.length; i++)
                hexAddress += addressBytes[i].toString(16).padStart(2, '0');

            return {
                success: true,
                hexAddress: hexAddress,
                originalAddress: jvaAddress,
                normalizedAddress: `j3${base32Part}`,
                format: format,
                checksumValid: true,
                algorithm: 'bech32m'
            };
        } else {
            const normalized = lowercaseFullAddress(jvaAddress);
            const hanziPart = normalized.substring(2, 17);
            const checksumTail = normalized.substring(17);

            const hanziBits = chineseToBits(hanziPart);
            const addressBits = hanziBits.slice(0, 160);

            let addressBytes = bitsToBytes(addressBits);
            const checksumRest = base32To5BitArray(checksumTail);
            const data5Bit = bytesTo5BitArray(addressBytes);
            const calculatedChecksum = bech32mCreateChecksum("j", data5Bit);

            let hexAddress = '0x';
            for (let i = 0; i < addressBytes.length; i++)
                hexAddress += addressBytes[i].toString(16).padStart(2, '0');

            return {
                success: true,
                hexAddress: hexAddress,
                originalAddress: jvaAddress,
                normalizedAddress: uppercaseFullAddress(jvaAddress),
                format: format,
                checksumValid: true,
                algorithm: 'bech32m'
            };
        }
    } catch (error) {
        return { success: false, error: `解码失败: ${error.message}` };
    }
}

/**
 * 验证JVA地址格式（自动检测），返回解码后的hex地址
 */
function validateJVA(jvaAddress) {
    if (!jvaAddress) return { valid: false, error: '地址不能为空' };
    jvaAddress = jvaAddress.trim();
    const prefix = jvaAddress.substring(0, 2).toLowerCase();
    if (prefix !== 'j3') return { valid: false, error: '地址必须以j3或J3开头' };
    if (jvaAddress.length !== 22 && jvaAddress.length !== 40)
        return { valid: false, error: `地址长度必须为22或40字符，当前为${jvaAddress.length}` };

    const result = decodeJVA(jvaAddress);
    if (!result.success) return { valid: false, error: result.error };
    return { valid: true, hexAddress: result.hexAddress, format: result.format, checksumValid: true };
}

/**
 * 格式化JVA地址用于显示
 */
function formatJVA(jvaAddress, separator = ' ') {
    const validation = validateJVA(jvaAddress);
    if (!validation.valid) return { success: false, error: validation.error };

    const nAddr = validation.normalizedAddress || jvaAddress;
    const n = nAddr.length;
    const formatted = nAddr.substring(0, 2) + separator + nAddr.substring(2, 6) + separator + nAddr.substring(6);
    return { success: true, formatted: formatted };
}

// 导出到全局
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { encodeJVA, decodeJVA, validateJVA, formatJVA };
}
