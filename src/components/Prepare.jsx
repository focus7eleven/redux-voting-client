import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
  connect
} from 'react-redux'
import * as actionCreators from '../action_creators'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField';
import styles from './Prepare.scss'

export const Prepare = React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount() {
    this.props.joinGame()
  },
  getInitialState() {
    return {
      phone: '',
    }
  },

  // Render.
  render() {
    const {
      viewer,
      targetValue,
    } = this.props

    if (!viewer) return null

    return <div className={styles.container}>
      <div className={styles.name}>欢迎你：{viewer.get('name')}</div>
      {/* <div>
        联系方式：<input style={{color: 'black'}} type="text" value={this.state.phone} onChange={evt=>this.setState({phone: evt.target.value})}/>
      </div> */}
      <RaisedButton fullWidth={true} primary={true} label={viewer.get('isReady')?'取消准备':'准备'} onClick={this.props.toggleReady.bind(this, this.state.phone)}></RaisedButton>
    </div>
  }
});

function mapStateToProps(state) {
  const clientId = state.get('clientId')

  return {
    viewer: state.getIn(['player', clientId]),
    targetValue: state.get('targetValue'),
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Prepare);
