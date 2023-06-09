import React from 'react';
import { connect } from 'react-redux';
import ReactSnackBar from "react-js-snackbar";
import { callUserApi } from '../../api/api';
import '../../styles/loadingSpinner.css';
import { loginUser } from '../../store/user/userSlice';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    //this.wrapper = React.createRef();
    this.state = {
      email: '',
      password: '',
      Show: false,
      Showing: false,
      snackbarMessage: '',
      formError: {
        email: '',
        password: '',
      },
      isLoading: false,
    }
  }

  show = () => {
    if (this.state.Showing) return;

    this.setState({ Show: true, Showing: true });
    setTimeout(() => {
      this.setState({ Show: false, Showing: false });
    }, 2000);
  };

  onEmailChange = (event) => {
    this.setState({ email: event.target.value })
  }

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value })
  }

  clearFormErrors = () => {
    this.setState({
      formError: {
        email: '',
        password: ''
      }
    });
  }

  validateForm = () => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let isValid = true;
    let tempFormError = {
      email: '',
      password: ''
    }

    if (!this.state.email.match(emailRegex)) {
      // console.log('email wrong');
      tempFormError.email = 'Please provide a valid email address';
      isValid = false;
    } else if (this.state.email === '') {
      tempFormError.email = 'Email field cannot be empty';
    } else {
      tempFormError.email = '';
    }
    if (this.state.password === '' || this.state.password.length < 3 || this.state.password.includes(' ')) {
      // console.log('password wrong');
      tempFormError.password = 'Min. 3 characters, no space';
      isValid = false;
    } else {
      tempFormError.password = '';
    }

    if (!isValid) {
      this.setState({
        formError: {
          ...tempFormError
        },
      });
    }
    // console.log('validation is: ', isValid)
    return isValid;
  };

  onSubmitSignIn = async (event) => {
    event.preventDefault();
    this.clearFormErrors();
    const isFormValid = this.validateForm();
    if (isFormValid) {
      try {
        this.setState({ isLoading: true });
        const postBody = {
          email: this.state.email,
          password: this.state.password
        }
        const loginData = await callUserApi('login', 'post', postBody);
        // console.log('loginData is: ', loginData);
        if (!loginData.success) {
          loginData?.error?.name || loginData?.error?.password
            ? this.snackbarMessage = 'Please don\'t use \'<\' or \'>\' characters'
            : this.snackbarMessage = 'Invalid credentials!';
          this.show()
        } else if (loginData.user.id) {
          // this.props.loadUser(loginData.user);
          this.props.loginUser({
            user: loginData.user
          });
          this.props.onRouteChange('home');
        }
        this.setState({ isLoading: false });
      } catch (err) {
        this.setState({ isLoading: false });
        console.error('Cannot get user info from server, ', err);
      }
    }
  }


  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br4 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <form className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Login</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email">Email</label>
                <input className={`${this.state.formError.email !== '' && 'ba b--dark-red'} pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100`}
                  type="email"
                  autoComplete="current-email"
                  onChange={this.onEmailChange}
                />
                <p className="red f7 tl">{this.state.formError.email}</p>
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password" type="password">Password</label>
                <input className={`${this.state.formError.password !== '' && 'ba b--dark-red'} b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100`}
                  type="password"
                  autoComplete="current-password"
                  onChange={this.onPasswordChange}
                />
                 <p className="red f7 tl">{this.state.formError.password}</p>
              </div>
            </fieldset>
            <div className="flex justify-center">
              {this.state.isLoading ? (
                <div className="loading-spinner" />
              ) : (
              <button
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit">
                  Login
                </button>
              )}
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => onRouteChange('register')}
                className="f6 link dim black db pointer">Registration
              </p>
            </div>
          </form>
          <ReactSnackBar Icon={<span>🚷</span>} Show={this.state.Show}>
            {this.snackbarMessage}
          </ReactSnackBar>
        </main>
      </article>
    )
  }
}

const mapDispatchToProps = dispatch => {
    return {
        loginUser: state => dispatch(loginUser(state))
    }
};

export default connect(null, mapDispatchToProps)(Signin);
