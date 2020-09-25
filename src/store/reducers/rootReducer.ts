import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import appReducer from './appReducer'


export const rootReducer = combineReducers({
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    app: appReducer
})


export type RootState = ReturnType<typeof rootReducer>