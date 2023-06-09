import React, { Component } from 'react';
import { connect } from 'react-redux';
import Particles from "react-tsparticles";
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';
import 'tachyons';
import { callUserApi, getUserFromLocalStorage } from './api/api';
import { setUserEntries, logoutUser, loginUser } from './store/user/userSlice';

const particleOptions = {
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      value: 25
    },
    size: {
      value: 3
    }
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      }
    }
  },
  detectRetina: false,
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    this._isMounted = false;
  }

  componentDidMount() {
    console.log('component mounted');
    this._isMounted = true;
    if (this._isMounted) {
      const localUser = getUserFromLocalStorage();
      if (localUser) {
        console.log('localUser is: ', localUser);
        this.setState({
          route: 'home',
          isSignedIn: true
        });
        this.props.loginUser({
          user: { ...localUser.user}
        });
      }
    }
  }

  componentWillUnmount() {
    console.log('component unmounted');
    this._isMounted = false;
  }

  handleScroll = () => {
    const element = document.getElementById('scrollElement');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (ev) => {
    this.setState({ input: ev.target.value })
  }

  onPictureSubmit = async () => {
    await this.setState({ imageUrl: this.state.input });
    if (this.state.imageUrl) {
      console.log('image url added: ', this.state.imageUrl)
      this.handleScroll();

      try {
        const imgPostBody = {
          input: this.state.input
        }
        const faceImageData = await callUserApi('imageurl', 'post', imgPostBody);
        if (faceImageData) {
          const userUpdateBody = {
            id: this.props.userState.id,
          }
          const userEntriesData = await callUserApi('image', 'put', userUpdateBody);
          if (userEntriesData) {
            this.props.setUserEntries(userEntriesData.entries);
          }
          this.displayFaceBox(this.calculateFaceLocation(faceImageData));
        }
      } catch (err) {
        console.error('Cannot upload image to server: ', err)
      }
    }
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
      this.props.logoutUser();
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    const { route, isSignedIn, box, imageUrl } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          options={particleOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        {route === 'home'
          ? <div className="mb-10">
            <Logo />
            {/* <Rank name={this.state.user.name} entries={this.state.user.entries} /> */}
            <Rank name={this.props.userState.name} entries={this.props.userState.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
            <FaceRecognition id="faceRecognition" box={box} imageUrl={imageUrl} />
            <div id="scrollElement" style={{ height: 400 }} />
          </div>
          :
          (route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { userState: state.user.user }
};

const mapDispatchToProps = dispatch => {
  return {
    // getUserFromLocalStorage: () => dispatch(getUserFromLocalStorage()),
    loginUser: state => dispatch(loginUser(state)),
    setUserEntries: state => dispatch(setUserEntries(state)),
    logoutUser: () => dispatch(logoutUser()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

