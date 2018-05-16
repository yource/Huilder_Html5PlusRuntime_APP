var mainWebview = null;
var $login = new Vue({
	el: '#loginCon',
	data: {
		username: "yource",
		password: "",
		showPwd: false,
		showClean: false
	},
	mounted() {
		mui.init();
		mui.plusReady(function() {
			pageReady();
		})
	},
	methods: {
		loginSubmit() {
			//校验
			if(!this.username) {
				toast.text('请输入用户名');
				return;
			}
			if(!this.password) {
				toast.text('请输入密码');
				return;
			}
			toast.wait();
			//			ajax({
			//				url: "login",
			//				data: {
			//					username: this.username,
			//					password: this.password
			//				},
			//				success: function(data) {
			//					toast.close();
			//					router.open(router.main)
			//				}
			//			})
			var that = this;
			setTimeout(function() {
				if(that.username == "yource" && that.password == "1") {
					toast.close();
					//触发主页面初始化方法
					mui.fire(mainWebview, "init", {
						userId: 12345,
						userName: "yource"
					})
					//显示主页面
					router.show(router.main)
				} else {
					toast.close();
					toast.text('登录失败');
				}
			}, 300)
		},
		toRegister() {
			router.open(router.register)
		},
		toForgetpwd() {
			router.open(router.forgetPassword)
		},
		cleanInput() {
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