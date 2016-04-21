/**
 * 判断类名是否存在
 */
function hasClass(element, className) {
	return (new RegExp('(^|\\s)' + className + '($|\\s)')).test(element.className);
}

/**
 * 添加类名
 */
function addClass(element, newClassName) {
	if (!hasClass(element, newClassName)) {
		element.className += element.className ? (' ' + newClassName) : newClassName; 
	}
}

/**
 * 移除类名
 */
function removeClass(element, oldClassName) {
	if (hasClass(element, oldClassName)) {
		element.className = element.className.replace(new RegExp('(^|\\s)' + oldClassName + '($|\\s)'), ' ').trim(); 
	}
}

/**
 * 判断类名前缀是否存在
 */
function hasClassPrefix(element, classPrefix) {
	return (new RegExp('(^|\\s)' + classPrefix + '-')).test(element.className);
}

/**
 * 替换类名后缀
 */
function replaceClassSuffix(element, classPrefix, newSuffix) {
	if(hasClassPrefix(element, classPrefix)) {
		element.className = element.className.replace(new RegExp('(^|\\s)(' + classPrefix + '-).*?($|\\s)'), '$1$2'+ newSuffix +'$3'); 
	} else {
		addClass(element, classPrefix + '-' + newSuffix);
	}
}

// 表单验证的配置
var VALIDATORS = {
	validateUserName: function (inputStr) {
		inputStr = inputStr.trim();
		var inputStrLen = 0;
		for (var i in inputStr) {
			if (/[\u4e00-\u9fa5\u3000-\u301e\ufe10-\ufe19\ufe30-\ufe44\ufe50-\ufe6b\uff01-\uffee]/.test(inputStr[i])) {
				inputStrLen +=2;
			} else {
				inputStrLen++;
			}
		}
		if (inputStr === '') {
			return [false, '姓名不能为空'];
		} else if (inputStrLen < 4 || inputStrLen > 16) {
			return [false, '字符长度应为4~16位（一个汉字或中文标点算2位）'];
		} else {
			return [true, '用户名可用'];
		}
	},

	validatePassword: function (inputStr) {
		if (/^[0-9a-zA-Z]{4,16}$/.test(inputStr)) {
			return [true, '密码可用'];
		} else if (inputStr === '') {
			return [false, '密码不能为空'];
		} else {
			return [false, '密码长度应为4~16位的数字或英文字母'];
		}
	},

	validatePasswordConfirm: function (inputStr, formElement) {
		var password = formElement.password.value; 
		if (/^[0-9a-zA-Z]{4,16}$/.test(inputStr) && inputStr === password) {
			return [true, '密码输入一致'];
		} else if (inputStr === '') {
			return [false, '密码不能为空'];
		} else if (inputStr !== password) {
			return [false, '两次密码输入不一致'];
		} else {
			return [false, '密码长度应为4~16位的数字或英文字母'];
		}
	},
	
	validateMail: function (inputStr) {
		inputStr = inputStr.trim();
		if (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+$/.test(inputStr)) {
			return [true, '邮箱地址格式正确'];
		} else if (inputStr === '') {
			return [false, '邮箱地址不能为空'];
		} else {
			return [false, '邮箱地址格式错误'];
		}
	},

	validatePhone: function (inputStr) {
		inputStr = inputStr.trim();
		if (/1\d{10}$/.test(inputStr)) {
			return [true, '手机号码格式正确'];
		} else if (inputStr === '') {
			return [false, '手机号码不能为空'];
		} else {
			return [false, '手机号码格式错误'];
		}
	}
};

// 表单项配置
var formData = {
	'user-name': {
		name: 'user-name',
		type: 'text',
		validator: VALIDATORS.validateUserName, // 表单验证规则
		label: '名称',                    // 表单标签
		rules: '必填，长度为4-16个字符',    // 填写规则提示
	},

	'password': {
		name: 'password',
		type: 'password',
		validator: VALIDATORS.validatePassword,
		label: '密码',
		rules: '必填，长度为4~16个数字或英文字母',
	},

	'password-confirm': {
		name: 'password-confirm',
		type: 'password',
		validator: VALIDATORS.validatePasswordConfirm,
		label: '密码确认',
		rules: '再次输入相同的密码',
	},

	'mail': {
		name: 'mail',
		type: 'text',
		validator: VALIDATORS.validateMail,
		label: '邮箱',
		rules: '必填，输入您的常用邮箱',
	},

	'phone': {
		name: 'phone',
		type: 'text',
		validator: VALIDATORS.validatePhone,
		label: '手机',
		rules: '必填，输入您的手机号',
	},
};

