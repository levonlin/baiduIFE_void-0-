function hasClass(element, className) {
	return (new RegExp('(^|\\s)' + className + '($|\\s)')).test(element.className);
}

function addClass(element, newClassName) {
	if (!hasClass(element, newClassName)) {
		element.className += element.className ? (' ' + newClassName) : newClassName; 
	}
}

function removeClass(element, oldClassName) {
	if (hasClass(element, oldClassName)) {
		element.className = element.className.replace(new RegExp('(^|\\s)' + oldClassName + '($|\\s)'), ' ').trim(); 
	}
}

function getTips(inputBox) {
	switch (inputBox.name) {
		case 'user-name':
		return '必填，长度为4~16个字符';
		case 'password':
		return '必填，长度为4~16个数字或英文字母';
		case 'password-confirm':
		return '再次输入相同的密码';
		case 'mail':
		return '必填，输入您的常用邮箱';
		case 'phone':
		return '必填，输入您的手机号';
		default:
		return '';
	}
}

function getInputStrLen(inputStr) {
	var result = 0;
	for (var i in inputStr) {
		if (/[\u4e00-\u9fa5\u3000-\u301e\ufe10-\ufe19\ufe30-\ufe44\ufe50-\ufe6b\uff01-\uffee]/.test(inputStr[i])) {
			result +=2;
		} else {
			result++;
		}
	}
	return result;
}

function validateUserName(inputStr) {
	inputStr = inputStr.trim();
	var inputStrLen = getInputStrLen(inputStr);
	if (inputStr === '') {
		return [false, '姓名不能为空'];
	} else if (inputStrLen < 4 || inputStrLen > 16) {
		return [false, '字符长度应为4~16位（一个汉字或中文标点算2位）'];
	} else {
		return [true, '用户名可用'];
	}
}

function validatePassword(inputStr) {
	if (/^[0-9a-zA-Z]{4,16}$/.test(inputStr)) {
		return [true, '密码可用'];
	} else if (inputStr === '') {
		return [false, '密码不能为空'];
	} else {
		return [false, '密码长度应为4~16位的数字或英文字母'];
	}
}

function validatePasswordConfirm(inputStr) {
	var password = myForm.password.value; 
	if (/^[0-9a-zA-Z]{4,16}$/.test(inputStr) && inputStr === password) {
		return [true, '密码输入一致'];
	} else if (inputStr === '') {
		return [false, '密码不能为空'];
	} else if (inputStr !== password) {
		return [false, '两次密码输入不一致'];
	} else {
		return [false, '密码长度应为4~16位的数字或英文字母'];
	}
}

function validateMail(inputStr) {
	inputStr = inputStr.trim();
	if (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+$/.test(inputStr)) {
		return [true, '邮箱地址格式正确'];
	} else if (inputStr === '') {
		return [false, '邮箱地址不能为空'];
	} else {
		return [false, '邮箱地址格式错误'];
	}
}

function validatePhone(inputStr) {
	inputStr = inputStr.trim();
	if (/1\d{10}$/.test(inputStr)) {
		return [true, '手机号码格式正确'];
	} else if (inputStr === '') {
		return [false, '手机号码不能为空'];
	} else {
		return [false, '手机号码格式错误'];
	}
}

function validateInput(inputBox) {
	var formItem = inputBox.parentNode;
	var valiInfo = formItem.getElementsByClassName('vali-info')[0];
	var valiResult = [undefined, undefined];	
	var inputStr = inputBox.value;
	switch (inputBox.name) {
		case 'user-name':
		valiResult = validateUserName(inputStr);
		break;
		case 'password':
		valiResult = validatePassword(inputStr);
		break;
		case 'password-confirm':
		valiResult = validatePasswordConfirm(inputStr);
		break;
		case 'mail':
		valiResult = validateMail(inputStr);
		break;
		case 'phone':
		valiResult = validatePhone(inputStr);
		break;
	}
	if (valiResult[0]) {
		removeClass(inputBox, 'err');
		removeClass(valiInfo, 'err');
		addClass(inputBox, 'correct');
		addClass(valiInfo, 'correct');
		valiInfo.textContent = valiResult[1];
	} else {
		removeClass(inputBox, 'correct');
		removeClass(valiInfo, 'correct');
		addClass(inputBox, 'err');
		addClass(valiInfo, 'err');
		valiInfo.textContent = valiResult[1];
	}
	return valiResult[0];
}

var myForm = document.getElementsByClassName('my-form')[0];
var inputBoxs = myForm.getElementsByTagName('input');
var submitBtn = myForm.getElementsByClassName('submit-btn')[0];

for (var i = 0; i < inputBoxs.length; i++) {
	inputBoxs[i].addEventListener('focus', function (event) {
		var inputBox = event.target;
		var formItem = inputBox.parentNode;
		var valiInfo = formItem.getElementsByClassName('vali-info')[0];
		removeClass(inputBox, 'err');
		removeClass(valiInfo, 'err');
		removeClass(inputBox, 'correct');
		removeClass(valiInfo, 'correct');
		valiInfo.textContent = getTips(inputBox);
	}, false);

	inputBoxs[i].addEventListener('blur', function (event) {
		var inputBox = event.target;
		validateInput(inputBox);
	}, false);
}

submitBtn.addEventListener('click', function (event) {
	var isAllVali = true;
	for (var i = 0; i < inputBoxs.length; i++) {
		var inputBox = inputBoxs[i];
		// 只要有一个验证结果为假，那所有结果就都为假
		isAllVali = validateInput(inputBox) && isAllVali;
	}
	if (isAllVali) {
		alert('提交成功！');
	} else {
		alert('提交失败！');
	}
}, false);
