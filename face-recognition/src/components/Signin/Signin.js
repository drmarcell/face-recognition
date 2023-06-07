import React from 'react';
import ReactSnackBar from "react-js-snackbar";

class Signin extends React.Component {
    constructor(props) {
        super(props);
        //this.wrapper = React.createRef();
        this.state = {
            signInEmail: '',
            signInPassword: '',
            Show: false,
            Showing: false,
            snackbarMessage: '',
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
        this.setState({ signInEmail: event.target.value })
    }

    onPasswordChange = (event) => {
        this.setState({ signInPassword: event.target.value })
    }

    onSubmitSignIn = (event) => {
        event.preventDefault();
        fetch('https://face-recognition-1ziy.onrender.com/v1/user/login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
            .then(response => response.json())
            .then(resp => {
                if (resp?.user?.id) {
                    this.props.loadUser(resp.user);
                    this.props.onRouteChange('home');
                } else {
                    // alert('Invalid credentials.')
                    this.snackbarMessage = 'Invalid credentials!';
                    this.show()
                }
            })
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
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="email"
                                    autoComplete="current-email"
                                    onChange={this.onEmailChange}
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password" type="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={this.onPasswordChange}
                                />
                            </div>
                        </fieldset>
                        <div className="">
                            <input
                                onClick={this.onSubmitSignIn}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value="Login"
                            />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={() => onRouteChange('register')}
                                className="f6 link dim black db pointer">Registration
                            </p>
                        </div>
                    </form>
                    <ReactSnackBar Icon={<span>🚷</span>} Show={this.state.Show}>
                        { this.snackbarMessage }
                    </ReactSnackBar>
                </main>
            </article>
        )
    }
}

export default Signin;
