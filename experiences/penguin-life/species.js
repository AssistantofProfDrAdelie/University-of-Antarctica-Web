/* 18种口径；公开种群估计作游戏权重，非年度出生统计。来源与单位逐项保留。 */
(function(root){
'use strict';
const species=[
  {
    "id": "emperor",
    "label": "帝企鹅",
    "tagline": "皇位自动续费",
    "description": "你没有帝国，但每月都会收到皇位账单。",
    "trait": "体面 +12；欠费不会退位，只会转为试用皇帝。",
    "index": 0,
    "bonus": {
      "dignity": 12
    },
    "ending": "帝国不存在，朕正常参保",
    "status": [
      "皇位尚未激活",
      "王冠试用中，禁止退订",
      "皇位已纳入失业保险"
    ],
    "atlas": "species-atlas.webp",
    "scientificName": "Aptenodytes forsteri",
    "habitat": "南极大陆沿岸的海冰",
    "fact": "帝企鹅会在南极冬季繁殖，亲鸟把蛋托在脚上保温。",
    "factUrl": "https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguin/",
    "flavor": [
      "风把脚边的雪吹成一道道细纹。队伍慢慢挪动，温暖没有固定座位。",
      "黑夜还很长，海冰在脚下轻轻作响。你把今天站成了明天的一部分。",
      "大家轮换位置。寒冷第一次遇到一种不肯独占的东西。"
    ],
    "population": {
      "minPairs": 256500,
      "maxPairs": 256500,
      "weightPairs": 256500.0,
      "sourceYear": 2021,
      "estimateLabel": "2021年论文所引综合估计",
      "sourceUrl": "https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2020.602972/full",
      "sourceTitle": "Frontiers in Marine Science 2021（卷2020）",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "adelie",
    "label": "阿德利企鹅",
    "tagline": "石头本位制",
    "description": "你认为石头可以解决一切。石头暂未反对。",
    "trait": "鹅缘 +12；石头账户由地质部门监管。",
    "index": 1,
    "bonus": {
      "bond": 12
    },
    "ending": "地壳是我的活期存款",
    "status": [
      "石头账户待开户",
      "石头已上市，山体拒绝拆股",
      "板块正在进行年度审计"
    ],
    "atlas": "species-atlas.webp",
    "scientificName": "Pygoscelis adeliae",
    "habitat": "南极沿岸的无冰岩地",
    "fact": "阿德利企鹅有明显的白眼圈，常用小石子筑巢。",
    "factUrl": "https://www.antarctica.gov.au/about-antarctica/animals/penguins/adelie-penguin/",
    "flavor": [
      "石子被海水洗得很光滑。你挑了很久，觉得家应该从一块顺眼的东西开始。",
      "白眼圈映着一片灰蓝的海。潮水把小石头推来，又假装不是它送的。",
      "巢边多了一块石子。没有落款，重量却很认真。"
    ],
    "population": {
      "minPairs": 3790000,
      "maxPairs": 3790000,
      "weightPairs": 3790000.0,
      "sourceYear": 2021,
      "estimateLabel": "2021年论文所引综合估计",
      "sourceUrl": "https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2020.602972/full",
      "sourceTitle": "Frontiers in Marine Science 2021（卷2020）",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "gentoo",
    "label": "巴布亚企鹅",
    "tagline": "因游得快被海限速",
    "description": "你比消息先到。消息要求你等一下它。",
    "trait": "饱腹 +12；海里的测速仪对你保持关注。",
    "index": 2,
    "bonus": {
      "food": 12
    },
    "ending": "因超速被吊销时间",
    "status": [
      "海尚未安装测速仪",
      "你的速度已引起光的注意",
      "昨天正在追赶本鹅"
    ],
    "atlas": "species-atlas.webp",
    "scientificName": "Pygoscelis papua",
    "habitat": "南极半岛及亚南极岛屿的海岸",
    "fact": "巴布亚企鹅头顶有白色宽带，喙呈橙红色。",
    "factUrl": "https://www.antarctica.gov.au/about-antarctica/animals/penguins/gentoo-penguin/",
    "flavor": [
      "橙色的喙掠过水面，白色头带在浪间一闪。海把一条通勤线打开了。",
      "海水从羽毛上滚落，岸边留下几枚湿脚印。它们比你晚到一点。",
      "你在清凉的水里拐了个弯。身后的浪还在学习这个动作。"
    ],
    "population": {
      "minPairs": 387000,
      "maxPairs": 387000,
      "weightPairs": 387000.0,
      "sourceYear": 2021,
      "estimateLabel": "2021年论文所引综合估计",
      "sourceUrl": "https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2020.602972/full",
      "sourceTitle": "Frontiers in Marine Science 2021（卷2020）",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "chinstrap",
    "label": "帽带企鹅",
    "tagline": "下巴线即国境线",
    "description": "下巴的一条黑线，被地图部门画成了边界。",
    "trait": "含鹅量 +12；张嘴前请办理出入境。",
    "index": 3,
    "bonus": {
      "penguin": 12
    },
    "ending": "本人是一个口岸",
    "status": [
      "下巴暂未建关",
      "张嘴属于跨境业务",
      "下巴口岸全年无休"
    ],
    "atlas": "species-atlas.webp",
    "scientificName": "Pygoscelis antarcticus",
    "habitat": "南极半岛周边的岩石海岸",
    "fact": "帽带企鹅的白脸下方有一条细黑线，像扣住帽子的带子。",
    "factUrl": "https://www.antarctica.gov.au/about-antarctica/animals/penguins/chinstrap-penguin/",
    "flavor": [
      "白脸下的细黑线安静地贴着。风再大，也没把这顶不存在的帽子吹掉。",
      "岩岸上有许多相似的叫声。你从中听见自己的名字，虽然未必叫对了。",
      "黑白的群落在海边起伏，像一页写满小小逗号的信。"
    ],
    "population": {
      "minPairs": 3420000,
      "maxPairs": 3420000,
      "weightPairs": 3420000.0,
      "sourceYear": 2021,
      "estimateLabel": "2021年论文所引综合估计",
      "sourceUrl": "https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2020.602972/full",
      "sourceTitle": "Frontiers in Marine Science 2021（卷2020）",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "rockhopper",
    "label": "南跳岩企鹅",
    "tagline": "眉毛拥有独立意见",
    "description": "两侧眉毛各有一个学生会，都不代表你。",
    "trait": "体面 +8、鹅缘 +4；理发需经三方会签。",
    "index": 4,
    "bonus": {
      "dignity": 8,
      "bond": 4
    },
    "ending": "眉毛执政，本鹅旁听",
    "status": [
      "眉毛正在筹备选举",
      "左眉已对右眉发起质询",
      "本体已成为眉毛的附属机构"
    ],
    "atlas": "species-atlas.webp",
    "scientificName": "Eudyptes chrysocome",
    "habitat": "南大洋岛屿的陡峭岩岸",
    "fact": "南跳岩企鹅常在崎岖岩地上跳跃移动，眼上有黄色羽冠。",
    "factUrl": "https://www.antarctica.gov.au/about-antarctica/animals/penguins/southern-rockhopper-penguin/",
    "flavor": [
      "脚下的岩石一层接一层。你跳过去，把路线留给下一次起落。",
      "黄色眉羽被风拨向两边。它们各自看着一片海，你负责站稳。",
      "浪撞上峭壁，碎成很细的白。你从其中一块声音上跳过去。"
    ],
    "population": {
      "minPairs": 1200000,
      "maxPairs": 1200000,
      "weightPairs": 1200000.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "little",
    "label": "小蓝企鹅",
    "tagline": "体积小，法律漏洞大",
    "description": "你不是不见了，只是尚未达到系统的最小识别尺寸。",
    "trait": "含鹅量 -12、鹅缘 +12；可从规章的字缝经过。",
    "index": 5,
    "bonus": {
      "penguin": -12,
      "bond": 12
    },
    "ending": "小到不构成任何问题",
    "status": [
      "系统正在放大本鹅",
      "你已进入规则的字缝",
      "宏观世界申请与你会面"
    ],
    "atlas": "species-atlas.webp",
    "scientificName": "Eudyptula minor",
    "habitat": "澳大利亚南部与新西兰的海岸",
    "fact": "小蓝企鹅体形小，背部羽色呈蓝灰色；并非南极海冰上的居民。",
    "factUrl": "https://teara.govt.nz/en/diagram/6382/penguins-of-the-new-zealand-region",
    "flavor": [
      "蓝灰色的背影藏进暮色。世界没有变大，只是你一直很小。",
      "浪声贴着低低的岸走过。你给自己留了一条刚好能回家的缝。",
      "傍晚的沙还存着一点温度。几枚很小的脚印把海岸慢慢缝起来。"
    ],
    "population": {
      "minPairs": 300000,
      "maxPairs": 300000,
      "weightPairs": 300000.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "king",
    "label": "王企鹅",
    "tagline": "漫长的孵化待办",
    "description": "蛋放在脚背上，日子放在蛋上。你申请把等待列入固定资产。",
    "trait": "体面 +10、鹅缘 +4；孵化期间脚背暂停出租。",
    "index": 0,
    "atlas": "species-atlas-a.webp",
    "bonus": {
      "dignity": 10,
      "bond": 4
    },
    "ending": "脚背上的漫长王国",
    "status": [
      "漫长的孵化待办",
      "世界正在接受你的物种设定",
      "脚背上的漫长王国"
    ],
    "scientificName": "Aptenodytes patagonicus",
    "habitat": "亚南极岛屿的沙砾海岸",
    "fact": "王企鹅颈侧有鲜艳橙黄色斑块，也会把蛋托在脚上孵化。",
    "factUrl": "https://www.antarctica.gov.au/about-antarctica/animals/penguins/king-penguin/",
    "flavor": [
      "橙黄色的颈侧接住了一点日光。脚背上的蛋，让漫长有了具体重量。",
      "沙砾海岸挤着许多相似的背影。你仍会认真听那一个熟悉的声音。",
      "时间经过孵化的脚背，走得比平时轻一些。"
    ],
    "population": {
      "minPairs": 1600000,
      "maxPairs": 1600000,
      "weightPairs": 1600000.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "macaroni",
    "aliases": ["马卡罗尼企鹅", "马可罗尼企鹅", "长眉企鹅"],
    "label": "长冠企鹅",
    "tagline": "金色头冠禁止食用",
    "description": "名字听起来像通心粉，金色头冠却拒绝附赠餐具。",
    "trait": "鹅缘 +10、饱腹 +4；头冠已经聘请造型顾问。",
    "index": 1,
    "atlas": "species-atlas-a.webp",
    "bonus": {
      "bond": 10,
      "food": 4
    },
    "ending": "头发先于本鹅入场",
    "status": [
      "金色头冠禁止食用",
      "世界正在接受你的物种设定",
      "头发先于本鹅入场"
    ],
    "scientificName": "Eudyptes chrysolophus",
    "habitat": "南大洋岛屿的岩岸",
    "fact": "长冠企鹅也叫马卡罗尼企鹅，面部较黑，头顶有醒目的金黄色羽冠。",
    "factUrl": "https://www.antarctica.gov.au/about-antarctica/animals/penguins/macaroni-penguin/",
    "flavor": [
      "金色羽冠在风里分出几束。你不整理它，海风今天有自己的审美。",
      "黑色的脸从浪花后露出来。头冠先干，剩下的鹅慢慢等。",
      "岛上的叫声层层叠叠，像有人翻动一床特别热闹的被子。"
    ],
    "population": {
      "minPairs": 6300000,
      "maxPairs": 6300000,
      "weightPairs": 6300000.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "royal",
    "label": "皇家企鹅",
    "tagline": "白脸由月亮承包",
    "description": "大家把你的白脸当成一面小银幕。电影散场后，月亮忘了离开。",
    "trait": "体面 +12；脸部反光需要预约。",
    "index": 2,
    "atlas": "species-atlas-a.webp",
    "bonus": {
      "dignity": 12
    },
    "ending": "月亮在我脸上加班",
    "status": [
      "白脸由月亮承包",
      "世界正在接受你的物种设定",
      "月亮在我脸上加班"
    ],
    "scientificName": "Eudyptes schlegeli",
    "habitat": "麦夸里岛及邻近小岛的海岸",
    "fact": "皇家企鹅面部通常较白，与面部较黑的长冠企鹅可以区分。",
    "factUrl": "https://www.antarctica.gov.au/about-antarctica/animals/penguins/royal-penguin/",
    "flavor": [
      "白脸上落了一点海雾。太阳看了一眼，决定把光放轻。",
      "麦夸里岛的风绕过羽冠，把远处浪花的消息带回来。",
      "海岸的一天灰白而明亮。你站着，像一张还没写完的明信片。"
    ],
    "population": {
      "minPairs": 500000,
      "maxPairs": 500000,
      "weightPairs": 500000.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "northern-rockhopper",
    "label": "北跳岩企鹅",
    "tagline": "长眉毛正在收听远方",
    "description": "你的长眉毛收到了海对岸的天气。它们说信号不错，不想剪。",
    "trait": "鹅缘 +8、含鹅量 +4；眉毛可接收远洋广播。",
    "index": 3,
    "atlas": "species-atlas-a.webp",
    "bonus": {
      "bond": 8,
      "penguin": 4
    },
    "ending": "远方已接入本鹅眉毛",
    "status": [
      "长眉毛正在收听远方",
      "世界正在接受你的物种设定",
      "远方已接入本鹅眉毛"
    ],
    "scientificName": "Eudyptes moseleyi",
    "habitat": "南大西洋及南印度洋温带岛屿的岩岸",
    "fact": "北跳岩企鹅的黄色饰羽较长，与南跳岩企鹅有别。",
    "factUrl": "https://www.penguinsinternational.org/northern-rockhopper-penguins/",
    "flavor": [
      "温带海岛的风卷起长长饰羽。两边的黄色先到了远处。",
      "你在岩缝间站定。浪把整座岛拍响，又认真退回海里。",
      "眉羽掠过眼侧，像两封还没拆开的远洋来信。"
    ],
    "population": {
      "minPairs": 190000,
      "maxPairs": 230000,
      "weightPairs": 210000.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "区间取中点"
    }
  },
  {
    "id": "fiordland",
    "label": "峡湾企鹅",
    "tagline": "把雨披在身上回家",
    "description": "森林把雨落在你肩上。你以为是欢迎礼，后来才发现它每天都送。",
    "trait": "鹅缘 +10、体面 +4；雨声是你的家庭成员。",
    "index": 4,
    "atlas": "species-atlas-a.webp",
    "bonus": {
      "bond": 10,
      "dignity": 4
    },
    "ending": "一只自带森林回声的鹅",
    "status": [
      "把雨披在身上回家",
      "世界正在接受你的物种设定",
      "一只自带森林回声的鹅"
    ],
    "scientificName": "Eudyptes pachyrhynchus",
    "habitat": "新西兰西南部的雨林海岸",
    "fact": "峡湾企鹅会在沿海森林中筑巢，脸颊常可见细白纹。",
    "factUrl": "https://www.nzbirdsonline.org.nz/species/fiordland-crested-penguin",
    "flavor": [
      "雨水落在蕨叶上，分成许多更小的雨。巢藏在森林靠近海的那一边。",
      "树根间的空气带着湿木头的味道。你从里面听见海。",
      "脸颊的细白纹闪了一下。林下的暗绿把你的轮廓温柔地收好。"
    ],
    "population": {
      "minPairs": 2500,
      "maxPairs": 3000,
      "weightPairs": 2750.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "区间取中点"
    }
  },
  {
    "id": "snares",
    "aliases": ["斯奈尔斯企鹅", "斯纳雷斯企鹅", "斯岛黄眉企鹅"],
    "label": "斯岛企鹅",
    "tagline": "树叶已经认领门牌",
    "description": "树根旁的巢有一片叶子当门。风每次来访，都先敲整座森林。",
    "trait": "鹅缘 +12；门牌号码由树叶随季更新。",
    "index": 5,
    "atlas": "species-atlas-a.webp",
    "bonus": {
      "bond": 12
    },
    "ending": "整座岛都是我的邻居",
    "status": [
      "树叶已经认领门牌",
      "世界正在接受你的物种设定",
      "整座岛都是我的邻居"
    ],
    "scientificName": "Eudyptes robustus",
    "habitat": "新西兰斯纳雷斯群岛的森林与岩岸",
    "fact": "斯岛企鹅在斯纳雷斯群岛繁殖，粗壮喙的基部有明显裸露皮肤。",
    "factUrl": "https://www.doc.govt.nz/nature/native-animals/birds/birds-a-z/penguins/snares-penguin/",
    "flavor": [
      "树叶在巢顶交谈，岩岸在远处回答。家有两种声音。",
      "粗壮的喙从湿叶间探出来。你看了一会儿海，再看一会儿邻居。",
      "岛不大，回家的路却可以走得很慢。每块树根都有熟悉的位置。"
    ],
    "population": {
      "minPairs": 26000,
      "maxPairs": 31000,
      "weightPairs": 28500.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "区间取中点"
    }
  },
  {
    "id": "erect-crested",
    "aliases": ["竖冠企鹅"],
    "label": "翘眉企鹅",
    "tagline": "眉冠与垂直方向合租",
    "description": "黄色羽冠笔直朝上。天空按天收租，你决定让它先提供产权证。",
    "trait": "体面 +12；上方空间需经羽冠会签。",
    "index": 0,
    "atlas": "species-atlas-b.webp",
    "bonus": {
      "dignity": 12
    },
    "ending": "垂直方向由本鹅代管",
    "status": [
      "眉冠与垂直方向合租",
      "世界正在接受你的物种设定",
      "垂直方向由本鹅代管"
    ],
    "scientificName": "Eudyptes sclateri",
    "habitat": "新西兰安蒂波德斯群岛与邦蒂群岛的岩岸",
    "fact": "翘眉企鹅也称竖冠企鹅，其黄色眉冠向上竖起。",
    "factUrl": "https://www.nzbirdsonline.org.nz/species/erect-crested-penguin-tawaki-nana-hi",
    "flavor": [
      "眉冠朝上，脚下是向海伸出的岩石。风从两个方向同时翻页。",
      "黄色饰羽在灰蓝天色中竖着，像几笔不肯躺下的阳光。",
      "海岛没有替你整理羽冠。它只是把风调成了熟悉的方向。"
    ],
    "population": {
      "minPairs": 80000,
      "maxPairs": 80000,
      "weightPairs": 80000.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "yellow-eyed",
    "label": "黄眼企鹅",
    "tagline": "把安静留到明天",
    "description": "你在林边留了一段安静。第二天，它长出了门把手。",
    "trait": "鹅缘 +6、体面 +6；安静不等于没有故事。",
    "index": 1,
    "atlas": "species-atlas-b.webp",
    "bonus": {
      "bond": 6,
      "dignity": 6
    },
    "ending": "世界轻声叫过我的名字",
    "status": [
      "把安静留到明天",
      "世界正在接受你的物种设定",
      "世界轻声叫过我的名字"
    ],
    "scientificName": "Megadyptes antipodes",
    "habitat": "新西兰南部与亚南极岛屿的林边海岸",
    "fact": "黄眼企鹅眼睛呈淡黄色，成鸟头后有黄色带状斑纹。",
    "factUrl": "https://www.nzbirdsonline.org.nz/species/yellow-eyed-penguin",
    "flavor": [
      "淡黄色的眼睛映着林边的光。你等四周安静下来，再迈出下一步。",
      "树叶和海浪之间有一条回家的路，不需要很多脚步。",
      "头后的黄色带子藏进阴影。安静也能把一天过得很完整。"
    ],
    "population": {
      "minPairs": 1700,
      "maxPairs": 1700,
      "weightPairs": 1700.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "已发表的繁殖对估计"
    }
  },
  {
    "id": "african",
    "label": "非洲企鹅",
    "tagline": "海风自带夏日配音",
    "description": "太阳太热，你的叫声又被误认成驴。你决定把阴凉单独留一份。",
    "trait": "鹅缘 +10、饱腹 +4；风扇不负责解释你的口音。",
    "index": 2,
    "atlas": "species-atlas-b.webp",
    "bonus": {
      "bond": 10,
      "food": 4
    },
    "ending": "阴凉是会走路的家",
    "status": [
      "海风自带夏日配音",
      "世界正在接受你的物种设定",
      "阴凉是会走路的家"
    ],
    "scientificName": "Spheniscus demersus",
    "habitat": "南非与纳米比亚的温带海岸",
    "fact": "非洲企鹅生活在非洲南部沿海，叫声常被形容为类似驴鸣。",
    "factUrl": "https://www.penguinsinternational.org/african-penguins/",
    "flavor": [
      "非洲海岸的光很亮，海水却凉。你把身体靠近一小块阴影。",
      "一声粗粗的鸣叫落在海风里。邻居听见了，回你一句差不多的。",
      "沙和岩石存着日光，浪花送来凉意。你在两者之间选了一个刚好的位置。"
    ],
    "population": {
      "minPairs": 9900,
      "maxPairs": 9900,
      "weightPairs": 9900.0,
      "sourceYear": 2025,
      "estimateLabel": "2023年成熟个体估计÷2",
      "sourceUrl": "https://www.birdlife.org.za/red-data-book/red-list/african-penguin/",
      "sourceTitle": "BirdLife South Africa 2025",
      "inputUnit": "成熟个体",
      "inputValue": 19800,
      "method": "成熟个体数除以2，用作繁殖对等价权重"
    }
  },
  {
    "id": "magellanic",
    "label": "麦哲伦企鹅",
    "tagline": "地洞里住着另一条海岸",
    "description": "你钻进地洞，带出一小片海。海关说这是携带家乡，不算超重。",
    "trait": "饱腹 +8、鹅缘 +6；胸前两条带子互不收费。",
    "index": 3,
    "atlas": "species-atlas-b.webp",
    "bonus": {
      "food": 8,
      "bond": 6
    },
    "ending": "把整个海岸折进地洞",
    "status": [
      "地洞里住着另一条海岸",
      "世界正在接受你的物种设定",
      "把整个海岸折进地洞"
    ],
    "scientificName": "Spheniscus magellanicus",
    "habitat": "南美洲南部的海岸与地洞",
    "fact": "麦哲伦企鹅胸前有两条黑带，常利用地洞或植被遮蔽筑巢。",
    "factUrl": "https://www.penguinsinternational.org/magellanic-penguins/",
    "flavor": [
      "两条黑色胸带被沙砾衬得分明。洞口后面，是海风拐不过来的地方。",
      "你从地洞探出头，远处的浪正把南美海岸一寸寸擦亮。",
      "沙落在背上，细得几乎没有重量。家却因此有了清楚的形状。"
    ],
    "population": {
      "minPairs": 1200000,
      "maxPairs": 1600000,
      "weightPairs": 1400000.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "区间取中点"
    }
  },
  {
    "id": "humboldt",
    "label": "洪堡企鹅",
    "tagline": "寒流是我的通勤线路",
    "description": "岸上晒得发白，海里仍然凉。你把一股寒流装进饭盒，准备带去上班。",
    "trait": "饱腹 +12；寒流月票不接受热情充值。",
    "index": 4,
    "atlas": "species-atlas-b.webp",
    "bonus": {
      "food": 12
    },
    "ending": "一股寒流在等我下班",
    "status": [
      "寒流是我的通勤线路",
      "世界正在接受你的物种设定",
      "一股寒流在等我下班"
    ],
    "scientificName": "Spheniscus humboldti",
    "habitat": "秘鲁和智利受洪堡寒流影响的干旱海岸",
    "fact": "洪堡企鹅生活在秘鲁和智利沿岸，寒冷而富营养的洋流支持其觅食。",
    "factUrl": "https://www.penguinsinternational.org/humboldt-penguins/",
    "flavor": [
      "岸上干燥，水里清凉。寒流把一张看不见的餐桌铺到海面以下。",
      "沙岩的颜色被太阳晒淡了。你走向蓝色更深的那一边。",
      "浪带着凉意上岸，像有人把远方洗过再寄给你。"
    ],
    "population": {
      "minPairs": 15000,
      "maxPairs": 20000,
      "weightPairs": 17500.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "区间取中点"
    }
  },
  {
    "id": "galapagos",
    "label": "加拉帕戈斯企鹅",
    "tagline": "赤道正在借我的阴影",
    "description": "你在赤道附近向太阳申请半天假。太阳说可以，但影子要留下值班。",
    "trait": "含鹅量 -6、鹅缘 +10；阴影按实际使用面积结算。",
    "index": 5,
    "atlas": "species-atlas-b.webp",
    "bonus": {
      "penguin": -6,
      "bond": 10
    },
    "ending": "我把赤道挪到阴凉里",
    "status": [
      "赤道正在借我的阴影",
      "世界正在接受你的物种设定",
      "我把赤道挪到阴凉里"
    ],
    "scientificName": "Spheniscus mendiculus",
    "habitat": "加拉帕戈斯群岛的火山岩岸",
    "fact": "加拉帕戈斯企鹅生活在赤道附近；遮阴和冷水对它们很重要。",
    "factUrl": "https://www.penguinsinternational.org/galapagos-penguins/",
    "flavor": [
      "黑色火山岩在日光下发热。你找到阴影，先让一双脚安顿下来。",
      "赤道附近的海也有清凉的一面。你沿着浪的边缘慢慢找。",
      "太阳把影子压得很短。你仍替自己留住了那一点点阴凉。"
    ],
    "population": {
      "minPairs": 750,
      "maxPairs": 2300,
      "weightPairs": 1525.0,
      "sourceYear": 2013,
      "estimateLabel": "2013年汇编；原调查年份不一",
      "sourceUrl": "https://www.pew.org/en/research-and-analysis/data-visualizations/2013/penguins-trends-and-threats",
      "sourceTitle": "Pew / Penguins: Natural History and Conservation 2013",
      "inputUnit": "繁殖对",
      "inputValue": null,
      "method": "区间取中点"
    }
  }
];
if(typeof module!=='undefined'&&module.exports)module.exports=species;else root.PenguinSpecies=species;
})(typeof window!=='undefined'?window:globalThis);
