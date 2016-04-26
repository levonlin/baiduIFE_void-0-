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

		return child;
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
			if (Object.prototype.toString.call(data) === '[object String]'){
 		 		return parent.addChild(data);
 		 	} else {
 		 		throw new Error('The first argument should be a string.');
 		 	}
	 	} else {
	 	    throw new Error('Cannot add node to a non-existent parent.');
	 	}
	},

	addWithArray: function(data, toNode) {
 		if (Object.prototype.toString.call(data) ==='[object Array]' ) {
	 		data.forEach(function (item) {
				this.add(item, toNode);
	 		}.bind(this));
	 	} else {
	 	    throw new Error('The first argument should be an array.');
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

	search: function (searchText, traversal) {
		var searchResult = [];
		this.contains(function (node) {
			if (node.data === searchText) {
				searchResult.push(node);
			}
		}, traversal);

		return searchResult;
	}
};

/**
 * 树对应的dom树类型，负责树的展现与交互
 */
function DomTree(tree) {
	this.tree = tree;
	this.selectedNode = null;
	this.searchResult = [];
}

DomTree.prototype = {
	constructor: DomTree,

	/**
	 * 设置被选中的dom节点
	 */
	setSelectedNode: function (selectedNode) {
		// 下面的大部分操作都和选择节点有关，所以只要在选择时清空搜索的展示即可
		this.clearSearch();
		if (this.selectedNode) {
			removeClass(this.selectedNode, 'selected');
		}

		if (selectedNode) {
			addClass(selectedNode, 'selected');
		}

		this.selectedNode = selectedNode;
	},

	/**
	 * 判断dom节点是否被折叠
	 */
	isFold: function (domNode) {
		return hasClass(domNode, 'fold');
	},

	/**
	 * 展开dom节点
	 */
	expandNode: function (node) {
		var icon = node.getElementsByClassName('icon')[0];
		removeClass(icon, 'icon-fold');
		addClass(icon, 'icon-expand');

		removeClass(node, 'fold');
	},

	/**
	 * 折叠dom节点
	 */
	foldNode: function (node) {
		var icon = node.getElementsByClassName('icon')[0];
		removeClass(icon, 'icon-expand');
		addClass(icon, 'icon-fold');

		addClass(node, 'fold');
	},

	/**
	 * 定义一个广度优先遍历的回调函数来渲染节点
	 */
	renderNode: function (treeNode) {
		var newDiv = document.createElement('div');
		addClass(newDiv, 'node');

		var infoDiv = document.createElement('div');
		addClass(infoDiv, 'node-info');
		// 禁止用户选择文字
		addClass(infoDiv, 'noTextSelect');

		var iconDiv = document.createElement('i');
		addClass(iconDiv, 'icon');
		addClass(iconDiv, 'iconfont');
		// 没有子节点就把图标隐藏
		if (treeNode.children.length === 0) {
			addClass(iconDiv, 'icon-hidden');
		}
		infoDiv.appendChild(iconDiv);

		var newData = document.createTextNode(' ' + treeNode.data);
		infoDiv.appendChild(newData);
		newDiv.appendChild(infoDiv);
		
		// 初始化时全部折叠，刷新时保留原先的原先的折叠状态
		if (!treeNode.domNode || treeNode.domNode && this.isFold(treeNode.domNode)) {
			this.foldNode(newDiv);
		} else {
			this.expandNode(newDiv);
		}

		// 刷新时保留原来的选择状态
		if (treeNode.domNode && hasClass(treeNode.domNode, 'selected')) {
			this.setSelectedNode(newDiv);
		}
		treeNode.domNode = newDiv;
		
		if (treeNode.getDepth() > 1) {
			treeNode.parent.domNode.appendChild(newDiv);
		} else if(treeNode.getDepth() === 1) {
			var container = document.getElementById('container');
			container.appendChild(newDiv);
		}

		return newDiv;
	},

	/**
	 * dom节点点击事件的处理函数
	 */
	clickNodeHandler: function (node) {
		if (node) {
			this.setSelectedNode(node);

			if (this.isFold(node)) {
				this.expandNode(node);
			} else {
				this.foldNode(node);
			}
		}
	},

	/**
	 * 通过广度优先遍历渲染出整棵树
	 */
	renderTree: function () {
		var container = document.getElementById('container');
		container.innerHTML = '';
		this.tree.contains(this.renderNode.bind(this), this.tree.traverseBF);

		// 在容器添加一个节点的点击事件代理；
		// 使用DOM0级事件处理使元素上只能有唯一一个事件处理程序，以避免重复添加多个事件处理后发生冲突
		container.onclick = function (event) {
			var target = event.target;
			var node = null;
			if (hasClass(target, 'node-info')) {
				node = target.parentNode;
			} else if (hasClass(target, 'icon')) {
				node = target.parentNode.parentNode;
			}
			this.clickNodeHandler(node);
		}.bind(this);
	},

	/**
	 * 由dom节点获取树节点
	 */
	getTreeNode: function (node) {
		var result = null;

		this.tree.contains(function (treeNode) {
			if (treeNode.domNode === node) {
				result = treeNode;
			}
		}, this.tree.traverseBF);

		return result;
	},

	/**
	 * 删除选中节点的操作
	 */
	deleteSelectedNode: function () {
		var treeNode = this.getTreeNode(this.selectedNode);
		if (this.selectedNode) {
			this.tree.remove(treeNode);
			
			this.setSelectedNode(null);
			this.renderTree();
		}
	},

	/**
	 * 在选中节点下添加子节点的操作
	 */
	appendToSelectedNode: function (newData) {
		if (!newData) {
			alert('节点内容不能为空');
		}
		else if (!this.selectedNode) {
			alert('请选择一个父节点插入');
		} else {
			var parentTreeNode = this.getTreeNode(this.selectedNode);
			var newTreeNode = this.tree.add(newData, parentTreeNode);
			
			// 展开选中节点
			this.expandNode(this.selectedNode);
			// 选择刚生成的节点
			this.setSelectedNode(this.renderNode(newTreeNode));
		}
	},

	/**
	 * 搜索结果的展示
	 */
	searchNode: function (searchText) {
		// 清空上次搜索的展示
		this.clearSearch();
		var result = this.tree.search(searchText, this.tree.traverseBF);
		
		if (result.length) {
			result.forEach(function (treeNode) {
				// 展开搜索结果的父节点
				var parentTreeNode = treeNode.parent;
				while(parentTreeNode) {
					this.expandNode(parentTreeNode.domNode);
					parentTreeNode = parentTreeNode.parent;
				}
				// 标记搜索到的节点
				addClass(treeNode.domNode, 'search-result');
				this.searchResult.push(treeNode.domNode);
			}.bind(this));
		} else {
			alert('找不到指定内容');
		}
	},

	/**
	 * 清空搜索结果的展示
	 */
	clearSearch: function () {
		if (this.searchResult.length !== 0) {
			this.searchResult.forEach(function (node) {
				removeClass(node, 'search-result');
			});
			this.searchResult.length = 0;
		}
	}
};

// 初始化并渲染一棵树
var tree = new Tree('Super');
tree.addWithArray(['Cat', 'Note', 'Fish'], 'Super');
tree.addWithArray(['Apple', 'Phone', 'Dog'], 'Cat');
tree.addWithArray(['Pear', 'Pig', 'Cola', 'Soccer'], 'Apple');
tree.addWithArray(['Book', 'School'], 'Dog');
tree.addWithArray(['Human', 'Program'], 'Note');
tree.addWithArray(['Code', 'Operator', 'Man'], 'Human');
tree.addWithArray(['Element', 'Class'], 'Program');
tree.add('Cat', 'Element');
var domTree = new DomTree(tree);
domTree.renderTree();

/** 
 * 分发点击事件的事件代理
 */
function delegateControlerClickEvent() {
	var controler = document.getElementsByClassName('control')[0];
	controler.onclick = function (event) {
		var target = event.target;
		var searchText = controler.getElementsByClassName('search-text')[0].value;
		// 按选择的方式进行遍历
		switch (target.className) {
			case 'search':
			domTree.searchNode(searchText);
			break;

			case 'clear-search':
			domTree.clearSearch();
			break;

			case 'delete-node':
			domTree.deleteSelectedNode();
			break;

			case 'add-node':
			var newData = controler.getElementsByClassName('add-text')[0].value;
			domTree.appendToSelectedNode(newData);
			break;
		}
	};
}

delegateControlerClickEvent();
