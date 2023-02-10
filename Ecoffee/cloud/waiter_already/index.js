// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("now we in here!!!")
  return await cloud.database().collection('order').doc(event.id)
  .update({
    data: {
      status: 2, //shangcai完成
    }
  })
}