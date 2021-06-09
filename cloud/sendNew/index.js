// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      lang: 'zh_CN',
      templateId: '9Bhch4xuwY9s_cN3yhZ_KvxfaOr4983pzJp_YknQ-tA',
      miniprogramState: 'developer',
      data: {
        character_string1: {
          value: event.No
        },
        time16: {
          value: event.time
        },
        thing2: {
          value: "Ecoffee北航新主楼店"
        },
      }
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}