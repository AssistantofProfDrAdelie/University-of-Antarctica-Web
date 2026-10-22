/* 原创扩展A：王、马卡罗尼、皇家、北跳岩、峡湾、斯奈尔斯。
真实特征参考：BAS king；Australian Antarctic Program macaroni；NZ Birds Online royal/northern rockhopper；NZ DOC Fiordland/Snares。
https://legacy.bas.ac.uk/about_antarctica/wildlife/birds/penguins/king.php
https://www.antarctica.gov.au/about-antarctica/animals/penguins/macaroni-penguin/
https://www.nzbirdsonline.org.nz/species/royal-penguin
https://www.nzbirdsonline.org.nz/species/northern-rockhopper-penguin
https://www.doc.govt.nz/nature/native-animals/birds/birds-a-z/penguins/snares-penguin/
所有情节均为原创虚构，真实特征仅作为创意起点。 */
(function(root){'use strict';
const events = [
  {
    "id": "king-calendar-4",
    "age": 4,
    "title": "你的脚背比日历忙",
    "text": "你是一只王企鹅，长辈教你把蛋稳稳托在脚上。你练习得很认真，站到日历翻页时，脚背上的小蛋仍没有任何下班的意思。隔壁十二月探头问：明年能借这里站一会儿吗？",
    "choices": [
      {
        "label": "允许十二月临时落脚",
        "result": "十二月脱掉日期，轻轻站在你旁边。此后你走到哪里，哪里就多出一小段年末，大家开始提前带着鱼来拜访。",
        "effects": {
          "bond": 8,
          "food": 3
        },
        "set": {
          "speciesQuest": "king"
        }
      },
      {
        "label": "给蛋单独编一本日历",
        "result": "你画的每一页都是今天。蛋没有催促过你，日历却慢慢学会等待，撕下的纸也不再掉到地上，而是安静地叠在脚边。",
        "effects": {
          "dignity": 8,
          "penguin": -3
        },
        "set": {
          "speciesQuest": "king"
        }
      },
      {
        "label": "请明年负责换班",
        "result": "明年提早到了，身上还带着新纸的气味。它站了一会儿，承认自己从未想过，一个今天居然能有这样的重量。",
        "effects": {
          "bond": 6,
          "dignity": 4
        },
        "set": {
          "speciesQuest": "king"
        }
      }
    ],
    "requires": {
      "species": "king"
    }
  },
  {
    "id": "king-calendar-12",
    "age": 12,
    "title": "别人过年，你过孵化季",
    "text": "你脚边那本日历长成了一栋很窄的屋子，住着没赶上同一季节的月份。楼下卖鱼，楼上晾着不同年份的风。门牌写着：请按自己的速度成熟，不统一敲钟。",
    "choices": [
      {
        "label": "开一家跨年托管所",
        "result": "三月把还没学会开花的春天送来了。你没有追问成绩，只让它跟小鹅坐一桌，午后屋里便长出了一点迟到的绿。",
        "effects": {
          "bond": 12,
          "food": -3
        },
        "set": {
          "speciesLegacy": "king-calendar-12-0"
        }
      },
      {
        "label": "把时钟改成脚步声",
        "result": "钟不再数秒，只记录你挪动脚掌的声音。群落听见这种缓慢的节奏，终于肯把一顿晚饭吃成整整一个晚上。",
        "effects": {
          "dignity": 9,
          "bond": 5
        },
        "set": {
          "speciesLegacy": "king-calendar-12-1"
        }
      },
      {
        "label": "让每个月自己取名字",
        "result": "原来的六月叫作鱼很鲜，十一月改名为等一等。邮差抱着一叠找不到地址的信，却第一次觉得自己没有迟到。",
        "effects": {
          "penguin": -5,
          "bond": 10
        },
        "set": {
          "speciesLegacy": "king-calendar-12-2"
        }
      }
    ],
    "requires": {
      "species": "king"
    }
  },
  {
    "id": "king-calendar-20",
    "age": 20,
    "title": "日历终于从你的脚背毕业",
    "text": "日历屋里的月份陆续长大，决定去不同的地方任职。它们送你一张空白年历，说这次不用再替谁托着时间。你低头看见脚背空了，竟然听得到海在更远处呼吸。",
    "choices": [
      {
        "label": "给自己留一个没有日期的下午",
        "result": "那天下午没有进入任何年份。你慢慢吃鱼，慢慢站着，太阳反复问是否可以落下，你说再等一小会儿，它就真的等了。",
        "effects": {
          "bond": 10,
          "food": 8
        },
        "set": {
          "speciesEnding": "king-calendar-20-0"
        },
        "endingTitle": "终身拥有一个无日期下午"
      },
      {
        "label": "把空白日历折成船",
        "result": "船载着没用完的日子出海了。后来总有小鹅收到一张白纸，背面写着：不着急，这一天还没有被谁过掉。",
        "effects": {
          "dignity": 10,
          "bond": 10
        },
        "set": {
          "speciesEnding": "king-calendar-20-1"
        },
        "endingTitle": "把没过完的日子寄给后来者"
      },
      {
        "label": "重新学习不托东西地走路",
        "result": "你先迈出左脚，又不太放心地看了一眼右脚。没有世界因此掉下去，只有一阵风过来，替你把胸前的羽毛理顺。",
        "effects": {
          "penguin": 8,
          "bond": 10
        },
        "set": {
          "speciesEnding": "king-calendar-20-2"
        },
        "endingTitle": "终于空着脚背散步"
      }
    ],
    "requires": {
      "species": "king",
      "speciesQuest": "king"
    }
  },
  {
    "id": "macaroni-gold-4",
    "age": 4,
    "title": "头上的金色拒绝成为装饰",
    "text": "你是一只马卡罗尼企鹅，金黄色冠羽每天比你先醒。今天它们在晨光里抖出一封信，说想辞去发型，改行担任真正的日出。你照镜子时，镜子已经眯起了眼。",
    "choices": [
      {
        "label": "同意冠羽轮流值早班",
        "result": "太阳得到了一次难得的懒觉。你头顶亮起几根细细的早晨，走过的石头都被照得很有精神，主动开始滚动。",
        "effects": {
          "dignity": 8,
          "bond": 5
        },
        "set": {
          "speciesQuest": "macaroni"
        }
      },
      {
        "label": "要求日出先交房租",
        "result": "冠羽交来一小撮金色。食堂把它当作调味料撒进汤里，整锅汤开始向东方移动，你只好端着碗一起上路。",
        "effects": {
          "food": 8,
          "penguin": -4
        },
        "set": {
          "speciesQuest": "macaroni"
        }
      },
      {
        "label": "给它们留一条通往海面的路",
        "result": "金色顺着你的背流下去，在海上铺出一条窄路。第一条走过来的鱼说，它原本只是想看看天怎么亮的。",
        "effects": {
          "bond": 9,
          "penguin": -3
        },
        "set": {
          "speciesQuest": "macaroni"
        }
      }
    ],
    "requires": {
      "species": "macaroni"
    }
  },
  {
    "id": "macaroni-gold-12",
    "age": 12,
    "title": "你被邀请参加黎明的试吃",
    "text": "头上的金色经营日出多年，终于端来三种新品：脆的早晨、带海盐的早晨，以及适合睡过头的温热早晨。它们邀请你先尝一口，承诺不会影响真正的太阳营业。",
    "choices": [
      {
        "label": "选适合睡过头的那份",
        "result": "这种早晨不催任何鹅。大家醒来时，鱼汤仍是热的，昨天没说完的话也还放在桌上，像一条没有被收走的小路。",
        "effects": {
          "food": 10,
          "bond": 8
        },
        "set": {
          "speciesLegacy": "macaroni-gold-12-0"
        }
      },
      {
        "label": "把海盐早晨寄给远方",
        "result": "信封边缘慢慢结出亮晶晶的盐。收信的鹅第一次尝到你的海，它没有回长信，只寄来自己那边一小片安静。",
        "effects": {
          "bond": 12,
          "food": -3
        },
        "set": {
          "speciesLegacy": "macaroni-gold-12-1"
        }
      },
      {
        "label": "建议生产可以关灯的早晨",
        "result": "你们研制出一个柔软的开关。失眠的鹅按下去，世界便暂时不要求它明亮，它因此愿意在明天再试一次。",
        "effects": {
          "dignity": 9,
          "penguin": -5
        },
        "set": {
          "speciesLegacy": "macaroni-gold-12-2"
        }
      }
    ],
    "requires": {
      "species": "macaroni"
    }
  },
  {
    "id": "macaroni-gold-20",
    "age": 20,
    "title": "你的头发想退休成夕阳",
    "text": "冠羽告诉你，做了一辈子日出，想试试把一天轻轻放下。它们已选好一片背风的海，打算每天在那里慢慢变暗。你抬头时，发现自己的头顶已经有一点黄昏。",
    "choices": [
      {
        "label": "允许夕阳偶尔不上班",
        "result": "那天的黄昏坐在你旁边吃鱼，没有急着染红任何东西。大家说天色平常，你却知道它正在过一种终于属于自己的生活。",
        "effects": {
          "bond": 12,
          "food": 6
        },
        "set": {
          "speciesEnding": "macaroni-gold-20-0"
        },
        "endingTitle": "头顶夕阳，本鹅准时吃饭"
      },
      {
        "label": "把一点金色借给深海",
        "result": "你把金色封进小瓶，送到从未见过日出的地方。回来时瓶子里装着黑暗的谢意，摸起来很凉，却一点也不空。",
        "effects": {
          "dignity": 10,
          "bond": 10
        },
        "set": {
          "speciesEnding": "macaroni-gold-20-1"
        },
        "endingTitle": "向深海出借一撮黎明"
      },
      {
        "label": "和冠羽一起改行当普通发型",
        "result": "你们郑重练习了如何什么也不照亮。镜子松了口气，说这样也很好看，而你终于能盯着自己看上一整分钟。",
        "effects": {
          "penguin": 10,
          "dignity": 6
        },
        "set": {
          "speciesEnding": "macaroni-gold-20-2"
        },
        "endingTitle": "停止发光，也非常体面"
      }
    ],
    "requires": {
      "species": "macaroni",
      "speciesQuest": "macaroni"
    }
  },
  {
    "id": "royal-face-4",
    "age": 4,
    "title": "白脸被误认为一张待填的纸",
    "text": "你是一只皇家企鹅，住在风很有主见的麦夸里岛。你的浅色脸被一位路过的诗人认作空白稿纸，它举着羽毛问能否写两句。你还没开口，海风已替你翻到了下一页。",
    "choices": [
      {
        "label": "只允许它写天气",
        "result": "诗人写下一阵小雨。你脸上没有湿，身边却多了一把小小的伞，它只给走得慢的鹅遮，态度非常专一。",
        "effects": {
          "bond": 8,
          "dignity": 4
        },
        "set": {
          "speciesQuest": "royal"
        }
      },
      {
        "label": "在脸上签收今日海风",
        "result": "海风按下一个看不见的指印。此后你抬头就能听到远方的潮声，有时还夹着一条鱼对晚饭的不同看法。",
        "effects": {
          "penguin": -4,
          "food": 8
        },
        "set": {
          "speciesQuest": "royal"
        }
      },
      {
        "label": "声明本人不是空白",
        "result": "诗人认真道歉，把未写出的那首诗递给你。它轻得没有重量，却总能在你冷的时候，把胸口挡住一小块。",
        "effects": {
          "dignity": 10,
          "bond": 5
        },
        "set": {
          "speciesQuest": "royal"
        }
      }
    ],
    "requires": {
      "species": "royal"
    }
  },
  {
    "id": "royal-face-12",
    "age": 12,
    "title": "你的脸收到一场岛屿朗诵会",
    "text": "这些年，风不断把别处的句子送到你面前。麦夸里岛想借你的浅色脸做一次露天朗诵，观众包括海浪、草叶和刚换完羽的邻居。节目单上，你被列为场地，也列为本人。",
    "choices": [
      {
        "label": "给本人单独留一个座位",
        "result": "你坐到自己的脸旁边，终于从观众席看了一次自己。台上的你有点紧张，台下的你给了它一条很有分量的鱼。",
        "effects": {
          "bond": 10,
          "food": 5
        },
        "set": {
          "speciesLegacy": "royal-face-12-0"
        }
      },
      {
        "label": "让风先读它没说完的话",
        "result": "风突然安静了很久，然后只说了一句回来吧。许多鹅抬起头，仿佛第一次知道，吹过身边的也可能是在等待。",
        "effects": {
          "bond": 13,
          "penguin": -3
        },
        "set": {
          "speciesLegacy": "royal-face-12-1"
        }
      },
      {
        "label": "要求海浪不要总重复副歌",
        "result": "海浪练习了新句子，拍岸时发出一种生疏的节拍。大家还是听懂了，因为那天所有鹅都愿意多听一会儿。",
        "effects": {
          "dignity": 8,
          "bond": 8
        },
        "set": {
          "speciesLegacy": "royal-face-12-2"
        }
      }
    ],
    "requires": {
      "species": "royal"
    }
  },
  {
    "id": "royal-face-20",
    "age": 20,
    "title": "把自己从所有比喻里领回来",
    "text": "朗诵会结束很多年，仍有游客来问你的脸今天演什么。你翻出当年的节目单，发现本人一栏一直没有退场。海风把一面小镜子放在岸边，等你决定如何署名。",
    "choices": [
      {
        "label": "签名为今天也来吃饭的鹅",
        "result": "从此节目单少了一个场地，多了一位常客。没有谁再要求你表达什么，但每次你出现，大家还是会往旁边挪一点。",
        "effects": {
          "bond": 12,
          "food": 7
        },
        "set": {
          "speciesEnding": "royal-face-20-0"
        },
        "endingTitle": "本人到场，比喻散会"
      },
      {
        "label": "把脸借给一片不会写字的云",
        "result": "云什么也没写，只在你脸前停了一下午。后来它飘走了，许多路过的鹅说自己读懂了，却谁也没有催你解释。",
        "effects": {
          "dignity": 11,
          "penguin": -5
        },
        "set": {
          "speciesEnding": "royal-face-20-1"
        },
        "endingTitle": "为一片云保留空白"
      },
      {
        "label": "将那首未写的诗寄回海里",
        "result": "海收下了轻得没有重量的信。你以后每次低头，都能看见一小段没有被命名的自己，安静地站在水里。",
        "effects": {
          "bond": 10,
          "penguin": 8
        },
        "set": {
          "speciesEnding": "royal-face-20-2"
        },
        "endingTitle": "把自己从诗里领回家"
      }
    ],
    "requires": {
      "species": "royal",
      "speciesQuest": "royal"
    }
  },
  {
    "id": "northern-rockhopper-plumes-4",
    "age": 4,
    "title": "冠羽长得超过了天气预报",
    "text": "你是一只北跳岩企鹅，长长的黄色冠羽在风里各走各的路。今早它们伸到了天气预报的边缘，一根说那边有晴天，另一根说那边的晴天正在收拾行李。你只想知道出门要不要带鱼。",
    "choices": [
      {
        "label": "允许一根冠羽先去探路",
        "result": "它寄回一张没有画面的明信片，摸起来却是晴的。你把它放在饭桌上，桌上的鱼因此拥有了一个晒得到太阳的角落。",
        "effects": {
          "food": 7,
          "bond": 7
        },
        "set": {
          "speciesQuest": "northern-rockhopper"
        }
      },
      {
        "label": "把两根冠羽编成天气辫",
        "result": "晴和雨被编在了一起，谁也没法单独闹脾气。群落第一次经历了很有秩序的乱天气，晾鱼的鹅表示可以接受。",
        "effects": {
          "dignity": 10,
          "penguin": -4
        },
        "set": {
          "speciesQuest": "northern-rockhopper"
        }
      },
      {
        "label": "决定带鱼，不带预报",
        "result": "你出门时遇到了三种天气，都对你的准备表示满意。剩下的那条鱼在晚饭时告诉你，其实它很喜欢听雨。",
        "effects": {
          "food": 10,
          "dignity": 3
        },
        "set": {
          "speciesQuest": "northern-rockhopper"
        }
      }
    ],
    "requires": {
      "species": "northern-rockhopper"
    }
  },
  {
    "id": "northern-rockhopper-plumes-12",
    "age": 12,
    "title": "远方把你的冠羽当成车站",
    "text": "冠羽越长越远，别的岛开始在末端挂站牌。风从一侧上车，带着盐和陌生的气味在另一侧下车。你头顶挤满了回家的天气，唯独你自己的方向还没有确定。",
    "choices": [
      {
        "label": "给慢风增加一个站台",
        "result": "那阵总赶不上季节的慢风终于有地方等。它把你周围的世界吹得很缓，海浪拍到岸边时，大家甚至来得及说请进。",
        "effects": {
          "bond": 12,
          "dignity": 5
        },
        "set": {
          "speciesLegacy": "northern-rockhopper-plumes-12-0"
        }
      },
      {
        "label": "把末班风改成随到随走",
        "result": "风不再追着时间跑，许多失散的气味慢慢找回原来的岛。你收到远方来信，信纸上闻得到一顿刚做好的晚饭。",
        "effects": {
          "bond": 10,
          "food": 5
        },
        "set": {
          "speciesLegacy": "northern-rockhopper-plumes-12-1"
        }
      },
      {
        "label": "暂停运营，给自己梳头",
        "result": "所有风都站在门外等你。你认真理顺一根羽毛，听到世界在外面礼貌地清嗓子，却第一次没有立刻出去迎接。",
        "effects": {
          "dignity": 12,
          "penguin": 4
        },
        "set": {
          "speciesLegacy": "northern-rockhopper-plumes-12-2"
        }
      }
    ],
    "requires": {
      "species": "northern-rockhopper"
    }
  },
  {
    "id": "northern-rockhopper-plumes-20",
    "age": 20,
    "title": "你的发梢已成为地图边缘",
    "text": "如今有鹅沿着你的冠羽旅行，走到末端便以为看见了世界尽头。你把头轻轻偏向海，一整条航线跟着转了弯。远方来询问，你愿意把哪一段留给自己。",
    "choices": [
      {
        "label": "保留通往家门的最后一厘米",
        "result": "地图上多出一条只有你知道的小路。别人从上面经过，只会闻到鱼汤；你经过时，门里总有一阵熟悉的风。",
        "effects": {
          "bond": 12,
          "food": 8
        },
        "set": {
          "speciesEnding": "northern-rockhopper-plumes-20-0"
        },
        "endingTitle": "地图再大，发梢仍通向家"
      },
      {
        "label": "把冠羽交还给风做长椅",
        "result": "风坐下来时，所有岛都短暂地安静了。你没有再提供任何方向，只听到远处有鹅说，今天的世界坐着也很好。",
        "effects": {
          "dignity": 10,
          "bond": 10
        },
        "set": {
          "speciesEnding": "northern-rockhopper-plumes-20-1"
        },
        "endingTitle": "远方坐下，本鹅歇一会儿"
      },
      {
        "label": "宣布这里从来不是尽头",
        "result": "你轻轻抖了抖头，原本的世界边缘便向外散开。后来出发的鹅都带上了鱼，却不再要求你保证终点。",
        "effects": {
          "penguin": -6,
          "dignity": 12
        },
        "set": {
          "speciesEnding": "northern-rockhopper-plumes-20-2"
        },
        "endingTitle": "把世界边缘抖远一点"
      }
    ],
    "requires": {
      "species": "northern-rockhopper",
      "speciesQuest": "northern-rockhopper"
    }
  },
  {
    "id": "fiordland-rain-4",
    "age": 4,
    "title": "森林为你保管一场雨",
    "text": "你是一只峡湾企鹅，在林下找到一小片能落脚的地方。树叶说这里的雨太多，想请你代存一场。它递来一个没有底的杯子，杯里装着雨停以后仍然留在空气中的声音。",
    "choices": [
      {
        "label": "把雨放在门口当门铃",
        "result": "有客人来时，门口便下一小阵雨。你总能提前听见脚步，却从没弄湿谁；连太阳来拜访，也郑重收好了光。",
        "effects": {
          "bond": 9,
          "dignity": 4
        },
        "set": {
          "speciesQuest": "fiordland"
        }
      },
      {
        "label": "用它煮一锅很慢的汤",
        "result": "汤里没有多余的水，只有树叶被轻轻敲过的气味。邻居们喝完都说想起什么，却谁也想不起那件事具体发生在哪一年。",
        "effects": {
          "food": 11,
          "bond": 4
        },
        "set": {
          "speciesQuest": "fiordland"
        }
      },
      {
        "label": "问森林何时来取",
        "result": "森林说等它学会不下雨的时候。你望着层层树叶，觉得这个期限很适合长期相处，于是把杯子放在最稳的石头上。",
        "effects": {
          "bond": 10,
          "penguin": -3
        },
        "set": {
          "speciesQuest": "fiordland"
        }
      }
    ],
    "requires": {
      "species": "fiordland"
    }
  },
  {
    "id": "fiordland-rain-12",
    "age": 12,
    "title": "你寄存的雨长成一条走廊",
    "text": "那场被你收好的雨越下越细，终于在树林与海之间搭起一条走廊。走廊没有屋顶，却从不淋湿路过的鹅。雨邀请你替它选一个用途，树叶都在外面等消息。",
    "choices": [
      {
        "label": "让归来的鹅先走",
        "result": "每只回来的鹅都能在走廊里抖掉一点远方。地面没有变湿，倒长出几处小小的放心，踩上去十分柔软。",
        "effects": {
          "bond": 13,
          "food": 3
        },
        "set": {
          "speciesLegacy": "fiordland-rain-12-0"
        }
      },
      {
        "label": "开放给想安静待着的鹅",
        "result": "走廊没有问来客为什么不说话。大家各站一段，雨替它们轻轻响着，等想说的时候，彼此已经很熟悉。",
        "effects": {
          "bond": 12,
          "dignity": 5
        },
        "set": {
          "speciesLegacy": "fiordland-rain-12-1"
        }
      },
      {
        "label": "把走廊接到昨天的饭桌",
        "result": "昨晚没吃完的鱼还放在那里。你并不打算改变什么，只回去把灯关好，然后带着今天的肚子慢慢走回来。",
        "effects": {
          "food": 9,
          "penguin": -5
        },
        "set": {
          "speciesLegacy": "fiordland-rain-12-2"
        }
      }
    ],
    "requires": {
      "species": "fiordland"
    }
  },
  {
    "id": "fiordland-rain-20",
    "age": 20,
    "title": "森林来取它年轻时的雨",
    "text": "森林终于来到门口，树干比从前粗了许多。它看着那条走廊，说没想到当年的一场雨被你养得这样会照顾人。它想带雨回去，也愿意听听你还有什么安排。",
    "choices": [
      {
        "label": "留下门口的一小声雨响",
        "result": "雨回到林间后，你家门口仍会在熟悉的脚步到来时轻响。你知道那不是天气，只是一段很久以前的招呼还在。",
        "effects": {
          "bond": 13,
          "dignity": 6
        },
        "set": {
          "speciesEnding": "fiordland-rain-20-0"
        },
        "endingTitle": "门口永远留着一小场雨"
      },
      {
        "label": "请森林也进来坐坐",
        "result": "树挪得很慢，但你没有撤掉任何一张椅子。那天的晚饭吃到苔藓都觉得饱了，森林第一次作为客人被好好招待。",
        "effects": {
          "food": 8,
          "bond": 12
        },
        "set": {
          "speciesEnding": "fiordland-rain-20-1"
        },
        "endingTitle": "请整座森林来吃晚饭"
      },
      {
        "label": "跟着雨去看它的新家",
        "result": "你走进林子，发现每片叶子都认得你的脚步。原来你替雨保管的那些年，它也一直替你留着一条不用解释的路。",
        "effects": {
          "penguin": 8,
          "bond": 12
        },
        "set": {
          "speciesEnding": "fiordland-rain-20-2"
        },
        "endingTitle": "沿着雨声走回另一种家"
      }
    ],
    "requires": {
      "species": "fiordland",
      "speciesQuest": "fiordland"
    }
  },
  {
    "id": "snares-forest-4",
    "age": 4,
    "title": "树林把影子排成了邻居",
    "text": "你是一只斯奈尔斯企鹅，在岛上的林下与许多同类一起筑巢。今天树影挤得比鹅还密，大家只好给影子分门牌。一片长得像家的阴凉停在你面前，问这里能不能算它的住处。",
    "choices": [
      {
        "label": "给它留半块石头的位置",
        "result": "影子安顿下来，每天替你把正午折小一点。它不吃鱼，却总在开饭时坐得很认真，好像坐在一起也是一种饱。",
        "effects": {
          "bond": 9,
          "food": 5
        },
        "set": {
          "speciesQuest": "snares"
        }
      },
      {
        "label": "请树影帮大家画巢区地图",
        "result": "地图随着太阳慢慢移动。大家起初总走错，后来发现每条错路都经过朋友家，群落因此增加了许多顺便吃饭的机会。",
        "effects": {
          "bond": 10,
          "dignity": 4
        },
        "set": {
          "speciesQuest": "snares"
        }
      },
      {
        "label": "与它约定轮流当房子",
        "result": "白天它遮着你，夜里你站在原地，让它知道第二天该从哪里开始。树叶看了很久，说这种房租很适合长住。",
        "effects": {
          "dignity": 8,
          "penguin": -3
        },
        "set": {
          "speciesQuest": "snares"
        }
      }
    ],
    "requires": {
      "species": "snares"
    }
  },
  {
    "id": "snares-forest-12",
    "age": 12,
    "title": "整片树荫想跟你去海边",
    "text": "多年来，巢区的影子已经学会了你的脚步。今天它们听说海面没有树，决定结伴去送一点阴凉。你带着一整片林下的安静走向岸边，身后没有树倒下，只有叶子轻轻点头。",
    "choices": [
      {
        "label": "给鱼也撑一会儿凉",
        "result": "鱼第一次在水里看见树荫，游得慢了下来。你们谁也没有立刻讨论晚饭，只在同一片凉意里，安静待到潮水换班。",
        "effects": {
          "bond": 12,
          "food": -3
        },
        "set": {
          "speciesLegacy": "snares-forest-12-0"
        }
      },
      {
        "label": "把树荫寄给远行的邻居",
        "result": "你把阴凉折进空信封。邻居回信说，它在很晒的海上打开信时，忽然听见了从前巢边两片叶子碰在一起的声音。",
        "effects": {
          "bond": 14,
          "dignity": 3
        },
        "set": {
          "speciesLegacy": "snares-forest-12-1"
        }
      },
      {
        "label": "让树荫自己决定停在哪里",
        "result": "它们挑中一块无人注意的小石滩。几天后那里聚起许多休息的鹅，大家叫它新家，你只是知道那边现在不太晒。",
        "effects": {
          "dignity": 10,
          "bond": 7
        },
        "set": {
          "speciesLegacy": "snares-forest-12-2"
        }
      }
    ],
    "requires": {
      "species": "snares"
    }
  },
  {
    "id": "snares-forest-20",
    "age": 20,
    "title": "你的门牌被树林收藏了",
    "text": "岛上的老树要整理一生见过的住户，来向你借当年的影子门牌。你把石头翻过来，发现背面写满许多鹅曾在这里坐过的时间。树说它想把这块石头长进年轮里。",
    "choices": [
      {
        "label": "把名字留在一圈年轮中",
        "result": "你的名字变成一段很慢的圆。后来有鹅靠着树休息，会莫名觉得这处阴凉熟悉，仿佛有人早已替它留好位置。",
        "effects": {
          "bond": 14,
          "dignity": 5
        },
        "set": {
          "speciesEnding": "snares-forest-20-0"
        },
        "endingTitle": "名字长进树的年轮"
      },
      {
        "label": "要求给后来者留一块空白",
        "result": "树认真空出一圈，不写任何名字。新来的鹅在那儿坐下时，没有被问来自哪里，只有一片叶子替它挡住了光。",
        "effects": {
          "bond": 12,
          "penguin": 5
        },
        "set": {
          "speciesEnding": "snares-forest-20-1"
        },
        "endingTitle": "替下一只鹅预留阴凉"
      },
      {
        "label": "把门牌重新放回巢边",
        "result": "你说树可以来认门，不必把家搬走。它果然每年都伸来一点新枝条，好像在门口轻轻敲两下，问今天鱼够不够。",
        "effects": {
          "food": 7,
          "bond": 13
        },
        "set": {
          "speciesEnding": "snares-forest-20-2"
        },
        "endingTitle": "树每年都来认一次门"
      }
    ],
    "requires": {
      "species": "snares",
      "speciesQuest": "snares"
    }
  },
  {
    "id": "a-variant-fish-breath-1",
    "age": 1,
    "title": "鱼把海忘在了你家",
    "text": "一条鱼来避雨，临走时忘了带走它身上的海。你家地面没有积水，却开始按潮汐轻轻起伏。母亲说先别急着退货，万一这片海只是第一次离开鱼，不知道该往哪里走。",
    "choices": [
      {
        "label": "替它铺一张小床",
        "result": "海在床上缩成很小的一团，睡觉时仍有船从梦里经过。你替船盖好被子，第二天醒来，枕边多了一点很轻的盐。",
        "effects": {
          "bond": 8,
          "food": 3
        }
      },
      {
        "label": "把海装进鱼形信封寄回去",
        "result": "邮差说这封信有点远。你没有催它，几周后收到鱼的回信：海已到，最近浪比较会照顾人，代它谢谢你。",
        "effects": {
          "dignity": 7,
          "bond": 6
        }
      },
      {
        "label": "征求海的长期居住意见",
        "result": "海没有立即答复，只在你睡着时把岸边往外挪了一点。你醒来发现家大了些，租金没涨，倒多了一扇能听见风的窗。",
        "effects": {
          "food": 6,
          "penguin": -4
        }
      }
    ],
    "variant": true
  },
  {
    "id": "a-variant-name-steam-2",
    "age": 2,
    "title": "你的名字在汤里起了雾",
    "text": "晚饭时有人叫了你的名字，碗上的热气便全部转过身来。你发现名字已经在汤里住了几天，晚上负责保温，白天负责替你回答问候。它说最近有人把你叫得特别轻。",
    "choices": [
      {
        "label": "请名字出来一起吃饭",
        "result": "名字坐到桌边时，所有鹅都下意识往旁边挪一点。你终于听见自己被好好叫了一声，连汤都没有急着凉下来。",
        "effects": {
          "bond": 9,
          "food": 5
        }
      },
      {
        "label": "给它放一天不被叫到的假",
        "result": "一整天没有谁喊你，但大家仍知道你在。你把这一天放进小口袋，后来每次觉得拥挤，就伸翅进去摸一摸。",
        "effects": {
          "dignity": 8,
          "penguin": -3
        }
      },
      {
        "label": "问汤能不能顺便替我开会",
        "result": "汤去了，发言时只有热气。会议一致认为它讲得含蓄，散会后还把一条鱼送来，说以后不用总把话说得那么满。",
        "effects": {
          "food": 10,
          "dignity": 3
        }
      }
    ],
    "variant": true
  },
  {
    "id": "a-variant-floor-leaf-5",
    "age": 5,
    "title": "地面想学一片叶子",
    "text": "你走到半路，脚下的地面忽然问能不能轻一点。它说每天托着大家，看树叶被风带走时有点羡慕。你蹲下来听它讲，才发现泥土和冰都各有一种很低的声音，只是平时没谁把耳朵放得这么近。",
    "choices": [
      {
        "label": "带地面去吹一会儿风",
        "result": "你们谁也没有离开原地，风却绕得比平时更低。地面被吹得有点痒，远处一块小石头第一次笑着滚了半圈。",
        "effects": {
          "bond": 9,
          "dignity": 4
        }
      },
      {
        "label": "帮它写一首很轻的诗",
        "result": "诗写到最后一个字时，地面短暂地浮起了一点。所有鹅都以为自己长高了，只有你听见它小声说，原来这就是轻。",
        "effects": {
          "penguin": -6,
          "dignity": 10
        }
      },
      {
        "label": "承诺回家时少带一点委屈",
        "result": "你没能每天都做到，地面也从不检查。它只是继续稳稳托着你，偶尔在你滑倒时，提前把坚硬的那一面藏好。",
        "effects": {
          "bond": 12,
          "food": 2
        }
      }
    ],
    "variant": true
  },
  {
    "id": "a-variant-sound-pocket-7",
    "age": 7,
    "title": "你捡到一只装满沉默的口袋",
    "text": "海边有个空口袋，里面的沉默却重得很认真。你提起来，发现每一段都留着不同的停顿：没说出口的道歉、吃饱后的安静，以及一只鹅等另一只鹅开口时，故意多留的几秒。",
    "choices": [
      {
        "label": "把口袋带去最吵的地方",
        "result": "沉默没有要求大家闭嘴，只在声音之间坐下来。谁都还在说话，却忽然能听见彼此，食堂第一次没有把晚饭喊成一场比赛。",
        "effects": {
          "bond": 12,
          "dignity": 4
        }
      },
      {
        "label": "留一小段给自己睡前用",
        "result": "那段沉默很柔软，盖住耳朵也不会隔开世界。你终于能先不回答所有问题，只听自己今天究竟累在了哪里。",
        "effects": {
          "food": 6,
          "penguin": 5
        }
      },
      {
        "label": "等原来的失主回来认领",
        "result": "一只远行的鹅来拿走口袋，说它在海上终于学会了开口。它没讲太多，你也没追问，只把那几秒等候完整还给它。",
        "effects": {
          "bond": 13,
          "dignity": 3
        }
      }
    ],
    "variant": true
  },
  {
    "id": "a-variant-smell-road-10",
    "age": 10,
    "title": "回家的气味先到了",
    "text": "你还在很远的岸边，却闻到家里热鱼的味道。气味说它走得比较快，可以先替你把回家的路铺好。你跟着走了一会儿，发现每个转弯都像一句熟悉的话，只是说得比平时更慢。",
    "choices": [
      {
        "label": "沿着鱼汤的方向慢慢走",
        "result": "路没有变短，你却不再急着赶完。到家时汤刚好能入口，家人说你今天走得很稳，仿佛一路上都有人替你扶着风。",
        "effects": {
          "food": 10,
          "bond": 8
        }
      },
      {
        "label": "给迷路的鹅也分一小段味道",
        "result": "它们闻到的并不全是鱼，有的闻到湿石头，有的闻到旧羽毛。每只鹅都因此找回自己的方向，没有谁必须跟你回同一个家。",
        "effects": {
          "bond": 14,
          "dignity": 3
        }
      },
      {
        "label": "问气味能不能偶尔留在远方",
        "result": "后来你出远门时，总会在一处陌生的地方闻到一点熟悉。你没有因此少走任何路，只是知道家也愿意向你走来。",
        "effects": {
          "penguin": -4,
          "bond": 12
        }
      }
    ],
    "variant": true
  },
  {
    "id": "a-variant-evening-bowl-16",
    "age": 16,
    "title": "傍晚掉进了你的碗里",
    "text": "你端着晚饭出门，正好接住一小块从天空掉下来的傍晚。它在碗沿慢慢变暗，太阳站在远处不敢下班，怕你还没吃完。邻居问能否先借一点暮色，它想让家里那只幼鹅睡得踏实些。",
    "choices": [
      {
        "label": "先借给幼鹅一个安静的梦",
        "result": "暮色从你碗里走过去，轻得没惊动任何门。你晚饭只剩半份黄昏，却吃得很慢，因为知道有谁已经安心睡下。",
        "effects": {
          "bond": 13,
          "food": 4
        }
      },
      {
        "label": "告诉太阳可以先走",
        "result": "太阳道谢后把最后一点暖放在碗底。你端着它回家，没有觉得天黑得太快，只觉得今天也被认真交到了自己手里。",
        "effects": {
          "food": 9,
          "dignity": 5
        }
      },
      {
        "label": "与邻居分着吃这段傍晚",
        "result": "你们没有把它说成什么重要的事，只各添了一条鱼。后来提到那天，大家都记不起日期，却都记得碗沿特别温。",
        "effects": {
          "bond": 14,
          "food": 6
        }
      }
    ],
    "variant": true
  }
];
if(typeof module!=='undefined'&&module.exports)module.exports=events;else root.PenguinEventsA=events;
})(typeof window!=='undefined'?window:globalThis);
