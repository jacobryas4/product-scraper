const rp = require('request-promise')
const $ = require('cheerio')
const url = 'https://brickseek.com'

rp(url).then((html) => {
    console.log($('item-list__title > span',html),length)
}).catch(err => {
    console.log(err)
})