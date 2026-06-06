import { kv } from '@vercel/kv';

// KV 键名
const SITE_DATA_KEY = 'site-data';

// 类型定义
export interface LiteraryWork {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  content: string;
}

export interface PhotographyWork {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
}

export interface HeroImage {
  id: string;
  url: string;
}

export interface SiteData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  heroImages: HeroImage[];
  about: {
    paragraphs: string[];
    tags: string[];
  };
  literaryWorks: LiteraryWork[];
  photographyWorks: PhotographyWork[];
}

// 默认数据（包含已有文本内容，KV 为空时自动使用）
export const defaultSiteData: SiteData = {
  hero: {
    title: '惟励莫肄 勇取进绩',
    subtitle: '',
    description: '我是竞海西渡，一个热爱文学与摄影的大一小登，当然，也是狂热的足球爱好者。欢迎大家访问本网站，期待与大家的交流，让我们共同进步！',
  },
  heroImages: [],
  about: {
    paragraphs: [
      '我是竞海西渡，一个热爱文学与摄影的创作者，现求学于燕园。在文字的世界里，我寻找生活的诗意；在镜头的光影中，我捕捉世界的美好。',
      '文学让我学会用文字表达内心的情感与思考，摄影让我学会用镜头观察世界的细节与瞬间。两者相辅相成，成为我认识世界、表达自我的方式。',
      '我相信，生活中处处都有诗意，只需要用心去发现。希望我的作品能带给你一些美好的感受。',
      '（纯AI文不过写的还可以就这么将就着吧）',
    ],
    tags: ['散文创作', '风光摄影', '人文纪实'],
  },
  literaryWorks: [
    {
      id: 4,
      title: '自律格记',
      excerpt: '乙巳年西洋历十二月三十日，余感今岁趋终，新元将至，而心生慵怠，愧于学事，由是而作自律格。自律者，人成事之本也，苟有能成艰著事而不自律者邪？自律格者，余创之伊克塞尔格也。亦欲以究成败服本，肃骄怠厌气，正...',
      category: '散文',
      date: '2025年12月',
      content: '乙巳年西洋历十二月三十日，余感今岁趋终，新元将至，而心生慵怠，愧于学事，由是而作自律格。自律者，人成事之本也，苟有能成艰著事而不自律者邪？自律格者，余创之伊克塞尔格也。亦欲以究成败服本，肃骄怠厌气，正潜学之心。念余素有延慢之风，故今尚距明年二日而塑性之计已始矣。\n\n予尝思枫杨时之奋，念早培时之勤，怀高考时之厉。回古思今，则惭恼溢于言表。曝霜露，斩荆棘，以有燕园之绩；而今挥之有如昏君之弃社稷，渔者之弃轻鲫！于是堕于山东之冠，体弱不胜竞技；安于荧屏之喜，视衰不敢赴医；疏于数理之业，委顿不能相衡。纵有千秋功业尚不能骄矜自恃，况今础弱基脆，安可不忧乎！\n\n律者，音乐之术也，使曲谐有韵之技也。自律之重毋庸言也，而自律之人，又因自律之珍罕而珍奇，实属异士也。余观李公为此士也。其体健，不作伤身之恶；其学优，技深而奋勇拓新；其有计，能小暇而治诸事，实为吾明年之仪样也，欲效之也。\n\n余奋发之际，顾全国难有人敌，然则一载之时，奋发之日可屈指也。今作自律之格，非欲为苦行面壁之事，实欲一湔颓困之风，大举向新之道，作修身之事也。\n\n平原竞海西渡记，于北京大学燕园。',
    },
    {
      id: 1,
      title: '荧屏论',
      excerpt: '荧屏者，余所予手机之号也。盖其示区变幻摇曳，烁荧荧之光，自以为此号称之。荧屏乃庶人不可缺失之物也！',
      category: '散文',
      date: '2026年1月',
      content: '荧屏者，余所予手机之号也。盖其示区变幻摇曳，烁荧荧之光，自以为此号称之。荧屏乃庶人不可缺失之物也！广自百业之交互，微自乘车之票据，无荧屏实寸步难行也。\n\n然余观荧屏之利亦见其弊也。登京铁四顾，无不俯首据机自乐者；赴学室浅瞰，莫不漫于聊叙互动者，观吾之时辰，亦因荧屏数裂也。\n\n平原竞海西渡记，丙午年西洋历一月三日于燕园卅八楼。',
    },
    {
      id: 2,
      title: '重实学说',
      excerpt: '惟实学以成学。学不惟广，尽己力不足以胜智能；学不惟时长，旦暮持不足以克机械。',
      category: '随笔',
      date: '2025年12月',
      content: '惟实学以成学。学不惟广，尽己力不足以胜智能；学不惟时长，旦暮持不足以克机械。欲莽夫之志而成学，犹蚍蜉渡海，草芥及天，固不可为也。\n\n然何谓"实学"也？余以为实学重其效，重其能。实学重效，故以一辰抵莽学数月，盖实学善悟，为莽学难及也。\n\n平原竞海西渡记，乙巳岁末于燕园。',
    },
  ],
  photographyWorks: [],
};

/**
 * 读取站点数据，如果 KV 中不存在则返回默认数据
 */
export async function readSiteData(): Promise<SiteData> {
  try {
    const data = await kv.get<SiteData>(SITE_DATA_KEY);
    if (!data) {
      return { ...defaultSiteData };
    }
    return {
      ...defaultSiteData,
      ...data,
      heroImages: data.heroImages || [],
      literaryWorks: data.literaryWorks || [],
      photographyWorks: data.photographyWorks || [],
    };
  } catch (error) {
    console.error('KV read error:', error);
    return { ...defaultSiteData };
  }
}

/**
 * 写入站点数据（整体覆盖）
 */
export async function writeSiteData(data: SiteData): Promise<void> {
  await kv.set(SITE_DATA_KEY, JSON.stringify(data));
}

/**
 * 合并更新部分字段
 */
export async function mergeSiteData(partial: Partial<SiteData>): Promise<SiteData> {
  const current = await readSiteData();
  const merged = { ...current, ...partial };
  await writeSiteData(merged);
  return merged;
}
