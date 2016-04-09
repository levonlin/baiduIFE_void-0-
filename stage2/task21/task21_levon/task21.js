/**
 * 定义一个对象工厂
 */
function InputBox(container) {
	var queue = [];
	var displayArea = container.getElementsByClassName('display')[0];

	/**
	 * 渲染dom
	 */
	function render(arr) {
		displayArea.innerHTML = '';
		for (var i in arr) {
			var newItem = document.createElement('span');
			newItem.innerHTML = '<span class="delete-info">点击删除&nbsp;</span>' + arr[i];
			newItem.className = 'display-item';
			displayArea.appendChild(newItem);
		}
	}

	/**
	 * 对字符串中的html字符进行转义
	 */
	function htmlEscape(text) {
		return text.replace(/[<>"&]/g, function (match, pos, originString) {
			switch (match) {
				case '<':
				return '&lt;';
				case '>':
				return '&gt;';
				case '&':
				return '&amp;';
				case '"':
				return '&quot;';
			}
		});
	}

	/**
	 * 数组去空字符元素操作
	 */
	function trimArray(arr) {
		  var newArr = [];
		  for (var i in arr) {
		    if (arr[i] !== '') {
		      newArr.push(arr[i].trim());
		    }
		  }
		  return newArr;
	}

	/**
	 * 输入的字符串按分隔符转为数组
	 */
	function formatInput(inputText) {
		inputText = htmlEscape(inputText);
		return trimArray(inputText.split(/[,，、\s\n]/));
	}

	/**
	 * 输入的字符串按分隔符转为数组
	 */
	function textLeftIn(inputText, maxLength) {
		var result = [];
		var arr = formatInput(inputText).concat(queue);
		for (var i = arr.length - 1; i >= 0; i--) {
			if (result.indexOf(arr[i]) === -1) {
				result.unshift(arr[i]);
			}
		}
		if (result.length <= maxLength) {
			return result;
		} else {
			return result.slice(0, maxLength);
		}
	}

	/**
	 * 由dom元素删除数组中与其对应的元素
	 */
	function deleteItem(target) {
		var displayItems = displayArea.children;
		var index = Array.prototype.indexOf.call(displayItems, target);
		queue.splice(index, 1);
	}

	/**
	 * 在容器加个点击事件代理，对点击事件进行分发
	 */
	function delegateClickEvent() {
		container.addEventListener('click', function (event) {
			var target = event.target;
			var inputText = container.getElementsByClassName('input-text')[0].value;
			switch (target.className) {
				case 'left-in-btn':
				queue = textLeftIn(inputText, 10);
				render(queue);
				break;	

				case 'display-item':
				deleteItem(target);
				render(queue);
				break;

				case 'delete-info':
				deleteItem(target.parentNode);
				render(queue);
				break;	
			}
		}, false);
	}

	/**
	 * 在容器加个键盘事件代理，对键盘事件进行分发
	 */
	function delegateKeyBoardEvent() {
		container.addEventListener('keyup', function (event) {
			var target = event.target;
			switch (target.className) {
				case 'input-text':
				if (event.keyCode === 13 || event.keyCode === 188 || event.keyCode === 32) {
					var inputText = container.getElementsByClassName('input-text')[0].value;
					queue = textLeftIn(inputText, 10);
					render(queue);
				}
				break;		
			}
		}, false);
	}

	/**
	/* 对象初始化函数
 	*/
	this.init = function (isListenKeyBoard) {
		delegateClickEvent();
		if (isListenKeyBoard) {
			delegateKeyBoardEvent();
		}
		render(queue);
	};
}

// 对象的实例化
var tagsContainer = document.getElementsByClassName('tags-container')[0];
var hobbiesContainer = document.getElementsByClassName('hobbies-container')[0];

tagsInputBox = new InputBox(tagsContainer);
tagsInputBox.init(true);

hobbiesInputBox = new InputBox(hobbiesContainer);
hobbiesInputBox.init();
