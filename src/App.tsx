import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Profile from './components/auth/Profile';
import Posts from './components/posts/Posts';
import Navbar from './components/layout/Navbar'
import AddPost from './components/posts/AddPost'


function App() {
  return (
    <div className="App">
      <Router>
        <Route component={Navbar} />
        <Switch>
            <Route exact path="/" component={Posts}/>
            <Route path="/signin" component={SignIn}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/profile" component={Profile}/>
            <Route path="/add-post" component={AddPost}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
