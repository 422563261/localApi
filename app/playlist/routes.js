/**
 * @file
 * @author tanrich@foxmail.com
 */

const router = require('koa-router')();
const { playlistDetailModel } = require('./model');

router.prefix('/playlist');

router.get('/detail', async function (ctx, next) {
  try {
    const { id } = ctx.request.query;
    const playlist = await playlistDetailModel.find({ id });
    if (!playlist || !playlist.length) throw Error('没有这个歌单');
    ctx.body = {
      code: 200,
      playlist: playlist[0]
    }
  } catch (err) {
    ctx.body = {
      code: 0
    }
  }
})

module.exports = router