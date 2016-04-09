var queue = ['abandon', 'IFE', '百度', '1', '2'];

/**
 * 渲染dom
 */
function render(arr) {
	var displayArea = document.getElementById('display');
	displayArea.innerHTML = '';
	for (var i in arr) {
		var newItem = document.createElement('span');
		newItem.innerHTML = arr[i];
		newItem.className = 'num-element';
		displayArea.appendChild(newItem);
	}
}

/**
 * 数组去空字符元素操作
 */
function trimArray(arr) {
  var newArr = [];
  for (var i in arr) {
    if (arr[i] !== '') {
      newArr.push(arr[i]);
    }
  }
  return newArr;
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
 * 输入的字符串按分隔符转为数组
 */
function formatInput(inputText) {
	inputText = htmlEscape(inputText);
	return trimArray(inputText.split(/[,，、\s\n]+/));
}

/**
 * 对匹配搜索的内容进行标示，返回处理好的数组
 */
function searchArray(arr, searchText) {
	for (var i in arr) {
		arr[i] = arr[i].replace(new RegExp(searchText, 'g'), 
			                    '<span class="highlight">' + searchText + '</span>');
	}
	return arr;
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
			queue = formatInput(inputText).concat(queue);
			render(queue);
			break;

			case 'right-in-btn':
			queue = queue.concat(formatInput(inputText));
			render(queue);
			break;

			case 'left-out-btn':
			alert(queue.shift());
			render(queue);
			break;

			case 'right-out-btn':
			alert(queue.pop());
			render(queue);
			break;	

			case 'num-element':
			var numElements = document.getElementById('display').children;
			var index = Array.prototype.indexOf.call(numElements, target);
			queue.splice(index, 1);
			render(queue);
			break;	

			case 'search-btn':
			var searchText = document.getElementsByClassName('search-text')[0].value;
			render(searchArray(queue.slice(), searchText));
			break;	
		}
	}, false);
}

/**
 * 页面初始化函数
 */
function init() {
	delegateClickEvent();
	render(queue);
}

init();
