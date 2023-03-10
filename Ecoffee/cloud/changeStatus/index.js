// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.action)
  console.log("菜品数据")
  if(event.action == 'onSale'){
    return await cloud.database().collection('food').doc(event.id)
    .update({
      data: {
        status: "上架",
      }
    })
  }else{
    return await cloud.database().collection('food').doc(event.id)
    .update({
      data: {
        status: "下架", 
      }
    })
  }
  
}