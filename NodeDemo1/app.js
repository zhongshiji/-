/**
 * 
 * @authors Er_shenger (Just Because)
 * @date    2018-05-07 10:25:52
 * @version $Id$
 */

const Koa = require("koa")
const Router = require('koa-router')
// const utility = require('utility')
const superagent = require('superagent')
const cheerio = require('cheerio')

const app = new Koa()
const router = new Router()

// app.use(async(ctx, next) => {
// 	await next();
// 	ctx.response.type = 'text/html';
// 	ctx.response.body = '<h1>Hello, koa2!</h1>';
// })

// router.get('/', (ctx, next) => {
// 	var q = ctx.query.q;
// 	var md5Value = utility.md5(q)
// 	ctx.response.body = md5Value
// })

router.get('/', async (ctx, next) => {
  //用superagent去抓取 https://cnodejs.org/ 的内容
  const data = new Promise((resolve, reject) => {
    superagent.get('https://cnodejs.org')
      .end(function (err, sres) {
        //常规的错误处理
        if (err) {
          return next(err)
        }
        // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
        // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
        // 剩下就都是 jquery 的内容了
        const $ = cheerio.load(sres.text);
        // console.log(sres.text)
        var items = [];
        $('#topic_list .topic_title').each(function (idx, element) {
          var $element = $(element)
          items.push({
            title: $element.attr('title'),
            href: $element.attr('href')
          })
        })
        // console.log(items)
        resolve(items)
      })
  });
  ctx.body = await data;
})

app
	.use(router.routes())
	.use(router.allowedMethods())

app.listen(3000, function() {
	console.log('app started at port 3000...')
})