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
 * 定义节点类型
 */
function Node(data) {
	this.data = data;
	this.children = [];
	this.parent = null;
	this.domNode = null;
}

Node.prototype = {
	constructor: Node,

	addChild: function (childData) {
		var child = new Node(childData);
		child.parent = this;
		this.children.push(child);
	},

	getDepth: function () {
		var depth = 0;
		if(this.parent) {
			depth += this.parent.getDepth();
		}
		depth++;
		return depth;
	}
};

/**
 * 定义树类型
 */
function Tree(data) {
	this._root = new Node(data);
}

Tree.prototype = {
	constructor: Tree,

	traverseDF: function(callback) {
	    (function recurse(currentNode) {
	    	callback(currentNode);
	        for (var i = 0, length = currentNode.children.length; i < length; i++) {
	            recurse(currentNode.children[i]);
	        }
	    })(this._root);
	},

	traverseBF: function(callback) {
	    var queue = [];
	    currentNode = this._root;
	    while(currentNode){
	    	callback(currentNode);
	        for (var i = 0, length = currentNode.children.length; i < length; i++) {
	            queue.push(currentNode.children[i]);
	        }
	        currentNode = queue.shift();
	    }
	},

	search: function(callback, traversal) {
	    traversal.call(this, callback);
	},

	add: function(data, toData, traversal) {
	    var parent = null;
	 	this.search(function(node) {
	            if (node.data === toData) {
	                parent = node;
	            }
	        }, traversal);

	 	if (parent) {
 		 	if (Object.prototype.toString.call(data) ==='[object Array]' ) {
 		 		data.forEach(function (item) {
					parent.addChild(item);
 		 		});
 		 	} else if (Object.prototype.toString.call(data) === '[object String]'){
 		 		parent.addChild(data);
 		 	}
	 	} else {
	 	    throw new Error('Cannot add node to a non-existent parent.');
	 	}
	},

	remove: function(data, fromData, traversal) {
	    var parent = null;
	    var childToRemove = null;
	    this.search(function(node) {
	        if (node.data === fromData) {
	            parent = node;
	        }
	    }, traversal);
	 
	    if (parent) {
	        parent.children.forEach(function (item, i) {
	        	if (item.data === data) {
	        	    index = i;
	        	}
	        });

	        if (index === undefined) {
	            throw new Error('Node to remove does not exist.');
	        } else {
	            childToRemove = parent.children.splice(index, 1);
	        }
	    } else {
	        throw new Error('Parent does not exist.');
	    }
	 
	    return childToRemove;
	},

	/**
	 * 定义一个广度优先遍历的回调函数来渲染节点
	 */
	renderNode: function (node) {
		var newDiv = document.createElement('div');
		newDiv.className = 'node';
		newDiv.textContent = node.data;
		node.domNode = newDiv;
		if (node.getDepth() > 1) {
			node.parent.domNode.appendChild(newDiv);
		} else if(node.getDepth() === 1) {
			var container = document.getElementById('container');
			container.appendChild(newDiv);
		}
	},

	/**
	 * 通过广度优先遍历渲染出整棵树
	 */
	renderTree: function () {
		this.traverseBF(this.renderNode);
	}
};

// 初始化并渲染一棵树
var tree = new Tree('Super');
tree.add(['Cat', 'Note', 'Fish'], 'Super', tree.traverseBF);
tree.add(['Apple', 'Phone', ''], 'Cat', tree.traverseBF);
tree.add(['Pear', 'Pig', 'Cola', 'Soccer'], 'Apple', tree.traverseBF);
tree.add(['Book', 'School'], '', tree.traverseBF);
tree.add(['Human', 'Program'], 'Note', tree.traverseBF);
tree.add(['Code', 'Operator', 'Man'], 'Human', tree.traverseBF);
tree.add(['Element', 'Class'], 'Program', tree.traverseBF);
tree.add('Cat', 'Element', tree.traverseBF);
tree.renderTree();



// 定义展示遍历过程的队列，及定时器
var showQueue = [];
var showTimeout;

/**
 * 遍历的回调函数，将遍历过程缓存起来
 */
function visit(node) {
	showQueue.push(node.domNode);
}

/**
 * 通过出队列操作，展示遍历的过程
 */
function showVisit() {
	addClass(showQueue[0], 'active');
	if(1 < showQueue.length) {
		showTimeout = setTimeout(function () {
			removeClass(showQueue[0], 'active');
			showQueue.shift();
			showVisit();
		}, 1000);
	} else {
		showTimeout = setTimeout(function () {
			removeClass(showQueue[0], 'active');
			showQueue.shift();
		}, 1000);
	}
}

/**
 * 若上次遍历的展示过程还在进行，则停止该展示过程
 */
function stopShowVisit() {
	if (showQueue.length !== 0) {
		clearTimeout(showTimeout);
		removeClass(showQueue[0], 'active');
		showQueue.length = 0;
	}
}

// 缓存搜索结果的数组
var searchResult = [];

/**
 * 搜索的回调函数，将搜索过程和结果缓存起来
 */
function searchVisit(node, searchText) {
	if (node.data === searchText) {
		searchResult.push(node.domNode);
	}
	visit(node);
}


/**
 * 展示搜索的过程
 */
function showSearch() {
	if (searchResult.indexOf(showQueue[0]) !== -1) {
		addClass(showQueue[0], 'search-result');
	} else {
		addClass(showQueue[0], 'active');
	}
	if(1 < showQueue.length) {
		showTimeout = setTimeout(function () {
			removeClass(showQueue[0], 'active');
			showQueue.shift();
			showSearch();
		}, 1000);
	} else {
		showTimeout = setTimeout(function () {
			removeClass(showQueue[0], 'active');
			showQueue.shift();
			if (searchResult.length === 0) {
				alert('找不到指定内容');
			}
		}, 1000);
	}
}

/**
 * 清空上次搜索的展示
 */
function clearSearch() {
	stopShowVisit();
	if (searchResult.length !== 0) {
		searchResult.forEach(function (item) {
			removeClass(item, 'search-result');
		});
		searchResult.length = 0;
	}
}

/** 
 * 分发点击事件的事件代理
 */
function delegateClickEvent() {
	var controler = document.getElementsByClassName('control')[0];
	controler.addEventListener('click', function (event) {
		var target = event.target;
		var searchText = controler.getElementsByClassName('search-text')[0].value;
		// 按选择的方式进行遍历
		switch (target.className) {
			case 'df-traverse':
			// 停止上一次展示遍历的过程
			stopShowVisit();
			tree.traverseDF(visit);
			// 展示遍历的过程
			showVisit();
			break;

			case 'bf-traverse':
			stopShowVisit();
			tree.traverseBF(visit);
			showVisit();
			break;

			case 'df-search':
			clearSearch();
			tree.search(function (node) {
				searchVisit(node, searchText);
			}, tree.traverseDF);
			showSearch();
			break;

			case 'bf-search':
			clearSearch();
			tree.search(function (node) {
				searchVisit(node, searchText);
			}, tree.traverseBF);
			showSearch();
			break;
		}
	}, false);
}

delegateClickEvent();
