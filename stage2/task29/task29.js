function delegateEvent(delegateElement, targetClassName, eventName, handler) {
	delegateElement.addEventListener(eventName, function (event) {
		var target = event.target;
		if (target.className === targetClassName) {
			return handler(event);
		}
	} ,false);
}

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

function validateInput(formItem) {
	var inputBox = formItem.getElementsByTagName('input')[0];
	var valiInfo = formItem.getElementsByClassName('vali-info')[0];
	inputStr = inputBox.value.trim();
	switch (inputBox.name) {
		case 'user-name':
		var inputStrLen = getInputStrLen(inputStr);
		if (inputStr === '') {
			removeClass(inputBox, 'correct');
			addClass(inputBox, 'err');
			removeClass(valiInfo, 'correct');
			addClass(valiInfo, 'err');
			valiInfo.textContent = '姓名不能为空';
		} else if (inputStrLen < 4 || inputStrLen > 16) {
			removeClass(inputBox, 'correct');
			addClass(inputBox, 'err');
			removeClass(valiInfo, 'correct');
			addClass(valiInfo, 'err');
			valiInfo.textContent = '字符长度应为4~16位（一个汉字或中文标点算2位）';
		} else {
			removeClass(inputBox, 'err');
			addClass(inputBox, 'correct');
			removeClass(valiInfo, 'err');
			addClass(valiInfo, 'correct');
			valiInfo.textContent = '格式正确';
		}
		break;
	}
}

var myForm = document.getElementsByClassName('my-form')[0];
delegateEvent(myForm, 'vali-btn', 'click', function (event) {
	var target = event.target;
	var formItem = target.parentNode;
	validateInput(formItem);
});
