import React, { Component } from 'react'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { addPost } from '../../store/actions/postsActions'
import { RouteComponentProps } from "react-router-dom";
import ErrorMessage from '../layout/ErrorMessage';
import { RootState } from '../../store/reducers/rootReducer'


type AddPostState = {
    description: string,
    picture: any
}

interface AddPostProps extends RouteComponentProps {
    addPost: (data: AddPostState) => void,
    userId: string
}


class AddPost extends Component <AddPostProps, AddPostState> {

    state = {
        description: '',
        picture: null
    }

    componentDidMount() {
        setTimeout(() => {
            if (!this.props.userId) {
                this.props.history.push('/signin')
            }
        }, 5000);
    }

    handleChangeDescription = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            description: e.target.value
        })
    }

    handleChooseFile = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            picture: e.target.files
        })
    }

    handleSubmit = (e:any) => {
        e.preventDefault()
        this.props.addPost(this.state)
        this.props.history.push('/')
    }

    render() {
        if (!this.props.userId) {
            return (
                <ErrorMessage text="Oops...you need an account to visit this page." />
            )
        }
        return (
            <main>
                <div className="container">
                    <section className="add-post">
                    <h2 className="text-center mb-4">Add a new post</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea className="form-control" id="description" onChange={this.handleChangeDescription}/>
                            </div>
                            <div className="input-file input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="ml-2 fas fa-arrow-right"></i></span>
                                </div>
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="profilePic" onChange={this.handleChooseFile} required/>
                                    <label className="custom-file-label" htmlFor="profilePic">Image</label>
                                </div>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        )
    }
}


const mapStateToProps = (state: RootState) => {
    return {
        userId: state.firebase.auth.uid
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        addPost: (data: AddPostState) => dispatch(addPost(data))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AddPost)
