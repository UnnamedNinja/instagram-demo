import React, { Component } from 'react'
import { signUp } from '../../store/actions/authActions'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, compose } from 'redux'
import { connect } from 'react-redux'
import { RootState } from '../../store/reducers/rootReducer'
import { Redirect, RouteComponentProps } from "react-router";
import { firestoreConnect } from 'react-redux-firebase'


type SignUpState = {
    email: string,
    password: string,
    name: string,
    profilePic: any,
    username: string
}

interface SignUpProps extends RouteComponentProps {
    signUp: (creds: SignUpState) => void,
    userId: string,
    usersList: {
        email: string,
        password: string,
        name: string,
        profilePic: any,
        username: string
    }[],
    app: {
        authError: {
            message: string
        }
    }
}

class SignUp extends Component<SignUpProps, SignUpState> {

    state = {
        email: '',
        password: '',
        name: '',
        profilePic: '',
        username: ''
    }

    userNameRef = React.createRef<HTMLInputElement>();
    userNameErrRef = React.createRef<HTMLSpanElement>();

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
    handleChangeName = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: e.target.value
        })
    }
    handleChangeUserName = (e:React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        value = value.replace(/[^a-z0-9]/g, '')
        
        this.setState({
            username: value
        })
    }
    handleSubmit = (e:any) => {
        e.preventDefault();
        let sameUser = this.props.usersList.filter(user => user.username === this.state.username)

        if (!sameUser.length) {
            this.props.signUp(this.state);
        } else if (this.userNameRef.current && this.userNameErrRef.current){
            this.userNameRef.current.style.borderColor = '#FF0000';
            this.userNameErrRef.current.style.display = 'inline';
        }
    }
    handleChooseFile = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            profilePic: e.target.files
        })
    }

    render() {
        if ( this.props.userId ) {
            return <Redirect to="/"/>
        }
        return (
            <main>
                <div className="container">
                    <section className="sign-up">
                        <h2 className="text-center mb-4">Create account</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" onChange={this.handleChangeEmail} required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" 
                                onChange={this.handleChangePassword} pattern="[a-zA-z0-9]{6,}" required/>
                                <small>At least 6 symbols.</small>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input ref={this.userNameRef} type="text" className="form-control" id="username" value={this.state.username} 
                                onChange={this.handleChangeUserName} pattern="[a-zA-z0-9]{5,}" required/>
                                <small>Username should be unique. (Only english letters and numbers - minimum 5)</small><br/>
                                <span className="username-error" ref={this.userNameErrRef}>Username already in use. Try something else.</span>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="form-control" id="name" onChange={this.handleChangeName} required/>
                            </div>
                            <div className="input-file input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="ml-2 fas fa-arrow-right"></i></span>
                                </div>
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="profilePic" onChange={this.handleChooseFile} required/>
                                    <label className="custom-file-label" htmlFor="profilePic">Profile pic</label>
                                </div>
                            </div>
                            <div className="text-center mb-3">
                                <button type="submit" className="btn btn-primary">Submit</button>
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
    console.log(state)
    return {
        userId: state.firebase.auth.uid,
        usersList: state.firestore.ordered.users,
        app: state.app
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        signUp: (creds:SignUpState) => dispatch(signUp(creds))
    }
}


export default compose<React.ComponentClass>(
    firestoreConnect([{collection: 'users'}]),
    connect(mapStateToProps, mapDispatchToProps)
)(SignUp)
