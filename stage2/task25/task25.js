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
	this.selectedNode = null;
}

Tree.prototype = {
	constructor: Tree,

	traverseDF: function(callback) {
	    (function recurse(currentNode) {
	    	if(currentNode) {
	    		callback(currentNode);
	    		for (var i = 0, length = currentNode.children.length; i < length; i++) {
	    		    recurse(currentNode.children[i]);
	    		}
	    	}
	    })(this._root);
	},

	traverseBF: function(callback) {
	    var queue = [];
	    currentNode = this._root;
	    while(currentNode){
	    	callback(currentNode);
	    	if(currentNode) {
	    		for (var i = 0, length = currentNode.children.length; i < length; i++) {
	    		    queue.push(currentNode.children[i]);
	    		}
	    		currentNode = queue.shift();
	    	}
	    }
	},

	contains: function(callback, traversal) {
	    traversal.call(this, callback);
	},

	add: function(data, toNode) {
	    var parent = null;
	    if (toNode instanceof Node) {
	    	parent = toNode;
	    } else if (Object.prototype.toString.call(toNode) === '[object String]') {
    		this.contains(function(node) {
    	           if (node.data === toNode) {
    	               parent = node;
    	           }
    	       }, this.traverseBF);
	    }

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

	remove: function(node) {
		// 将指定节点从父节点删除，对于根节点则直接置空
		if (node.getDepth() > 1) {
		    node.parent.children.forEach(function (item, i, array) {
	        	if (item === node) {
	        	   	array.splice(i, 1);
	        	}
		    });
		} else if(node.getDepth() === 1) {
			this._root = null;
		}
	},

	/**
	 * 定义一个广度优先遍历的回调函数来渲染节点
	 */
	renderNode: function (node) {
		var newDiv = document.createElement('div');
		newDiv.className = 'node';

		var infoDiv = document.createElement('div');
		infoDiv.className = 'node-info';

		var flodDiv = document.createElement('i');
		flodDiv.className = 'fold iconfont icon-saelect';
		infoDiv.appendChild(flodDiv);

		var newData = document.createTextNode(' ' + node.data);
		infoDiv.appendChild(newData);

		newDiv.appendChild(infoDiv);
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
		var container = document.getElementById('container');
		container.innerHTML = '';
		this.contains(this.renderNode, this.traverseBF);

		// 在容器添加一个节点的点击事件代理
		container.addEventListener('click', function (event) {
			var target = event.target;
			if (hasClass(target, 'node')) {
				if (this.selectedNode) {
					removeClass(this.selectedNode.domNode, 'selected');
				}
				addClass(target, 'selected');
				this.contains(function (node) {
					if (node.domNode === target) {
						this.selectedNode = node;
					}
				}.bind(this), this.traverseBF);
			}
		}.bind(this), false);
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



// 定义展示遍历过程的计数变量，及定时器队列
var count = 0;
var timeoutQueue = [];

/**
 * 遍历的回调函数，将遍历过程和结果缓存起来
 */
function show(node) {
	var showTimeout = setTimeout(function () {
		addClass(node.domNode, 'active');
		setTimeout(function () {
			removeClass(node.domNode, 'active');
		}, 1000);
	}, 1000 * count);

	timeoutQueue.push(showTimeout);
	count++;
}

/**
 * 若上次遍历的展示过程还在进行，则展示并重置计时
 */
function stopShow() {
	timeoutQueue.forEach(function (item) {
		clearTimeout(item);	
	});

	timeoutQueue.length = 0;
	count = 0;
}

// 缓存搜索结果的数组
var searchResult = [];

/**
 * 搜索的回调函数，将搜索过程和结果缓存起来
 */
function showSearch(node, searchText) {
	if (node.data === searchText) {
		var showTimeout = setTimeout(function () {
			addClass(node.domNode, 'search-result');
		}, 1000 * count);
		searchResult.push(node.domNode);
		timeoutQueue.push(showTimeout);
		count++;
	} else {
		show(node);
	}
}

/**
 * 处理搜索结果
 */
function handleSearchResult() {
	if (searchResult.length === 0) {
		var showTimeout = setTimeout(function () {
			alert('找不到指定内容');
		}, 1010 * count );
		timeoutQueue.push(showTimeout);
		count++;
	}
}

/**
 * 清空上次搜索的展示
 */
function clearSearch() {
	stopShow();
	if (searchResult.length !== 0) {
		searchResult.forEach(function (item) {
			removeClass(item, 'search-result');
		});
		searchResult.length = 0;
	}
}

/**
 * 删除选中节点的操作
 */
function deleteSelectedNode() {
	if (tree.selectedNode) {
		tree.remove(tree.selectedNode);
		tree.selectedNode = null;
		tree.renderTree();
	}
}

/**
 * 在选中节点下添加子节点的操作
 */
function appendToSelectedNode(newData) {
	if (tree.selectedNode) {
		tree.add(newData, tree.selectedNode);
		tree.selectedNode = null;
		tree.renderTree();
	} else {
		alert('请选择一个父节点插入');
	}
}

/** 
 * 分发点击事件的事件代理
 */
function delegateControlerClickEvent() {
	var controler = document.getElementsByClassName('control')[0];
	controler.addEventListener('click', function (event) {
		var target = event.target;
		var searchText = controler.getElementsByClassName('search-text')[0].value;
		// 按选择的方式进行遍历
		switch (target.className) {
			case 'df-search':
			clearSearch();
			tree.contains(function (node) {
				showSearch(node, searchText);
			}, tree.traverseDF);
			handleSearchResult();
			break;

			case 'bf-search':
			clearSearch();
			tree.contains(function (node) {
				showSearch(node, searchText);
			}, tree.traverseBF);
			handleSearchResult();
			break;

			case 'delete-node':
			deleteSelectedNode();
			break;

			case 'add-node':
			var newData = controler.getElementsByClassName('add-text')[0].value;
			appendToSelectedNode(newData);
			break;
		}
	}, false);
}

delegateControlerClickEvent();
