/**
 * 
 * @authors Er_shenger (Just Because)
 * @date    2018-05-14 10:56:47
 * @version $Id$
 */

const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

const fibonacci = function (n) {
  // typeof NaN === 'number' 是成立的，所以要判断 NaN
  if (typeof n !== 'number' || isNaN(n)) {
    throw new Error('n should be a Number');
  }
  if (n < 0) {
    throw new Error('n should >= 0')
  }
  if (n > 10) {
    throw new Error('n should <= 10');
  }
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }

  return fibonacci(n-1) + fibonacci(n-2);
};

router.get('/fib', (ctx, next) => {
  // console.log(ctx.query)
  var n = Number(ctx.query.n)
  try {
    ctx.body = String(fibonacci(n))
  } catch (e) {
    ctx.status = 500
    ctx.body = e.message
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app.listen(3000, function () {
  console.log('app is listening at port 3000')
})