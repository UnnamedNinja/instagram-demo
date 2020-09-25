import { connect } from 'react-redux';
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { signOut } from '../../store/actions/authActions';
import { RootState } from '../../store/reducers/rootReducer';

type NavbarProps = {
    history: {
        location: {
            pathname: string
        }
    },
    id: string,
    profilePic: any,
    signOut: () => void
}

class Navbar extends Component <NavbarProps> {

    postsLinkRef = React.createRef<HTMLAnchorElement>();

    handleClick = (e:React.MouseEvent<HTMLAnchorElement>):void => {
        let links = document.querySelectorAll('.nav-item');
        
        links.forEach(link => {
            link.classList.remove('active')
        })
        e.currentTarget.classList.add('active')
    }

    handleClickBrand = ():void => {
        this.postsLinkRef.current?.classList.add('active');
    }

    componentDidMount() {
        if (this.props.history.location.pathname !== '/') {
            this.postsLinkRef.current?.classList.remove('active')
        }
    }


    render() {
        return (
            <header>
                <nav className="navbar navbar-expand navbar-light" id="mainNav">
                    <div className="container">
                        <NavLink onClick={this.handleClickBrand} className="navbar-brand" to="/"><img src="/img/logo.png" alt="Navbar logo"/></NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav ml-auto">
                                { this.props.id ? (
                                    <>
                                        <NavLink onClick={this.handleClick} className="home nav-item nav-link" to="/" ref={this.postsLinkRef} title="Home" ><i className="fas fa-home mr-1"></i></NavLink>
                                        <NavLink onClick={this.handleClick} className="add-post-btn nav-item nav-link" to="/add-post" title="Add post"><i className="far fa-plus-square mr-3"></i></NavLink>
                                        <NavLink onClick={this.handleClick} className="mobile-profile nav-item nav-link" to="/profile" title="Profile"><img className="profile-img" src={this.props.profilePic} alt="Profile"/></NavLink>
                                        <NavLink className="mobile-logout-btn nav-item nav-link" to="/signin" onClick={() => this.props.signOut()}><i className="fas fa-door-open mr-1"></i></NavLink>
                                        <div className="nav-item dropdown profile-dropdown" title="Profile">
                                            { this.props.profilePic ? (
                                                <a className="text-dark"  id="dropdownMenuButton" data-toggle="dropdown" href="/">
                                                    <img className="profile-img" src={this.props.profilePic} alt="Profile"/>
                                                </a>
                                            ) : (null) }
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <NavLink className="dropdown-item" to="/profile" onClick={this.handleClick}><i className="far fa-user-circle mr-1"></i>Profile</NavLink>
                                                <NavLink className="dropdown-item logout-btn" to="/signin" onClick={() => this.props.signOut()}><i className="fas fa-door-open mr-1"></i>Logout</NavLink>
                                            </div>
                                        </div>
                                        
                                    </>
                                ) : (
                                    <>
                                        <NavLink onClick={this.handleClick} className="nav-item nav-link" to="/signin"><i className="fas fa-sign-in-alt mr-1"></i>Sign In</NavLink>
                                        <NavLink onClick={this.handleClick} className="nav-item nav-link" to="/signup"><i className="fas fa-user-plus mr-1"></i>Sign Up</NavLink>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}


const mapStateToProps = (state: RootState) => {
    return {
        id: state.firebase.auth.uid,
        profilePic: state.firebase.auth.photoURL
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        signOut: () => dispatch(signOut())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
