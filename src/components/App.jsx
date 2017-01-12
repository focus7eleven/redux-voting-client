import React from 'react'
import {ConnectionStateContainer} from './ConnectionState'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default React.createClass({
  render: function() {
    return <MuiThemeProvider>
	    <div style={{height: "100vh",width: "100vw"}}>
			<ConnectionStateContainer />
			{this.props.children}
	    </div>
	</MuiThemeProvider>
  }
});
