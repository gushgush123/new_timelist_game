window.GameApp = window.GameApp || {};

/**
 * 统一新闻数据库
 * 包含：标题、摘要(desc)、日期、分类、图片等字段
 * 支持主页面滚动背景与游戏内选项共享资源
 */
GameApp.NEWS_DB = [
  {
    "id": 1,
    "title": "普京当选俄罗斯总统",
    "desc": "普京首次当选俄罗斯总统，开启其长期主导俄罗斯政治的新阶段。",
    "date": "2000-03-26",
    "sortDate": 20000326,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.b678672a93967cbea40e62545066ad80?rik=JnYjUkcukRQt8w&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20220626ac%2f199%2fw639h360%2f20220626%2fbe46-76214cf20e523272b8ea606353f4901f.jpg&ehk=pdP13t3eawx9%2fAFn4Uzq%2fcm5RjQUhGP3C30rDtEIal8%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 2,
    "title": "悉尼奥运会开幕",
    "desc": "第27届夏季奥林匹克运动会在澳大利亚悉尼举行，规模创历史之最。",
    "date": "2000-09-15",
    "sortDate": 20000915,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://ts2.tc.mm.bing.net/th/id/OIP-C.0T080BEHnuSF5pppGACeTQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 3,
    "title": "纳斯达克互联网泡沫破裂",
    "desc": "互联网泡沫开始崩溃，大量高估值的科技公司破产，全球股市动荡。",
    "date": "2000-03-10",
    "sortDate": 20000310,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://pica.zhimg.com/8e5f255557df1cd5c28d5e5451bd90f0_r.jpg"
  },

  {
    "id": 4,
    "title": "人类基因组草图完成",
    "desc": "国际人类基因组计划宣布完成人类基因组工作草图，生物学进入新纪元。",
    "date": "2000-06-26",
    "sortDate": 20000626,
    "category": "science",
    "catLabel": "科学",
    "image": "https://p2.img.cctvpic.com/cportal/cnews-yz/img/2021/06/25/1624614521927_497_497x400.jpg"
  },

  {
    "id": 5,
    "title": "维基百科上线",
    "desc": "维基百科正式上线，开启了全球协作式在线百科全书的新模式。",
    "date": "2001-01-15",
    "sortDate": 20010115,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://pic.nximg.cn/file/20201226/26753533_170914283176_2.jpg"
  },

  {
    "id": 6,
    "title": "北京申奥成功",
    "desc": "北京获得2008年第29届夏季奥林匹克运动会主办权，全国人民欢欣鼓舞。",
    "date": "2001-07-13",
    "sortDate": 20010713,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://img.d-arts.cn/grab_img/890c5501225331c46dfd3ac359a03d801657778193.jpeg"
  },

  {
    "id": 7,
    "title": "“9·11”恐怖袭击",
    "desc": "恐怖分子劫持民航飞机撞击美国世界贸易中心和五角大楼，震惊世界。",
    "date": "2001-09-11",
    "sortDate": 20010911,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://x0.ifengimg.com/ucms/2024_31/5DFA63C6AD535FCEE14BACC66D2335D38E0F507F_size729_w975_h549.png"
  },

  {
    "id": 8,
    "title": "中国加入世界贸易组织",
    "desc": "中国正式成为世界贸易组织第143个成员，标志着中国对外开放进入新阶段。",
    "date": "2001-12-11",
    "sortDate": 20011211,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://ts1.tc.mm.bing.net/th/id/OIP-C.uMoMCYHZq4wP7J56LMjWywHaE2?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 9,
    "title": "欧元正式流通",
    "desc": "欧元纸币和硬币正式在欧元区12国流通，成为单一货币。",
    "date": "2002-01-01",
    "sortDate": 20020101,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://today.help.bj.cn/1/1/2002/DE163929353.jpg"
  },

  {
    "id": 10,
    "title": "巴西夺得世界杯冠军",
    "desc": "巴西在韩日世界杯决赛中击败德国，第五次捧起大力神杯。",
    "date": "2002-06-30",
    "sortDate": 20020630,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://p6.itc.cn/images01/20220708/9bc4e7c776064c8190aadce1fa0acd9e.jpeg"
  },

  {
    "id": 11,
    "title": "哥伦比亚号失事",
    "desc": "美国哥伦比亚号航天飞机在返回地面时解体，7名宇航员全部遇难。",
    "date": "2003-02-01",
    "sortDate": 20030201,
    "category": "science",
    "catLabel": "科学",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.7ab12667c30bc916e3ecb7264579feff?rik=9XcsCy97tCwy4A&riu=http%3a%2f%2fwww.uux.cn%2fattachments%2f2023%2f01%2f1_2023012616140419449.jpg&ehk=a9yRswGQc91JcN8mhMwUqdR2wbyxeKiZsiP0qfbEE7I%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 12,
    "title": "美伊战争爆发",
    "desc": "美国及其盟友对伊拉克发动军事打击，萨达姆政权随后倒台。",
    "date": "2003-03-20",
    "sortDate": 20030320,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.e69e72d1cd6d20e28d9d196aece47155?rik=7SjB84enPiU3wA&riu=http%3a%2f%2fx0.ifengimg.com%2fres%2f2019%2f4464AF76CDB00694D02551DC606F1B3B1F5B02AE_size80_w1080_h574.jpeg&ehk=naC7oxLPbw6LM%2b2FtFmsHUY1ME5CC3QZOkDBI6Mumbg%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 13,
    "title": "“神舟”五号发射",
    "desc": "杨利伟搭乘“神舟”五号进入太空，中国成为独立掌握载人航天的第三国。",
    "date": "2003-10-15",
    "sortDate": 20031015,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.96f98b2c8c4ce897d7fbfc885aa969e2?rik=UFYmXQAxwflKIQ&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20201015ac%2f400%2fw1280h720%2f20201015%2f0858-kaqzmiv5507261.jpg&ehk=fTNpVFeMkuWLC0%2bstU19MjXSHStXS%2baZX%2f1l31swu7I%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 14,
    "title": "Facebook成立",
    "desc": "马克·扎克伯格在哈佛大学创办Facebook，社交媒体格局开始巨变。",
    "date": "2004-02-04",
    "sortDate": 20040204,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://e0.ifengimg.com/09/2019/0211/3BE98E825FDB981BE50AC6C7ACF2B88A9668AECC_size24_w641_h430.jpeg"
  },

  {
    "id": 15,
    "title": "雅典奥运会开幕",
    "desc": "奥运会回到发源地希腊，刘翔在110米栏决赛中平世界纪录夺冠。",
    "date": "2004-08-13",
    "sortDate": 20040813,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://ts1.tc.mm.bing.net/th/id/OIP-C.V-nBDVNsC-yM3Ac3tjlKlgHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 16,
    "title": "印度洋海啸爆发",
    "desc": "印度洋发生强震并引发特大海啸，造成多国20余万人遇难。",
    "date": "2004-12-26",
    "sortDate": 20041226,
    "category": "environment",
    "catLabel": "环境",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.6b1007b2400ad7a92ffd34d93b7d8b4f?rik=rbI11uDvhQxaFA&riu=http%3a%2f%2fn.sinaimg.cn%2fsinacn19%2f296%2fw1200h696%2f20180928%2f636e-hhuhisn4535749.jpg&ehk=Vh8dA47EGVyG6US%2bcMBASCrsLuJufprtQB4Z12wE1EE%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 17,
    "title": "YouTube上线",
    "desc": "YouTube网站正式上线，视频分享时代由此开启。",
    "date": "2005-02-15",
    "sortDate": 20050215,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.d4f617eea9cbb543447a5d4609373f7b?rik=Z5YnE6nBX%2bAajw&riu=http%3a%2f%2fwww.szquanli.com%2fuploads%2fallimg%2f170904%2f2-1FZ4110144.jpg&ehk=aX012xv7oAL781DIY06gZ7govHI2Di9jgPtVU6gQIT8%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 18,
    "title": "京都议定书生效",
    "desc": "旨在限制温室气体排放的《京都议定书》正式生效，全球应对气候变化。",
    "date": "2005-02-16",
    "sortDate": 20050216,
    "category": "environment",
    "catLabel": "环境",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.15c342f05ecb50d452d88956a77c4c78?rik=dDB8TgHzJEpNOQ&riu=http%3a%2f%2fwww.npc.gov.cn%2fzgrdw%2fnpc%2fzxft%2fzxft8%2fattachement%2fjpg%2fsite201%2f20090824%2f0021861a64e20bfc26860b.jpg&ehk=6kll4NMOnnRbnZqHPtx2mdIAQkkxTGGxR0G%2bGRNVlQA%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 19,
    "title": "推特（Twitter）发布",
    "desc": "Jack Dorsey等人发布Twitter，短文本社交媒体风靡全球。",
    "date": "2006-03-21",
    "sortDate": 20060321,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts2.tc.mm.bing.net/th/id/OIP-C.q2SBbRCFLhN32RyUTzOGZgHaE2?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 20,
    "title": "青藏铁路全线通车",
    "desc": "世界上海拔最高、线路最长的高原铁路——青藏铁路正式通车。",
    "date": "2006-07-01",
    "sortDate": 20060701,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://p1.img.cctvpic.com/cportal/cnews-yz/img/2021/06/12/1623503303931_858_450x300.jpg"
  },

  {
    "id": 21,
    "title": "冥王星降级",
    "desc": "国际天文学联合会决定将冥王星从行星降级为“矮行星”。",
    "date": "2006-08-24",
    "sortDate": 20060824,
    "category": "science",
    "catLabel": "科学",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.7f8395cc07e522d8a6dc428235123339?rik=BAlgwMgga8A24w&riu=http%3a%2f%2fn.sinaimg.cn%2fsinacn20111%2f291%2fw1264h627%2f20190717%2f6119-hzxsvnn7330775.jpg&ehk=jSXkAfkrHhOulJ7mV%2foTQO8ZvCNVieGaWlc6oVMVc7A%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 22,
    "title": "第一代iPhone发布",
    "desc": "乔布斯发布第一代iPhone，开启了智能手机和移动互联网时代。",
    "date": "2007-01-09",
    "sortDate": 20070109,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://k.sinaimg.cn/n/front20220610ac/776/w560h216/20220610/4e1e-e17ae23e8934ae7f5cdd21e5464ad002.jpg/w700d1q75cms.jpg?by=cms_fixed_width"
  },

  {
    "id": 23,
    "title": "Netflix推出流媒体",
    "desc": "Netflix从传统的DVD租赁业务转向在线流媒体服务，颠覆影视行业。",
    "date": "2007-01-15",
    "sortDate": 20070115,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.f9666bed7472e232d3f8b7013e8dda47?rik=Vcw%2f2DyBYWMsnQ&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20117%2f762%2fw1000h562%2f20240220%2f5444-9194d45c94bfa7a40222dd8c524c023f.jpg&ehk=LImM4Xf3PtDd%2blLl%2bRWQXb5BxUYJatJL5bf%2fBwwqnnk%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 24,
    "title": "北京奥运会开幕",
    "desc": "第29届夏季奥林匹克运动会在北京开幕，中国首次位列金牌榜首。",
    "date": "2008-08-08",
    "sortDate": 20080808,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.2081b20f7cda9685a289bf3ff4976fd6?rik=KApw8DMYbz7e6A&riu=http%3a%2f%2fi3.sinaimg.cn%2f2008%2fhdphoto%2f2008%2f0809%2fU366P461T180D4F4673DT20080809005518.jpg&ehk=ScUvHwF70j0chq0DJa8Zz4KTQrC0F5%2b8%2bntzRhedqd0%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 25,
    "title": "雷曼兄弟破产",
    "desc": "美国第四大投资银行雷曼兄弟宣告破产，引发全球性金融海啸。",
    "date": "2008-09-15",
    "sortDate": 20080915,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.0a771c115f1798d30910de81162c9a53?rik=Hmi59a1v45X7oQ&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20180911%2fdf11d5d56b8f4d83a906cfe79ae231b1.jpeg&ehk=7ufs5aut2aKmHojYB%2fxiszx%2fS7h%2b15cTH5J2wpSM5mk%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 26,
    "title": "奥巴马当选总统",
    "desc": "巴拉克·奥巴马当选美国第44任总统，成为美国史上首位非裔总统。",
    "date": "2008-11-04",
    "sortDate": 20081104,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://www.shuomingshu.cn/wp-content/uploads/images/2022/11/10/2314ca4ac8f94ecaba1049da80e5944a_j4moqioycdy.jpg"
  },

  {
    "id": 27,
    "title": "比特币创世块诞生",
    "desc": "中本聪挖出比特币的第一个区块（创世块），加密货币时代开启。",
    "date": "2009-01-03",
    "sortDate": 20090103,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://n.sinaimg.cn/sinakd20230104s/222/w1080h742/20230104/7647-bc987a342e8717f31b98d8f9662f7641.png"
  },

  {
    "id": 28,
    "title": "迈克尔·杰克逊去世",
    "desc": "“流行音乐之王”迈克尔·杰克逊在洛杉矶去世，引发全球歌迷哀悼。",
    "date": "2009-06-25",
    "sortDate": 20090625,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://www.shuomingshu.cn/wp-content/uploads/images/2023/02/11/1575c5dc13c74589979d4c9e8cbbb3da_kkz3wsk52zf.jpg"
  },

  {
    "id": 29,
    "title": "海地强烈地震",
    "desc": "海地发生7.0级地震，造成首都太子港严重破坏，数十万人遇难。",
    "date": "2010-01-12",
    "sortDate": 20100112,
    "category": "environment",
    "catLabel": "环境",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.1538e81df0747295e8ecfb8af66812d3?rik=vQQhGpqfv2WGDw&riu=http%3a%2f%2fa2.img.fengone.com%2f856acb54d4fd0bf35cb9c4562b264d27%40100Q_800w&ehk=v9YU6gsA8lodMs9CDEP92ffeYyZa5c%2fluOW%2fFw1FSU0%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 30,
    "title": "上海世博会开幕",
    "desc": "中国首次举办综合性世界博览会，以“城市，让生活更美好”为主题。",
    "date": "2010-05-01",
    "sortDate": 20100501,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://ts1.tc.mm.bing.net/th/id/OIP-C.N3hDrfIFFTVcrUAqqcl1kgHaEs?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 31,
    "title": "Instagram发布",
    "desc": "移动端照片分享应用Instagram正式在iOS平台上架。",
    "date": "2010-10-06",
    "sortDate": 20101006,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.96522c751b8b13c86417862e6f854be8?rik=vD2pQEXlJbHElw&riu=http%3a%2f%2fimg.mp.sohu.com%2fupload%2f20171225%2f57a7ffc2b8814042a8a4d599f90ac02f_th.jpg&ehk=W9JCn0ThWxThmq1hNkwnQ0BfEhD7l6Kslkbp4PsBa8k%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 32,
    "title": "日本福岛核电站事故",
    "desc": "日本东北部发生9.0级强震并引发特大海啸，导致福岛核电站事故。",
    "date": "2011-03-11",
    "sortDate": 20110311,
    "category": "environment",
    "catLabel": "环境",
    "image": "https://x0.ifengimg.com/res/2021/C7AF6E16F6C59BB9723E01B46F7B4B1D97956E60_size121_w1024_h632.jpeg"
  },

  {
    "id": 33,
    "title": "本·拉登被击毙",
    "desc": "美国海豹突击队在巴基斯坦击毙“基地”组织头目奥萨马·本·拉登。",
    "date": "2011-05-02",
    "sortDate": 20110502,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://so1.360tres.com/t01e3619987452241a3.jpg"
  },

  {
    "id": 34,
    "title": "伦敦奥运会开幕",
    "desc": "第30届夏季奥林匹克运动会在英国伦敦开幕，成为展示英国文化的舞台。",
    "date": "2012-07-27",
    "sortDate": 20120727,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://ts2.tc.mm.bing.net/th/id/OIP-C.Mda3u-TsqxOph8iWKrUIWgHaEt?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 35,
    "title": "好奇号登陆火星",
    "desc": "NASA的“好奇号”火星车在盖尔陨石坑成功着陆，开启科学探索。",
    "date": "2012-08-06",
    "sortDate": 20120806,
    "category": "science",
    "catLabel": "科学",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.e285f524d295000449815d895d08fe5c?rik=54JjHOAbeJEEAg&riu=http%3a%2f%2fi5.qhimg.com%2ft0192edbd3ae1dfc978.jpg&ehk=En7VzVaQzYAuC2l9e8KyUAdLZhlP4bi1IB%2fHo0JkacY%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 36,
    "title": "希格斯玻色子发现",
    "desc": "欧洲核子研究中心宣布发现“上帝粒子”——希格斯玻色子。",
    "date": "2012-07-04",
    "sortDate": 20120704,
    "category": "science",
    "catLabel": "科学",
    "image": "https://p3.itc.cn/q_70/images03/20210219/cd8281d1278e4aa28a9b6e52c76ee6d8.jpeg"
  },

  {
    "id": 37,
    "title": "莫言获诺贝尔奖",
    "desc": "中国作家莫言获得诺贝尔文学奖，成为首位获此奖项的中国籍作家。",
    "date": "2012-10-11",
    "sortDate": 20121011,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://tse2-mm.cn.bing.net/th/id/OIP-C.6yHAH4_42L3TaG-Hr3JeqgHaFE?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 38,
    "title": "习近平当选主席",
    "desc": "习近平在十二届全国人大一次会议上当选为中华人民共和国主席。",
    "date": "2013-03-14",
    "sortDate": 20130314,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://file.dahe.cn/FjrThZ-dwv75SWtoIHj755PZMc9Q?imageMogr2/thumbnail/960%3E"
  },

  {
    "id": 39,
    "title": "教皇方济各就任",
    "desc": "来自阿根廷的枢机主教伯格里奥当选教皇，称号为方济各。",
    "date": "2013-03-13",
    "sortDate": 20130313,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://ts1.tc.mm.bing.net/th/id/OIP-C._xBY-Prm4asEn9_GN5vZoQHaH0?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 40,
    "title": "斯诺登“棱镜门”",
    "desc": "前中情局雇员斯诺登向媒体揭露美国大规模监听计划，震撼全球。",
    "date": "2013-06-05",
    "sortDate": 20130605,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts4.tc.mm.bing.net/th/id/OIP-C.WVUzrrM6RsMlkGZ22ZT2EQHaEh?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 41,
    "title": "马航MH370失踪",
    "desc": "载有239人的马航MH370航班在飞行途中失踪，成为航空史之谜。",
    "date": "2014-03-08",
    "sortDate": 20140308,
    "category": "environment",
    "catLabel": "环境",
    "image": "https://img2.voc.com.cn/remote/2021/12/03/579_13e35c73e2ac3578dc51cc255b0725c80c24dc97.jpg"
  },

  {
    "id": 42,
    "title": "德国夺得世界杯",
    "desc": "德国队在巴西世界杯决赛中1-0击败阿根廷，第四次夺冠。",
    "date": "2014-07-13",
    "sortDate": 20140713,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.2efc834757d9b806bbe24201b105f630?rik=z1JAWgN9jR0Ifw&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20210212ac%2f169%2fw1651h918%2f20210212%2f45bb-kiweitw7605950.jpg&ehk=H1bryvpwbDCd%2beuqdAJnz7jiGc1fHztk3K%2b%2bRLZbcW4%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 43,
    "title": "阿里巴巴纽交所上市",
    "desc": "阿里巴巴集团在纽约证券交易所正式挂牌，创下全球最大IPO记录。",
    "date": "2014-09-19",
    "sortDate": 20140919,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.4d63f85853bec316a60f11486fa49f6a?rik=wukw1TNRpSJScg&riu=http%3a%2f%2fywhz.hangzhou.com.cn%2fcxcy%2fimages%2f2016-06%2f20%2f0023aea5a95c19022dc007.jpg&ehk=l4Oh81Jhv8teLWptQWtSJlSjZdDzsZ8PX6nfeZLx%2fgw%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 44,
    "title": "巴黎恐袭事件",
    "desc": "恐怖分子袭击巴黎多家餐厅、剧院及球场，造成重大伤亡。",
    "date": "2015-11-13",
    "sortDate": 20151113,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.c806d3e26aa44f8ca7a501b98b92557f?rik=Coq%2fXpMofwGXtg&riu=http%3a%2f%2fpic.people.com.cn%2fNMediaFile%2f2015%2f1117%2fMAIN201511171804000526409764082.jpg&ehk=8RGdlt83z3Bw6jEJaLfMzjPZRX%2bL1wNvWmw4VSVZA3U%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 45,
    "title": "巴黎协定达成",
    "desc": "联合国气候变化大会通过《巴黎协定》，为2020年后应对气候变化指明方向。",
    "date": "2015-12-12",
    "sortDate": 20151212,
    "category": "environment",
    "catLabel": "环境",
    "image": "https://pic2.zhimg.com/0db6f1821d84329c003e6a7bcff53d56_1440w.jpg?source=172ae18b"
  },

  {
    "id": 46,
    "title": "屠呦呦获诺贝尔奖",
    "desc": "中国药学家屠呦呦因发现青蒿素获得诺贝尔生理学或医学奖。",
    "date": "2015-10-05",
    "sortDate": 20151005,
    "category": "science",
    "catLabel": "科学",
    "image": "https://www.bjmu.edu.cn/images/2022-08/ed40c1bffc324c23ba3676f14407eacb.jpeg"
  },

  {
    "id": 47,
    "title": "AlphaGo战胜李世石",
    "desc": "人工智能AlphaGo以4-1的总比分战胜围棋世界冠军李世石。",
    "date": "2016-03-15",
    "sortDate": 20160315,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.209bed35e7715bd21051c7bde8a33974?rik=zoe31gPQpg1N1Q&riu=http%3a%2f%2fn.sinaimg.cn%2fsports%2ftransform%2f194%2fw620h374%2f20200324%2f77dd-ireifzi4903358.png&ehk=9cNyQsVSKBahEIpuIEfiICmX9kGyISqD6I37DgP2RxA%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 48,
    "title": "猎鹰9号首次回收",
    "desc": "SpaceX成功实现猎鹰9号火箭一级助推器在海上平台的垂直回收。",
    "date": "2015-12-21",
    "sortDate": 20151221,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://static.leiphone.com/uploads/new/article/740_740/201604/570a13cd2ad33.jpg"
  },

  {
    "id": 49,
    "title": "英国脱欧公投",
    "desc": "英国举行脱离欧盟全民公投，51.9%的选民支持脱欧。",
    "date": "2016-06-23",
    "sortDate": 20160623,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://k.sinaimg.cn/n/translate/w640h363/20180126/Lqv1-fyqzcxf7208356.jpg/w700d1q75cms.jpg?by=cms_fixed_width"
  },

  {
    "id": 50,
    "title": "里约奥运会开幕",
    "desc": "第31届夏季奥林伯克运动会在巴西里约热内卢开幕，南美首办奥运。",
    "date": "2016-08-05",
    "sortDate": 20160805,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.2b846de18f348b0cd473544c2a376052?rik=tD3vfXhnuqxnZQ&riu=http%3a%2f%2fnews.66wz.com%2fpic%2f003%2f003%2f298%2f00300329867_1d465e55.jpg&ehk=Iyp2xv%2fXmTUVgzR2y05sEfX4331sQq0bb96BMGq2HI0%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 51,
    "title": "特朗普当选总统",
    "desc": "共和党人唐纳德·特朗普击败希拉里·克林顿，当选美国第45任总统。",
    "date": "2016-11-08",
    "sortDate": 20161108,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.8a2ffb06ea2ba3ee0dea242686a04c76?rik=CBjKn%2fYm6BKwww&riu=http%3a%2f%2fp0.ifengimg.com%2fa%2f2016_46%2ffed2d14abe5764a_size49_w750_h483.jpg&ehk=QX%2bDqzn7FzUghK5ztuujVFOiLxctOLK91nhO112RoGs%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 52,
    "title": "AlphaGo击败柯洁",
    "desc": "AlphaGo在乌镇围棋峰会以3-0战胜世界第一棋手柯洁。",
    "date": "2017-05-27",
    "sortDate": 20170527,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://static.leiphone.com/uploads/new/article/740_740/201705/59291a0cdc2c4.jpg?imageMogr2/quality/90"
  },

  {
    "id": 53,
    "title": "马克龙当选总统",
    "desc": "埃马纽埃尔·马克龙当选法国总统，成为法国现代史上最年轻总统。",
    "date": "2017-05-07",
    "sortDate": 20170507,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.36d764376ee2d171d241a0c24b660bb2?rik=i%2furznni5LiTFQ&riu=http%3a%2f%2fhimg2.huanqiu.com%2fattachment2010%2f2017%2f0508%2f09%2f25%2f20170508092532916.jpg&ehk=%2fyTISPkJKBYTpnSPVKdSHH3DMzeRH0imbQcwXRy39wQ%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 54,
    "title": "比特币破1万美元",
    "desc": "比特币价格首次突破10,000美元大关，数字货币热度达到顶峰。",
    "date": "2017-11-28",
    "sortDate": 20171128,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://x0.ifengimg.com/thmaterial/2020_7/40704492CC764B6393F033A855739D9F_w698_h392.jpg"
  },

  {
    "id": 55,
    "title": "战狼2刷新票房",
    "desc": "国产动作电影《战狼2》上映，创下中国影史单片票房最高记录。",
    "date": "2017-07-27",
    "sortDate": 20170727,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://ts1.tc.mm.bing.net/th/id/OIP-C.jwBkwzMQvN3k9Qh0ABJRVwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 56,
    "title": "平昌冬奥会开幕",
    "desc": "第23届冬季奥林匹克运动会在韩国平昌开幕，朝韩代表团共同入场。",
    "date": "2018-02-09",
    "sortDate": 20180209,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.7ed02219d817ee9329fed91c52be8219?rik=e%2bRXSVzDWg7vzw&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20220102s%2f533%2fw800h533%2f20220102%2f1134-e24517fee31bc3f6c1b35a73d090233b.jpg&ehk=q9V3%2fTgZWn5M6WxvFOh%2fyr6ZYhFLxsM1QgQkFcqpKp0%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 57,
    "title": "首届进博会举行",
    "desc": "首届中国国际进口博览会在上海开幕，展示中国扩大开放的决心。",
    "date": "2018-11-05",
    "sortDate": 20181105,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.49ab2725463d3ec7883aaa5fb74c2176?rik=x40FPXcRitkv0Q&riu=http%3a%2f%2fwww.828i.com%2ffile%2fallimg%2f230707%2f1-230FH250040-L.jpg&ehk=w%2bIZ1KrU3pSnVShnKhaPnrlcrVDL8bTGJcCefkkZegw%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 58,
    "title": "黑洞照片首曝光",
    "desc": "事件视界望远镜组织公布人类史上首张黑洞照片，验证广义相对论。",
    "date": "2019-04-10",
    "sortDate": 20190410,
    "category": "science",
    "catLabel": "科学",
    "image": "https://pic1.zhimg.com/v2-ebfd1292cb15798162567104f0863955_r.jpg?source=1940ef5c"
  },

  {
    "id": 59,
    "title": "寄生虫获金棕榈",
    "desc": "韩国电影《寄生虫》在戛纳电影节获金棕榈奖，随后获奥斯卡最佳影片。",
    "date": "2019-05-25",
    "sortDate": 20190525,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.2765259a6ca8a36aaad9dad40c0a3f54?rik=j1lTMYbhRipwog&riu=http%3a%2f%2fe0.ifengimg.com%2f03%2f2019%2f0526%2f59BDFA8E66FEEF5A596317FFB87A92503C5B68DB_size992_w3435_h2500.jpeg&ehk=UxZcsuWqPx%2bhwY7n5bTiDYLQ9bbHVQRVumYWj5kem14%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 60,
    "title": "武汉发现不明原因肺炎病例",
    "desc": "湖北省和武汉市卫生部门接到当地一家医院报告聚集性不明原因肺炎病例。",
    "date": "2019-12-29",
    "sortDate": 20191229,
    "category": "science",
    "catLabel": "科学",
    "image": "https://n.sinaimg.cn/sinakd20221209s/178/w1080h698/20221209/0886-1a78b080c2ea5bdf1584cc06b6868d6b.jpg"
  },

  {
    "id": 61,
    "title": "东京奥运会延期",
    "desc": "受疫情影响，原定2020年举办的东京奥运会宣布推迟至2021年。",
    "date": "2020-03-24",
    "sortDate": 20200324,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://n.sinaimg.cn/front20200325ac/200/w640h360/20200325/b6ed-irkazzu9512990.jpg"
  },

  {
    "id": 62,
    "title": "拜登赢得大选",
    "desc": "民主党人乔·拜登在总统选举中胜出，当选美国第46任总统。",
    "date": "2020-11-07",
    "sortDate": 20201107,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://n.sinaimg.cn/translate/200/w600h400/20191128/2ea8-iixnuaa0956230.jpg"
  },

  {
    "id": 63,
    "title": "天问一号发射",
    "desc": "中国首次火星探测任务“天问一号”探测器成功发射升空。",
    "date": "2020-07-23",
    "sortDate": 20200723,
    "category": "science",
    "catLabel": "科学",
    "image": "https://n.sinaimg.cn/sinakd2020723s/384/w1841h943/20200723/3342-iwtqvyk5281291.jpg"
  },

  {
    "id": 64,
    "title": "散户轧空华尔街",
    "desc": "GameStop股价在散户抱团下疯涨，华尔街对冲基金遭遇巨额亏损。",
    "date": "2021-01-28",
    "sortDate": 20210128,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://n.sinaimg.cn/finance/transform/59/w550h309/20210128/ebf2-kiksqxf4132618.jpg"
  },

  {
    "id": 65,
    "title": "中国空间站入轨",
    "desc": "中国空间站“天和”核心舱发射成功，开启载人航天空间站时代。",
    "date": "2021-04-29",
    "sortDate": 20210429,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://n.sinaimg.cn/sinakd2021429s/106/w2048h2058/20210429/d507-kphwums1173720.jpg"
  },

  {
    "id": 66,
    "title": "韦伯望远镜发射",
    "desc": "人类最强大的空间望远镜——詹姆斯·韦伯望远镜发射升空。",
    "date": "2021-12-25",
    "sortDate": 20211225,
    "category": "science",
    "catLabel": "科学",
    "image": "https://d.ifengimg.com/q100/img1.ugc.ifeng.com/newugc/20220329/15/wemedia/cecfcba90a1aa92c9a79e06788554b821bb4c0f7_size359_w640_h377.png"
  },

  {
    "id": 67,
    "title": "俄乌冲突爆发",
    "desc": "俄罗斯宣布对乌克兰发起“特别军事行动”，引发二战后最大欧洲战事。",
    "date": "2022-02-24",
    "sortDate": 20220224,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://rs-channel.huanqiucdn.cn/imageDir/5ee0cc2de4699f13659d4e7515750812.png"
  },

  {
    "id": 68,
    "title": "英国女王去世",
    "desc": "英国女王伊丽莎白二世在巴尔莫勒尔堡去世，享年96岁。",
    "date": "2022-09-08",
    "sortDate": 20220908,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://ts3.tc.mm.bing.net/th/id/OIP-C.zRJPfdMew-cmxa-hfgzKvAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 69,
    "title": "ChatGPT向公众开放",
    "desc": "OpenAI推出基于GPT-3.5的对话模型，引爆生成式人工智能革命。",
    "date": "2022-11-30",
    "sortDate": 20221130,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts3.tc.mm.bing.net/th/id/OIP-C.rKD-P6ECIeeB1dswi5ts2wHaEH?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 70,
    "title": "梅西圆梦世界杯",
    "desc": "阿根廷队在点球大战中击败法国队，夺得卡塔尔世界杯冠军。",
    "date": "2022-12-18",
    "sortDate": 20221218,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://rs-channel.huanqiucdn.cn/imageDir/c391e660fa331e7273646d0e6a7f8fa7u5.jpg"
  },

  {
    "id": 71,
    "title": "DeepSeek R1发布",
    "desc": "DeepSeek发布R1推理模型，引发行业对高性价比推理能力与开源生态的广泛关注。",
    "date": "2025-01-20",
    "sortDate": 20250120,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts4.tc.mm.bing.net/th/id/OIP-C.ObKeqgS9D_nLpa5_Te7AyAHaFj?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 72,
    "title": "印度探测器登月",
    "desc": "印度的“月船3号”在月球南极附近成功着陆，成为第四个登月国。",
    "date": "2023-08-23",
    "sortDate": 20230823,
    "category": "science",
    "catLabel": "科学",
    "image": "https://www.cnsa.gov.cn/n6758823/n6759010/c6806951/part/6781559.png"
  },

  {
    "id": 73,
    "title": "杭州亚运会开幕",
    "desc": "第19届亚运会在中国杭州开幕，规模和科技含量创历届之最。",
    "date": "2023-09-23",
    "sortDate": 20230923,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://www.hangzhou2022.cn/xwzx/jdxw/ttxw/202309/W020230921462719208332.png"
  },

  {
    "id": 74,
    "title": "巴以冲突再起",
    "desc": "哈马斯突袭以色列引发大规模冲突，加沙局势成为全球焦点。",
    "date": "2023-10-07",
    "sortDate": 20231007,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.9a04d8cb5200f09662232980dddbbd45?rik=cr7oB7xEL7gOEQ&riu=http%3a%2f%2fwww.news.cn%2fmil%2f2023-01%2f29%2f1211722626_16749576448541n.jpg&ehk=%2fFkBWQlTs6IC7u6jYJsl3TzXAvwkSlOiJyNy7G9Ao3U%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 75,
    "title": "OpenAI发布Sora",
    "desc": "OpenAI发布文生视频模型Sora，展示了惊人的视频生成能力。",
    "date": "2024-02-15",
    "sortDate": 20240215,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts4.tc.mm.bing.net/th/id/OIP-C.TcWnrQxm9UiqaqDd6mKsmAHaDw?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 76,
    "title": "巴黎奥运会开幕",
    "desc": "第33届夏季奥运会在法国巴黎开幕，开幕式首次在塞纳河上举行。",
    "date": "2024-07-26",
    "sortDate": 20240726,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://img.d-arts.cn/doc_img/8e5797592b35f1a4f00854a842b12dd91722391549.jpeg"
  },

  {
    "id": 77,
    "title": "英伟达市值破3万亿",
    "desc": "受AI热潮推动，芯片巨头英伟达市值突破3万亿美元大关。",
    "date": "2024-06-05",
    "sortDate": 20240605,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://k.sinaimg.cn/n/sinakd20240606s/650/w1000h1250/20240606/a088-8e0e32a00dbe2811079032d082e24814.jpg/w700d1q75cms.jpg?by=cms_fixed_width"
  },

  {
    "id": 78,
    "title": "嫦娥六号背采返回",
    "desc": "中国嫦娥六号返回器携带人类首份月球背面样品成功着陆。",
    "date": "2024-06-25",
    "sortDate": 20240625,
    "category": "science",
    "catLabel": "科学",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.59e7ee9477c1ce36d874d1b63b5ebbcf?rik=hAt%2fdx%2fEenM91Q&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20240503s%2f400%2fw1280h720%2f20240503%2fbea9-b1690ec9ab964959b63e16e653ec8c82.jpg&ehk=q%2f0c6S4NqT1FxaA8JfjRhAfXuyXc%2fgwuSUvmiXHK518%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 79,
    "title": "特朗普再次当选",
    "desc": "唐纳德·特朗普击败卡玛拉·哈里斯，再次当选美国第47任总统。",
    "date": "2024-11-05",
    "sortDate": 20241105,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.8cff319f2dfc57deb5b37c48838c86e5?rik=k1puFBvywqPO7A&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20240714s%2f400%2fw1280h720%2f20240714%2fa73b-f54076eba64b31dee3a8c815b2c07f27.jpg&ehk=Svf807ZngU6744u8Vw8R2G7gueXlsunCHsNNq0F0DEU%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 80,
    "title": "苹果Vision Pro发布",
    "desc": "苹果发布首款空间计算设备Vision Pro，标志混合现实技术进入新阶段。",
    "date": "2023-06-05",
    "sortDate": 20230605,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://files.nowre.com/articles/2023/06/Vision-Pro.png"
  },

  {
    "id": 81,
    "title": "欧盟通过AI法案",
    "desc": "欧盟正式通过《人工智能法案》，成为全球首个全面监管AI的法律框架。",
    "date": "2024-03-13",
    "sortDate": 20240313,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://www.aitntnews.com/pictures/2024/3/15/29f33833-e298-11ee-bb24-fa163e4b35c9.png"
  },

  {
    "id": 82,
    "title": "韩国国会通过第二次对尹锡悦弹劾动议",
    "desc": "第二次弹劾动议：国会再次对尹锡悦的弹劾动议进行表决，最终以204票赞成通过，尹锡悦的总统职务立即停止",
    "date": "2024-12-24",
    "sortDate": 20241224,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts4.tc.mm.bing.net/th/id/OIP-C.-8PFbwx5HKSmyEJMsRE1kQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 83,
    "title": "字节跳动发布SeeDance 2.0",
    "desc": "字节跳动发布SeeDance 2.0相关进展，进一步提升多模态生成与动作/舞蹈理解能力，引发行业关注。",
    "date": "2026-02-12",
    "sortDate": 20260212,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://i-blog.csdnimg.cn/img_convert/47bfa56183b55525c969d2d95c993005.jpeg"
  },

  {
    "id": 84,
    "title": "米兰-科尔蒂纳丹佩佐冬奥会开幕式举行",
    "desc": "第25届冬季奥林匹克运动会在米兰与科尔蒂纳丹佩佐拉开帷幕，开幕式以意大利文化与科技呈现引发关注。",
    "date": "2026-02-06",
    "sortDate": 20260206,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.6aa680f3be3f8e80719d0aa389497327?rik=HgCu6nZcTGa76A&riu=http%3a%2f%2fi4.hexun.com%2f2022-02-23%2f205354722.jpg&ehk=T9iZJnlObAuCnuOfbGiAQbEWVhkAJ3yYWQZOq8eGpwE%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 85,
    "title": "OpenAI发布GPT-4 Turbo",
    "desc": "OpenAI推出GPT-4 Turbo模型，在成本和性能上实现优化升级。",
    "date": "2023-11-06",
    "sortDate": 20231106,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://www.itcow.cn/wp-content/uploads/2023/11/image-170.png"
  },

  {
    "id": 86,
    "title": "韦伯望远镜首次公布深空图像",
    "desc": "詹姆斯·韦伯望远镜首次发布多张深空观测图像，揭示早期宇宙结构。",
    "date": "2022-07-12",
    "sortDate": 20220712,
    "category": "science",
    "catLabel": "科学",
    "image": "https://ts1.tc.mm.bing.net/th/id/OIP-C.a_TUSLZdds-VfvMTAPHJugHaGN?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 87,
    "title": "2026年全国两会闭幕",
    "desc": "2026年全国两会在北京闭幕，确立年度经济增长目标与科技发展规划。",
    "date": "2026-03-12",
    "sortDate": 20260312,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://x0.ifengimg.com/ucms/2023_10/7189CAA0B97EABF06669B199B61EBFDF15F483FC_size1549_w1280_h720.png"
  },

  {
    "id": 88,
    "title": "NASA宣布火星样本返回任务方案调整",
    "desc": "NASA公布火星样本返回（MSR）任务的最新方案与下一步时间表调整，并继续与ESA协同推进相关架构评估。",
    "date": "2023-04-19",
    "sortDate": 20230419,
    "category": "science",
    "catLabel": "科学",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.3f70daab63544ac8e85b1d0b5ae53802?rik=m%2ffjPMb2tCQPOQ&riu=http%3a%2f%2fp0.ifengimg.com%2fa%2f2018_28%2f944fa8e9e78f612_size30_w586_h314.jpg&ehk=JZkJln63nymEd5I0i3Rn9UhWSA3xbMirYhGQh%2f7Pgbs%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 89,
    "title": "谷歌发布Willow量子芯片：RCS基准测试实现量子优势",
    "desc": "谷歌公布Willow量子芯片最新结果：在RCS（随机线路采样）基准测试中建立量子优势，约5分钟完成当前最先进超级计算机需约10^25年才能完成的计算；并在表面码纠错上取得突破，纠错后的逻辑量子比特错误率低于参与纠错的物理量子比特。",
    "date": "2024-12-10",
    "sortDate": 20241210,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://i-blog.csdnimg.cn/direct/691fe92515d04ea79c5e2d3a2d1c937f.png"
  },

  {
    "id": 90,
    "title": "诺贝尔文学奖授予韩江",
    "desc": "韩国作家韩江因其深刻直面历史创伤的诗意散文获得诺贝尔文学奖。",
    "date": "2024-10-10",
    "sortDate": 20241010,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://x0.ifengimg.com/ucms/2024_41/65C13E283C208A4345F7DC588E122BD9E7E85B2A_size122_w1080_h1080.jpg"
  },

  {
    "id": 91,
    "title": "中非合作论坛北京峰会",
    "desc": "中非合作论坛峰会在京举行，发布未来三年中非务实合作规划。",
    "date": "2024-09-04",
    "sortDate": 20240904,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://x0.ifengimg.com/ucms/2024_36/223C7255097CE8ADBF1640ED1C12630531D5200A_size126_w1920_h1080.jpg"
  },

  {
    "id": 92,
    "title": "SpaceX星舰完成第二次综合试飞（IFT-2）",
    "desc": "SpaceX开展星舰第二次综合试飞（IFT-2）：Super Heavy助推器与Starship飞船成功点火升空并完成级间分离，随后飞行器按试飞计划在后续阶段失联/解体，任务取得关键数据并推动后续迭代。",
    "date": "2023-11-18",
    "sortDate": 20231118,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.896539969037838ff75a315252b1e4ae?rik=pPoxDwfUwWqlwQ&riu=http%3a%2f%2fimage.nbd.com.cn%2fuploads%2farticles%2fimages%2f1498780%2f1.jpg&ehk=7VyO%2fXw9WU1EU%2f1GMRe3x71heWg1V5je9uSIPo4dnI0%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 93,
    "title": "全球最低企业税率协议生效",
    "desc": "130多个国家同意实施15%的全球最低企业税率，打击跨国避税。",
    "date": "2024-01-01",
    "sortDate": 20240101,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://ts4.tc.mm.bing.net/th/id/OIP-C.sCKdAXyiNKQvxNDmpNmLAwHaH0?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 94,
    "title": "华纳兄弟探索宣布制作《哈利·波特》电视剧（七季规划）",
    "desc": "华纳兄弟探索于2023年4月宣布制作《哈利·波特》电视剧：计划将J.K.罗琳七部原著小说改编为七季剧集，在流媒体平台Max播出，并规划打造长达十年的系列；原著作者J.K.罗琳担任执行制片人并参与早期开发与主创选择，官方强调剧集将“忠于原作”。",
    "date": "2023-04-12",
    "sortDate": 20230412,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://ts4.tc.mm.bing.net/th/id/OIP-C.ljcybhMlcjWIuIBtesQ_hQHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 95,
    "title": "NASA暂停“月球门户”空间站现有方案，转向月面基地优先",
    "desc": "NASA宣布暂停“月球门户”空间站现有架构，转而把资源与任务重点放在月球表面基地建设，并启动相关方案与预算的重新评估。",
    "date": "2026-03-15",
    "sortDate": 20260315,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts4.tc.mm.bing.net/th/id/OIP-C.vD1RDJikEJ3xmLOBf4DmOwHaEq?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 96,
    "title": "世界杯亚洲区扩军",
    "desc": "2026年美加墨世界杯预选赛激战正酣，亚洲区名额增至8.5个。",
    "date": "2025-10-01",
    "sortDate": 20251001,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://ts1.tc.mm.bing.net/th/id/OIP-C.qy0Ip6IVZTdxQqvgHyhc8AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 97,
    "title": "沙特与伊朗恢复外交关系",
    "desc": "在中国斡旋下，沙特与伊朗宣布恢复外交关系，缓解中东紧张局势。",
    "date": "2023-03-10",
    "sortDate": 20230310,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts4.tc.mm.bing.net/th/id/OIP-C.Ej2Nhp0yMJxbVsxS02MU7AHaD_?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 98,
    "title": "联合国启动“人工智能治理全球对话”机制",
    "desc": "联合国设立“人工智能治理全球对话”机制，与“人工智能独立国际科学小组”共同构成联合国人工智能治理框架：将组建由40名专家组成的团队评估人工智能风险、机遇及社会影响，并通过全球对话推动政策讨论与共识建设，目标聚焦安全可信系统、治理协同与开放式创新。",
    "date": "2025-09-25",
    "sortDate": 20250925,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://s.secrss.com/anquanneican/306251ed5bcbcfe53068d71cb9a1588c.jpg"
  },

  {
    "id": 99,
    "title": "汶川大地震",
    "desc": "中国四川汶川发生8.0级特大地震，造成数万人遇难，举国哀悼并展开大规模救援。",
    "date": "2008-05-12",
    "sortDate": 20080512,
    "category": "environment",
    "catLabel": "环境",
    "image": "https://n.sinaimg.cn/sinacn13/272/w2048h1424/20180512/c42f-hamfahw9893048.jpg"
  },

  {
    "id": 100,
    "title": "巴黎圣母院大火",
    "desc": "法国巴黎圣母院突发大火，尖塔倒塌，世界文化遗产遭受严重损毁。",
    "date": "2019-04-15",
    "sortDate": 20190415,
    "category": "culture",
    "catLabel": "文化",
    "image": "https://n.sinaimg.cn/sinacn10112/136/w2000h1336/20190416/55b0-hvsckth5191427.jpg"
  },

  {
    "id": 101,
    "title": "苏伊士运河堵塞事件",
    "desc": "长赐号货轮在苏伊士运河搁浅，导致全球重要航道堵塞近一周，影响国际贸易。",
    "date": "2021-03-23",
    "sortDate": 20210323,
    "category": "economy",
    "catLabel": "经济",
    "image": "https://ugc-img.ifengimg.com/img/2021/8/20/50972085-7f70-4bc9-bc9b-cdf82425c6d2_w817_h545.jpeg"
  },

  {
    "id": 102,
    "title": "法国夺得世界杯冠军",
    "desc": "法国队在俄罗斯世界杯决赛中击败克罗地亚，时隔20年再次夺冠。",
    "date": "2018-07-15",
    "sortDate": 20180715,
    "category": "sports",
    "catLabel": "体育",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.49314ef5684325e41d3e49199b76859b?rik=l%2bAFnD%2fZx5ZlAw&riu=http%3a%2f%2fimg5.iqilu.com%2fc%2fu%2f2018%2f0716%2f1531677226358.jpg&ehk=r7SVhwmYzotl450%2bpdrzRf5XqiKjddAawXW9LEFZwtc%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 103,
    "title": "英国正式脱欧",
    "desc": "英国正式退出欧盟，结束47年的成员国身份，开启新的政治与经济关系阶段。",
    "date": "2020-01-31",
    "sortDate": 20200131,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts2.tc.mm.bing.net/th/id/OIP-C.zORkkWvCs9m8xvClWkl8QQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 104,
    "title": "赖清德当选台湾地区领导人",
    "desc": "台湾地区举行领导人选举，赖清德当选，引发两岸及国际关注。",
    "date": "2024-01-13",
    "sortDate": 20240113,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://rs-channel.huanqiucdn.cn/imageDir/951eb99d47a1338e32c8041483012355.jpg"
  },

  {
    "id": 105,
    "title": "COP28气候大会达成协议",
    "desc": "联合国气候变化大会COP28在迪拜达成历史性协议，首次提出逐步摆脱化石燃料。",
    "date": "2023-12-13",
    "sortDate": 20231213,
    "category": "environment",
    "catLabel": "环境",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.1cb5d82f0aa2efbaf89dee1594fbee40?rik=y1gchqVu%2bu4Omg&riu=http%3a%2f%2fwww.aeif.asia%2fTemplets%2fDefault%2fUploadFiles%2f20231230%2f20231230145367976797.jpg&ehk=tl23ruhOkW5JOiLAOeayHhfZJ%2bfc%2b0Kpnzzc%2bqIL3Mw%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 106,
    "title": "百度发布文心一言",
    "desc": "百度正式发布生成式人工智能产品“文心一言”，标志中国大模型竞争进入新阶段。",
    "date": "2023-03-16",
    "sortDate": 20230316,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.44d2435d21723e11bbd5aa77a1d59483?rik=KATotfIkgolLOg&riu=http%3a%2f%2fwww.sowang.com%2fErniebot%2f7aec54e736d12f2ef1902761d0900a69843568fc.webp.jpg&ehk=dYoRH4dpN9WZT5SAjgXLfVSdBQjcmv7hjiExf6OFnYI%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 107,
    "title": "华为发布鸿蒙系统",
    "desc": "华为正式推出HarmonyOS（鸿蒙操作系统），加速构建自主可控生态体系。",
    "date": "2019-08-09",
    "sortDate": 20190809,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.ccad53685e6349a30b2f6a28ca16212b?rik=F5RXkKQEN1h6%2bQ&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20241023s%2f300%2fw720h380%2f20241023%2f2b2e-3b21e4a87a65c63eff7622be72687aae.jpg&ehk=izV6zOsoyrFV1lB9ZO%2fqf4953yX491KsLtliZp6RVAE%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 108,
    "title": "中国北斗全球组网完成",
    "desc": "北斗三号最后一颗卫星发射成功，中国全球卫星导航系统正式建成。",
    "date": "2020-06-23",
    "sortDate": 20200623,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://k.sinaimg.cn/n/sinakd2020623s/162/w1080h682/20200623/8b2f-ivmqpci0556337.png/w700d1q75cms.jpg?by=cms_fixed_width"
  },

  {
    "id": 109,
    "title": "阿里达摩院发布AI芯片含光800",
    "desc": "阿里巴巴达摩院发布AI推理芯片含光800，在图像识别等任务中表现领先。",
    "date": "2019-09-25",
    "sortDate": 20190925,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts3.tc.mm.bing.net/th/id/OIP-C.NNlwy1YUcG65DbfLUHAulAHaEN?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 110,
    "title": "中国量子计算原型机“九章”问世",
    "desc": "中国科学家实现光量子计算原型机“九章”，在特定问题上实现量子优越性。",
    "date": "2020-12-04",
    "sortDate": 20201204,
    "category": "science",
    "catLabel": "科学",
    "image": "https://ts4.tc.mm.bing.net/th/id/OIP-C.uI_qHKRYrHSCojDyr-aazwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 111,
    "title": "中国发布AI大模型监管办法",
    "desc": "中国发布生成式人工智能服务管理暂行办法，规范AI发展与应用。",
    "date": "2023-07-13",
    "sortDate": 20230713,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.d58ea6b55fd11d263b20b33b3ff5a272?rik=luZ%2bxHlP4mdcJg&riu=http%3a%2f%2fwww.mqy.com.cn%2fcommonresource%2f2023-04-07%2f0f461a4e-4b31-4032-a578-dcc740a6236afb5c81ed.png&ehk=s0tMPbGvHzR77t%2f6GY3QofSUD5zlZikqKj0E9D7Uf7o%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 112,
    "title": "科大讯飞发布星火大模型",
    "desc": "科大讯飞推出“星火认知大模型”，布局中文通用人工智能生态。",
    "date": "2023-05-06",
    "sortDate": 20230506,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://image.aieva.cn/site/20230607/111018-647ff51aca352.png"
  },

  {
    "id": 113,
    "title": "中国实现6G关键技术突破",
    "desc": "中国科研团队在太赫兹通信等6G关键技术领域取得重要突破。",
    "date": "2023-01-30",
    "sortDate": 20230130,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://doc-fd.zol-img.com.cn/t_s2000x2000/g7/M00/06/0F/ChMkK2aQ0A6Ib4_pAAETgTTMSboAAgcigEm-tsAAROZ729.png"
  },

  {
    "id": 114,
    "title": "华为Mate 60 Pro发布引发关注",
    "desc": "华为Mate 60 Pro发布，其国产芯片与5G能力引发全球科技界高度关注。",
    "date": "2023-08-29",
    "sortDate": 20230829,
    "category": "technology",
    "catLabel": "科技",
    "image": "https://ts4.tc.mm.bing.net/th/id/OIP-C.t31SvmofNhgC54bxVhGFbAHaDl?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 115,
    "title": "清华大学人工智能医院成立",
    "desc": "清华大学在北京依托智能产业研究院与清华长庚医院，成立人工智能医院（Agent Hospital），推出42位AI医生智能体，覆盖21个科室，探索AI辅助诊疗新模式。",
    "date": "2025-04-26",
    "sortDate": 20250426,
    "category": "science",
    "catLabel": "科学",
    "image": "https://ts3.tc.mm.bing.net/th/id/OIP-C.bUZrHQ6kfQjPXDRajVy0nwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 116,
    "title": "安倍晋三遭枪击",
    "desc": "日本前首相安倍晋三在奈良市进行街头演讲时遭枪击身亡，震惊全球。",
    "date": "2022-07-08",
    "sortDate": 20220708,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://ts1.tc.mm.bing.net/th/id/R-C.d1595ef45551ce81aec7199819546002?rik=0aS%2fE3cwjLFwqA&riu=http%3a%2f%2fzdimg.lifeweek.com.cn%2fbg%2f20220726%2f1658816013827ioidl.jpg&ehk=FQll7WhCblcXbrGVmYg39hcfsMUwNUAXM0mM0Spx%2bDw%3d&risl=&pid=ImgRaw&r=0"
  },

  {
    "id": 117,
    "title": "佩洛西访台",
    "desc": "时任美国众议院议长南希·佩洛西乘专机抵达台湾进行访问，引发中美关系高度紧张。",
    "date": "2022-08-02",
    "sortDate": 20220802,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://tse3.mm.bing.net/th/id/OIP.xNYbrRy5d9eTQmluDxnmcAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 118,
    "title": "石破茂下台",
    "desc": "石破茂内阁在经历了众议院选举失利与自民党内部权力更迭后宣布辞职。",
    "date": "2024-09-07",
    "sortDate": 20240907,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://tse3.mm.bing.net/th/id/OIP.KQy7BW--dv-X9DOvD4QCgAHaEj?rs=1&pid=ImgDetMain&o=7&rm=3"
  },

  {
    "id": 119,
    "title": "高市早苗上台",
    "desc": "高市早苗在日本国会众参两院首相指名选举中当选第104任日本首相，成为日本历史上首位女性首相。",
    "date": "2025-10-21",
    "sortDate": 20251021,
    "category": "politics",
    "catLabel": "政治",
    "image": "https://tse3.mm.bing.net/th/id/OIP._Q-E5FSrxqvo7RtRFFav6wHaEm?rs=1&pid=ImgDetMain&o=7&rm=3"
  }
];