// 表单项工厂
function FormRowFactory(formRowData) {
	this.name = formRowData.name;
	this.type = formRowData.type;
	this.validator = formRowData.validator;
	this.label = formRowData.label;
	this.rules = formRowData.rules;

	/**
	 * 表单项的渲染方法
	 */
	this.renderFormRow = function () {
		var formRow = document.createElement('div');
		formRow.className = 'row clearfix';
		
		var label = document.createElement('label');
		label.for = this.name;
		label.textContent = this.label  + ' ';
		formRow.appendChild(label);

		var formItem = document.createElement('div');
		formItem.className = 'form-item';
		var input = document.createElement('input');
		input.type = this.type;
		input.name = this.name;
		formItem.appendChild(input);
		var span = document.createElement('span');
		span.className = 'vali-info';
		formItem.appendChild(span);
		formRow.appendChild(formItem);

		return formRow;
	};
}

// 表单工厂
function FormFactory(formItems) {
	var availableFormRowName = [];

	for(var i in formItems) {
		var formRowName = formItems[i];
		if (formRowName in formData) {
			availableFormRowName.push(formRowName);
			var formRowData = formData[formRowName];
			this[formRowName] = new FormRowFactory(formRowData);
		}
	}

	/**
	 * 渲染提交按钮
	 */
	function renderSubmitBtn() {
		var formRow = document.createElement('div');
		formRow.className = 'row clearfix';
		
		var submitBtn = document.createElement('button');
		submitBtn.className = 'submit-btn';
		submitBtn.type = 'button';
		submitBtn.textContent = '提交';
		formRow.appendChild(submitBtn);

		return formRow;
	}

	/**
	 * 表单的渲染方法
	 */
	this.renderForm = function (formElement, formStyleName) {
		replaceClassSuffix(formElement, 'style', formStyleName);

		formElement.innerHTML = '';
		for(var i = 0, len = availableFormRowName.length; i < len; i++) {
			var formRowName = availableFormRowName[i];
			formElement.appendChild(this[formRowName].renderFormRow());
		}

		formElement.appendChild(renderSubmitBtn());
	};

	/**
	 * 表单事件监听的汇总
	 */
	this.initEventListener = function (formElement) {
		var that = this;
		var inputBoxs = formElement.getElementsByTagName('input');
		var submitBtn = formElement.getElementsByClassName('submit-btn')[0];

		function inputFocusHandler(event) {
			var inputBox = event.target;
			var formItem = inputBox.parentNode;
			var valiInfo = formItem.getElementsByClassName('vali-info')[0];
			removeClass(inputBox, 'err');
			removeClass(valiInfo, 'err');
			removeClass(inputBox, 'correct');
			removeClass(valiInfo, 'correct');
			valiInfo.textContent = that[inputBox.name].rules;
		}

		function validateInput(inputBox) {
			var formItem = inputBox.parentNode;
			var valiInfo = formItem.getElementsByClassName('vali-info')[0];
			var inputStr = inputBox.value;
			var valiResult = [undefined, undefined];
			if (inputBox.name === 'password-confirm') {
				valiResult = that['password-confirm'].validator(inputStr, formItem.parentNode.parentNode);
			} else {
				valiResult = that[inputBox.name].validator(inputStr);
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

		function inputBlurHandler(event) {
			var inputBox = event.target;
			validateInput(inputBox);
		}

		function submitClickHandler() {
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
		}

		for (var i = 0; i < inputBoxs.length; i++) {
			inputBoxs[i].onfocus = inputFocusHandler;
			inputBoxs[i].onblur = inputBlurHandler;
		}
		submitBtn.addEventListener('click', submitClickHandler, false);
	};
}

// 获取用户选择情况，以此生成表单
var formGenerator = document.getElementById('form-generator');
var formGeneratorBtn = formGenerator.getElementsByTagName('button')[0];
formGeneratorBtn.addEventListener('click', function (event) {
	var formItems = formGenerator['form-item'];
	var checkedFormItems = [];
	for (var i = 0, len = formItems.length; i < len; i++) {
		if (formItems[i].checked) {
			checkedFormItems.push(formItems[i].value);
		}
	}

	var formStyles = formGenerator['form-style'];
	var formStyle = formStyles.value;

	if (checkedFormItems.length !== 0) {
		var formElement = document.getElementsByClassName('my-form')[0];
		var form = new FormFactory(checkedFormItems);
		form.renderForm(formElement, formStyle);
		form.initEventListener(formElement);
	}
}, false);
