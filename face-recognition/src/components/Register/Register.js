import React from 'react';
import ReactSnackBar from "react-js-snackbar";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            Show: false,
            Showing: false,
            snackbarMessage: '',
            snackbarIcon: '❌',
            formError: {
                name: '',
                email: '',
                password: ''
            }
        }
    }

    show = () => {
        if (this.state.Showing) return;

        this.setState({ Show: true, Showing: true });
        setTimeout(() => {
            this.setState({ Show: false, Showing: false });
        }, 2000);
    };

    onNameChange = (event) => {
        this.setState({ name: event.target.value })
    }

    onEmailChange = (event) => {
        this.setState({ email: event.target.value })
    }

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    validateForm = () => {
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        let isValid = true;
        let tempFormError = {
            name: '',
            email: '',
            password: ''
        }

        if (this.state.name === '' || this.state.name.length < 3 || this.state.name.includes('  ')) {
            console.log('name wrong');
            tempFormError.name = 'Min. 3 characters, max 1 space at once';
            isValid = false;
        } else {
            tempFormError.name = '';
        }
        if (!this.state.email.match(emailRegex)) {
            console.log('email wrong');
            tempFormError.email = 'Please provide a valid email address';
            isValid = false;
        } else {
            tempFormError.email = '';
        }
        if (this.state.password === '' || this.state.password.length < 3 || this.state.password.includes(' ')) {
            console.log('password wrong');
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
        console.log('validation is: ', isValid)
        return isValid;
    };

    onSubmitRegister = (event) => {
        event.preventDefault();
        const isFormValid = this.validateForm();
        if (isFormValid) {
            fetch('https://face-recognition-phy5.onrender.com/v1/user/register', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        }).then(response => response.json())
            .then(resp => {
                if (resp.error) {
                    console.log('error occured')
                    resp.error === 'occupied'
                        ? this.snackbarMessage = 'The given email is already in use!'
                        : resp.error === 'failed'
                        ? this.snackbarMessage = 'Registration was unsuccessful!'
                        : this.snackbarMessage = '';
                    this.snackbarIcon = '❌';
                    this.show();
                    return;
                }
                if (resp.user.id) {
                    this.snackbarMessage = 'Registration was successful!';
                    this.snackbarIcon = '✅';
                    this.show();
                    setTimeout(() => {
                        this.props.loadUser(resp.user);
                        this.props.onRouteChange('home');
                    }, 2200);
                }
            })
        }
    }

    render() {
        return (
            <article className="br4 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <form className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Registration</legend>
                            <label className="db fw6 lh-copy f5" htmlFor="pleaseuse">Please use <span className='b underline'>NON existing/fake</span> email and password.</label>
                            <label className="db fw6 lh-copy f5" htmlFor="advice">You can log in with the given credentials.</label>
                            <div className="mt3" style={{ width: '94%' }}>
                                <label style={{ marginLeft: 10 }} className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input className={`${this.state.formError.name !== '' && 'ba b--dark-red'} pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100`}
                                    autoComplete="new-name"
                                    onChange={this.onNameChange}
                                />
                                <p className="red f7 tl">{this.state.formError.name}</p>
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input className={`${this.state.formError.email !== '' && 'ba b--dark-red'} pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100`}
                                    type="email"
                                    autoComplete="new-email"
                                    onChange={this.onEmailChange}
                                />
                                <p className="red f7 tl">{this.state.formError.email}</p>
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password" type="password">Password</label>
                                <input className={`${this.state.formError.password !== '' && 'ba b--dark-red'} pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100`}
                                    type="password"
                                    autoComplete="new-password"
                                    onChange={this.onPasswordChange}
                                />
                                <p className="red f7 tl">{this.state.formError.password}</p>
                            </div>
                        </fieldset>
                        <div className="">
                            <input
                                onClick={this.onSubmitRegister}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value="Registration"
                            />
                        </div>
                    </form>
                    <ReactSnackBar Icon={<span>{this.snackbarIcon}</span>} Show={this.state.Show}>
                        { this.snackbarMessage }
                    </ReactSnackBar>
                </main>
            </article>
        )
    }
}

export default Register;
