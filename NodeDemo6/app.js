/**
 * 
 * @authors Er_shenger (Just Because)
 * @date    2018-05-15 14:55:27
 * @version $Id$
 */

const fs = require('fs')
const async = require('async')
const cheerio = require('cheerio')
const request = require('request') // request 太古老了~~~
const path = require('path')
const axios = require('axios')
const url = require('url')

const schoolUrl = 'http://jwc.scau.edu.cn/jwc/index.php?m=content&c=index&a=lists&catid=16'
let arr = []

request(schoolUrl, function(error, response, body) {
	if (!error && response.statusCode === 200) {
		const $ = cheerio.load(body)
		let articleUrls = []
		$(".list .mc a").each((idx, element) => {
			const $element = $(element)
			const href = url.resolve(schoolUrl, $element.attr('href'))
			articleUrls.push(href)
		})
		// console.log(articleUrls)
		async.eachOf(articleUrls, function(value, key, callback) {
			axios.get(value)
				.then(function (response) {
					// console.log(response)
					const $ = cheerio.load(response.data)
					// console.log($('h1').text())
					fs.writeFile(path.join(__dirname, `./教务处公告/${ key + 1 }` + '.txt'), 
					($('.detail_title').text() + $('#content p').text()) || 
					($('.arti_title').text() + $('.article .read p').text()), 
					function(err) {
						if (err) {
							callback(err)
						}
						try {
							arr.push(key)
							console.log(`第${ key + 1 }项`, '写入成功')
						} catch (e) {
							callback(e)
						}
						callback()
					})
				})
		}, err => {
			if (err) {
				console.error(err.message)
			}
			console.log(arr)
		})
		

		// http://www.scau.edu.cn/2018/0502/c1390a82119/page.htm
		// request('http://www.scau.edu.cn/2018/0502/c1390a82119/page.htm', function(error, response, body) {
		// 	if (error) {
		// 		console.error(error) // Error: socket hang up
		// 	}
		// 	// console.log(body)
		// }).on('err', error => { console.log(err) })
		

		// axios.get('http://www.scau.edu.cn/2018/0502/c1390a82119/page.htm')
		// 	.then(function(response) {
		// 		// console.log(response);
		// 		const $ = cheerio.load(response.data)
		// 		console.log($(".article").text())
		// 	})
		// 	.catch(function(error) {
		// 		console.log(error);
		// 	});
	}
})