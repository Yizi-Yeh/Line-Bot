// 引用 line 機器人套件
import linebot from 'linebot'
// 引用 dotenv 套件
import dotenv from 'dotenv'

import axios from 'axios'

import cheerio from 'cheerio'

// 讀取.env
dotenv.config()

// 設定機器人
const bot = linebot({
  // process.env.設定名稱  處理程序的環境
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  verify: true
})

bot.on('message', async event => {
  try {
    // 對bot說的話

    const text = event.message.text
    const response = await axios.get(`https://www.weblio.jp/content/${encodeURIComponent(text)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'
      }
    })
    console.log(`https://www.weblio.jp/content/${encodeURIComponent(text)}`)
    const $ = cheerio.load(response.data)
    // eslint-disable-next-line no-unused-vars
    let reply = ''
    if ($('.section-card .basic-card .kijiWrp .kiji').text()) {
      reply += $('.section-card .basic-card .kijiWrp .kiji .midashigo').eq(0).text() + '\n'
      const desc = $('.section-card .basic-card .kiji .Sgkdj p')
      for (let i = 0; i < desc.length; i++) {
        reply += desc.eq(i).text() + '\n' + '\n'
        reply += '參考資料：'+ '\n'　+ 'https://www.weblio.jp/content/' + text
      }
    } else {
      if ($('#main #cont .kijiWrp .kiji').text()) {
        reply += $('#main #cont .kijiWrp .kiji .midashigo').eq(0).text() + '\n'
        reply += $('#main #cont .kijiWrp .kiji .Jtnhj').eq(0).text() + '\n'
        const imi = $('#main #cont .kijiWrp .kiji .Sgkdj p')
        for (let j = 0; j < imi.length; j++) {
          reply += imi.eq(j).text() + '\n' + '\n'
        } reply += '參考資料：'　+ '\n' + 'https://www.weblio.jp/content/' + text 
      }
    }
 
    console.log('reply: \n' + reply)
    // eslint-disable-next-line no-undef
    reply = (reply.length === 0) ? '言葉は見つからなかったよ...すみません。' : reply
    event.reply(reply)
  } catch (error) {
    event.reply('發生錯誤')
    console.log(error)
  }
})



bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
