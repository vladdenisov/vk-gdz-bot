const { VK } = require('vk-io')
const cheerio = require('cheerio')
const axios = require('axios')
require('dotenv').config()

const GETARGS = ctx => ctx.text.toLowerCase().match(/\S+/g).slice(1)

const vk = new VK({
  token: process.env.TOKEN
})

const { updates } = vk

updates.hear('/start', async ctx => {
  console.log(ctx)
  await ctx.send('Hello!')
})

updates.hear(/алгебра/gi, async ctx => {
  let cmd = GETARGS(ctx)
  let BASE_URL = 'https://gdz.ru/class-10/algebra/reshebnik-mordkovich-a-g/'
  let URL = `${ BASE_URL }${ cmd[0] }-item-${ cmd[1] }/`
  console.log(URL)
  axios.get(URL).then(async response => {
    let $ = cheerio.load(response.data)
    let tasks = $('.task-img-container')
    let img = []
    tasks.map(async e => img.push('http:' + $(tasks[e]).children()[0].children[1].attribs.src))
    await ctx.sendPhotos(img)
  })
})

updates.hear(/геометрия/gi, async ctx => {
  let cmd = GETARGS(ctx)
  let BASE_URL = 'https://megaresheba.ru/publ/reshebnik/geometrija/10_11_klass_atanasjan/32-1-0-1117/'
  let URL = `${ BASE_URL }class-${ cmd[0] >= 400 ? 11 : 10 }-${ cmd[0] }/`
  axios.get(URL).then(async response => {
    let $ = cheerio.load(response.data)
    let tasks = $('div.with-overtask')
    let img = []
    tasks.map(async e => img.push($(tasks[e]).children()[0].attribs.src))
    await ctx.sendPhotos(img)
  })
})

updates.startPolling()
