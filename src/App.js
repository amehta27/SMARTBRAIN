import React, {Component} from 'react';
import Navigation  from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo  from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import reactDom from 'react-dom';

const app = new Clarifai.App({
  // apiKey: '449f01b86ebc41aa96bb8549e8eabb2c'
  // apiKey: '180ce8c8243b4b75874c6444a2bc029b'
  apiKey: '197b3d31304f4d328398ba3e186af676'
 });

const particleOptions = {
  particles : {
    number:{
       value :120,
       density : {
          enable: true,
          value_area: 600
          }
    }  
  }
}
              
// class App extends Component {
//   constructor(){
//     super();
//     this.state= {
//       input: '',
//       imageUrl : '',
//       box : {},
//       route : 'signin',
//       isSignedIn : false,
//       user:{
//         id:'',
//         name :'',
//         email : '',
//         entries :0,
//         joined : ''
//       }
//     }
//   }

  // loadUser = (data) =>{
  //   this.setState({user: {
  //       id:data.id,
  //       name :data.name,
  //       email : data.email,
  //       entries :data.entries,
  //       joined : data.joined

  //   }})
  // }

  class App extends Component {
    constructor(){
      super();
      this.state= {
        input: '',
        imageUrl: '',
        box: {},
        route: 'signin',
        isSignedIn: false,
        user: {
          id: '',
          name: '',
          email: '',
          entries: 0,
          joined: ''
        }
      }
    }

  loadUser = (data) =>{
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }})
    }

  // componentDidMount(){
  //   fetch('http://localhost:3001/')
  //        .then(response => response.json())
  //        .then(data => console.log(data))
  // }

  calculateFaceLocation = (data) =>{
    console.log('calculateFaceLocation', data)
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace)
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height)
    console.log(clarifaiFace.left_col);
    console.log('top row',clarifaiFace.top_row);
    return{
      // topRow: 600.387 ,
      // rightCol: 800.368,
      // bottom: 122.429,
      // left: 800.377,

      // topRow: 717.522,
      // rightCol: 757.655,
      // bottomRow: -147.077,
      // leftCol: 745.786,
        // leftCol: (clarifaiFace.left_col * width),
        // topRow : (clarifaiFace.top_row * height)+ 300,
        // rightCol : width -(clarifaiFace.right_col * width),
        // bottomRow : height -(clarifaiFace.bottom_row * height) ,
        leftCol: (clarifaiFace.left_col * width),
        topRow : (clarifaiFace.top_row * height),
        rightCol : width -(clarifaiFace.right_col * width),
        bottomRow : height -(clarifaiFace.bottom_row * height),
    
    }

    
  }

  displayFaceBox = (box) => {
    console.log('calculateFaceLocationafter', box)
    console.log(box);
    this.setState({box : box})
  }

  onInputChange =(event)=>{
    this.setState({input: event.target.value});
    // console.log(event.target.value)
  }


  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
        // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
        // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
        // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
        // is to use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
        // so you would change from:
        // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        // to:
        // .predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        console.log('hi', response)
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
              
            })
            
          })
             
            .then(response => response.json())
            console.log(response)
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            console.log(response)

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  // onButtonSubmit = ()=>{
  //   this.setState({imageUrl : this.state.input});
  //   app.models
  //   .predict(
  //     Clarifai.FACE_DETECT_MODEL, 
  //    this.state.input)
  //   //  console.log(response)
  //    .then(response => {
  //     if(response){

  //       fetch('http://localhost:3001/image',{
  //         method: 'put',
  //         headers: {'content-Type': 'application/json'},
  //         body : JSON.stringify({
  //             id : this.state.user.id
          
  //         })
  //      })
  //      .then(response => response.json())
      
  //      .then(count => {
  //        this.setState({user :{
  //          entries : count
  //        }})
        
  //      })
  //     }
  //     this.displayFaceBox(this.calculateFaceLocation(response))
  //    })
  //    .catch(err => console.log(err));
  //       //  function(response){
  //       //       this.calculateFaceLocation(response)
          
  //         // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
  //         // console.log(response)

  //       // },
  //       // function(err){

  //       // }
       
      
  // }

  onRouteChange =(route) => {
    if(route === 'signout'){
      this.setState({isSignedIn : false})
    }else if (route === 'home'){
      this.setState({isSignedIn : true})
    }

     this.setState({route : route})
  }
  render(){
    // const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
       <Particles className ='particles'
                params={particleOptions} 
        />
      <Navigation isSignedIn ={this.state.isSignedIn} onRouteChange ={this.onRouteChange}/>
      { this.state.route === 'home'
         ? <div>
         <Logo />
         <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
         <ImageLinkForm 
            onInputChange ={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} />
         <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />  
        </div>
        :(
          this.state.route === 'signin'
          ? <Signin  onRouteChange={this.onRouteChange}/>
          : <Register  loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
        )
      }
 
</div>
  )
    }
         
         
         
         
         
   
  
}

export default App;
