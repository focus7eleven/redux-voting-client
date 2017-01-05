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

const [WIDTH, HEIGHT, RADIUS] = [window.innerWidth, 200, 40]

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
    }
  },
  componentDidMount() {
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
    const [ox, oy] = [(WIDTH - (2 * radius + 2 * margin) * length) / 2, (HEIGHT - 2 * radius) / 2]

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
        const to = clamp(Math.round((mouse[0] - this._layout[0][0]) / (this._radius * 2 + this._margin * 2)), 0, elements.size);
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
    this.setState({isPressed: false, delta: [0, 0]});
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
              scale: spring(1.2, springSetting1),
              boxShadow: spring((x - (WIDTH - 50) / 2) / 15, springSetting1),
            };
          } else {
            [x, y] = this._layout[visualPosition];

            style = {
              translateX: spring(x, springSetting2),
              translateY: spring(y, springSetting2),
              scale: spring(1, springSetting1),
              boxShadow: spring((x - (WIDTH - 50) / 2) / 15, springSetting1),
            };
          }

          return (
            <Motion key={op.get('code')} style={style}>
              {({translateX, translateY, scale, boxShadow}) =>
                <div
                  onMouseDown={this.handleMouseDown.bind(null, op, [x, y])}
                  onTouchStart={this.handleTouchStart.bind(null, op, [x, y])}
                  className={styles.expressionElement}
                  style={{
                    WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    zIndex: op.get('code') === lastPress ? 99 : visualPosition,
                    boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`,
                    lineHeight: `${this._radius * 2}px`,
                    height: this._radius * 2,
                    width: this._radius * 2,
                    marginLeft: this._margin,
                    marginRight: this._margin,
                    fontSize: 1 * this._radius,
                  }}
                >
                  {sourceName?<div className={styles.sourceLabel} style={{
                    fontSize: this._radius * 0.7,
                    marginLeft: this._radius - 2,
                    WebkitTransform: `translate3d(-50%, ${-1.6 * this._radius}px, 0)`,
                    transform: `translate3d(-50%, ${-1.6 * this._radius}px, 0)`,
                  }}>
                    {sourceName}
                  </div>:null}
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
    return <div className={styles.container}>
      {this.renderExpression()}
      <div className={styles.operationZone}>
        <FloatingActionButton >
          <ContentRemove />
        </FloatingActionButton>
      </div>
      <Paper className={styles.socialZone}>
        <span>123</span>
        <div className={styles.inputArea}>
          <TextField className={styles.inputField} hintStyle={{width: "100%",textAlign: "center"}} hintText="在这输入他人的物资代码" />
          <FloatingActionButton mini={true} >
            <ContentAdd />
          </FloatingActionButton>
        </div>
      </Paper>
    </div>
  }
})

function mapStateToProps(state) {
  return {
    players: state.get('player'),
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Playing);
