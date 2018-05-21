/**
 * 
 * @authors Er_shenger (Just Because)
 * @date    2018-05-10 08:46:27
 * @version $Id$
 */

const eventproxy = require('eventproxy')
const superagent = require('superagent')
const cheerio = require('cheerio')
const url = require('url')

const cnodeUrl = 'https://cnodejs.org/'

superagent.get(cnodeUrl)
	.end((err, res) => {
		if (err) {
			return console.error(err)
		}
		var topicUrls = []
		const $ = cheerio.load(res.text)
		//获取首页所有的链接
		$('#topic_list .topic_title').each((idx, element) => {
			const $element = $(element)
			const href = url.resolve(cnodeUrl, $element.attr('href'))
			topicUrls.push(href)
		})
		// console.log(topicUrls)
		const ep = new eventproxy()
	
		ep.after('topic_html', topicUrls.length, (topics) => {
			// topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那40个 pair 
			
			// 开始行动
			topics = topics.map((topicPair) => {
				var topicUrl = topicPair[0]
				var topicHtml = topicPair[1]
				const $ = cheerio.load(topicHtml)
				return ({
					title: $('.topic_full_title').text().trim(),
					href: topicUrl,
					comment1: $('.reply_content').eq(0).text().trim()
				})
			})
	
			console.log('finals:')
			console.log(topics)
		})

		topicUrls.forEach((topicUrl) => {
			superagent.get(topicUrl)
				.end((err, res) => {
					console.log('fetch ' + topicUrl + ' successful')
					ep.emit('topic_html', [topicUrl, res.text])
				})
		})
	})