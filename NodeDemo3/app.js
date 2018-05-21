/**
 * 
 * @authors Er_shenger (Just Because)
 * @date    2018-05-10 13:57:42
 * @version $Id$
 */

const async = require('async')

var concurrencyCount = 0
const fetchUrl = (url, callback) => {
	var delay = parseInt((Math.random() * 10000000) % 2000, 10)
	concurrencyCount++
	console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒')
	setTimeout(() => {
		concurrencyCount--
		callback(null, url + ' html content')
	}, delay)
}

var urls = []
for (var i = 0; i < 30; i++) {
	urls.push('http://datasource_' + i)
}

async.mapLimit(urls, 5, (url, callback) => {
	fetchUrl(url, callback)
}, (err, results) => {
	console.log('final:')
	console.log(results)
})