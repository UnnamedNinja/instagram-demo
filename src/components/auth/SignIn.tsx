import React, { Component } from 'react'
import { signIn, facebookSignIn, googleSignIn } from '../../store/actions/authActions'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../store/reducers/rootReducer'
import { Redirect } from "react-router";


type SignInState = {
    email: string,
    password: string
}

interface SignInProps {
    signIn: (creds: SignInState) => void,
    facebookSignIn: () => void,
    googleSignIn: () => void,
    userId: string,
    app: {
        authError: {
            message: string
        }
    }
}

class SignIn extends Component<SignInProps, SignInState> {

    state = {
        email: '',
        password: ''
    }

    handleChangeEmail = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            email: e.target.value
        })
    }
    handleChangePassword = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            password: e.target.value
        })
    }
    handleSubmit = (e:any) => {
        e.preventDefault();
        this.props.signIn(this.state);
    }


    render() {
        if ( this.props.userId ) {
            return <Redirect to="/"/>
        }
        return (
            <main>
                <div className="container">
                    <section className="sign-in">
                        <h2 className="text-center">Sign in</h2>
                        <div className="social-btns text-center">
                            <i className="fab fa-facebook-square" onClick={this.props.facebookSignIn}></i>
                            <i className="fab fa-google-plus-square" onClick={this.props.googleSignIn}></i>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" onChange={this.handleChangeEmail} required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" 
                                onChange={this.handleChangePassword} pattern="[A-Za-z0-9]{6,}" required/>
                            </div>
                            <div className="text-center mb-3">
                                <button type="submit" className="btn btn-primary">Sign in</button>
                            </div>
                            <p className="text-center text-danger">{ this.props.app.authError && this.props.app.authError.message}</p>
                        </form>
                    </section>
                </div>
            </main>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        userId: state.firebase.auth.uid,
        app: state.app
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        signIn: (creds:SignInState) => dispatch(signIn(creds)),
        facebookSignIn: () => dispatch(facebookSignIn()),
        googleSignIn: () => dispatch(googleSignIn())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
