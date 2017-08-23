var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接数据库
mongoose.connect('mongodb://127.0.0.1/shop');

//当数据库连接成功的时候触发
mongoose.connection.on('connected',function(){
  console.log("Mongodb connected success");
})

//当数据库连接失败的时候触发
mongoose.connection.on('error',function(){
  console.log("Mongodb connected disconnected fail");
})

//当数据库关闭连接的时候触发
mongoose.connection.on('disconnected',function(){
  console.log("Mongodb connected disconnected");
})

router.get("/list",function(req,res,next){
	
	let page = parseInt(req.param("page"));//第几页
	let pagesize = parseInt(req.param("pagesize"));//每页有多少条数据
	
	let sort = req.param('sort');
	let priceLevel = req.param('priceLevel');
	let priceGt  = '', priceLte = '';
	let skip = (page-1) * pagesize;
	let param = {};
	console.log(page,skip);
		if(priceLevel != 'all'){
			switch (priceLevel){
				case '0':priceGt = 0; priceLte = 100;break;
				case '1':priceGt = 100; priceLte = 500;break;
				case '2':priceGt = 500; priceLte = 1000;break;
				case '3':priceGt = 1000; priceLte = 5000;break;
			}
			
			param = {
				salePrice:{
					$gt:priceGt,
					$lte:priceLte,
				}
			}
		}
		
		let goodsModel = Goods.find(param).limit(pagesize).skip(skip);
		goodsModel.sort({'salePrice':sort})
		goodsModel.exec({},function(err,docs){
		  console.log(docs);
		  res.json({
		  	status:'0',
		  	result:docs
		  })
		})
	})



//加入购物车

router.post("/addCart",function(req,res,next){
	if(req.cookies.userId){
		var userId = req.cookies.userId;
	}else{
 		res.json({
			status:"1",
			msg:'用户信息不存在'
		})
	}
	
	var productId = req.body.productId;
	var User = require('../models/user');
	
	User.findOne({userId:userId},function(err,userDoc){
		//console.log(userDoc);
		//当添加商品的时候，先去数据库里查询一下这个商品是否存在
		//如果存在，就让它的productNum加1，如果不存在，就添加这个商品

		let goodItem = '';
		//先去数据库里查询一下
		userDoc.cartList.forEach(function(item){
			//如果购物车里面的id和现在要添加的商品id一样就让它productNum加1
			if(item.productId == productId){
				//此时把相同的商品赋值一个变量
				goodItem = item;
				item.productNum ++;
			}
		})
		
		if(goodItem){
			//说明购物车里面存在这个商品
			userDoc.save(function(err3,doc3){
				if(err3){
					res.json({
						status:"1",
						msg:err.message
					})
				}else{
					res.json({
						status:"0",
						result:"商品数量添加成功！"
					})
				}
			});
		}else{
		//此时的逻辑是当商品第一次添加到购物车里面
		//通过productId查询出一条商品,然后把这条商品,存入到user的cartList里面
			Goods.findOne({productId:productId},function(err1,goodsDoc){
					//添加相同的商品，商品只添加一次，数量加1
					goodsDoc.productNum = 1;
					userDoc.cartList.push(goodsDoc);
					userDoc.save(function(err2,doc2){
						if(err2){
							res.json({
								status:"1",
								msg:err.message
							})
						}else{
							res.json({
								status:'0',
								msg:'',
								result:"此商品第一次加入购物车"
							})
						}
		 			})
			}) 
		}	
	})
})
module.exports = router;