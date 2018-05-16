## 简单概述
基于前端技术和Html5Plus SDK，用webview做界面管理的多页面应用，可以调用摄像头、文件系统、设备信息等系统api，也可以进行第三方登录、支付、地图等拓展，功能丰富，运行流畅。

## 主要功能

0. [窗口管理：预加载页面，事件触发，滑动返回，nativeUI绘制等](#0)
1. [弹框：消息提示、确认框、等待框](#1)
2. [图片轮播](#2)
3. [操作表，时间日期选择器，多级联动选择器](#3)
4. 懒加载和上拉/下拉刷新
5. 选项卡页面切换
6. 索引列表
7. Echart图表
8. 音频录制播放
9. 二维码扫描
10. 图片选择/拍照
11. 发送短信/打电话
12. QQ/微信/新浪 登录
13. 微信/支付宝 支付
14. 分享到QQ/微信朋友群等
15. 消息推送及设置

----------------------


### <a name="0">窗口管理</a>
基于plus.webview系列方法，支持右滑返回；styles等参数参考<a target="_blank" href="http://www.html5plus.org/doc/zh_cn/webview.html">HTML5+规范</a>。
router.create创建新窗口，router.show显示已创建的窗口，router.open创建并打开，router.openUrl打开网络页面
> 
    //路由定义示例
    router.main = {
        id:"main",
        url:".././pages/main.html"
    }
    
    //打开页面，返回窗口对象
    main = router.open(router.main)
    
    //或者 根据id获取页面窗口对象
    main = plus.webview.getWebviewById("main")
> 
窗口间事件通讯：
>   
    //确认TargetWebview已创建
    TargetWebview = router.create(router.target);
    
    //在当前页面触发init事件
    mui.fire(TargetWebview, "init", {
    	userId: 12345,
    	userName: "yource"
    })
    
    //在TargetWebview监听事件
    document.addEventListener('init', function (event) {
    	var userId = event.detail.userId;
    	var userName = event.detail.userName;
    	...
    })
>
### <a name="1">消息框</a>
提示框（定时消失）
>   
    mui.toast('登陆成功',{ duration:'long'}) ;
    mui.closePopups();
>
等待框（原生）
> 
    plus.nativeUI.showWaiting( "等待中", {background:"rgba(0,0,0,0.7)"} );
    plus.nativeUI.closeWaiting();
> 
确认框（带确认和取消按钮）
> 
    mui.confirm(message, title, function(btn){
        alert(btn.index)
    });
    mui.closePopups();
> 
### <a name="2">图片轮播<a>
使用mint-ui
> 
    <mt-swipe :auto="2000" >
    	<mt-swipe-item v-for="item in banner" :key="item.id">
    		<img :src="item.picUrl" @tap="bannerClick(item.linkUrl)">
    	</mt-swipe-item>
    </mt-swipe>
> 
### <a name="3">选择器<a>
从下方弹出的操作选项，使用mint-ui
> 
    <mt-actionsheet :actions="actionsheet" v-model="showPicker"></mt-actionsheet>
    
    data:{
        showPicker: false,
        actionsheet: [{
        	name: "选项1",
        	method: function () {}
        }, {
        	name: "选项2",
        	method: function () {}
        }]
    }
> 


