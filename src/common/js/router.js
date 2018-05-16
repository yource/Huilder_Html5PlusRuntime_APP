/**
 * 定义页面路由及打开方法
 * router.open(router.name)
 **/
(function(router) {
	//首页-底部tabBar
	router.main = {
		id: 'main',
		url: ".././main/main.html",
		aniShow: "zoom-fade-out",
		duration: 100,
		styles: {
			popGesture: "none",
			transform: "ease-out"
		},
		noReturn: true, //不可回退
	}

	router.newsDetail = {
		id: "newsDetail",
		url: ".././newsDetail/newsDetail.html",
		styles: {
			"popGesture": "hide",
			"bounce": "vertical",
			"bounceBackground": "#efeff4"
		}
	}

	//忘记密码
	router.forgetPassword = {
		id: "forgetPassword",
		url: ".././login/forget_password.html"
	}

	/**
	 * 通过router.open打开的页面，默认开启右滑返回
	 * 页面退出后，默认hide
	 */
	router.open = function(name) {
		var id = name.id,
			url = name.url,
			styles = name.styles || {},
			aniShow = name.aniShow || "slide-in-right",
			duration = name.duration || 200,
			showedCB = name.showedCB; //显示之后的回调函数
		styles.plusrequire = "ahead";
		styles.backButtonAutoControl = name.close ? "close" : "hide";
		styles.errorPage = ".././erro/error.html";
		if(plus.os.name == "iOS" && !name.noReturn) {
			styles.popGesture = styles.popGesture || name.close ? "close" : "hide"; //右滑关闭默认开启
		}
		var curWebview = plus.webview.currentWebview();
		var newWebview = plus.webview.open(url, id, styles, aniShow, duration, showedCB);
		if(plus.os.name == "Android" && !name.noReturn) {
			newWebview.drag({
				direction: 'right',
				moveMode: 'followFinger'
			}, {
				view: curWebview,
				moveMode: 'silent'
			}, function(e) {
				if(e.type == 'end' && e.result) {
					if(name.close) {
						plus.webview.close(newWebview);
					} else {
						plus.webview.hide(newWebview);
					}
				}
			});
		}
		return newWebview;
	};
	
	/**
	 * 用于预加载页面
	 */
	router.create = function(name) {
		var id = name.id,
			url = name.url,
			styles = name.styles || {};
		styles.plusrequire = "ahead";
		styles.backButtonAutoControl = name.close ? "close" : "hide";
		styles.errorPage = ".././erro/error.html";
		if(plus.os.name == "iOS" && !name.noReturn) {
			styles.popGesture = styles.popGesture || name.close ? "close" : "hide"; //右滑关闭默认开启
		}
		var curWebview = plus.webview.currentWebview();
		var newWebview = plus.webview.create(url, id, styles);
		if(plus.os.name == "Android" && !name.noReturn) {
			newWebview.drag({
				direction: 'right',
				moveMode: 'followFinger'
			}, {
				view: curWebview,
				moveMode: 'silent'
			}, function(e) {
				if(e.type == 'end' && e.result) {
					if(name.close) {
						plus.webview.close(newWebview);
					} else {
						plus.webview.hide(newWebview);
						newWebview.setStyle({left:'0px'});
					}
				}
			});
		}
		return newWebview;
	};
	
	/**
	 * 显示create创建的页面
	 */
	router.show = function(name){
		var aniShow = name.aniShow || "slide-in-right",
			duration = name.duration || 200,
			showedCB = name.showedCB; //显示之后的回调函数
		plus.webview.show(name.id,aniShow,duration,showedCB)
	}
	
	/**
	 * 打开网络页面
	 */
	router.openURL = function(url, title, showedCB) {
		var id = url;
		var styles = {
			errorPage: ".././erro/error.html",
			backButtonAutoControl: "close"
		};
		if(title) {
			styles.titleNView = {
				autoBackButton: true,
				backgroundColor: "#fff",
				progress: {
					color: "#ff6700",
					height: "1px"
				},
				splitLine: {
					color: "rgba(0,0,0,0.1)",
					height: "1px"
				},
				titleColor: "#3d3e42",
				titleText: title,
				titleSize: "16px"
			}
		}
		if(plus.os.name == "iOS" && !name.noReturn) {
			styles.popGesture = styles.popGesture || name.close ? "close" : "hide"; //右滑关闭默认开启
		}
		var aniShow = "slide-in-right";
		var duration = 200;
		var curWebview = plus.webview.currentWebview();
		var newWebview = plus.webview.open(url, id, styles, aniShow, duration, showedCB);
		if(plus.os.name == "Android") {
			newWebview.drag({
				direction: 'right',
				moveMode: 'followFinger'
			}, {
				view: curWebview,
				moveMode: 'silent'
			}, function(e) {
				if(e.type == 'end' && e.result) {
					if(name.close) {
						plus.webview.close(newWebview);
					} else {
						plus.webview.hide(newWebview);
					}
				}
			});
		}
		return newWebview;
	};

})(window.router = {});