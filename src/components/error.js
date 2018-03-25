import React from 'react'

class Error extends React.Component{

  render (){

  if(this.props.hasError){
    return(
      <p className="Error">There was a problem with that BattleTag</p>
    );
  }
  else {
    return (
      <p className="Error"></p>
    )
  }

}
}
export default Error;
