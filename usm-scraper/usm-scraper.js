require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 目标网站 URL
const TARGET_URL = 'https://directory.usm.my/';

async function fetchCleanText(url) {
  // 伪装成正常的浏览器访问，防止被部分大学服务器直接拦截
  const { data: html } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    timeout: 15000,
  });

  const $ = cheerio.load(html);

  // 暴力拆除所有没用的前端代码和不可见元素
  $('script, style, noscript, svg, iframe, nav, footer').remove();

  // 提取剩余干净的纯文本
  const rawText = $('body').text();
  const cleanText = rawText
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');

  return cleanText;
}

async function extractLecturersWithGemini(cleanText) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY 没找到！请检查你的 .env 文件。');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // 召唤 2026 年 9 月最新发布的旗舰处理引擎 gemini-3.8-flash
  const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

  // 精准指令：提取关键情报并强制转换 JSON
  const prompt = `你是一个学术情报提取专家。请从以下大学目录的纯文本中，提取所有讲师的姓名 (name)、所属部门/学院 (faculty) 以及联系方式 (contact，邮箱或电话)。
请严格返回一个 JSON 数组格式，不要包含任何 Markdown 标记（例如 \`\`\`json ），不要有任何废话。

文本内容:
${cleanText}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // 防御性代码：万一大模型又抽风带上了 Markdown 框，手动帮它削掉
  const cleaned = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('JSON 转换失败，大模型的原始返回是：\n', responseText);
    throw err;
  }
}

async function main() {
  try {
    console.log(`[1/3] 正在潜入目标网站抓取网页: ${TARGET_URL}...`);
    const cleanText = await fetchCleanText(TARGET_URL);

    console.log(`[2/3] 抓取成功！清洗出 ${cleanText.length} 个字符的纯文本。`);
    console.log('[3/3] 正在交给 Gemini 3.8 Flash 大脑进行数据炼金...');

    const lecturers = await extractLecturersWithGemini(cleanText);

    console.log('\n========= 🎉 成功提取到的情报数据 =========');
    console.log(JSON.stringify(lecturers, null, 2));
  } catch (err) {
    console.error('\n❌ 任务失败:', err.message);
  }
}

main();