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

const springSetting1 = {
  stiffness: 120,
  damping: 10
};
const springSetting2 = {
  stiffness: 120,
  damping: 17
};

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

export const Playing = React.createClass({
  propTypes: {
    viewer: React.PropTypes.object,
  },
  mixins: [PureRenderMixin],

  getInitialState() {
    this.updateLayout(this.props.viewer.get('elements'))

    return {
      mouse: [0, 0],
      delta: [0, 0], // difference between mouse and circle pos, for dragging
      lastPress: null, // key of the last pressed component
      isPressed: false,

      inputCodeValue: '',
    }
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.viewer.get('elements').size !== this.props.viewer.get('elements').size) {
      this.updateLayout(nextProps.viewer.get('elements'))
    }
  },
  componentDidMount() {
    const that = this
    this._handleInputCode = _.debounce((value = "") => {
      if (value.length === 3) {
        this.props.addAnotherElement(value)
      }
    }, 1000)

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
  handleChangeCodeInput(evt) {
    this.setState({
      inputCodeValue: evt.target.value,
    })
    this._handleInputCode(evt.target.value)
  },

  // Render.
  renderExpression() {
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
  },
  render() {
    const {
      viewer
    } = this.props
    const originalElement = viewer.get('elements').find(v => !!v.get('tip'))

    return <div className={styles.container}>
      {this.renderExpression()}

      <Paper className={styles.socialZone}>
        <span>{viewer.get('name')}：{originalElement.get('code')}</span>
        <div className={styles.inputArea}>
          <TextField className={styles.inputField} hintStyle={{width: "100%",textAlign: "center"}} hintText="输入其他人代码" value={this.state.inputCodeValue} onChange={this.handleChangeCodeInput}/>
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
