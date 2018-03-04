const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const cors = require('koa2-cors');
const user = require('./app/user/routes')
const playlist = require('./app/playlist/routes')
const comment = require('./app/comment/routes')

app.keys = ['secret code']

// error handler
onerror(app)

// middlewares

// 跨域设置
app.use(cors({
  credentials: true
}))
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(session(app))
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// router
app.use(async function (ctx, next) {
  try {
    // 检查token
    if ((ctx.session && ctx.session.user) || /^\/user\/(login|register)?\w*/.test(ctx.request.url)) {
      await next();
    }
  } catch (err) {
    console.log(err)
  }
})
app.use(user.routes(), user.allowedMethods())
app.use(playlist.routes(), user.allowedMethods())
app.use(comment.routes(), user.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
