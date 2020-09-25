import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore';
import 'firebase/storage';
import { 
    USER_AUTH_ERROR,
    ISignInParams, 
    ISignUpParams,
    IEditProfileParams } from '../../interfaces/authInterfaces'
import { RootState } from '../reducers/rootReducer'
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'



export const signUp = (creds: ISignUpParams): ThunkAction<void, RootState, any, Action<string>> => {
    return (dispatch) => {
        firebase.auth().createUserWithEmailAndPassword(creds.email, creds.password)
            .then(() => {
                firebase.storage().ref('users/' + firebase.auth().currentUser?.uid + '/profilePic').put(creds.profilePic[0])
                .then(response => {
                    firebase.storage().ref(response.metadata.fullPath).getDownloadURL()
                        .then(imgUrl => {
                            firebase.auth().currentUser?.updateProfile({
                                photoURL: imgUrl,
                                displayName: creds.username
                            })
                            .then(() => {
                                firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).set({
                                    name: creds.name,
                                    email: creds.email,
                                    createdAt: new Date(),
                                    username: creds.username,
                                    profilePic: imgUrl
                                })
                                .then(() => {
                                    window.location.reload(false);
                                })
                            })
                        })
                        
                })
            })
            .catch((err) => {
                dispatch({type: USER_AUTH_ERROR, err})
            })
    }
}


export const signIn = (creds: ISignInParams): ThunkAction<void, RootState, any, Action<string>> => {
    return (dispatch) => {
        firebase.auth().signInWithEmailAndPassword(creds.email, creds.password)
            .catch((err) => {
                dispatch({type: USER_AUTH_ERROR, err})
            })
    }
}



export const facebookSignIn = (): ThunkAction<void, RootState, any, Action<string>> => {
    return (dispatch) => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                if (result.user && result.additionalUserInfo?.isNewUser) {
                    firebase.firestore().collection("users").doc(result.user.uid).set({
                        email: result.user.email,
                        username: result.user.displayName,
                        name: result.user.displayName,
                        createdAt: new Date(),
                        profilePic: result.user.photoURL
                    })
                }
            })
            .catch((err) => {
                dispatch({type: USER_AUTH_ERROR, err})
            });
    }
}

export const googleSignIn = (): ThunkAction<void, RootState, any, Action<string>> => {
    return (dispatch) => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                if (result.user && result.additionalUserInfo?.isNewUser) {
                    firebase.firestore().collection("users").doc(result.user?.uid).set({
                        email: result.user.email,
                        username: result.user.displayName,
                        name: result.user.displayName,
                        createdAt: new Date(),
                        profilePic: result.user.photoURL
                    })
                }
            })
            .catch((err) => {
                dispatch({type: USER_AUTH_ERROR, err})
            });
    }
}


export const signOut = (): ThunkAction<void, RootState, any, Action<string>> => {
    return (dispatch) => {
        firebase.auth().signOut()
            .catch((err) => {
                dispatch({type: USER_AUTH_ERROR, err})
            })
    }
}


export const editProfile = (data: IEditProfileParams):ThunkAction<void, RootState, any, Action<string>> => {
    return (dispatch) => {
        const userId =  firebase.auth().currentUser?.uid;
        firebase.firestore().collection('users').doc(userId).update({
            name: data.name,
            username: data.username
        })
        .then(() => {
            firebase.auth().currentUser?.updateProfile({
                displayName: data.username
            })
        })
        .then(() => {
            if (data.profilePic) {
                firebase.storage().ref('users/' + userId + '/profilePic').put(data.profilePic[0])
                .then(response => {
                    firebase.storage().ref(response.metadata.fullPath).getDownloadURL()
                        .then(imgUrl => {
                            firebase.auth().currentUser?.updateProfile({
                                photoURL: imgUrl
                            })
                            .then(() => {
                                firebase.firestore().collection('users').doc(userId).update({
                                    name: data.name,
                                    username: data.username,
                                    profilePic: imgUrl
                                })
                                .then(() => {
                                    window.location.reload(false);
                                })
                            })
                        })
                })
            }
        })
        .catch((err) => {
            dispatch({type: USER_AUTH_ERROR, err})
        })
    }
}