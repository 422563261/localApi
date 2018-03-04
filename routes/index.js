const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  if (!ctx.cookies.get('user')) {
    ctx.cookies.set('user', 'tan')
  }
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  if (n >=5 ) ctx.session = null;
  // console.log(ctx.session)

  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
