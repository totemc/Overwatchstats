import React from 'react';

import '.././App.css';
import OWStats from '.././overwatch-stats.js';
import Cards from './cards.js'
import Error from './error.js'
import Input from './input.js'

import Drawer from './drawer1.js'

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
  wins: '',
  losses: '',
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

  this.loadFromLSChain();
  //console.log('loadFromLS called');
}

  render() {



    return (
      <div>
        <Input enterPressed={this.handleEnterPressed} onUpdate={this.onUpdate} />
        <Error {...this.state}/>

        <Cards {...this.state}/>

        <Drawer/>
      </div>
    )
  }


loadFromLSChain(){
  //localStorage.clear();
  if (localStorage.getItem("counter") === null) {
  localStorage.setItem("counter","0");
  }
  let counter = parseInt(localStorage.getItem("counter"));

  let friendArray = []


  let chain = Promise.resolve(friendArray);

  for (let i = 1; i <= counter; i++){
    let currentFriend = localStorage.getItem(JSON.stringify(i));
    friendArray.push(currentFriend);
  }

  chain.then(friendArray.map(friend => this.makeRequest1(friend)));

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
        console.log(stats);
        // Stats Object available for use

      //  console.log(stats);
        this.setState({hasError: false});
        this.setState({friends: this.state.friends.concat([{
          battleTag: stats._battleTag,
          comprank: stats._raw.body.us.stats.competitive.overall_stats.comprank,
          winrate: stats._raw.body.us.stats.competitive.overall_stats.win_rate,
          avatar: stats._raw.body.us.stats.competitive.overall_stats.avatar,
          tier: stats._raw.body.us.stats.competitive.overall_stats.tier_image,
          wins: stats._raw.body.us.stats.competitive.overall_stats.wins,
          losses: stats._raw.body.us.stats.competitive.overall_stats.losses,
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
            wins: stats._raw.body.us.stats.competitive.overall_stats.wins,
            losses: stats._raw.body.us.stats.competitive.overall_stats.losses,

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

export default Container1;
