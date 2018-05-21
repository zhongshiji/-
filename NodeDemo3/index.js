/**
 * 
 * @authors Er_shenger (Just Because)
 * @date    2018-05-10 14:30:17
 * @version $Id$
 */

const superagent = require('superagent')
const cheerio = require('cheerio')
const url = require('url')
const async = require('async')

const doubanUrl = 'https://book.douban.com/'

superagent.get(doubanUrl)
	.end((err, res) => {
		if (err) {
			return console.error(err)
		}
		var bookUrls = []
		const $ = cheerio.load(res.text)
		//获取新书速递版块中所有书籍的链接
		$('#content .bd .slide-list .cover a').each((idx, element) => {
			const $element = $(element)
			// console.log($element)
			const href = url.resolve(doubanUrl, $element.attr('href'))
			bookUrls.push(href)
		})
		// console.log(bookUrls)

		var concurrencyCount = 0

		const fetchUrl = function(url) {
			const date1 = Date.now()
			concurrencyCount++
			return new Promise((resolve, reject) => {
				superagent.get(url)
					.end((err, res) => {
						if (err) { console.error(err) }
						var introduction = []
						const $ = cheerio.load(res.text)
						$('#interest_sectl .rating_num').each((idx, element) => {
							const $element = $(element)
							const pcontent = $element.text().trim() || '尚无评分'
							introduction.push(pcontent)
						})
						resolve(introduction)
						concurrencyCount--
					})
			const date2 = Date.now()
			console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + (date2-date1) + '毫秒')
			})
		}

		async.mapLimit(bookUrls, 5, async(url) => {
			return await fetchUrl(url)
		}, (err, results) => {
			// results 为所有 introduction 
			console.log('final:')
			console.log(results)
		})
	})