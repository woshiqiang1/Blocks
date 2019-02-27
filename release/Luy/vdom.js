"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

exports.update = update;
exports.findDOMNode = findDOMNode;
exports.render = render;

var _utils = require("./utils");

var _createElement = require("./createElement");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mountIndex = 0; //全局变量
function mountIndexAdd() {
    return mountIndex++;
}

function updateText(oldTextVnode, newTextVnode, parentDomNode) {
    var dom = oldTextVnode._hostNode;

    if (oldTextVnode.props !== newTextVnode.props) {

        dom.nodeValue = newTextVnode.props;
    }
}
function isSameVnode(pre, next) {
    if (pre.type === next.type && pre.key === next.key) {
        return true;
    }
    return false;
}

function mapKeyToIndex(old) {
    var hascode = {};
    old.forEach(function (el, index) {
        if (el.key) {
            hascode[el.key] = index;
        }
    });
    return hascode;
}

function updateChild(oldChild, newChild, parentDomNode) {
    newChild = (0, _createElement.flattenChildren)(newChild);

    if (!Array.isArray(oldChild)) oldChild = [oldChild];
    if (!Array.isArray(newChild)) newChild = [newChild];
    var oldLength = oldChild.length,
        newLength = newChild.length,
        oldStartIndex = 0,
        newStartIndex = 0,
        oldEndIndex = oldLength - 1,
        newEndIndex = newLength - 1,
        oldStartVnode = oldChild[0],
        newStartVnode = newChild[0],
        oldEndVnode = oldChild[oldEndIndex],
        newEndVnode = newChild[newEndIndex],
        hascode = {};

    if (newLength && !oldLength) {
        newChild.forEach(function (newVnode) {
            renderByLuy(newVnode, parentDomNode);
        });
        return newChild;
    }

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (oldStartVnode === undefined) {
            oldStartVnode = oldChild[++oldStartIndex];
        } else if (oldEndVnode === undefined) {
            oldEndVnode = oldChild[--oldEndIndex];
        } else if (isSameVnode(oldStartVnode, newStartVnode)) {
            update(oldStartVnode, newStartVnode, newStartVnode._hostNode);
            oldStartVnode = oldChild[++oldStartIndex];
            newStartVnode = newChild[++newStartIndex];
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            update(oldEndVnode, newEndVnode, newEndVnode._hostNode);
            oldEndVnode = oldChild[--oldEndIndex];
            newEndVnode = newChild[--newEndIndex];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            var dom = oldStartVnode._hostNode;
            parentDomNode.insertBefore(dom, oldEndVnode.nextSibling);
            update(oldStartVnode, newEndVnode, oldStartVnode._hostNode._hostNode);
            oldStartVnode = oldChild[++oldStartIndex];
            newEndVnode = newChild[--newEndIndex];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            var _dom = oldEndVnode._hostNode;
            parentDomNode.insertBefore(_dom, oldStartVnode._hostNode);
            update(oldStartVnode, newEndVnode, oldStartVnode._hostNode);
            oldEndVnode = oldChild[--oldEndIndex];
            newStartVnode = newChild[++newStartIndex];
        } else {
            if (hascode === undefined) hascode = mapKeyToIndex(oldChild);

            var indexInOld = hascode[newStartVnode.key];

            if (indexInOld === undefined) {
                var newElm = renderByLuy(newStartVnode, parentDomNode, true);
                parentDomNode.insertBefore(newElm, oldStartVnode._hostNode);
                newStartVnode = newChild[++newStartIndex];
            } else {
                var moveVnode = oldChild[indexInOld];
                update(moveVnode, newStartVnode, moveVnode._hostNode);
                parentDomNode.insertBefore(moveVnode._hostNode, oldStartVnode._hostNode);
                oldChild[indexInOld] = undefined;
                newStartVnode = newChild[++newStartIndex];
            }
        }
        if (oldStartIndex > oldEndIndex) {

            for (; newStartIndex - 1 < newEndIndex; newStartIndex++) {

                if (newChild[newStartIndex]) {
                    renderByLuy(newChild[newStartIndex], parentDomNode);
                }
            }
        } else if (newStartIndex > newEndIndex) {

            for (; oldStartIndex - 1 < oldEndIndex; oldStartIndex++) {
                if (oldChild[oldStartIndex]) {
                    parentDomNode.removeChild(oldChild[oldStartIndex]._hostNode);
                }
            }
        }
    }

    return newChild;
}

