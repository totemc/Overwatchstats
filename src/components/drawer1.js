import React from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';


const footerList = {
  position: 'absolute',
  bottom: 0,
};


export default class DrawerUndockedExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});


  deleteFriends = () => localStorage.clear();
  handleClose = () => this.setState({open: false});

  render() {
    return (
      <div>
        <RaisedButton
          label="about"
          onClick={this.handleToggle}
        />

        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >

     <List>
  <ListItem primaryText="BattleTag is case-sensitive" />
  <ListItem primaryText="ie. Cabedi#1257" />
  </List>

  <List style={footerList}>
<ListItem primaryText="React application created with Material-UI" />
<ListItem primaryText="by Chris Abedi" />
</List>
  <RaisedButton
    label="clear Friends"
    onClick={this.deleteFriends}
  />
        </Drawer>
      </div>
    );
  }
}
