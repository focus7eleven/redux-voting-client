import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  connect
} from 'react-redux';
import * as actionCreators from '../action_creators';

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
      viewer
    } = this.props

    if (!viewer) return null

    return <div>
      <div>我的名字是{viewer.get('name')}</div>
      <div>
        联系方式：<input style={{color: 'black'}} type="text" value={this.state.phone} onChange={evt=>this.setState({phone: evt.target.value})}/>
      </div>
      <button style={{color: 'black'}} onClick={this.props.toggleReady}>{viewer.get('isReady')?'取消准备':'准备'}</button>
    </div>
  }
});

function mapStateToProps(state) {
  const clientId = state.get('clientId')

  return {
    viewer: state.getIn(['player', clientId])
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Prepare);
