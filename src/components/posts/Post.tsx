import 'firebase/firestore';
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { RootState } from '../../store/reducers/rootReducer';
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { Link } from "react-router-dom";
import { addLike, addComment, deletePost } from '../../store/actions/postsActions'
import moment from 'moment'


type PostProps = {
    post: {
        id: string,
        picture: any, 
        description: string,
        authorPic: any,
        author: string,
        liked: string[],
        comments: {comment: string, author: string}[],
        createdAt: any
    },
    users: {
        id: string,
        email: string,
        name: string,
        username: string,
        createdAt: any,
        profilePic: string
    }[],
    username: string,
    userId: string,
    addLike: (id: string) => void,
    addComment: (id: string, comment: string, username: string) => void,
    deletePost: (postId: string) => void
}

type PostState = {
    comment: string
}

class Posts extends Component <PostProps, PostState> {

    state = {
        comment: ''
    }


    handleSubmit = (postId: string, e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (this.state.comment) {
            this.props.addComment(postId, this.state.comment, this.props.userId)
            e.currentTarget.reset();
        }
    }

    handleChangeComment= (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            comment: e.target.value
        })
    }
    handleDeletePost = (postId: string, e:React.MouseEvent<HTMLAnchorElement>) => {
        this.props.deletePost(postId)
    }
    getAuthorName = (authorId: string):string => {
        let authorName = '';

        this.props.users?.forEach((user) => {
            if (user.id === authorId) {
                authorName = user.username
            }
        })
        return authorName
    }
    getAuthorPic = (authorId: string):string => {
        let authorPic = '';

        this.props.users?.forEach((user) => {
            if (user.id === authorId) {
                authorPic = user.profilePic
            }
        })
        return authorPic
    }
    render() {
        return (
            <div key={this.props.post.id} className="post">
                <div className="post-header">
                    <div className="author">
                        <div className="author-pic-wrapper">
                            <img src={this.getAuthorPic(this.props.post.author)} alt="profile" />
                        </div>
                        <span className="author-username">{this.getAuthorName(this.props.post.author)}</span>
                    </div>
                    { this.props.userId === this.props.post.author &&  
                        <Link 
                            to="/" 
                            className="delete-post-btn text-danger" 
                            onClick={(e) => this.handleDeletePost(this.props.post.id, e)}>
                                <i className="fas fa-trash-alt mr-2"></i>
                        </Link>
                    }
                </div>
                <div className="post-content">
                    <div className="post-pic-wrapper">
                        <img src={this.props.post.picture} alt="post"/>
                    </div>
                    { this.props.post.description && <p className="post-description">{this.props.post.description}</p> }
                </div>
                <div className="post-footer">
                    <div className="response">
                        <span 
                            style={this.props.post.liked.includes(this.props.userId) ? {color: '#ed4956'} : {color: 'white', WebkitTextStroke: '2px black'}} 
                            onClick={() => this.props.addLike(this.props.post.id)} 
                            className="fas fa-heart mr-2">
                        </span>
                        <span className="number-of-likes">{this.props.post.liked.length} like(s)</span>
                        <span className="created-at">{moment(this.props.post.createdAt.toDate()).fromNow()}</span>
                    </div>
                    <div>
                        <ul className="comments-list">
                            { this.props.post.comments && this.props.post.comments.map((comment,index) => {
                                return (
                                    <li key={index}>
                                        <strong className="mr-1">{this.getAuthorName(comment.author)}</strong>{comment.comment}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="add-comment">
                        <form className="add-comment-form" onSubmit={(e) => this.handleSubmit(this.props.post.id, e)}>
                            <input className="form-control" placeholder="Add a comment..." onChange={this.handleChangeComment} />
                            <button type="submit">Post</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state: RootState) => {
    return {
        username: state.firebase.auth.displayName,
        users: state.firestore.ordered.users
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        addLike: (id: string) => dispatch(addLike(id)),
        addComment: (id: string, comment: string, username: string) => {
            return dispatch(addComment(id, comment, username))
        },
        deletePost: (postId: string) => dispatch(deletePost(postId))
    }
}

export default compose<React.ComponentClass>(
    firestoreConnect([
        {collection: 'users'}
    ]),
    connect(mapStateToProps, mapDispatchToProps)
)(Posts)
