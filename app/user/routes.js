/**
 * @file
 * @author tanrich@foxmail.com
 */

const router = require('koa-router')()
const { userModel, playlistModel } = require('./model');
const { playlistDetailModel, trackModel } = require('../playlist/model');

router.prefix('/user')

router.get('/login', async function (ctx, next) {
  try {
    // 检查token
    if (ctx.session && ctx.session.user) {
      ctx.body = { code: 200, username: ctx.session.user.username };
      return;
    }
    // 无token检查是否为登陆的请求
    const { username, password } = ctx.request.query;
    if (!username || !password) throw Error('没有收到字段');
    // 查询此用户
    const res = await userModel.find({ username });
    if (!res || !res.length) throw Error('没有这个用户'); // 没有这个用户
    ctx.session.user = { username, password };
    ctx.body = { code: 200, username };
  } catch (err) {
    ctx.body = { code: 0 };
  }
})

router.post('/register', async function (ctx, next) {
  try {
    const { username, password } = ctx.request.body;
    const res = await userModel.findOne({ username });
    if (res) throw Error(); // 用户名重复
    // 创建歌单并绑定用户
    const playlist = new playlistModel({ creator: username });
    // 创建用户 绑定歌单
    const user = new userModel({ username, password, playlist: [playlist] });
    await user.save();
    ctx.body = {
      code: 200,
      username,
      password
    };
    let track_fox = await trackModel.find({name: '狐狸'});
    // 创建tracks
    if (!track_fox || !track_fox.length) {
      track_fox = new trackModel({
        id: 525241230,
        name: '狐狸',
        ar: [{ name: '薛之谦'}],
        al: {
          name: '狐狸',
          picUrl: "https://miao.su/image/dKmkJ"
        }
      });
    }
    // 绑定歌单详情
    const playlistDetail = new playlistDetailModel({
      id: playlist.id,
      creator: { nickname: username },
      tracks: [track_fox],
    })
    await playlistDetail.save();
  } catch (err) {
    console.log(err)
    ctx.body = { code: 0 }
  }
})

router.put('/logout', function (ctx, next) {
  ctx.session.user = null;
  ctx.body = { status: 0 };
})

router.get('/playList', async function (ctx, next) {
  try {
    if (!ctx.session.user || !ctx.session.user.username) {
      throw new Error('未登录')
    }
    const res = await userModel.findOne({ username: ctx.session.user.username });
    if (!res || !res.playlist) throw Error('没有查到这个人');
    ctx.body = {
      code: 200,
      playlist: res.playlist
    };
  } catch (err) {
    ctx.body = { code: 0 };
  }
})

router.put('/collect', async function (ctx) {
  try {
    if (!ctx.session.user || !ctx.session.user.username) {
      throw new Error('未登录')
    }
    const { songInfo, playListId } = ctx.request.body;
    const res = await playlistDetailModel.findOne({ id:  playListId });
    const resUser = await userModel.findOne({ username: ctx.session.user.username });
    if (!res || !res.tracks) throw Error('收藏失败');

    // 如果收藏则取消，反之
    for (let i = 0, len = res.tracks.length;i < len;i++) {
      if (res.tracks[i].id === songInfo.id) {
        res.tracks.splice(i, 1);
        res.trackCount--;
        resUser.playlist[0].trackCount--;
        await resUser.save();
        await res.save();
        ctx.body = {
          code: 200,
          collect: '取消收藏'
        };
        return;
      }
    }

    res.trackCount++;
    resUser.playlist[0].trackCount++;
    res.tracks.push(songInfo);
    await resUser.save();
    await res.save();
    ctx.body = {
      code: 200,
      collect: '加入收藏'
    };
  } catch (err) {
    console.log(err)
    ctx.body = { code: 0 };
  }
})

module.exports = router
