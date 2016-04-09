/**
 * 定义构造函数
 */
function InputBox(container) {
	var queue = [];
	this.displayArea = container.getElementsByClassName('display')[0];

	/**
	 * 在容器加个点击事件代理，对点击事件进行分发
	 */
	this.delegateClickEvent = function () {
		var that = this;
		container.addEventListener('click', function (event) {
			var target = event.target;
			var textBox = container.getElementsByClassName('input-text')[0];
			var inputText = textBox.value;
			switch (target.className) {
				case 'left-in-btn':
				queue = that.textLeftIn(queue, inputText, 10);
				textBox.value = '';
				that.render(queue);
				break;	

				case 'display-item':
				that.deleteItem(queue, target);
				that.render(queue);
				break;

				case 'delete-info':
				that.deleteItem(queue, target.parentNode);
				that.render(queue);
				break;	
			}
		}, false);
	};

	/**
	 * 在容器加个键盘事件代理，对键盘事件进行分发
	 */
	this.delegateKeyBoardEvent = function () {
		var that = this;
		container.addEventListener('keyup', function (event) {
			var target = event.target;
			var textBox = container.getElementsByClassName('input-text')[0];
			var inputText = textBox.value;
			switch (target.className) {
				case 'input-text':
				if (event.keyCode === 13 || /[，,\s]/.test(inputText)) {
					queue = that.textLeftIn(queue, inputText, 10);
					textBox.value = '';
					that.render(queue);
				}
				break;
			}
		}, false);
	};

	/**
	/* 对象初始化函数
 	*/
	this.init = function (isListenKeyBoard) {
		this.delegateClickEvent();
		if (isListenKeyBoard) {
			this.delegateKeyBoardEvent();
		}
		this.render(queue);
	};
}

// 将公有方法放到原先对象里，避免重复定义
InputBox.prototype = {
	/**
	 * 渲染dom
	 */
	render: function (arr) {
		this.displayArea.innerHTML = '';
		for (var i in arr) {
			var newItem = document.createElement('span');
			newItem.innerHTML = '<span class="delete-info">点击删除&nbsp;</span>' + arr[i];
			newItem.className = 'display-item';
			this.displayArea.appendChild(newItem);
		}
	},

	/**
	 * 对字符串中的html字符进行转义
	 */
	htmlEscape: function (text) {
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
	},

	/**
	 * 数组去空字符元素操作
	 */
	trimArray: function (arr) {
		  var newArr = [];
		  for (var i in arr) {
		    if (arr[i] !== '') {
		      newArr.push(arr[i].trim());
		    }
		  }
		  return newArr;
	},

	/**
	 * 输入的字符串按分隔符转为数组
	 */
	formatInput: function (inputText) {
		inputText = this.htmlEscape(inputText);
		return this.trimArray(inputText.split(/[,，、\s\n]/));
	},

	/**
	 * 输入的字符串按分隔符转为数组
	 */
	textLeftIn: function (oldQueue,inputText, maxLength) {
		var result = [];
		var arr = this.formatInput(inputText).concat(oldQueue);
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
	},

	/**
	 * 由dom元素删除数组中与其对应的元素
	 */
	deleteItem: function (oldQueue, target) {
		var displayItems = this.displayArea.children;
		var index = Array.prototype.indexOf.call(displayItems, target);
		oldQueue.splice(index, 1);
	}
};

// 对象的实例化
var tagsContainer = document.getElementsByClassName('tags-container')[0];
var hobbiesContainer = document.getElementsByClassName('hobbies-container')[0];

tagsInputBox = new InputBox(tagsContainer);
tagsInputBox.init(true);

hobbiesInputBox = new InputBox(hobbiesContainer);
hobbiesInputBox.init();