function update(oldVnode, newVnode, parentDomNode) {
    newVnode._hostNode = oldVnode._hostNode;
    // if (!oldVnode && newVnode) {
    //     renderByLuy(newVnode, parentDomNode)
    //     return newVnode
    // }


    if (oldVnode.type === newVnode.type) {
        if (oldVnode.type === "#text") {
            newVnode._hostNode = oldVnode._hostNode; //更新一个dom节点
            updateText(oldVnode, newVnode);

            return newVnode;
        }
        if (typeof oldVnode.type === 'string') {
            //原生html
            //更新后的child，返回给组件
            newVnode.props.children = updateChild(oldVnode.props.children, newVnode.props.children, oldVnode._hostNode);
            var nextStyle = newVnode.props.style;
            //更新css
            if (oldVnode.props.style !== nextStyle) {
                (0, _keys2.default)(nextStyle).forEach(function (s) {
                    return newVnode._hostNode.style[s] = nextStyle[s];
                });
            }
        }
        if (typeof oldVnode.type === 'function') {//非原生

        }
    } else {

        var dom = renderByLuy(newVnode, parentDomNode, true);
        if (newVnode._hostNode) {
            parentDomNode.insertBefore(dom, newVnode._hostNode);
            parentDomNode.removeChild(newVnode._hostNode);
        } else {
            parentDomNode.appendChild(dom);
        }
    }
    return newVnode;
}
/**
 * 渲染自定义组件
 * @param {*} Vnode
 * @param {Element} parentDomNode
 */
function renderComponent(Vnode, parentDomNode) {
    var type = Vnode.type,
        props = Vnode.props;


    var Component = type;
    var instance = new Component(props);

    var renderedVnode = instance.render();
    if (!renderedVnode) console.warn('你可能忘记在组件render()方法中返回jsx了');
    var domNode = renderByLuy(renderedVnode, parentDomNode);
    instance.Vnode = renderedVnode;
    instance.dom = domNode;
    instance.Vnode._hostNode = domNode; //用于在更新时期oldVnode的时候获取_hostNode
    instance.Vnode._mountIndex = mountIndexAdd();

    return domNode;
}

function mountNativeElement(Vnode, parentDomNode) {
    var domNode = renderByLuy(Vnode, parentDomNode);
    Vnode._hostNode = domNode;
    Vnode._mountIndex = mountIndexAdd();
    return domNode;
}
function mountTextComponent(Vnode, domNode) {
    var textDomNode = document.createTextNode(Vnode.props);
    domNode.appendChild(textDomNode);
    Vnode._hostNode = textDomNode;
    Vnode._mountIndex = mountIndexAdd();
    return textDomNode;
}

function mountChild(childrenVnode, parentDomNode) {

    var childType = (0, _utils.typeNumber)(childrenVnode);
    var flattenChildList = childrenVnode;
    if (childType === 8) {
        //Vnode
        flattenChildList._hostNode = mountNativeElement(flattenChildList, parentDomNode);
    }
    if (childType === 7) {
        //list
        flattenChildList = (0, _createElement.flattenChildren)(childrenVnode);
        flattenChildList.forEach(function (item) {
            renderByLuy(item, parentDomNode);
        });
    }
    if (childType === 4 || childType === 3) {
        //string or number
        flattenChildList = (0, _createElement.flattenChildren)(childrenVnode);
        mountTextComponent(flattenChildList, parentDomNode);
    }

    return flattenChildList;
}

function findDOMNode(ref) {
    if (ref == null) {
        return null;
    }
    if (ref.nodeType === 1) {
        return ref;
    }
    return ref.__dom || null;
}

/**
 * ReactDOM.render()函数入口
 * 渲染组件，组件的子组件，都在这里
 * @param {*} Vnode
 * @param {Element} container
 * @param {boolean} isUpdate
 */
var depth = 0;
function renderByLuy(Vnode, container, isUpdate) {
    var type = Vnode.type,
        props = Vnode.props;
    var className = props.className,
        style = props.style,
        children = props.children;

    var domNode = void 0;
    if (typeof type === 'function') {
        domNode = renderComponent(Vnode, container);
    } else if (typeof type === 'string' && type === '#text') {
        domNode = mountTextComponent(Vnode, container);
    } else {
        domNode = document.createElement(type);
    }

    if (children) {
        props.children = mountChild(children, domNode); //flatten之后的child 要保存下来
    }

    if (className !== undefined) {
        domNode.className = className;
    }

    if (style !== undefined) {
        (0, _keys2.default)(style).forEach(function (styleName) {
            domNode.style[styleName] = style[styleName];
        });
    }

    Vnode._hostNode = domNode;

    if (isUpdate) {
        return domNode;
    } else {
        Vnode._mountIndex = mountIndexAdd();
        if (container) container.appendChild(domNode);
    }
    return domNode;
}

function render(Vnode, container) {
    var rootDom = renderByLuy(Vnode, container);
    return rootDom;
}
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(mountIndex, "mountIndex", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(mountIndexAdd, "mountIndexAdd", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(updateText, "updateText", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(isSameVnode, "isSameVnode", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(mapKeyToIndex, "mapKeyToIndex", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(updateChild, "updateChild", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(update, "update", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(renderComponent, "renderComponent", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(mountNativeElement, "mountNativeElement", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(mountTextComponent, "mountTextComponent", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(mountChild, "mountChild", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(findDOMNode, "findDOMNode", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(depth, "depth", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(renderByLuy, "renderByLuy", "app/src/Luy/vdom.js");

    __REACT_HOT_LOADER__.register(render, "render", "app/src/Luy/vdom.js");
}();

;