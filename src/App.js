import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognization from './components/FaceRecognization/FaceRecognization.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import './App.css';

const app = new Clarifai.App({
 apiKey: 'cd425d073e8445ed918e9b15ea1adee4'
});
const particlesOptions = {
    particles: {
      number: {
        value: 80,
          density: {
              enable: true,
              value_area: 800
           }  
      }
    }
}
class App extends Component {
  constructor() {
      super();
      this.state= {
        input: '',
        imageUrl: '',
        box: {},
        route: 'signin',
        isSignedIn: false
    }
  }

  calculateFaceLocation =(data)=> {
    const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;     //Below this line in this funn all are DOM manipulation
    const image= document.getElementById('inputimage');
    const width= Number(image.width);
    const height= Number(image.height);
    return {
        leftCol: clarifaiFace.left_col*width,
        topRow: clarifaiFace.top_row*height,
        rightCol: width - (clarifaiFace.right_col*width),
        bottomRow: height - (clarifaiFace.bottom_row*height)
    }
  }


  displayFaceBox = (box)=> {
     this.setState({box: box});
    }
  onInputChange = (event)=> {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = ()=> {
     this.setState({imageUrl: this.state.input})
      app.models.predict( Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err=> console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  render() {
     const { isSignedIn, route, box, imageUrl } = this.state;
      return (
        <div className="App">
            <Particles className='particles'
              params={particlesOptions}
            />
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
            {route === 'home'
              ? <div>
                 <Logo/>                   {/* Note in react all component name must start with capital letter eg Navigation with N, Logo with L or else it will be seen as html tag by react, */}
                 <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                 <Rank/>
                 <FaceRecognization box={box} imageUrl={imageUrl}/>
               </div> 
              : (
                this.state.route === "signin"
                  ?<Signin onRouteChange={this.onRouteChange}/>
                  :<Register onRouteChange={this.onRouteChange}/>
                )

             }
        </div>
     );
  }
}

export default App;
