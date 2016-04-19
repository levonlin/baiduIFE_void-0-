/**
 * 定义节点类型
 */
function Node(data) {
	this.data = data;
	this.leftChild = null;
	this.rightChild = null;
	this.parent = null;
	this.domNode = null;
}

Node.prototype = {
	constructor: Node,

	addChildren: function (leftChild, rightChild) {
		this.leftChild = leftChild;
		this.rightChild = rightChild;
		if (this.leftChild) this.leftChild.parent = this;
		if (this.rightChild) this.rightChild.parent = this;
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
 * 定义二叉树类型
 */
function BinaryTree(data) {
	this._root = new Node(data);
}

BinaryTree.prototype = {
	constructor: BinaryTree,

	preOrd: function (_root, callback) {
		if(_root) {
			callback(_root);
			this.preOrd(_root.leftChild, callback);
			this.preOrd(_root.rightChild, callback);
		}
	},

	preOrder: function (callback) {
		this.preOrd(this._root, callback);
	},

	inOrd: function (_root, callback) {
		if(_root) {
			this.inOrd(_root.leftChild, callback);
			callback(_root);
			this.inOrd(_root.rightChild, callback);
		}
	},

	inOrder: function (callback) {
		this.inOrd(this._root, callback);
	},

	postOrd: function (_root, callback) {
		if(_root) {
			this.postOrd(_root.leftChild, callback);
			this.postOrd(_root.rightChild, callback);
			callback(_root);
		}
	},

	postOrder: function (callback) {
		this.postOrd(this._root, callback);
	}
};

/**
 * 定义一个先序遍历的回调函数来渲染节点
 */
function renderNode (node) {
	var newDiv = document.createElement('div');
	newDiv.className = 'node';
	node.domNode = newDiv;
	if (node.getDepth() > 1) {
		node.parent.domNode.appendChild(newDiv);
	} else if(node.getDepth() === 1) {
		var container = document.getElementById('container');
		container.appendChild(newDiv);
	}
}

/**
 * 通过先序遍历渲染出整棵树
 */
function renderTree(tree) {
	tree.preOrder(renderNode);
}

// 初始化并渲染一棵二叉树
var tree = new BinaryTree(1);
tree._root.addChildren(new Node(2), new Node(3));
tree._root.leftChild.addChildren(new Node(4), null);
tree._root.rightChild.addChildren(new Node(5), null);
renderTree(tree);



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
	showQueue[0].style.backgroundColor = '#00f';
	if(1 < showQueue.length) {
		showTimeout = setTimeout(function () {
			showQueue[0].style.backgroundColor = '#fff';
			showQueue.shift();
			showVisit();
		}, 1000);
	} else {
		showTimeout = setTimeout(function () {
			showQueue[0].style.backgroundColor = '#fff';
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
		showQueue[0].style.backgroundColor = '#fff';
		showQueue.length = 0;
	}
}

/** 
 * 分发点击事件的事件代理
 */
function delegateClickEvent() {
	var btns = document.getElementsByClassName('buttons')[0];
	btns.addEventListener('click', function (event) {
		var target = event.target;
		if (target.tagName.toLowerCase() === 'button') {
			// 停止上一次展示遍历的过程
			stopShowVisit();
			// 按选择的方式进行遍历
			switch (target.className) {
				case 'pre-order':
				tree.preOrder(visit);
				break;

				case 'in-order':
				tree.inOrder(visit);
				break;

				case 'post-order':
				tree.postOrder(visit);
				break;
			}
			// 展示遍历的过程
			showVisit();
		}
	}, false);
}

delegateClickEvent();
