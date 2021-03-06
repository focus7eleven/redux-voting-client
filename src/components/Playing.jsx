import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
  connect
} from 'react-redux'
import * as actionCreators from '../action_creators'
import {
  Motion,
  spring
} from 'react-motion'
import _ from 'underscore'
import styles from './Playing.scss'
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import Slider from 'nw-react-slider'
import 'nw-react-slider/dist/nw-react-slider.css'

const springSetting1 = {
  stiffness: 120,
  damping: 10
};
const springSetting2 = {
  stiffness: 120,
  damping: 17
};
const SLIDER_MARKERS = [{value: 0, label: '0'}, {value: 1, label: '1'}, {value: 2, label: '2'}, {value: 3, label: '3'}, {value: 4, label: '4'}, {value: 5, label: '5'}, {value: 6, label: '6'}, {value: 7, label: '7'}, {value: 8, label: '8'}, {value: 9, label: '9'}, {value: 10, label: '+'}, {value: 11, label: '-'}, {value: 12, label: '×'}, {value: 13, label: '÷'}]

function reinsert(arr, from, to) {
  arr = arr.slice(0);
  const val = arr.get(from);
  arr = arr.splice(from, 1);
  arr = arr.splice(to, 0, val);
  return arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const [WIDTH, HEIGHT, RADIUS, DELETE_LIMIT] = [window.innerWidth, 200, 40, 50]
const CODE_SET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


const ExpressionPanel = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState() {
    this.updateLayout(this.props.viewer.get('elements'))

    return {
      mouse: [0, 0],
      delta: [0, 0], // difference between mouse and circle pos, for dragging
      lastPress: null, // key of the last pressed component
      isPressed: false,
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.viewer.get('elements').size !== this.props.viewer.get('elements').size) {
      this.updateLayout(nextProps.viewer.get('elements'))
    }
  },
  componentDidMount() {
    const that = this

    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  },
  componentWillUnmount() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  },
  updateLayout(expr) {
    const length = expr.size
    const radius = RADIUS * Math.pow(0.9, length)
    const margin = radius * 0.2
    const [ox, oy] = [(WIDTH - (2 * radius + 2 * margin) * length) / 2, (HEIGHT - 2 * radius) / 2 - radius]

    this._layout = _.map(_.range(length), i => [ox + i * (2 * radius + 2 * margin), oy])
    this._ox = ox
    this._oy = oy
    this._radius = radius
    this._margin = margin
  },

  // Handler
  handleTouchStart(key, pressLocation, e) {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  },
  handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  },
  handleMouseMove({pageX, pageY}) {
    const {lastPress, isPressed, delta: [dx, dy]} = this.state;
    const elements = this.props.viewer.get('elements')

    if (isPressed) {
      const mouse = [pageX - dx, pageY - dy];

      if (Math.abs(mouse[1] - this._oy) < 40) {
        const to = clamp(Math.round((mouse[0] - this._layout[0][0]) / (this._radius * 2 + this._margin * 2)), 0, elements.size - 1);
        const from = elements.findIndex(v => v.get('code') === lastPress)
        if (from !== to) {
          const newElements = reinsert(elements, from, to);
          this.props.resortElements(newElements)
        }
      }

      this.setState({
        mouse: mouse
      })
    }
  },
  handleMouseDown(key, [pressX, pressY], {pageX, pageY}) {
    this.setState({
      lastPress: key.get('code'),
      isPressed: true,
      delta: [pageX - pressX, pageY - pressY],
      mouse: [pressX, pressY],
    });
  },
  handleMouseUp() {
    if (this.state.isPressed && Math.abs(this.state.mouse[1] - this._oy) > DELETE_LIMIT) {
      this.props.deleteElement(this.state.lastPress)
    }

    this.setState({isPressed: false, delta: [0, 0]})
  },

  render() {
    const {
      lastPress,
      isPressed,
      mouse,
    } = this.state
    const elements = this.props.viewer.get('elements')

    return (
      <div className={styles.expressionPanel}>
        {elements.map((op, key) => {
          let style;
          let x;
          let y;
          let sourceName;
          const visualPosition = key;
          if (op.get('code') === lastPress && isPressed) {
            [x, y] = mouse;
            sourceName = this.props.players.getIn([op.get('source'), 'name'])
            style = {
              translateX: x,
              translateY: y,
              scale: spring(this.props.clientId !== op.get('source') && Math.abs(this._oy - y) > DELETE_LIMIT ? 0 : 1.2, springSetting1),
            };
          } else {
            [x, y] = this._layout[visualPosition];

            style = {
              translateX: spring(x, springSetting2),
              translateY: spring(y, springSetting2),
              scale: spring(1, springSetting1),
            };
          }

          return (
            <Motion key={op.get('code')} style={style}>
              {({translateX, translateY, scale}) =>
                <div
                  onMouseDown={(evt)=>this.handleMouseDown(op, [x, y], evt)}
                  onTouchStart={(evt)=>this.handleTouchStart(op, [x, y], evt)}
                  className={styles.expressionElement}
                  style={{
                    WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    zIndex: op.get('code') === lastPress ? 99 : visualPosition,
                    lineHeight: `${this._radius * 2}px`,
                    backgroundColor: !!op.get('tip') ? 'rgb(255, 64, 129)' : '#6282df',
                    height: this._radius * 2,
                    width: this._radius * 2,
                    marginLeft: this._margin,
                    marginRight: this._margin,
                    fontSize: 1 * this._radius,
                  }}
                >
                  {op.get('value')}
                </div>
              }
            </Motion>
          );
        })}
      </div>
    );
  }
})

