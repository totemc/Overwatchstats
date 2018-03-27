import React from 'react';
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';


const style = {
  height: 250,
  width: 200,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

const divStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

};

const imgStyle = {
  height:75,
  width:75,
  maxWidth:75,
  minWidth:75,
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
};


const  ologo ='/static/media/Overwatch_circle_logo.1a528d9e.svg';


class Cards extends React.Component {

  render(){

    const cards = this.props.friends.map((step, move) => {

   if (step.battleTag!==''){

     let Name= step.battleTag.split('-');
     let battleTagName =Name[0]
     let number = Name[1];

     console.log(step.tier);

     let imgsrc=step.tier;

     if(imgsrc===undefined){
       imgsrc=ologo;
     }

     if (step.comprank===null)
     step.comprank='Unranked';


     return (


         <Card style={style} zDepth={3} key={move}>
            <CardHeader
              title={battleTagName}
              subtitle={number}
              avatar={imgsrc}
            >
            <Divider/>
            </CardHeader>
            <CardTitle title={step.comprank} subtitle={step.winrate} >
            </CardTitle>

            <CardText>
             {step.wins} wins / {step.losses} losses
            </CardText>

          </Card>
       );
     }

   });

 return <div style={divStyle}>{cards}</div>
 }
 }

export default Cards;
