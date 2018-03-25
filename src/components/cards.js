import React from 'react';
import {Card, CardHeader, CardTitle} from 'material-ui/Card';

const style = {
  height: 200,
  width: 200,
  margin: 20,
  textAlign: 'left',
  display: 'inline-block',
};

const divStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

};

class Cards extends React.Component {

  render(){

    const cards = this.props.friends.map((step, move) => {

   if (step.battleTag!==''){
     return (


         <Card style={style} zDepth={3} key={move}>
            <CardHeader
              title={step.battleTag}
              subtitle="Subtitle"
              avatar={step.tier}
            />

            <CardTitle title={step.comprank} subtitle={step.winrate} />
          </Card>
       );
     }

   });

 return <div style={divStyle}>{cards}</div>
 }
 }

export default Cards;
