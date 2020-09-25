import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, compose, applyMiddleware } from 'redux';
import fbConfig from './config/fbConfig'
import { rootReducer } from './store/reducers/rootReducer'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider} from 'react-redux-firebase'
import { reduxFirestore, createFirestoreInstance } from 'redux-firestore'
import firebase from 'firebase/app'
import "firebase/database";
import './css/posts.css'
import './css/nav.css'
import './css/auth.css'
import './css/main.css'
import './css/media.css'

firebase.initializeApp(fbConfig);

const store = createStore(rootReducer,
  compose(
      applyMiddleware(thunk),
      reduxFirestore(firebase)
  )
)


// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
  enableRedirectHandling: false,
  resetBeforeLogin: false
}



const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}


ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