export const Playing = React.createClass({
  propTypes: {
    viewer: React.PropTypes.object,
  },
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      inputCodeValue: '',
      targetValue: 0,
      pressedKey: [],
    }
  },
  getKeyButton(code) {
    return ['R', 'A', 'N', 'D', 'O', 'M']
  },
  getSign(v) {
    return _.find(SLIDER_MARKERS, marker => marker.value === v).label
  },
 
  handleChangeTarget(v) {
    this.setState({
      targetValue: v,
    })
    this.props.addAnotherElement(this.state.pressedKey, this.getSign(v))
  },
  handlePressKey(k, evt) {
    evt.preventDefault()
    evt.stopPropagation()

    let pressedKey = this.state.pressedKey.slice()

    if (~this.state.pressedKey.indexOf(k)) {
      pressedKey = this.state.pressedKey.filter(v => v !== k)
      this.setState({
        pressedKey,
      })
    } else {
      pressedKey.push(k)
      this.setState({
        pressedKey,
      })
    }
    this.props.addAnotherElement(pressedKey, this.getSign(this.state.targetValue))
  },

  // Render.
  render() {
    const {
      viewer,
      players
    } = this.props
    const originalElement = viewer.get('elements').find(v => !!v.get('tip'))

    return <div className={styles.container}>
      <div className={styles.labelGroup}>
        <div className={styles.nameLabel}>{viewer.get('name')}</div>
        <div className={styles.codeLabel}>我的代码：{originalElement.get('code')}</div>
      </div>

      <ExpressionPanel {...this.props}></ExpressionPanel>

      <Paper className={styles.socialZone}>
        <Slider
          triggerOnChangeWhileDragging={false}
          value={this.state.targetValue}
          min={0}
          max={13}
          ticks
          markerLabel={SLIDER_MARKERS}
          onChange={this.handleChangeTarget}
        />

        <div className={styles.keyboard}>
          {this.getKeyButton(originalElement.get('code')).map((v, k) => <span key={k} style={~this.state.pressedKey.indexOf(v)?{backgroundColor: '#b8b8b8'}:{}} onMouseDown={this.handlePressKey.bind(this, v)} onTouchStart={this.handlePressKey.bind(this, v)}>{v}</span>)}
        </div>
      </Paper>
    </div>
  }
})

function mapStateToProps(state) {
  return {
    clientId: state.get('clientId'),
    players: state.get('player'),
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Playing);
