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
import TextField from 'material-ui/TextField';

const springSetting1 = {
  stiffness: 180,
  damping: 10
};
const springSetting2 = {
  stiffness: 120,
  damping: 17
};

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const allColors = [
  '#EF767A', '#456990', '#49BEAA', '#49DCB1', '#EEB868', '#EF767A', '#456990',
  '#49BEAA', '#49DCB1', '#EEB868', '#EF767A',
];
const [count, width, height] = [11, 70, 90];
const [WIDTH, HEIGHT, RADIUS] = [window.innerWidth, 200, 40]

export const Playing = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    this.updateLayout(['1', '+', '2'])

    return {
      mouse: [0, 0],
      delta: [0, 0], // difference between mouse and circle pos, for dragging
      lastPress: null, // key of the last pressed component
      isPressed: false,
      order: _.range(count), // index: visual position. value: component key/id
      expression: ['1', '+', '2']
    }
  },
  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  },
  updateLayout(expr) {
    const length = expr.length
    const radius = RADIUS * Math.pow(0.9, length)
    const margin = 5 * Math.pow(1.1, length)
    const [ox, oy] = [(WIDTH - (2 * radius + 2 * margin) * length) / 2, (HEIGHT - 2 * radius) / 2]

    this._layout = _.map(_.range(expr.length), i => [ox + i * (2 * radius + 2 * margin), oy])
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
    const {order, lastPress, isPressed, delta: [dx, dy]} = this.state;
    if (isPressed) {
      const mouse = [pageX - dx, pageY - dy];
      const col = clamp(Math.floor(mouse[0] / width), 0, 2);
      const row = clamp(Math.floor(mouse[1] / height), 0, Math.floor(count / 3));
      const index = row * 3 + col;
      const newOrder = reinsert(order, order.indexOf(lastPress), index);
      this.setState({mouse: mouse, order: newOrder});
    }
  },

  handleMouseDown(key, [pressX, pressY], {pageX, pageY}) {
    this.setState({
      lastPress: key,
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
      order,
      lastPress,
      isPressed,
      mouse,
      expression,
    } = this.state

    return (
      <div className={styles.expressionPanel}>
        {expression.map((op, key) => {
          let style;
          let x;
          let y;
          const visualPosition = key;
          if (op === lastPress && isPressed) {
            [x, y] = mouse;
            style = {
              translateX: x,
              translateY: y,
              scale: spring(1.2, springSetting1),
              boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
            };
          } else {
            [x, y] = this._layout[visualPosition];

            style = {
              translateX: spring(x, springSetting2),
              translateY: spring(y, springSetting2),
              scale: spring(1, springSetting1),
              boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
            };
          }

          return (
            <Motion key={key} style={style}>
              {({translateX, translateY, scale, boxShadow}) =>
                <div
                  onMouseDown={this.handleMouseDown.bind(null, op, [x, y])}
                  onTouchStart={this.handleTouchStart.bind(null, op, [x, y])}
                  className={styles.expressionElement}
                  style={{
                    backgroundColor: allColors[key],
                    WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    zIndex: op === lastPress ? 99 : visualPosition,
                    boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`,
                  }}
                />
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
      <Card className={styles.socialZone}>
        <CardHeader
          title={this.props.viewer.get('name')}
          actAsExpander={false}
          showExpandableButton={false}
        />
        <CardText expandable={false}>
        <TextField hintText="描述一下你的物资" floatingLabelText="我的物资描述" floatingLabelFixed={true}/>
        </CardText>
      </Card>
    </div>
  }
})

function mapStateToProps(state) {
  const clientId = state.get('clientId')

  return {
    viewer: state.getIn(['player', clientId]),
    stage: state.get('stage'),
    targetValue: state.get('targetValue'),
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Playing);
