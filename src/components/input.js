import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldVal: ""
    }
  }

  _handleKeyPress = (e) => {
      if (e.key === 'Enter') {
      //  console.log("enter was pressed");
        this.props.enterPressed();
        // Empty the field for ux
        this.setState({fieldVal:''});
      }
    }
  update = (e) => {
  //  console.log(e.target.value);
    this.props.onUpdate(e.target.value);
    this.setState({fieldVal: e.target.value});
  };

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="BattleTag + Enter"
          onChange={this.update}
          value={this.state.fieldVal}
          onKeyPress={this._handleKeyPress}
        />
      </div>
    )
  }
}

export default Input;
