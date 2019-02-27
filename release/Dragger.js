import _extends from 'babel-runtime/helpers/extends';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import { int, innerHeight, innerWidth, outerHeight, outerWidth, parseBounds, isNumber } from './utils';

var doc = document;

var Dragger = function (_React$Component) {
    _inherits(Dragger, _React$Component);

    function Dragger() {
        var _ref;

        _classCallCheck(this, Dragger);

        for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
            props[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = Dragger.__proto__ || _Object$getPrototypeOf(Dragger)).call.apply(_ref, [this].concat(props)));

        _this.state = {
            /** x轴位移，单位是px */
            x: null,

            /** y轴位移，单位是px */
            y: null,

            /**鼠标点击元素的原始位置，单位是px */
            originX: 0,
            originY: 0,

            /**已经移动的位移，单位是px */
            lastX: 0,
            lastY: 0
        };

        _this.move = _this.move.bind(_this);
        _this.onDragEnd = _this.onDragEnd.bind(_this);
        return _this;
    }
    /** props end */

    /**
     * 初始变量设置
     */


    _createClass(Dragger, [{
        key: 'move',
        value: function move(event) {
            var _state = this.state,
                lastX = _state.lastX,
                lastY = _state.lastY;
            /*  event.client - this.state.origin 表示的是移动的距离,
            *   elX表示的是原来已经有的位移
            */

            var deltaX = event.clientX - this.state.originX + lastX;
            var deltaY = event.clientY - this.state.originY + lastY;

            /**
             * 网格式移动范围设定，永远移动 n 的倍数
             * 注意:设定移动范围的时候，一定要在判断bounds之前，否则会造成bounds不对齐
             */
            var grid = this.props.grid;

            if (Array.isArray(grid) && grid.length === 2) {
                deltaX = Math.round(deltaX / grid[0]) * grid[0];
                deltaY = Math.round(deltaY / grid[1]) * grid[1];
            }

            var bounds = this.props.bounds;

            if (bounds) {
                /**
                 * 如果用户指定一个边界，那么在这里处理
                 */
                var NewBounds = typeof bounds === 'string' ? bounds : parseBounds(bounds);
                console.log(NewBounds);

                if (this.props.bounds === 'parent') {
                    NewBounds = {
                        left: int(this.parent.style.paddingLeft) + int(this.self.style.marginLeft) - this.self.offsetLeft,
                        top: int(this.parent.style.paddingTop) + int(this.self.style.marginTop) - this.self.offsetTop,
                        right: innerWidth(this.parent) - outerWidth(this.self) - this.self.offsetLeft + int(this.parent.style.paddingRight) - int(this.self.style.marginRight),
                        bottom: innerHeight(this.parent) - outerHeight(this.self) - this.self.offsetTop + int(this.parent.style.paddingBottom) - int(this.self.style.marginBottom)
                    };
                }

                /**
                 * 保证不超出右边界和底部
                 *
                 */
                if (isNumber(NewBounds.right)) deltaX = Math.min(deltaX, NewBounds.right);
                if (isNumber(NewBounds.bottom)) deltaY = Math.min(deltaY, NewBounds.bottom);

                /**
                 * 保证不超出左边和上边
                 *
                 */
                if (isNumber(NewBounds.left)) deltaX = Math.max(deltaX, NewBounds.left);
                if (isNumber(NewBounds.top)) deltaY = Math.max(deltaY, NewBounds.top);
            }

            /**如果设置了x,y限制 */
            deltaX = this.props.allowX ? deltaX : 0;
            deltaY = this.props.allowY ? deltaY : 0;

            /**移动时回调，用于外部控制 */
            if (this.props.onMove) this.props.onMove(event, deltaX, deltaY);

            this.setState({
                x: deltaX,
                y: deltaY
            });
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart(event) {
            /** 保证用户在移动元素的时候不会选择到元素内部的东西 */
            doc.body.style.userSelect = 'none';

            if (this.props.hasDraggerHandle) {
                if (event.target.className !== 'handle') return;
            }

            if (this.props.hasCancelHandle) {
                if (event.target.className === 'cancel') return;
            }

            if (this.props.static === true) return;

            /**
             * 把监听事件的回掉函数，绑定在document上
             * 当设置边界的时候，用户鼠标会离开元素的范围
             * 绑定在document上可以使得其依旧能够监听
             * 如果绑定在元素上，则鼠标离开元素，就不会再被监听了
             */
            doc.addEventListener('mousemove', this.move);
            doc.addEventListener('mouseup', this.onDragEnd);

            if (this.props.bounds === 'parent' && (
                /**为了让 这段代码不会重复执行 */
                typeof this.parent === 'undefined' || this.parent === null)) {
                /**
                 * 在这里我们将父节点缓存下来，保证当用户鼠标离开拖拽区域时，我们仍然能获取到父节点
                 */
                this.parent = event.currentTarget.offsetParent;
                /**
                 * 我们自己
                 */
                this.self = event.currentTarget;
            }

            if (this.props.onDragStart) this.props.onDragStart(this.state.x, this.state.y);

            this.setState({
                originX: event.clientX,
                originY: event.clientY,
                lastX: this.state.x,
                lastY: this.state.y
            });
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd(event) {
            /** 取消用户选择限制，用户可以重新选择 */
            doc.body.style.userSelect = '';
            this.parent = null;
            this.self = null;
            doc.removeEventListener('mousemove', this.move);
            doc.removeEventListener('mouseup', this.onDragEnd);

            if (this.props.onDragEnd) this.props.onDragEnd(event);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            /**
             * 这个函数只会调用一次
             * 这个只是一个临时的解决方案，因为这样会使得元素进行两次刷新
             */
            if (typeof this.props.x === 'number' && typeof this.props.y === 'number') {
                this.setState({
                    x: this.props.x,
                    y: this.props.y
                });
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            /**
             * 外部props 改变的时候更新元素的内部位置
             * 这个api设计其实很不好
             * 以后可能会修改掉
             */
            var isUserMove = nextProps.isUserMove;

            if (!isUserMove) {
                if (typeof nextProps.x === 'number' && typeof nextProps.y === 'number') {
                    this.setState({
                        x: nextProps.x,
                        y: nextProps.y,
                        lastX: nextProps.x,
                        lastY: nextProps.y
                    });
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _state2 = this.state,
                x = _state2.x,
                y = _state2.y;
            var _props = this.props,
                bounds = _props.bounds,
                style = _props.style,
                className = _props.className,
                others = _props.others;


            if (!this.props.isUserMove) {
                /**当外部设置其props的x,y初始属性的时候，我们在这里设置元素的初始位移 */
                x = this.props.x;
                y = this.props.y;
            }

            /**主要是为了让用户定义自己的className去修改css */
            var fixedClassName = typeof className === 'undefined' ? '' : className + ' ';
            return React.createElement(
                'div',
                _extends({ className: fixedClassName + 'WrapDragger',
                    style: _extends({}, style, { touchAction: 'none!important', transform: 'translate(' + x + 'px,' + y + 'px)' }),
                    onMouseDown: this.onDragStart.bind(this),
                    onMouseUp: this.onDragEnd.bind(this)
                }, others),
                React.cloneElement(React.Children.only(this.props.children), {})
            );
        }
    }]);

    return Dragger;
}(React.Component);

Dragger.propTypes = {
    /**
     * 给予元素一个x,y的初始位置，单位是px
     */
    x: PropTypes.number,
    y: PropTypes.number,

    /**
     * 拖动范围限制
     * 如果不规定范围，那么子元素就可以随意拖动不受限制
     * 1.可以提供自定义的范围限制
     * 2.也可以提供父类为边框的范围限制(string === parent)
     */
    bounds: PropTypes.oneOfType([PropTypes.shape({
        left: PropTypes.number,
        right: PropTypes.number,
        top: PropTypes.number,
        bottom: PropTypes.number
    }), PropTypes.string]),
    /**
     * 以网格的方式移动，每次移动并不是平滑的移动
     * [20,30]，鼠标x轴方向移动了20 px ，y方向移动了30 px，整个子元素才会移动
     */
    grid: PropTypes.arrayOf(PropTypes.number),

    /**只允许移动x轴 */
    allowX: PropTypes.bool,

    /**只允许移动y轴 */
    allowY: PropTypes.bool,

    /**
     * 内部的移动拖拽把手
     * 拖拽把手className一定要设置成handle并且这个属性设置成true
     * <Dragger hasDraggerHandle={true}>
     *      <div className={handle} >点击我拖动</div>
     * </Dragger>
     */
    hasDraggerHandle: PropTypes.bool,

    /**
     * 内部取消的区域
     * <Dragger hasCancelHandle={true}>
     *      <div className={cancel} >点击我拖动</div>
     * </Dragger>
     */
    hasCancelHandle: PropTypes.bool,

    /**
     * 是否由用户移动
     * 可能是通过外部props改变
     */
    isUserMove: PropTypes.bool,

    /**
     * 是否静态
     * 设置了就不可移动
     */
    static: PropTypes.bool,

    /**
     * 生命周期回调
     */
    onDragStart: PropTypes.func,
    onMove: PropTypes.func,
    onDragEnd: PropTypes.func };
Dragger.defaultProps = {
    allowX: true,
    allowY: true,
    hasDraggerHandle: false,
    isUserMove: true
};
var _default = Dragger;
export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(doc, 'doc', 'app/src/Dragger.js');

    __REACT_HOT_LOADER__.register(Dragger, 'Dragger', 'app/src/Dragger.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'app/src/Dragger.js');
}();

;