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
  }
];

if (typeof module !== 'undefined' && module.exports) module.exports = events;
else root.PenguinEvents = events;
})(typeof window !== 'undefined' ? window : globalThis);
