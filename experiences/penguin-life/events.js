/* 原创事件库。条件事件在同龄基础事件之前匹配；数值只改变处境，不评价鹅生。 */
(function (root) {
'use strict';
const events = [
  {
    id: 'stone-loan', age: 1, title: '石头申请小额借款',
    text: '你在岸边捡到一块石头。它沉默了很久，提出借一条鱼周转。它没有嘴，以上内容由你理解。',
    choices: [
      { label: '借给它，不催', result: '石头没有回应。你把这理解为已读。', effects: { food: -8, bond: 5 }, set: { stoneLoan: true } },
      { label: '要求抵押另一块石头', result: '你获得两块石头。流动资金进一步不足。', effects: { dignity: 5, food: -3 }, set: { stoneBank: true } },
      { label: '告诉它先去实习', result: '它开始原地实习，岗位是石头。', effects: { dignity: 3, penguin: 3 } }
    ]
  },
  {
    id: 'name-registration', age: 2, title: '办理企鹅户口',
    text: '登记员问你叫什么。你叫了一声。登记员说这属于动作，不属于姓名。',
    choices: [
      { label: '登记为「啊」', result: '你的名字只有一声。以后开会点名会非常热闹。', effects: { dignity: -4, bond: 5 }, set: { registeredName: '啊' } },
      { label: '让登记员先叫', result: '登记员叫了。你趁机把它登记为家属。', effects: { bond: 7 }, set: { clerkFamily: true } },
      { label: '使用暂定名称「待定」', result: '你的身份审核通过，姓名仍在路上。', effects: { dignity: 6 }, set: { registeredName: '待定' } }
    ]
  },
  {
    id: 'sea-lesson', age: 3, title: '第一次下海',
    text: '大家站在冰沿，等第一只企鹅下水。海面已经发了三次会议提醒。',
    choices: [
      { label: '先问水温，再进去', result: '海回复「你下来就知道了」。你决定相信一片海。', effects: { food: 10, dignity: 3 }, set: { seaTrust: true } },
      { label: '把影子先放下去', result: '影子浮在水上，假装自己是深度。', effects: { dignity: -3, penguin: -5 }, set: { shadowIndependent: true } },
      { label: '在岸上负责鼓掌', result: '你荣获最佳岸上支持。鱼不接受精神支持。', effects: { food: -5, bond: 8 } }
    ]
  },
  {
    id: 'wrong-partner', age: 4, title: '一只熟悉的陌生鹅',
    text: '一只企鹅冲过来拥抱你，说终于找到你了。你也以为终于找到它了。你们暂时都没有问名字。',
    choices: [
      { label: '一起吃饭，之后再确认', result: '你们聊了一整晚。关于身份的问题被饭后散步挤掉了。', effects: { bond: 12, food: 4 }, set: { partner: true } },
      { label: '交换身份证明', result: '双方证明都是湿的。你们约好风干后再见。', effects: { dignity: 7, bond: 3 }, set: { proofFriend: true } },
      { label: '先加它进家族群', result: '它发现群里全是石头，但很有礼貌地没有退出。', effects: { bond: 6, penguin: -3 } }
    ]
  },
  {
    id: 'knee-proof', age: 5, title: '南极大学补充材料通知',
    text: '学校收到你的入学申请。招生办要求提交膝盖证明，并注明：不得用想象代替。',
    choices: [
      { label: '开始寻找自己的膝盖', result: '你低头找了一整天，顺便滑倒一次。地面给你盖了章。', effects: { dignity: -5, penguin: 5 }, set: { kneeQuest: true } },
      { label: '提交「暂无相关经验」', result: '学校批准你旁听。上课地点在门外，也属于校园。', effects: { dignity: 4, bond: 3 }, set: { auditor: true } },
      { label: '询问能否用翅膀抵学分', result: '教务处正在研究换算规则。你获得一个回执。', effects: { dignity: 6 }, set: { wingCredits: true } }
    ]
  },
  {
    id: 'seal-dinner', age: 6, title: '绝对不是饭局',
    text: '一只海豹寄来邀请：周六，来参加「绝对不是饭局」的饭局。落款是餐饮部以外的部门。',
    choices: [
      { label: '赴约，先坐靠门的位置', result: '海豹给你讲了两小时保险。你安全离开，带回三本宣传册。', effects: { dignity: -3, food: 5 }, set: { sealInsurance: true } },
      { label: '让影子替我参加', result: '影子回来了，问你家里有没有打印机。', effects: { penguin: -7, bond: 4 }, set: { shadowDinner: true } },
      { label: '回复「我这边也是海豹」', result: '你被拉进海豹家族群。群公告要求周日称体重。', effects: { penguin: -9, bond: 8 }, set: { sealFamily: true } }
    ]
  },
  {
    id: 'chick-language', age: 7, title: '幼鹅问你怎么叫',
    text: '一只幼鹅想跟你学鸣叫。你认真示范了「啊」。它问下一课是什么。你说下一课是「啊啊」。',
    choices: [
      { label: '送它去学正规鸣叫', result: '你用鱼交了学费。它临走前说，以后会回来教你。', effects: { food: -9, bond: 10 }, set: { chick: true } },
      { label: '成立「啊」语言研究所', result: '你们发表第一篇论文，全文只有一个字。审稿意见是「啊？」。', effects: { dignity: 8, penguin: -3 }, set: { ahInstitute: true } },
      { label: '带它去听海', result: '海讲了一下午。你们都没有听懂，但听力练习已经完成。', effects: { bond: 7, food: 3 }, set: { chickSea: true } }
    ]
  },
  {
    id: 'huddle', age: 8, title: '暴风雪中的站位',
    text: '大家抱团取暖。你发现队伍的中心是一台冰箱。冰箱说自己只是来感受集体生活。',
    choices: [
      { label: '给冰箱让一个位置', result: '它把制冷关了。所有鹅都觉得它很会照顾人。', effects: { bond: 9, food: 5 }, set: { fridgeFriend: true } },
      { label: '轮换去外围值班', result: '你冻得很体面。下一班的企鹅给你带了一条热心的鱼。', effects: { dignity: 6, bond: 6, food: -4 } },
      { label: '提议给风办理访客证', result: '风没有带身份证，暂时被保安拦在群落外。', effects: { dignity: 8, penguin: -4 }, set: { windBanned: true } }
    ]
  },
  {
    id: 'left-complaint', age: 9, title: '左边提出异议',
    text: '你向左走了三步。左边投诉你占用它的方向。调解员建议双方各退一步。',
    choices: [
      { label: '退到右边', result: '右边表示欢迎，但要求提前预约。', effects: { dignity: 4, food: 3 } },
      { label: '向上申诉', result: '你跳起来。申诉持续了零点三秒。', effects: { dignity: -4, penguin: 6 }, set: { skyAppeal: true } },
      { label: '留在原地，成立地点', result: '你拥有了一个地址。地址暂时没有门牌号。', effects: { dignity: 7 }, set: { ownsPlace: true } }
    ]
  },
  {
    id: 'route-sign', age: 10, title: '给后来者留一块路牌',
    text: '你又迷路了。你决定在岔口立一块路牌。问题是，你仍然不知道正确方向。',
    choices: [
      { label: '写「这边应该是」', result: '字体非常坚定，内容保留余地。', effects: { dignity: 4, bond: 6 }, set: { sign: true } },
      { label: '写「别跟着我」', result: '大家以为这是领队的谦辞，跟得更紧了。', effects: { bond: 8, dignity: -3 }, set: { accidentalLeader: true } },
      { label: '请路自己指一下', result: '路弯了一下腰。你向它道谢。', effects: { penguin: -5, dignity: 5 }, set: { roadFriend: true } }
    ]
  },
  {
    id: 'menu', age: 11, title: '你的名字在食堂菜单上',
    text: '你发现菜单上写着自己的名字。食堂解释是同名菜品，并保证尊重知识产权。',
    choices: [
      { label: '要求署名费', result: '食堂付了你半条鱼。你正式进入文创行业。', effects: { food: 8, dignity: 5 }, set: { menuRoyalty: true } },
      { label: '点一份，看看自己', result: '端来一碗清水。厨师说这道菜主要表达你的精神面貌。', effects: { dignity: -5, penguin: 5 }, set: { orderedSelf: true } },
      { label: '连夜改名为「今日售罄」', result: '次日食堂营业额归零。你仍然合法。', effects: { dignity: 7, bond: -4 }, set: { renamed: true, registeredName: '今日售罄', rename: '今日售罄' } }
    ]
  },
  {
    id: 'job-fair', age: 12, title: '群落招聘会',
    text: '招聘摊位有捕鱼员、滑行员和气氛组。最热门的岗位叫「先坐着，来了再说」。',
    choices: [
      { label: '应聘捕鱼员', result: '你成功说服一条鱼加入团队。团队目前由你和晚饭组成。', effects: { food: 12, dignity: 3 }, set: { fisher: true } },
      { label: '应聘气氛组', result: '每当大家沉默，你负责说「确实」。群落运转更加顺畅。', effects: { bond: 10, dignity: 2 }, set: { atmosphere: true } },
      { label: '先坐着', result: '坐了半年后，你被评为岗位稳定性优秀。', effects: { dignity: 7, food: -3 }, set: { stableJob: true } }
    ]
  },
  {
    id: 'tuesday', age: 13, title: '星期二不认识你',
    text: '日历翻到星期二，你的预约全部失效。星期二说系统里查无此鹅。',
    choices: [
      { label: '改约星期三', result: '星期三认识你，但要你证明昨天存在。', effects: { dignity: -3, penguin: 4 }, set: { tuesdayMissing: true } },
      { label: '找朋友替我作证', result: '朋友说你昨天一直在。星期二说它昨天还没上班。', effects: { bond: 6, dignity: 3 }, set: { tuesdayMissing: true } },
      { label: '享受一天无责任生活', result: '你没去上班。工资系统也没有识别到星期二。', effects: { food: -4, dignity: 7 }, set: { tuesdayHoliday: true } }
    ]
  },
  {
    id: 'iceberg-rent', age: 14, title: '房东宣布冰山出国',
    text: '冰山向北漂移一厘米。房东通知你补交海外租金，群落正在紧急学习外语。',
    choices: [
      { label: '要求提供海关文件', result: '房东递来一片海。你们都觉得手续有待完善。', effects: { dignity: 7, food: 3 } },
      { label: '在原地开一家免税店', result: '顾客购买了你原本就没有的税。', effects: { food: 9, penguin: -4 }, set: { dutyFree: true } },
      { label: '给家里寄一张明信片', result: '明信片走了一厘米，比你先适应海外生活。', effects: { bond: 7 }, set: { postcard: true } }
    ]
  },
  {
    id: 'stone-audit', age: 15, title: '资产盘点',
    text: '你清点家产：一块冰、几根羽毛，以及一件不知道算不算自己的事。',
    choices: [
      { label: '把冰列为固定资产', result: '会计建议你加快折旧。冰正在主动配合。', effects: { dignity: 6, food: 3 } },
      { label: '把往事列为无形资产', result: '你突然很富有。食堂表示暂不接受回忆支付。', effects: { bond: 7, food: -3 } },
      { label: '送朋友一根羽毛', result: '朋友别在胸前，说这是今年最正式的一天。', effects: { bond: 10, dignity: 2 } }
    ]
  },
  {
    id: 'anniversary', age: 16, title: '一个没有安排的下午',
    text: '今天没有会议，没有迁徙，也没有任何鹅要求你证明自己。你怀疑漏看了群消息。',
    choices: [
      { label: '找熟悉的鹅一起坐坐', result: '你们坐到太阳下班。它加了一会儿班，谁也没有催。', effects: { bond: 10, food: 4 } },
      { label: '整理这些年的小物件', result: '你找到一张回执。原来有些事一直没有办完，也没关系。', effects: { dignity: 6, penguin: 3 } },
      { label: '给今天起个名字', result: '你把今天叫作「不用也行」。以后偶尔会想起它。', effects: { dignity: 4, bond: 4 }, set: { quietDay: true } }
    ]
  },
  {
    id: 'letter', age: 17, title: '一封来自远方的信',
    text: '信封没有寄件人。里面写着「我到了」。你不知道是谁，但替它松了一口气。',
    choices: [
      { label: '回信「到了就好」', result: '邮差把信送给了远方。远方郑重收下。', effects: { bond: 8 }, set: { farLetter: true } },
      { label: '邀请它回来吃饭', result: '你多准备了一条鱼。当天没有客人，但你吃得很饱。', effects: { food: 10, bond: 3 } },
      { label: '把信挂在门口', result: '路过的鹅都觉得自己终于到了。门口变得很热闹。', effects: { bond: 10, dignity: -2 } }
    ]
  },
  {
    id: 'diploma-default', age: 18, title: '校友认领日',
    text: '南极大学举办校友认领日。学校表示，只要你曾经路过，就可以谈谈对母校的感情。',
    choices: [
      { label: '领取一份旁听回忆', result: '回忆不收学费。你在封面签上自己的名字。', effects: { dignity: 8, bond: 3 } },
      { label: '捐赠自己的迷路经验', result: '导航系成立了。系主任暂时还在找办公室。', effects: { dignity: 6, bond: 6 } },
      { label: '去食堂认领午饭', result: '食堂认出了你。午饭也认出了你。', effects: { food: 12, dignity: -2 } }
    ]
  },
  {
    id: 'retirement', age: 19, title: '退休年龄由谁决定',
    text: '一只幼鹅问你什么时候退休。你说要看身体。身体表示从来没人征求过它的意见。',
    choices: [
      { label: '让身体先休息', result: '你躺了一下午。身体给了你五星好评。', effects: { food: 6, dignity: 5 }, set: { retired: true } },
      { label: '再带一届幼鹅', result: '幼鹅们决定先教你使用新版冰面。', effects: { bond: 10, dignity: -2 }, set: { mentor: true } },
      { label: '转为远程站着', result: '你在家站着。单位说效果非常稳定。', effects: { dignity: 8 }, set: { remoteStand: true } }
    ]
  },
  {
    id: 'museum', age: 20, title: '群落博物馆征集藏品',
    text: '博物馆向你征集一件能代表这一生的东西。你看了看自己的小窝，发现每样东西都能讲很久。',
    choices: [
      { label: '捐一块经常坐的冰', result: '展签写着「曾承载大量想法」。馆方提醒观众别坐。', effects: { dignity: 10 }, set: { museumIce: true } },
      { label: '捐一个未实现的计划', result: '展柜是空的。大家站在前面，看见自己的倒影。', effects: { bond: 7, dignity: 5 }, set: { museumPlan: true } },
      { label: '捐一条新鲜的鱼', result: '展览开幕前，藏品被工作人员认真研究完了。', effects: { food: -5, bond: 10 }, set: { museumFish: true } }
    ]
  },
  {
    id: 'migration', age: 21, title: '新一年的迁徙',
    text: '年轻的企鹅来问你，远方到底有什么。你想了想，远方大概也有一些站在原地的鹅。',
    choices: [
      { label: '陪它们走一段', result: '这次大家走得很慢。你第一次看清路边的石头。', effects: { bond: 10, food: -3 } },
      { label: '教它们看海流', result: '你讲得很认真。海流也过来旁听，说自己平时比较凭感觉。', effects: { dignity: 8, bond: 5 } },
      { label: '留下等它们回来', result: '你把门口整理了一下。有一个地方可以回来，也是远行的一部分。', effects: { bond: 8, food: 5 }, set: { homeKeeper: true } }
    ]
  },
  {
    id: 'old-friend', age: 22, title: '有人敲门',
    text: '你问是谁。门外说「我」。这个回答和许多年前一样没有信息，但你还是听懂了。',
    choices: [
      { label: '开门，多拿一个碗', result: '你们把很多年前的事重新讲了一遍。版本有出入，谁也没有纠正。', effects: { bond: 12, food: -3 } },
      { label: '先问它今天吃了吗', result: '门外说没有。你说那就先别解释自己是谁。', effects: { bond: 10, food: -4 } },
      { label: '隔着门一起晒太阳', result: '门也晒到了。它说自己这么多年很少被考虑。', effects: { bond: 6, dignity: 5 } }
    ]
  },
  {
    id: 'last-photo', age: 23, title: '群落合影',
    text: '摄影师让所有企鹅看镜头。你们看了很久，镜头先不好意思了。',
    choices: [
      { label: '给身边的鹅留点位置', result: '合影里多出一小块空地。以后大家一看，就知道那里本来给谁留着。', effects: { bond: 10 }, set: { photoSpace: true } },
      { label: '举起自己的身份证明', result: '摄影师说放下吧，大家认识你。', effects: { penguin: 12, dignity: 5 }, set: { knownPenguin: true } },
      { label: '把相机也邀请进来', result: '大家请一块石头按下快门。照片拍得非常稳定。', effects: { bond: 7, dignity: 5 }, set: { cameraFriend: true } }
    ]
  },
  {
    id: 'last-page', age: 24, title: '最后一页的填写说明',
    text: '鹅生档案员送来一张表，问这一生最重要的是什么。附注：写不下可以另附冰面。',
    choices: [
      { label: '写下陪过我的名字', result: '有些名字写错了。但档案员说，它们会知道的。', effects: { bond: 8 }, set: { finalWish: 'names' } },
      { label: '写「冰箱里还有我」', result: '档案员认真地把这句归入文学，而非食品安全。', effects: { penguin: -5, dignity: 8 }, set: { finalWish: 'fridge' } },
      { label: '留白，请后来者坐坐', result: '档案员搬来一张椅子。你们一起坐了一会儿。', effects: { dignity: 5, bond: 5 }, set: { finalWish: 'blank' } }
    ]
  },

  // 条件分支：每条都保留与基础事件相同的年份，只替换当年遭遇。
  {
    id: 'photo-edge', age: 3, requires: { origin: 'photo' }, title: '照片的边界',
    text: '你向海边走去，撞上了一圈相框。摄影师当年只拍到这里。',
    choices: [
      { label: '请隔壁照片接一下', result: '隔壁是一张食堂照片。你第一次下海，直接进入午饭。', effects: { food: 12, penguin: -4 }, set: { photoTravel: true } },
      { label: '把相框推远一点', result: '画面扩大了三厘米。远方终于有了编制。', effects: { dignity: 7 }, set: { frameExpanded: true } },
      { label: '留在边缘看外面', result: '有人在另一边看着你。你们互相觉得对方很小。', effects: { bond: 6, penguin: -3 }, set: { outsideFriend: true } }
    ]
  },
  {
    id: 'fridge-family', age: 8, requires: { origin: 'fridge' }, title: '冰箱家长会',
    text: '你的出生冰箱来到抱团现场，站在外围。它说自己习惯给大家降温，今天想学着温暖一点。',
    choices: [
      { label: '把门轻轻关好', result: '它不再漏冷气，第一次觉得沉默也很暖和。', effects: { bond: 12, food: 4 }, set: { fridgeFriend: true } },
      { label: '介绍它是我的家长', result: '家长名单多了一台家电。老师认真给它留了座。', effects: { bond: 9, dignity: 5 }, set: { fridgeParent: true } },
      { label: '让它带大家做热身操', result: '冰箱努力原地震动。大家跟着跳，果然暖和起来。', effects: { bond: 7, dignity: 3 }, set: { fridgeCoach: true } }
    ]
  },
  {
    id: 'shadow-payroll', age: 9, requires: { shadowDinner: true }, title: '影子有自己的考勤',
    text: '你的影子开始每天九点出门，六点回来。中午它发消息，说今天不跟你一起晒太阳了。',
    choices: [
      { label: '祝它工作顺利', result: '它发来第一笔工资：半平方米阴影。你收好，留着夏天用。', effects: { bond: 9, food: 5 }, set: { shadowCareer: true } },
      { label: '要求共享午休', result: '你们约定，每周五一起在墙上躺十分钟。', effects: { bond: 10 }, set: { shadowLunch: true } },
      { label: '问它公司还招本体吗', result: '人事说岗位要求有影子。你的影子正在别处上班。', effects: { dignity: -4, penguin: -4 }, set: { shadowReference: true } }
    ]
  },
  {
    id: 'seal-weigh-in', age: 12, requires: { sealFamily: true }, title: '海豹家族年度体检',
    text: '家族群关心你为什么这么瘦。姑妈寄来三十条鱼，并提醒你不要总穿燕尾服。',
    choices: [
      { label: '收下鱼，解释这是皮肤', result: '姑妈说年轻人的穿搭她不懂。她还是很喜欢你。', effects: { food: 16, bond: 8 }, set: { sealAunt: true } },
      { label: '承认自己其实是企鹅', result: '群里沉默了两分钟，然后问企鹅能不能吃鱼。', effects: { penguin: 10, bond: 8 }, set: { sealTruth: true } },
      { label: '发一张横着拍的照片', result: '家族放心了。照片比例成为家族机密。', effects: { dignity: -4, bond: 5 }, set: { sealWidePhoto: true } }
    ]
  },
  {
    id: 'renamed-hospital', age: 14, requires: { renamed: true }, title: '今日售罄的预约',
    text: '你只是来做常规体检。护士喊了三遍「今日售罄」，候诊室的企鹅陆续遗憾离开。',
    choices: [
      { label: '举翅说明这是我的名字', result: '护士写上备注：本人有货。体检顺利完成。', effects: { food: 6, dignity: 4 }, set: { nameExplained: true } },
      { label: '登记为艺名，再申请笔名', result: '笔名暂定为「本人」。你拥有了双重身份，食堂请你出席周年庆。', effects: { dignity: 8, bond: 4 }, set: { stageName: true } },
      { label: '享受空无一鹅的候诊室', result: '医生第一次准点下班，送你一张「谢谢惠顾」。', effects: { dignity: 6, bond: 5 } }
    ]
  },
  {
    id: 'stone-repayment', age: 15, requires: { stoneLoan: true }, title: '石头终于到账了',
    text: '十四年前借你鱼的石头开口了：「不好意思，刚到账。」它打算分期还你，期限是直到你不需要。',
    choices: [
      { label: '接受按月发鱼', result: '你的养老金由一块石头发放。流程稳定，态度坚硬。', effects: { food: 16, bond: 12 }, set: { pension: true } },
      { label: '只拿回当年的一条', result: '石头把利息改成陪你坐着。它在这方面经验丰富。', effects: { food: 8, bond: 14 }, set: { stoneCompanion: true } },
      { label: '转给需要的幼鹅', result: '石头成立助学基金。第一份年报仍然没有声音。', effects: { bond: 16, dignity: 8 }, set: { stoneScholarship: true } }
    ]
  },
  {
    id: 'partner-truth', age: 16, requires: { partner: true }, title: '十二周年身份核对',
    text: '一起吃过十二年的饭后，对方轻声说：「我可能认错鹅了。」你说：「我可能也是。」锅里的鱼没有发表意见。',
    choices: [
      { label: '那就重新认识一下', result: '你们交换名字。晚饭仍然按老习惯做，两条鱼都没有浪费。', effects: { bond: 16, dignity: 5 }, set: { partnerKnown: true } },
      { label: '继续做认错的那只鹅', result: '你们郑重续签误会。有效期：再吃十二年。', effects: { bond: 14, penguin: -3 }, set: { partnerRenewed: true } },
      { label: '成为朋友，也一起吃饭', result: '你们搬到隔壁。门口的小路比过去多了一段，但走得更自在。', effects: { bond: 12, dignity: 6 }, set: { partnerFriend: true } }
    ]
  },
  {
    id: 'ancient-fridge', age: 17, requires: { chick: true }, title: '幼鹅带着翻译证回来了',
    text: '你送去学鸣叫的幼鹅如今已是翻译。它认真听你叫了一声，说：「原来你一直讲的是古代冰箱语。」',
    choices: [
      { label: '问它我以前都说了什么', result: '它翻译：「门没关好、鱼放左边，以及我很想你。」最后一句你叫了很多年。', effects: { bond: 18, dignity: 4 }, set: { fridgeLanguage: true } },
      { label: '请它教我一句新的', result: '你学会了「欢迎回来」。发音不标准，但它听懂了。', effects: { bond: 16, penguin: 6 }, set: { welcomeLanguage: true } },
      { label: '共同修订「啊」词典', result: '第一版有三百页。最后一页写着「有些话不用翻译」。', effects: { dignity: 12, bond: 10 }, set: { ahDictionary: true } }
    ]
  },
  {
    id: 'ground-doctor', age: 18, requires: { kneeQuest: true }, title: '地面颁发名誉博士',
    text: '你这些年反复滑倒，终于收到南极大学的名誉博士证书。研究方向：地面为什么突然靠近。膝盖证明获准后补。',
    choices: [
      { label: '发表一次贴地演讲', result: '你滑到讲台下，完成了极具说服力的现场示范。', effects: { dignity: 14, bond: 7 }, set: { diploma: true } },
      { label: '感谢一直支持我的地面', result: '地面说你也没少支持它。全场起立，随后集体滑倒。', effects: { bond: 12, dignity: 10 }, set: { diploma: true, groundFriend: true } },
      { label: '把证书借给幼鹅玩', result: '幼鹅用它滑了很远。知识确实改变了它的移动方式。', effects: { bond: 14, dignity: 7 }, set: { diploma: true, diplomaSled: true } }
    ]
  },
  {
    id: 'shadow-retirement', age: 19, requires: { shadowCareer: true }, title: '影子提前退休',
    text: '影子领到退休证明，准备去阴凉的地方旅行。它问你，有没有什么想让它带回来的。',
    choices: [
      { label: '一张它过得好的照片', result: '照片几乎全黑。你知道它笑得很开心。', effects: { bond: 14, dignity: 5 }, set: { shadowRetired: true } },
      { label: '夏天偶尔回来挡太阳', result: '它同意了。你们不再形影不离，但会提前约时间。', effects: { bond: 12, food: 6 }, set: { shadowRetired: true, shadowVisits: true } },
      { label: '邀请它先吃完这顿饭', result: '你们一个吃鱼，一个吃鱼的影子。餐具终于够用。', effects: { food: 8, bond: 12 }, set: { shadowRetired: true } }
    ]
  },
  {
    id: 'organized-migration', age: 21, requires: { sign: true }, title: '迁徙学奠基鹅',
    text: '你当年的路牌成为官方路线。幼鹅们终于不再乱走，开始有组织地走错。它们请你出任导航顾问。',
    choices: [
      { label: '坦白当年也不知道', result: '幼鹅们松了口气。新路牌写着「一起找找」。', effects: { bond: 14, dignity: 5 }, set: { honestGuide: true } },
      { label: '把终点改为「沿途」', result: '大家走到哪里都算抵达。迁徙完成率首次达到百分之百。', effects: { dignity: 12, bond: 6 }, set: { alongTheWay: true } },
      { label: '跟它们重新走一遍', result: '原来那条错误的路通向一片好看的海。你这次记住了。', effects: { bond: 12, food: 6 }, set: { rediscoveredSea: true } }
    ]
  },
  {
    id: 'photo-fading', age: 23, requires: { origin: 'photo' }, title: '你的出生照片开始褪色',
    text: '那张你破壳的照片边缘泛白。现在群落要拍新合影，有人问你要不要搬进来。它们已经给你留了位置。',
    choices: [
      { label: '带着旧照片搬进去', result: '新合影里，你抱着一张旧照片。你的来处没有被裁掉。', effects: { bond: 16, penguin: 8 }, set: { photoMoved: true } },
      { label: '请大家来旧照片坐坐', result: '照片从此挤了一点，但再也不显得空。', effects: { bond: 16 }, set: { photoVisited: true } },
      { label: '站在两张照片之间', result: '摄影师说这里没有取景。朋友说有你就有。', effects: { dignity: 10, bond: 10 }, set: { photoBetween: true } }
    ]
  },

  // 物种专属命运与可重复游玩的随机替换事件。
  {
    "id": "emperor-4",
    "age": 4,
    "title": "皇位是一把折叠椅",
    "text": "你作为帝企鹅收到一把折叠椅。通知说这就是皇位，展开后即视为即位。你看了看说明书，最大承重竟然包括整个帝国。",
    "choices": [
      {
        "label": "先坐下，看看管谁",
        "result": "臣民名单只有椅子。你宣布免除它的站立义务。椅子很感动，折了。",
        "effects": {
          "dignity": 9,
          "penguin": -4
        },
        "set": {
          "speciesQuest": "emperor",
          "imperialChair": true
        }
      },
      {
        "label": "把皇位借给石头",
        "result": "石头在位期间没有发表过一次讲话，支持率稳定在地壳以上。你成为摄政企鹅。",
        "effects": {
          "bond": 8,
          "dignity": 4
        },
        "set": {
          "speciesQuest": "emperor",
          "regentStone": true
        }
      },
      {
        "label": "申请皇帝失业保险",
        "result": "工作人员找不到你的帝国，认定你已失去工作场所。每月补贴一枚不存在的金币。",
        "effects": {
          "food": 7,
          "penguin": -6
        },
        "set": {
          "speciesQuest": "emperor",
          "unemployedEmperor": true
        }
      }
    ],
    "requires": {
      "species": "emperor"
    }
  },
  {
    "id": "emperor-12",
    "age": 12,
    "title": "你的帝国要求报销",
    "text": "海关寄来一封信：你名下的帝国出差去了昨天，需要你报销往返时差。发票抬头是「朕有限公司」。",
    "choices": [
      {
        "label": "按天报销昨天",
        "result": "财务问昨天住了几晚。你填「明晚」。时间报销系统当场放假。",
        "effects": {
          "dignity": 8,
          "food": 6
        },
        "set": {
          "speciesLegacy": "emperor-time"
        }
      },
      {
        "label": "宣布本鹅不参与时间管理",
        "result": "帝国把你列为历史遗留问题。历史每周来一次，帮你把鱼热好。",
        "effects": {
          "bond": 10,
          "penguin": -5
        },
        "set": {
          "speciesLegacy": "emperor-history"
        }
      },
      {
        "label": "把皇位改成计时工",
        "result": "你每天只当两小时皇帝。剩下二十二小时由椅子值班，政策更加贴地。",
        "effects": {
          "food": 10,
          "dignity": -3
        },
        "set": {
          "speciesLegacy": "emperor-shift"
        }
      }
    ],
    "requires": {
      "species": "emperor"
    }
  },
  {
    "id": "emperor-20",
    "age": 20,
    "title": "退休时必须归还黄昏",
    "text": "皇帝退休窗口要求归还任内使用的全部黄昏。你说黄昏每天都自己走了。窗口说口头离职不算。",
    "choices": [
      {
        "label": "给太阳补开离职证明",
        "result": "太阳终于可以准时下班。大家发现夜晚一直在门口等工位。",
        "effects": {
          "bond": 13,
          "dignity": 8
        },
        "set": {
          "speciesEnding": "emperor-sunset"
        }
      },
      {
        "label": "把自己折回那把椅子",
        "result": "你变成一把很有帝王气质的折叠椅。朋友坐下时，你仍会说「免礼」。",
        "effects": {
          "penguin": -15,
          "dignity": 12
        },
        "set": {
          "speciesEnding": "emperor-chair"
        }
      },
      {
        "label": "申请以企鹅身份重新入职",
        "result": "系统提示转岗成功。帝国保留了你的位置，职位名称是「会回来吃饭的那个」。",
        "effects": {
          "bond": 14,
          "food": 6
        },
        "set": {
          "speciesEnding": "emperor-penguin"
        }
      }
    ],
    "requires": {
      "species": "emperor",
      "speciesQuest": "emperor"
    }
  },
  {
    "id": "adelie-4",
    "age": 4,
    "title": "石头宣布自己是法定货币",
    "text": "阿德利登记处把你捡的石头认定为一百块。你问一百什么，登记处说先别问，这样经济才能运转。",
    "choices": [
      {
        "label": "存进地壳银行",
        "result": "柜员是一条裂缝。它吞下石头，给你开了一张山脉存单。到账周期：三千万年。",
        "effects": {
          "dignity": 7,
          "food": -3
        },
        "set": {
          "speciesQuest": "adelie",
          "crustDeposit": true
        }
      },
      {
        "label": "用石头买另一块石头",
        "result": "你找回一块更小的石头作为零钱。交易结束后，地面少了一个明显的点。",
        "effects": {
          "food": 5,
          "bond": 4
        },
        "set": {
          "speciesQuest": "adelie",
          "stoneExchange": true
        }
      },
      {
        "label": "宣布暂时实行鱼本位",
        "result": "鱼表示反对被固定。它们认为自己至少应该是流动资产。",
        "effects": {
          "food": 8,
          "penguin": -4
        },
        "set": {
          "speciesQuest": "adelie",
          "fishStandard": true
        }
      }
    ],
    "requires": {
      "species": "adelie"
    }
  },
  {
    "id": "adelie-12",
    "age": 12,
    "title": "地壳总行调高大陆利率",
    "text": "你年轻时办理的石头业务触发板块级审计。地壳总行要求你解释：为什么你的资产每天向东移动两厘米。",
    "choices": [
      {
        "label": "说这是资产自主择业",
        "result": "亚洲板块向你投递简历。你以办公面积不足为由，婉拒了一块大陆。",
        "effects": {
          "dignity": 10,
          "penguin": -6
        },
        "set": {
          "speciesLegacy": "adelie-continent"
        }
      },
      {
        "label": "要求以原地不动结算",
        "result": "地球为配合你停止了半秒。半秒随后要求加班费，你第一次欠时间钱。",
        "effects": {
          "bond": 6,
          "food": -4
        },
        "set": {
          "speciesLegacy": "adelie-second"
        }
      },
      {
        "label": "把利息兑成一座小山",
        "result": "小山每天跟在你后面。你不再有背景，它就是你的背景。",
        "effects": {
          "bond": 11,
          "dignity": 5
        },
        "set": {
          "speciesLegacy": "adelie-mountain"
        }
      }
    ],
    "requires": {
      "species": "adelie"
    }
  },
  {
    "id": "adelie-20",
    "age": 20,
    "title": "一块大陆前来认领你",
    "text": "地质部门发现你其实属于石头的私人收藏。石头只借出了你二十年，现在准备带你参加矿物展。",
    "choices": [
      {
        "label": "在展签上写「活体零钱」",
        "result": "你被摆在最显眼的位置。游客投鱼喂你，地壳银行认为这是现金流。",
        "effects": {
          "food": 15,
          "dignity": 6
        },
        "set": {
          "speciesEnding": "adelie-change"
        }
      },
      {
        "label": "申请成为石头的法定监护鹅",
        "result": "法院认定双方互为监护。你负责鱼，石头负责永远在场。",
        "effects": {
          "bond": 16,
          "penguin": 4
        },
        "set": {
          "speciesEnding": "adelie-guardian"
        }
      },
      {
        "label": "把展览直接开在原地",
        "result": "地球宣布永久参展。你成为唯一不需要搬运的巡回展策展鹅。",
        "effects": {
          "dignity": 14,
          "penguin": -8
        },
        "set": {
          "speciesEnding": "adelie-earth"
        }
      }
    ],
    "requires": {
      "species": "adelie",
      "speciesQuest": "adelie"
    }
  },
  {
    "id": "gentoo-4",
    "age": 4,
    "title": "你游出了上一页",
    "text": "你是一只巴布亚企鹅。第一次认真游泳，发现海水后面有个「上一页」按钮。你到岸时，比出发早了七分钟。",
    "choices": [
      {
        "label": "把七分钟存起来",
        "result": "你把七分钟装进口袋。口袋从此每逢周一就先下班。",
        "effects": {
          "food": 7,
          "dignity": 4
        },
        "set": {
          "speciesQuest": "gentoo",
          "savedMinutes": true
        }
      },
      {
        "label": "回去提醒自己别游太快",
        "result": "你们在水里相遇，双方都说「借过」。海面因重复用户暂停服务。",
        "effects": {
          "bond": 8,
          "penguin": -7
        },
        "set": {
          "speciesQuest": "gentoo",
          "metSelf": true
        }
      },
      {
        "label": "假装没有看到按钮",
        "result": "浏览记录里仍留下一个你。你开始收到来自自己童年的好友申请。",
        "effects": {
          "dignity": 6,
          "bond": 5
        },
        "set": {
          "speciesQuest": "gentoo",
          "historySelf": true
        }
      }
    ],
    "requires": {
      "species": "gentoo"
    }
  },
  {
    "id": "gentoo-12",
    "age": 12,
    "title": "光速向你发出律师函",
    "text": "光速认为你未经许可使用了它的工作方式。庭审安排在明天，你昨天已经出庭，今天只需领取结果。",
    "choices": [
      {
        "label": "要求光速证明它比我快",
        "result": "光还没赶到，你已签收胜诉通知。法官认定这属于抢答，庭审重新开始。",
        "effects": {
          "dignity": 11,
          "penguin": -7
        },
        "set": {
          "speciesLegacy": "gentoo-light"
        }
      },
      {
        "label": "把速度借给静止的石头",
        "result": "石头忽然出现在远方，仍然一动不动。物理系集体申请年假。",
        "effects": {
          "bond": 10,
          "food": 4
        },
        "set": {
          "speciesLegacy": "gentoo-faststone"
        }
      },
      {
        "label": "退回多出来的昨天",
        "result": "昨天被你退回之后，周历多出一格空白。全校决定在里面睡午觉。",
        "effects": {
          "bond": 12,
          "dignity": 4
        },
        "set": {
          "speciesLegacy": "gentoo-calendar"
        }
      }
    ],
    "requires": {
      "species": "gentoo"
    }
  },
  {
    "id": "gentoo-20",
    "age": 20,
    "title": "你已经退休了两次",
    "text": "退休办发现你多游了一圈，人生末尾排在了人生开头。你昨天收到的祝福，是自己明年寄的。",
    "choices": [
      {
        "label": "按原路游回来",
        "result": "你把所有早到的再见还给了原主。朋友终于能在你出现时说「你来了」。",
        "effects": {
          "bond": 15,
          "penguin": 6
        },
        "set": {
          "speciesEnding": "gentoo-ontime"
        }
      },
      {
        "label": "开通昨日快递",
        "result": "你的快递保证昨天送达，退款也在购买之前到账。顾客暂时不需要买东西。",
        "effects": {
          "food": 15,
          "dignity": 7
        },
        "set": {
          "speciesEnding": "gentoo-yesterday"
        }
      },
      {
        "label": "把终点留给下一只企鹅",
        "result": "后来者游到这里时，发现终点是一张你留的纸条：「急什么，鱼还没热。」",
        "effects": {
          "bond": 14,
          "dignity": 8
        },
        "set": {
          "speciesEnding": "gentoo-finish"
        }
      }
    ],
    "requires": {
      "species": "gentoo",
      "speciesQuest": "gentoo"
    }
  },
  {
    "id": "chinstrap-4",
    "age": 4,
    "title": "你的下巴被划为边境",
    "text": "你是一只帽带企鹅，下巴那条黑线被地图部门识别为国界。今天吃的鱼需要先从嘴办理入境。",
    "choices": [
      {
        "label": "给鱼盖一个消化签证",
        "result": "签证有效期到晚饭。鱼很快成为本鹅不可分割的一部分，地理老师拒绝解释。",
        "effects": {
          "food": 12,
          "penguin": -5
        },
        "set": {
          "speciesQuest": "chinstrap",
          "fishVisa": true
        }
      },
      {
        "label": "向下巴申请过境权",
        "result": "下巴同意，但要求每天留下两秒沉默。你从此拥有了一个很像思考的习惯。",
        "effects": {
          "dignity": 8,
          "bond": 4
        },
        "set": {
          "speciesQuest": "chinstrap",
          "chinTreaty": true
        }
      },
      {
        "label": "把头歪到线的另一侧",
        "result": "你发现自己已经出国。身体仍在国内，正在替你收快递。",
        "effects": {
          "penguin": -8,
          "dignity": 7
        },
        "set": {
          "speciesQuest": "chinstrap",
          "headAbroad": true
        }
      }
    ],
    "requires": {
      "species": "chinstrap"
    }
  },
  {
    "id": "chinstrap-12",
    "age": 12,
    "title": "鼻子和肚子发生贸易摩擦",
    "text": "下巴边检截获三条未申报的鱼。肚子宣称这是内部事务，鼻子要求召开嗅觉峰会。你只是想吃午饭。",
    "choices": [
      {
        "label": "召开全鹅内部协商",
        "result": "各器官按顺序发言。尾巴坚持自己有一票，但始终没等到麦克风。",
        "effects": {
          "bond": 9,
          "dignity": 7
        },
        "set": {
          "speciesLegacy": "chinstrap-parliament"
        }
      },
      {
        "label": "让鱼走绿色通道",
        "result": "鱼被涂绿后顺利通关。海洋对此开展了一次颜色税改革。",
        "effects": {
          "food": 13,
          "penguin": -5
        },
        "set": {
          "speciesLegacy": "chinstrap-green"
        }
      },
      {
        "label": "宣布午饭属于公共海域",
        "result": "所有鹅都来你嘴边围观。你赶紧宣布下午茶属于私人领海。",
        "effects": {
          "bond": 12,
          "food": -4
        },
        "set": {
          "speciesLegacy": "chinstrap-sea"
        }
      }
    ],
    "requires": {
      "species": "chinstrap"
    }
  },
  {
    "id": "chinstrap-20",
    "age": 20,
    "title": "你成为一条可以拥抱的国界",
    "text": "地图部门申请把你的下巴印进新版地图。你问以后怎么见朋友，对方递来一本跨境拥抱操作手册。",
    "choices": [
      {
        "label": "宣布所有朋友免签",
        "result": "当天入境量创历史新高。你被抱成一团，边检终于感到了温暖。",
        "effects": {
          "bond": 18,
          "dignity": 5
        },
        "set": {
          "speciesEnding": "chinstrap-visa"
        }
      },
      {
        "label": "把黑线留给地图，自己去散步",
        "result": "你第一次没有国界地吃完一条鱼。地图上的线仍很认真地代班。",
        "effects": {
          "food": 12,
          "penguin": 6
        },
        "set": {
          "speciesEnding": "chinstrap-map"
        }
      },
      {
        "label": "把整片海登记为家属",
        "result": "海在紧急联系人栏签了字。每次涨潮，都像它过来问你吃没吃。",
        "effects": {
          "bond": 15,
          "penguin": -8
        },
        "set": {
          "speciesEnding": "chinstrap-ocean"
        }
      }
    ],
    "requires": {
      "species": "chinstrap",
      "speciesQuest": "chinstrap"
    }
  },
  {
    "id": "rockhopper-4",
    "age": 4,
    "title": "眉毛宣布自治",
    "text": "你是一只跳岩企鹅。你的眉毛比你先跳起来，宣布成立眉毛自治区。它们暂时仍使用你的头作为办公地址。",
    "choices": [
      {
        "label": "承认它们，建立外交关系",
        "result": "两边眉毛分别派来一名大使。你发现它们之间也有历史遗留问题。",
        "effects": {
          "bond": 9,
          "penguin": -5
        },
        "set": {
          "speciesQuest": "rockhopper",
          "browDiplomacy": true
        }
      },
      {
        "label": "召开全脸代表大会",
        "result": "眼睛闭会，嘴保持沉默。眉毛以全票通过了「下次再说」。",
        "effects": {
          "dignity": 9,
          "bond": 4
        },
        "set": {
          "speciesQuest": "rockhopper",
          "faceCongress": true
        }
      },
      {
        "label": "自己也宣布从头部独立",
        "result": "头表示欢迎。你成为自己楼上的邻居，房租由颈部统一代收。",
        "effects": {
          "dignity": 6,
          "penguin": -9
        },
        "set": {
          "speciesQuest": "rockhopper",
          "headNeighbour": true
        }
      }
    ],
    "requires": {
      "species": "rockhopper"
    }
  },
  {
    "id": "rockhopper-12",
    "age": 12,
    "title": "眉毛参加了学生会选举",
    "text": "你的左眉竞选南极大学学生会主席，右眉负责反对。它们都要求你在表情管理上保持中立。",
    "choices": [
      {
        "label": "以本鹅名义投弃权票",
        "result": "眉毛要求你不要躲在眼皮后面。你的脸第一次出现了公开透明的争吵。",
        "effects": {
          "dignity": 8,
          "penguin": -4
        },
        "set": {
          "speciesLegacy": "rockhopper-neutral"
        }
      },
      {
        "label": "支持把上课改成跳课",
        "result": "提案通过。全校改为跳着上课，出勤率和海拔同时上升。",
        "effects": {
          "bond": 12,
          "dignity": 5
        },
        "set": {
          "speciesLegacy": "rockhopper-jump"
        }
      },
      {
        "label": "让两边眉毛轮流上台",
        "result": "它们共同组成联合眉阁。你只要抬头，就能召开一次内阁会议。",
        "effects": {
          "dignity": 11,
          "bond": 7
        },
        "set": {
          "speciesLegacy": "rockhopper-cabinet"
        }
      }
    ],
    "requires": {
      "species": "rockhopper"
    }
  },
  {
    "id": "rockhopper-20",
    "age": 20,
    "title": "眉毛外交终于取得突破",
    "text": "左右眉毛签署永久停火协议，决定一起向上长。联合声明说，这是为了给你留出更大的天空。",
    "choices": [
      {
        "label": "给它们各颁一张退休证",
        "result": "两边眉毛搬到照片上养老。你终于能毫无政治含义地眨眼。",
        "effects": {
          "dignity": 12,
          "penguin": 5
        },
        "set": {
          "speciesEnding": "rockhopper-retired"
        }
      },
      {
        "label": "接受提名，担任全脸秘书长",
        "result": "你的第一项工作是调停鼻孔之间的通风争端。眉毛说它们看好你。",
        "effects": {
          "dignity": 15,
          "bond": 5
        },
        "set": {
          "speciesEnding": "rockhopper-secretary"
        }
      },
      {
        "label": "把协议折成两只小翅膀",
        "result": "眉毛替你飞了一小段。你仍然站在原地，但整个表情已经出过远门。",
        "effects": {
          "bond": 15,
          "penguin": -10
        },
        "set": {
          "speciesEnding": "rockhopper-flying"
        }
      }
    ],
    "requires": {
      "species": "rockhopper",
      "speciesQuest": "rockhopper"
    }
  },
  {
    "id": "little-4",
    "age": 4,
    "title": "你的身高按厘米收费",
    "text": "你是一只小蓝企鹅。物业认为你占用的高度属于低空资源，寄来一张「垂直空间使用费」账单。",
    "choices": [
      {
        "label": "缩进一个标点符号里",
        "result": "你藏进句号。物业把账单寄给这句话，这句话到现在还没说完",
        "effects": {
          "dignity": 7,
          "penguin": -8
        },
        "set": {
          "speciesQuest": "little",
          "punctuationHome": true
        }
      },
      {
        "label": "要求按影子高度计费",
        "result": "太阳一落山，你的住房面积归零。物业陪你等了一整夜的日出。",
        "effects": {
          "food": 7,
          "dignity": 6
        },
        "set": {
          "speciesQuest": "little",
          "shadowLease": true
        }
      },
      {
        "label": "联合小鱼成立厘米工会",
        "result": "工会宣布每一厘米都应被看见。第一场游行在尺子上顺利举行。",
        "effects": {
          "bond": 12,
          "dignity": 4
        },
        "set": {
          "speciesQuest": "little",
          "centimetreUnion": true
        }
      }
    ],
    "requires": {
      "species": "little"
    }
  },
  {
    "id": "little-12",
    "age": 12,
    "title": "你被认定为法律漏洞",
    "text": "你太小，从规章的字缝里走了过去。法务部认定你是活体漏洞，要求你立刻补上自己。",
    "choices": [
      {
        "label": "在漏洞旁边开一扇门",
        "result": "大家终于有路可走。法务部给门颁发了「合规漏洞」证书。",
        "effects": {
          "bond": 13,
          "dignity": 5
        },
        "set": {
          "speciesLegacy": "little-door"
        }
      },
      {
        "label": "申请把字体调大",
        "result": "字变大了，漏洞也变大了。你带着全家从「不得」二字中间搬了家。",
        "effects": {
          "bond": 11,
          "penguin": -7
        },
        "set": {
          "speciesLegacy": "little-font"
        }
      },
      {
        "label": "把自己写进规章的脚注",
        "result": "从此每条严肃规定下面都有一只小蓝企鹅。读到最后的鹅才会发现你。",
        "effects": {
          "dignity": 12,
          "penguin": -5
        },
        "set": {
          "speciesLegacy": "little-footnote"
        }
      }
    ],
    "requires": {
      "species": "little"
    }
  },
  {
    "id": "little-20",
    "age": 20,
    "title": "你在巨大的世界里拥有一扇小门",
    "text": "你年轻时留下的字缝成为官方通道。大企鹅要求扩建，你发现那会拆掉自己最喜欢的一个逗号。",
    "choices": [
      {
        "label": "保留逗号，让大家侧身过",
        "result": "每只大企鹅都学会低一点头。逗号也学会等一等后面的人。",
        "effects": {
          "bond": 17,
          "dignity": 6
        },
        "set": {
          "speciesEnding": "little-comma"
        }
      },
      {
        "label": "把门开到句子外面",
        "result": "你走出了这段介绍。旁白赶紧跟上，问外面还算不算上班。",
        "effects": {
          "penguin": -15,
          "dignity": 11
        },
        "set": {
          "speciesEnding": "little-outside"
        }
      },
      {
        "label": "把世界缩小到适合拥抱",
        "result": "房子、山、规章都缩小了。只有朋友没有变，抱你的时候仍然很小心。",
        "effects": {
          "bond": 16,
          "penguin": -8
        },
        "set": {
          "speciesEnding": "little-world"
        }
      }
    ],
    "requires": {
      "species": "little",
      "speciesQuest": "little"
    }
  },
  {
    "id": "sea-buffering",
    "age": 3,
    "title": "海面正在加载",
    "text": "你准备下海，海面却停在百分之九十九。进度条说最后百分之一需要你同意成为海的一部分。",
    "choices": [
      {
        "label": "同意，但保留个人鱼权",
        "result": "海把你加入用户协议。你每次游泳，都会收到一条自己同意过的鱼。",
        "effects": {
          "food": 11,
          "penguin": -5
        },
        "set": {
          "seaTerms": true
        }
      },
      {
        "label": "刷新整片海",
        "result": "浪从头再来了一遍。岸边的鹅对自己的出场位置很不满意。",
        "effects": {
          "dignity": 8,
          "bond": -3
        },
        "set": {
          "seaRefresh": true
        }
      },
      {
        "label": "切换到离线海洋",
        "result": "你在冰面上游了半天。海承认你有离线经验，补发一张湿润证明。",
        "effects": {
          "dignity": 6,
          "penguin": -7
        },
        "set": {
          "offlineOcean": true
        }
      }
    ],
    "variant": true
  },
  {
    "id": "perimeter-outage",
    "age": 9,
    "title": "你的周长突然停电",
    "text": "你绕着自己走了一圈，发现周长没有亮。维修员说你的边界欠费，今晚可能与附近企鹅连成一片。",
    "choices": [
      {
        "label": "和邻居共用一个轮廓",
        "result": "你们暂时成为同一只企鹅的两间卧室。晚饭时内部交通拥堵。",
        "effects": {
          "bond": 12,
          "penguin": -8
        },
        "set": {
          "sharedOutline": true
        }
      },
      {
        "label": "拿鱼给边界充电",
        "result": "轮廓亮了。所有鱼都以为你是捕鱼灯，主动来投诉光污染。",
        "effects": {
          "food": 10,
          "dignity": -4
        },
        "set": {
          "chargedBorder": true
        }
      },
      {
        "label": "趁没边界，散开一会儿",
        "result": "你把自己摊成一小片天气。朋友问今天怎么这么像你。",
        "effects": {
          "dignity": 8,
          "penguin": -10
        },
        "set": {
          "becameWeather": true
        }
      }
    ],
    "variant": true
  },
  {
    "id": "tuesday-delete",
    "age": 13,
    "title": "星期二被误删了",
    "text": "管理员清理日历时把星期二拖进了回收站。所有周二出生的鹅开始半透明，你的午饭只剩下「午」。",
    "choices": [
      {
        "label": "从回收站认领星期二",
        "result": "星期二回来后坚持叫你家长。你每周要开一次日历家长会。",
        "effects": {
          "bond": 10,
          "dignity": 4
        },
        "set": {
          "adoptedTuesday": true
        }
      },
      {
        "label": "把星期三复制一份",
        "result": "第二个星期三自己改名叫星期三副本。周末要求增加一个岗位。",
        "effects": {
          "food": 8,
          "penguin": -8
        },
        "set": {
          "copiedWednesday": true
        }
      },
      {
        "label": "请大家先过一个标点",
        "result": "全群落在逗号里休息了一天。事情没有解决，但语气缓和了。",
        "effects": {
          "bond": 8,
          "dignity": 8
        },
        "set": {
          "punctuationDay": true
        }
      }
    ],
    "variant": true
  },
  {
    "id": "sea-scans-you",
    "age": 14,
    "title": "海扫了你一下",
    "text": "你站在岸边，身上的羽毛排列恰好成为二维码。海扫了你一下，跳转到一份已经读完的企鹅使用说明。",
    "choices": [
      {
        "label": "要求海先关注再看",
        "result": "海关注了你。退潮时取关，涨潮时又关注，粉丝数极不稳定。",
        "effects": {
          "bond": 10,
          "penguin": -5
        },
        "set": {
          "oceanFollower": true
        }
      },
      {
        "label": "把说明书设为仅自己可见",
        "result": "你也看不到自己。朋友按照记忆勾勒你的轮廓，画得稍微胖了一点。",
        "effects": {
          "bond": 11,
          "dignity": -4
        },
        "set": {
          "privatePenguin": true
        }
      },
      {
        "label": "更新到下一个企鹅版本",
        "result": "系统提示「请勿在换羽时关闭企鹅」。你原地重启，鱼保持了登录状态。",
        "effects": {
          "dignity": 9,
          "penguin": -9
        },
        "set": {
          "penguinUpdate": true
        }
      }
    ],
    "variant": true
  },
  {
    "id": "gravity-renewal",
    "age": 19,
    "title": "重力自动续费失败",
    "text": "你的重力会员到期，脚底出现「体验版」水印。你每走三步就悬空一次，地面在下面举着续费二维码。",
    "choices": [
      {
        "label": "申请教育优惠",
        "result": "你展示当年滑倒的学习记录。重力认可你的长期投入，赠送终身落地权。",
        "effects": {
          "dignity": 10,
          "penguin": 5
        },
        "set": {
          "gravityScholar": true
        }
      },
      {
        "label": "改用朋友的家庭套餐",
        "result": "朋友把你拉回冰上。你们从此共享同一个「放不下」。",
        "effects": {
          "bond": 15,
          "penguin": -5
        },
        "set": {
          "gravityFamily": true
        }
      },
      {
        "label": "取消订阅，先飘着",
        "result": "你发现天空里全是忘记续费的鹅。大家已经成立物业，收费项目是高度。",
        "effects": {
          "bond": 10,
          "penguin": -12
        },
        "set": {
          "floatingTenant": true
        }
      }
    ],
    "variant": true
  },
  {
    "id": "narrator-resignation",
    "age": 22,
    "title": "旁白申请离职",
    "text": "陪你二十二年的旁白说自己想去当省略号。它的最后一项工作，是问你能不能替它描述一次自己。",
    "choices": [
      {
        "label": "说「它一直都在」",
        "result": "旁白沉默很久，打出六个点。每个点都是它坐下来的样子。",
        "effects": {
          "bond": 14,
          "dignity": 6
        },
        "set": {
          "narratorEllipsis": true
        }
      },
      {
        "label": "批准离职，我自己讲",
        "result": "你第一次叫出下一年的标题。世界愣了一下，开始认真准备。",
        "effects": {
          "dignity": 14,
          "penguin": -6
        },
        "set": {
          "selfNarrator": true
        }
      },
      {
        "label": "邀请它作为角色留下",
        "result": "一只叫旁白的企鹅从句子后面走出来。它终于能吃到自己描写了多年的鱼。",
        "effects": {
          "bond": 16,
          "food": -4
        },
        "set": {
          "narratorPenguin": true
        }
      }
    ],
    "variant": true
  }
];

const additions = typeof module !== 'undefined' && module.exports ? [...require('./events-a.js'),...require('./events-b.js')] : [...root.PenguinEventsA,...root.PenguinEventsB];
const completeEvents=[...events,...additions.map(e=>({...e,edition:3}))];
if (typeof module !== 'undefined' && module.exports) module.exports = completeEvents;
else root.PenguinEvents = completeEvents;
})(typeof window !== 'undefined' ? window : globalThis);
