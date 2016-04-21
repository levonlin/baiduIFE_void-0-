function checkName(node) {
	var resultP = node.parentNode.getElementsByTagName("p")[0],
		name = node.value.trim();

	var chinese = /[\u4E00-\u9FA5|，|。|？|、|；|：|“|”|‘|’|》|《|｛|｝|【|】|！|￥|……|（|）|——|·]/gi,
		ch_wordsNum = 0;

	while(chinese.test(name)){
		ch_wordsNum++;
	}
	if (name.length + ch_wordsNum < 4 || name.length + ch_wordsNum > 16) {
		resultP.innerHTML = "姓名长度必须在4-16位之间";
		resultP.style.color = "red";
	} else {
		resultP.innerHTML = "姓名格式正确！";
		resultP.style.color = "green";
	}
}

function checkPassword(node) {
	var parent = node.parentNode,
		resultP = parent.getElementsByTagName("p")[0],
		password = node.value,
		passwordConfirm = parent.nextSibling.nextSibling.getElementsByTagName("input")[0].value;

	if (passwordConfirm) {
		if (password !== passwordConfirm) {
			resultP.innerHTML = "密码不一致";
			resultP.style.color = "red";
		} else {
			resultP.innerHTML = "密码有效！";
			resultP.style.color = "green";
		}
	} else {
		if (password.length < 6 || password.length > 20) {
			resultP.innerHTML = "密码长度必须在6-20位之间";
			resultP.style.color = "red";
		} else {
			resultP.innerHTML = "密码有效！";
			resultP.style.color = "green";
		}
	}
}

function checkPasswordConfirm(node) {
	var parent = node.parentNode,
		resultP = parent.getElementsByTagName("p")[0],
		password = parent.previousSibling.previousSibling.getElementsByTagName("input")[0].value,
		passwordConfirm = node.value;

	if(password){
		if (password !== passwordConfirm) {
			resultP.innerHTML = "密码不一致";
			resultP.style.color = "red";
		} else {
			resultP.innerHTML = "密码有效！";
			resultP.style.color = "green";
		}
	} else {
		if (passwordConfirm.length < 6 || passwordConfirm.length > 20) {
			resultP.innerHTML = "密码长度必须在6-20位之间";
			resultP.style.color = "red";
		} else {
			resultP.innerHTML = "密码有效！";
			resultP.style.color = "green";
		}
	}
}

function checkEmail(node) {
	var resultP = node.parentNode.getElementsByTagName("p")[0],
		mail = node.value,
		mailFormat = /^[0-9a-zA-z\.]+@[0-9a-zA-z]+[0-9a-zA-z\.]*\.[a-zA-z]+$/gi;

	if (mailFormat.test(mail)) {
		resultP.innerHTML = "邮箱格式正确！";
		resultP.style.color = "green";
	} else {
		resultP.innerHTML = "邮箱地址格式有误";
		resultP.style.color = "red";
	}
}
function checkPhone(node) {
	var resultP = node.parentNode.getElementsByTagName("p")[0],
		phone = node.value,
		phoneFormat = /^1(3[0-9]|47|5[0-3]|5[5-9]|80|8[5-9])[0-9]{8}$/gi;

	if (phoneFormat.test(phone)) {
		resultP.innerHTML = "手机号有效！";
		resultP.style.color = "green";
	} else {
		resultP.innerHTML = "手机号有误";
		resultP.style.color = "red";
	}
}
function initial() {

	var foreach = Array.prototype.forEach;

	foreach.call(document.getElementsByTagName("form"),function(v,i){
		foreach.call(v.getElementsByTagName("input"),function(val,index){
			val.onfocus = function () {
				val.parentNode.getElementsByTagName("p")[0].style.visibility = "visible";
			};
			val.onblur = function () {
				switch(val.getAttribute("data-filltype")){
					case "name":
						checkName(this);
						break;

					case "password":
						checkPassword(this);
						break;

					case "passwordConfirm":
						checkPasswordConfirm(this);
						break;

					case "mail":
						checkEmail(this);
						break;

					case "phone":
						checkPhone(this);
						break;
				}
			};
		});
	});
	document.getElementById("submit").onclick = function(e) {
		e = e || window.event;
		if(e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		foreach.call(document.getElementsByTagName("input"),function(v,i){
			v.parentNode.getElementsByTagName("p")[0].style.visibility = "visible";
			switch(v.getAttribute("data-filltype")){
				case "name":
					checkName(v);
					break;

				case "password":
					checkPassword(v);
					break;

				case "passwordConfirm":
					checkPasswordConfirm(v);
					break;

				case "mail":
					checkEmail(v);
					break;

				case "phone":
					checkPhone(v);
					break;
			}
		});
	};
}

initial();