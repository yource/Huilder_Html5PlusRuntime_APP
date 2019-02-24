/**
 * 对localStorage的简单封装
 * storage.set(name,config)
 * storage.get(name)
 **/
(function(storage) {
	storage.state = JSON.parse(localStorage.getItem("state"));
	storage.set = function(name, cfg) {
		if(!name || !cfg || typeof(name) != "string") {
			console.log("错误：storage设置错误");
			return;
		}
		localStorage.setItem(name, JSON.stringify(cfg));
	};
	storage.get = function(name) {
		if(!name) {
			console.log("错误：缺少storage查询参数");
			return;
		}
		var settingsText = localStorage.getItem(name) || "{}";
		return JSON.parse(settingsText);
	};

	/**
	 * 获取本地是否安装客户端
	 **/
	storage.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
})(window.storage = {});

/**
 * ajax方法，统一处理请求错误
 * ajax({url,type,data,success})
 */
(function(window) {
	if(!window.mui) {
		return;
	} else {
		var mui = window.mui;
	}
	var http = storage.get("http");
	var origin = url = "";
	if(http.origin) {
		origin = http.origin;
	} else {
		origin = window.location.origin;
	}
	window.ajax = function(url, success, fail) {
		if(url.indexOf("http") == 0) {
			url = url;
		} else if(url.indexOf("www") == 0) {
			url = "http://" + url;
		} else if(url.indexOf("/") == 0) {
			url = origin + url;
		} else {
			url = origin + "/" + url;
		}
		var oldError = config.error;
		config.error = function(xhr, type, error) {
			toast.close();
			toast.text("请求出错");
			if(oldError) {
				oldError(xhr, type, error)
			}
		};
		mui.ajax(url, config);
	}
})(window);

/**
 * dateUtils时间辅助类
 * 将一个时间转换成x小时前、y天前等
 */
(function(window) {
	if(!window.mui) {
		return;
	}
	var util = {
		UNITS: {
			'年': 31557600000,
			'月': 2629800000,
			'天': 86400000,
			'小时': 3600000,
			'分钟': 60000,
			'秒': 1000
		}
	};
	util.humanize = function(milliseconds) {
		var humanize = '';
		mui.each(this.UNITS, function(unit, value) {
			if(milliseconds >= value) {
				humanize = Math.floor(milliseconds / value) + unit + '前';
				return false;
			}
			return true;
		});
		return humanize || '刚刚';
	};
	util.format = function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if(diff < this.UNITS['天']) {
			return this.humanize(diff);
		}

		var _format = function(number) {
			return(number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' + _format(date.getHours()) + ':' + _format(date.getMinutes());
	};
	util.parse = function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	};
	window.dateUtils = util;
})(window);


// noNet()获取当前网络状况
(function(window){
    window.noNet = function(){
        if(window.plus){
            return plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE;
        }else{
            return false;
        }
    }
})(window)