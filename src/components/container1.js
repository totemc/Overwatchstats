import React from 'react';

import '.././App.css';
import OWStats from '.././overwatch-stats.js';
import {Card, CardHeader, CardTitle} from 'material-ui/Card';



class Container1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldVal: "",
      hasError: false,
      enterPressed: false,
friends: [{
  battleTag: '',
  comprank: '',
  winrate: '',
  avatar: '',
  tier: '',
}],
    }
  }

  onUpdate = (val) => {
    this.setState({
      fieldVal: val
    })
  };

handleEnterPressed = () => {
  this.setState({
    enterPressed: true,
  })
};

componentDidUpdate(){
console.log('componentDidUpdateCalled');
  if (this.state.enterPressed){
    new Promise((resolve, reject) => {
    return this.makeRequest();
  });
    this.setState({
      enterPressed: false,
    });
}
}


componentDidMount(){

  this.loadFromLS();
  console.log('loadFromLS called');
}

  render() {



    return (
      <div>
        <Input enterPressed={this.handleEnterPressed} onUpdate={this.onUpdate} />
        <Error {...this.state}/>

        <Cards {...this.state}/>

      </div>
    )
  }


loadFromLS(){
  console.log('inside load from LS');
  var count=1;

//localStorage.clear();
  if (localStorage.getItem("counter") === null) {
  localStorage.setItem("counter","0");
}
  var counter = parseInt(localStorage.getItem("counter"));


  console.log('counter:'+ counter);
  while(count<=counter){
  var currentFriend=localStorage.getItem(JSON.stringify(count));
  console.log('count:'+count);
  console.log('counter:'+counter);
  console.log('currentFriend:'+currentFriend);
    new Promise((resolve, reject) => {
    return this.makeRequest1(currentFriend);
  });

    count++;
  }
}


saveToLs(string){
  console.log('inside savetoLs');

  var counter = parseInt(localStorage.getItem('counter'));
  console.log('counter:'+counter);
  //var currentFriend = localStorage.getItem(JSON.stringify(counter));

  var notInList=true;
  for(var i=1;i<=counter;i++){
    if (string===localStorage.getItem(JSON.stringify(i)))
    notInList=false;
  }

  if (notInList===true){
    counter++;
    localStorage.setItem(JSON.stringify(counter),string);
    localStorage.setItem('counter',JSON.stringify(counter));
  }

}

makeRequest1(currentFriend){

  OWStats.load(currentFriend).catch((error)=>{
    console.log(error);
    this.setState({hasError: true});
  })
      .then(data => {
        let stats = new OWStats(data)
        // Stats Object available for use

      //  console.log(stats);
        this.setState({hasError: false});
        this.setState({friends: this.state.friends.concat([{
          battleTag: stats._battleTag,
          comprank: stats._raw.body.us.stats.competitive.overall_stats.comprank,
          winrate: stats._raw.body.us.stats.competitive.overall_stats.win_rate,
          avatar: stats._raw.body.us.stats.competitive.overall_stats.avatar,
          tier: stats._raw.body.us.stats.competitive.overall_stats.tier_image,
        }]),
      });


    }).catch((error)=>{
      console.log(error);
      this.setState({hasError: true});
    });


  }



  makeRequest(){
    console.log(this.state.fieldVal);
    console.log('makeRequest called');
    if (this.state.fieldVal!==''){
    OWStats.load(this.state.fieldVal)
    .catch((error)=>{
      console.log(error);
      this.setState({hasError: true});
    })
        .then(data => {
          let stats = new OWStats(data)
          // Stats Object available for use

        //  console.log(stats);
          this.setState({hasError: false});
          this.setState({friends: this.state.friends.concat([{
            battleTag: stats._battleTag,
            comprank: stats._raw.body.us.stats.competitive.overall_stats.comprank,
            winrate: stats._raw.body.us.stats.competitive.overall_stats.win_rate,
            avatar: stats._raw.body.us.stats.competitive.overall_stats.avatar,
            tier: stats._raw.body.us.stats.competitive.overall_stats.tier_image,
          }]),
        });

        this.saveToLs(stats._battleTag);
      }).catch((error)=>{
        console.log(error);
        this.setState({hasError: true});
      });


    }
  }
}

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

/*
class Cards extends React.Component{

  render(){


   const cards = this.props.friends.map((step, move) => {

  if (step.battleTag!==''){
    return (

        <div className="card card-1" key={move}>
        <p>{step.battleTag} </p>
        <img src={step.tier} alt='' className='Tier'/>
        <p>SR: {step.comprank}</p>
         <p>Win Percent: {step.winrate}</p>
        </div>

      );
    }

  });

return <div>{cards}</div>
}
}
*/

const style = {
  height: 200,
  width: 200,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
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

 return <div>{cards}</div>
 }
 }

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


export default Container1;
