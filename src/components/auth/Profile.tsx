import { connect } from 'react-redux'
import React, { Component } from 'react'
import { RootState } from '../../store/reducers/rootReducer'
import { editProfile } from '../../store/actions/authActions'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction, compose } from 'redux'
import { IEditProfileParams } from '../../interfaces/authInterfaces'
import ErrorMessage from '../layout/ErrorMessage';
import { RouteComponentProps } from 'react-router-dom'
import { firestoreConnect } from 'react-redux-firebase'


interface ProfileProps extends RouteComponentProps {
    name: string,
    username: string,
    email: string,
    profilePic: any,
    userId: string,
    editProfile(data: IEditProfileParams): void,
    usersList: {
        email: string,
        password: string,
        name: string,
        profilePic: any,
        username: string
    }[]
}

type ProfileState = {
    name: string,
    username: string,
    email: string,
    profilePic: any,
    newProfilePic: any
}

class Profile extends Component<ProfileProps, ProfileState>  {

    state = {
        name: '',
        username: '',
        email: '',
        profilePic: '',
        newProfilePic: ''
    }

    editRef = React.createRef<HTMLDivElement>();
    userNameRef = React.createRef<HTMLInputElement>();
    userNameErrRef = React.createRef<HTMLSpanElement>();

    loadState = () => {
        this.setState({
            name: this.props.name,
            username: this.props.username,
            email: this.props.email,
            profilePic: this.props.profilePic
        })
    }

    componentDidMount() {
        this.loadState();
        setTimeout(() => {
            if (!this.props.userId) {
                this.props.history.push('/signin')
            }
        }, 5000);
    }

    componentDidUpdate(prevProps: ProfileProps) {
        if (prevProps !== this.props) {
            this.loadState();
        }
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

    handleChangePic = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newProfilePic: e.target.files
        })
    }

    handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let sameUser = this.props.usersList.filter(user => {
            return (
                user.username === this.state.username &&
                this.state.username !== this.props.username
            )
        })
        const newData = {
            name: this.state.name,
            username: this.state.username,
            profilePic: this.state.newProfilePic
        }

        if (!sameUser.length) {
            this.props.editProfile(newData);
            if (this.editRef.current) {
                this.editRef.current.style.display = 'none';
            }
        } else if (this.userNameRef.current && this.userNameErrRef.current){
            this.userNameRef.current.style.borderColor = '#FF0000';
            this.userNameErrRef.current.style.display = 'inline';
        }
    }

    handleClick = () => {
        if (this.editRef.current?.style.display === 'block') {
            this.editRef.current.style.display = 'none';
        } else if (this.editRef.current) {
            this.editRef.current.style.display = 'block';
        }
    }

    render() {
        if (!this.props.userId) {
            return (
                <ErrorMessage text="Oops...you need an account to visit this page." />
            )
        }
        return (
            <main>
                <section className="profile-page">
                    <div className="container">
                        <div className="profile">
                            <div className="profile-pic-wrapper">
                                <img src={this.props.profilePic} alt="Profile"/>
                            </div>
                            <div className="profile-info">
                                <ul>
                                    <li>Username: <strong>{this.props.username}</strong></li>
                                    <li>Name: {this.props.name}</li>
                                    <li>Email: {this.props.email}</li>
                                </ul>
                            </div>
                            <i className="fas fa-edit edit-profile-btn" onClick={this.handleClick}></i>
                        </div>
                        <div ref={this.editRef} className="edit-profile">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="profileName">Name</label>
                                    <input type="text" className="form-control" id="profileName" 
                                    value={this.state.name ? this.state.name : ''} onChange={this.handleChangeName} required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="profileUserName">Username</label>
                                    <input ref={this.userNameRef} type="text" className="form-control" id="profileUserName" 
                                    value={this.state.username ? this.state.username : ''} pattern="[a-zA-z0-9]{5,}" onChange={this.handleChangeUserName} required/>
                                    <small>Username should be unique. (Only english letters and numbers - minimum 5)</small><br/>
                                    <span className="username-error" ref={this.userNameErrRef}>Username already in use. Try something else.</span>
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="profilePic">Upload new profile picture</label>
                                    <input type="file" className="form-control-file" id="profilePic" onChange={this.handleChangePic} />
                                </div>
                                <div className="form-group text-center">
                                    <button className="save-profile-btn" type="submit">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        )
    }
}



const mapStateToProps = (state: RootState) => {
    return {
        name: state.firebase.profile.name,
        username: state.firebase.profile.username,
        email: state.firebase.profile.email,
        profilePic: state.firebase.auth.photoURL,
        userId: state.firebase.auth.uid,
        usersList: state.firestore.ordered.users
    }
}


const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        editProfile: (data:IEditProfileParams) => dispatch(editProfile(data))
    }
}

export default compose<React.ComponentClass>(
    firestoreConnect([{collection: 'users'}]),
    connect(mapStateToProps, mapDispatchToProps)
)(Profile)
