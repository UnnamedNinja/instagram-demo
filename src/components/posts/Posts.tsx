import 'firebase/firestore';
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { RootState } from '../../store/reducers/rootReducer';
import { Redirect } from "react-router-dom";
import Post from './Post'


type PostsProps = {
    posts: {
        id: string,
        picture: any, 
        description: string,
        authorPic: any,
        author: string,
        liked: string[],
        comments: {comment: string, author: string}[],
        createdAt: any
    }[],
    userId: string
}

type PostsState = {
    showMore: boolean
}

class Posts extends Component <PostsProps, PostsState> {

    state = {
        showMore: false
    }

    showMoreRef = React.createRef<HTMLButtonElement>();

    showMore = () => {
        this.setState({
            showMore: true
        })
        
        if (this.showMoreRef.current) {
            this.showMoreRef.current.style.display = 'none';
        }
    }
    render() {
        if (!this.props.userId) {
            return (
                <Redirect to="/signin"/>
            )
        }
        return (
            <main>
                <section className="posts">
                    <div className="container">
                        { this.props.posts && this.props.posts.map((post, index) => {
                            let postProps = {
                                post: post,
                                userId: this.props.userId
                            }
                            if (this.state.showMore === false && index > 2) {
                                return null
                            } else {
                                return (
                                    <Post key={post.id} {...postProps} />
                                )
                            }
                            
                        })}
                        <div className="text-center">
                            <button ref={this.showMoreRef} className="show-more-btn mb-5" onClick={this.showMore}>Show more</button>
                        </div>
                    </div>
                </section>
            </main>
        )
    }
}


const mapStateToProps = (state: RootState) => {
    return {
        posts: state.firestore.ordered.posts,
        userId: state.firebase.auth.uid,
    }
}


export default compose<React.ComponentClass>(
    firestoreConnect([
        {collection: 'posts', orderBy: ['createdAt', 'desc']}
    ]),
    connect(mapStateToProps)
)(Posts)
