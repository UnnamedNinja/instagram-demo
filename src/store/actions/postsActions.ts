import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { RootState } from '../reducers/rootReducer'
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import {
    POST_ERROR,
    IAddPostParams
} from '../../interfaces/postsInterfaces'



export const addPost = (data: IAddPostParams): ThunkAction<void, RootState, any, Action<string>> => {
    return (dispatch) => {
        firebase.firestore().collection('posts').add({
            description: data.description,
            picture: null
        })
        .then(resp => {
            firebase.storage().ref(resp.path + '/picture').put(data.picture[0])
            .then(picture => {
                firebase.storage().ref(picture.metadata.fullPath).getDownloadURL()
                    .then(imgUrl => {
                        firebase.firestore().collection('posts').doc(resp.id).update({
                            picture: imgUrl,
                            author: firebase.auth().currentUser?.uid,
                            createdAt: new Date(),
                            liked: []
                        })
                    })
            })
        })
        .catch((err) => {
            dispatch({type: POST_ERROR, err})
        })
    }
}

export const deletePost = (postId: string): ThunkAction<void, RootState, any, Action<string>> => {
    return (dispatch) => {
        firebase.firestore().collection('posts').doc(postId).delete()
            .then(() => {
                firebase.storage().ref('posts/' + postId + '/picture').delete()
            })
            .catch((err) => {
                dispatch({type: POST_ERROR, err})
            })
    }
}



export const addLike = (id: string): ThunkAction<void, RootState, any, Action<string>> => {
    return (dispatch) => {
        const user = firebase.auth().currentUser?.uid;
        firebase.firestore().collection('posts').get()
            .then(resp => {
                let isLiked = false;
                resp.forEach(post => {
                    if (post.data().liked.includes(user) && post.id === id) {
                        isLiked = true;
                    }
                })
                return isLiked
            })
            .then((resp) => {
                if (resp) {
                    firebase.firestore().collection('posts').doc(id).update({
                        liked: firebase.firestore.FieldValue.arrayRemove(user)
                    })
                    .catch((err) => {
                        dispatch({type: POST_ERROR, err})
                    })
                } else {
                    firebase.firestore().collection('posts').doc(id).update({
                        liked: firebase.firestore.FieldValue.arrayUnion(user)
                    })
                    .catch((err) => {
                        dispatch({type: POST_ERROR, err})
                    })
                }
            })
    }
}


export const addComment = (postId: string, postComment: string, userId: string): ThunkAction<void, RootState, any, Action<string>> => {
    return (dispatch) => {
        firebase.firestore().collection('posts').doc(postId).update({
            comments: firebase.firestore.FieldValue.arrayUnion({comment: postComment, author: userId})
        })
        .catch((err) => {
            dispatch({type: POST_ERROR, err})
        })
    }
}

