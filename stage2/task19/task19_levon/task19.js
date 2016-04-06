var queue = [42, 68, 35, 10, 70, 25];
var sortShortcut = [];

function render(arr) {
	var displayArea = document.getElementById('display');
	displayArea.innerHTML = '';
	for (var i in arr) {
		var newItem = document.createElement('span');
		newItem.className = 'num-element';
		if (typeof arr[i] === 'string') {
			arr[i] = parseInt(arr[i]);
			newItem.className += ' active';
		}
		newItem.textContent = arr[i];
		newItem.style.height = arr[i] * 5 + 'px';
		displayArea.appendChild(newItem);
	}
}

function isNumberString(str) {
	if (/^\d+$/.test(str)) {
		return true;
	} else {
		return false;
	}
}

function validateInput(inputText) {
	if (isNumberString(inputText) && inputText >= 10 && inputText <= 100) {
		if (queue.length < 60) {
			return true;
		} else {
			alert('队列元素数量最多限制为60个，请删除元素后重试');
			return false;
		}
	} else {
		alert('请输入0-100间的数字');
		return false;
	}
}

function swap(arr, i, j) {
	var temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
}

function bubbleSort(arr) {
	// 冒泡计数、确定上界
	for (var i = arr.length - 1, last = 0; i > 0; i = last) {
		last = 0;
		// 执行冒泡
		for (var j = 0; j < i; j++) {
			arr[j] = parseInt(arr[j]); 
			// 比较后交换
			if (arr[j] > arr[j + 1]) {
				swap(arr, j, j + 1);
				last = j;
			}
			// 给该趟冒的每一个泡打标记
			arr[j + 1] += '*'; 
			sortShortcut.push(arr.slice());
			console.log(arr);
		}
		// 消除所有标记，结束一趟冒泡
		arr[j] = parseInt(arr[j]);
		sortShortcut.push(arr.slice());
		console.log(arr);
	}
}

function selectSort(arr) {
    for (var i = 0; i < arr.length; i++) {
        var minIndex = i;
        // 选出最小值
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[minIndex] > arr[j]) {
                minIndex = j;
            }
        }
        // 要交换的值打上标记
        arr[minIndex] += '*';
        arr[i] += '*';
        sortShortcut.push(arr.slice());
        console.log(arr);
        // 只在位置不同时交换
        if (i !== minIndex) {
        	swap(arr, i, minIndex);
        	sortShortcut.push(arr.slice());
        	console.log(arr);
        }
        // 消除所有标记，结束一趟选择
        arr[minIndex] = parseInt(arr[minIndex]);
        arr[i] = parseInt(arr[i]);
        sortShortcut.push(arr.slice());
        console.log(arr);
    }
}

function insertSort(arr) {
    for (var i = 1; i < arr.length; i++) {
        var temp = arr[i];
        arr[i] += '*';
        sortShortcut.push(arr.slice());
        console.log(arr);
        arr[i] = parseInt(arr[i]);
        for (var j = i - 1; j >= 0; j--) {
            if (arr[j] > temp) {
                arr[j + 1] = arr[j];
            } else {
                break;
            }
        }
        arr[j + 1] = temp;
        arr[j + 1] += '*';
        sortShortcut.push(arr.slice());
        console.log(arr);
        arr[j + 1] = parseInt(arr[j + 1]);
        sortShortcut.push(arr.slice());
        console.log(arr);
    }
}

function showSort(i) {
	render(sortShortcut[i]);
	if(i + 1 < sortShortcut.length) {
		setTimeout(function	() {
			showSort(i + 1);
		}, 500);
	} else {
		sortShortcut = [];
	}
}

function delegateClickEvent() {
	var container = document.getElementById('container');
	container.addEventListener('click', function (event) {
		var target = event.target;
		var inputText = document.getElementsByClassName('input-text')[0].value;
		switch (target.className) {
			case 'left-in-btn':
			validateInput(inputText) && queue.unshift(parseInt(inputText));
			render(queue);
			break;

			case 'right-in-btn':
			validateInput(inputText) && queue.push(parseInt(inputText));
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

			case 'bubble-sort-btn':
			bubbleSort(queue);
			showSort(0);
			break;

			case 'select-sort-btn':
			selectSort(queue);
			showSort(0);
			break;

			case 'insert-sort-btn':
			insertSort(queue);
			showSort(0);
			break;
		}
	}, false);
}

function init() {
	delegateClickEvent();
	render(queue);
}

init();
