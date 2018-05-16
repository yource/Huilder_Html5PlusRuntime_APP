var mainWebview = null;
var $login = new Vue({
	el: '#loginCon',
	data: {
		username: "yource",
		password: "",
		showPwd: false,
		showClean: false
	},
	mounted:function() {
		mui.init();
		mui.plusReady(function() {
			pageReady();
		})
	},
	methods: {
		loginSubmit:function() {
			if(!this.username) {
				mui.toast('请输入用户名') 
				return;
			}
			if(!this.password) {
				mui.toast('请输入密码') 
				return;
			}
			mui.toast("",{type:"wait"})
			setTimeout(function() {
			    mui.closePopups();
				if($login.username == "yource" && $login.password == "1") {
					//触发主页面初始化方法
					mui.fire(mainWebview, "init", {
						userId: 12345,
						userName: "yource"
					})
					router.show(router.main)
				} else {
					mui.toast('登录失败');
				}
			}, 300)
		},
		toRegister:function() {
			router.open(router.register)
		},
		toForgetpwd:function() {
			router.open(router.forgetPassword)
		},
		cleanInput:function() {
			this.username = "";
			this.password = "";
			document.querySelector("#username").focus();
		},
	}
});

function pageReady() {
	// 预加载主页面
	mainWebview = router.create(router.main)
	// 监听安卓返回键
	var backButtonPress = 0;
	mui.back = function(event) {
		backButtonPress++;
		if(backButtonPress > 1) {
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast('再按一次退出应用');
		}
		setTimeout(function() {
			backButtonPress = 0;
			toast.close();
		}, 1800);
		return false;
	};
}