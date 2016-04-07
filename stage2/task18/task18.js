var queue = [10, 3, 7, 12, 17, 30];

/**
 * 渲染dom
 */
function render() {
	var displayArea = document.getElementById('display');
	displayArea.innerHTML = '';
	for (var i in queue) {
		var newItem = document.createElement('span');
		newItem.textContent = queue[i];
		newItem.className = 'num-element';
		displayArea.appendChild(newItem);
	}
}

/**
 * 判断字符串是否由纯数字字符组成
 */
function isNumberString(str) {
	if (/^\d+$/.test(str)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 在容器加个点击事件代理，对点击事件进行分发
 */
function delegateClickEvent() {
	var container = document.getElementById('container');
	container.addEventListener('click', function (event) {
		var target = event.target;
		var inputText = document.getElementsByClassName('input-text')[0].value;
		switch (target.className) {
			case 'left-in-btn':
			if (isNumberString(inputText)) {
				queue.unshift(inputText); 
			}else {
				alert('请输入数字');
			} 
			render();
			break;

			case 'right-in-btn':
			if (isNumberString(inputText)) {
				queue.push(inputText); 
			}else {
				alert('请输入数字');
			} 
			render();
			break;

			case 'left-out-btn':
			alert(queue.shift());
			render();
			break;

			case 'right-out-btn':
			alert(queue.pop());
			render();
			break;	

			case 'num-element':
			var numElements = document.getElementById('display').children;
			var index = Array.prototype.indexOf.call(numElements, target);
			queue.splice(index, 1);
			render();
			break;		
		}
	}, false);
}

/**
 * 页面初始化函数
 */
function init() {
	delegateClickEvent();
	render();
}

init();
