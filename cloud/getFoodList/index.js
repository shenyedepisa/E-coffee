// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.action == 'search' && event.searchKey) { //搜索菜品
    return await db.collection('food').where({
      name: event.searchKey
    }).get()
  } else if (event.action == 'getHot') { //获取首页推荐位热门商品
    return await db.collection('food').where({
        status: '上架'
      })
      .orderBy('sell', 'desc')
      .limit(10)
      .get()
  } else if(event.action == "getAll") { //获取100条菜品
    return await db.collection('food')
      .where({
        status: '上架'
      }).get()
  }else if(event.action == "charts"){
    return await db.collection('food')
    .orderBy('sell','asc')
    .where({
      status:'上架'
    })
    .get()
  }else if(event.action == "onSale"){
    return await db.collection('food')
    .orderBy('sell', 'desc')
    .where({
      status: '上架'
    }).get()
  }else if(event.action == "offShelf"){
    return await db.collection('food')
    .orderBy('sell', 'desc')
    .where({
      status: '下架'
    }).get()
  }
  else{
    return await db.collection('food')
      .where({
        status: '上架'
      }).get()
  }
}