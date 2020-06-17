import React from "react";
import "./w3.css";
import {API_MEDIA_URL} from "./constants.js";
import API_URL from "./constants.js";
import axios from "axios";
import CommentTemplate from "./CommentTemplate.js";

class PostTemplate extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			showComments : false,
			comments : [],
			comment_fetch_error : undefined,
			showNewCommentForm : false,
			message : '',
			message_error : undefined,
			post_error : undefined,
		};
	}

	fetchComments = () => {
		axios.get(API_URL + "posts/" + this.props.post.id + "/").then(
			(response) => {
					this.setState({comments : response.data})
			}

		).catch(
			(error) => {
				this.setState({comment_fetch_error : "Error at API endpoint to fetch comments"})
			}

		);
	};

	onShowCommentButtonClick = (ev) => {
		this.toggleCommentsPanel();
		this.fetchComments();
	};

	toggleCommentsPanel = () => {
		this.setState({showComments : !this.state.showComments});
		//clear fetch_comment error before closing and opening. always call this methode before fetching comments else error will be washed away
		this.setState({comment_fetch_error : undefined});
	};

	toggleNewCommentForm = () => {
		this.setState({showNewCommentForm : !this.state.showNewCommentForm});
		//clear all fields/errors before showing new form or after closing form to avoid previous data
		this.setState({
			message : '',
			message_error : undefined,
			post_error :undefined
		});
	}

	onInputChange = (ev) => {
		let name, value;
		name = ev.target.name;
		value = ev.target.value;
		this.setState({[name] : value});
	};

	onFormSubmit = (ev) => {
		ev.preventDefault();
		if (sessionStorage.getItem("api_token")){
			this.createComment();
		}
		else{
			this.setState({post_error : "Please Log in first"});
		}
	};

	createComment = () => {
		let form_data = new FormData();
		form_data.append("message", this.state.message);
		let form_params = {
			headers : {
				"authorization" : "Token " + sessionStorage.getItem("api_token")
			}
		};
		axios.post(API_URL + "posts/" + this.props.post.id + "/", form_data, form_params).then(

			() => {
				this.toggleNewCommentForm();
				this.fetchComments();
			}
		).catch(
			(error) => {
				let message_error, post_error;
				
				if (error.response){	//if response returned of error
					//message error
					if (error.response.data.message){
						message_error = error.response.data.message[0];
					}
					//general comment creation error
					if (error.response.data.detail){
						post_error = error.response.data.detail;
					}
				}
				else{	//if no response returned means api endpoint error
					post_error = "Error at API endpoint in creating comment";
				}

				this.setState({
					message_error : message_error,
					post_error : post_error
				});
			}
		);
	};

	render(){

		let post = this.props.post;
		return (
			<div className="w3-card-4 w3-panel w3-leftbar w3-margin w3-border-dark-grey w3-light-grey">
				<div className="w3-panel w3-dark-grey w3-text-white" >
					<span className="w3-left" >
						Created by : {post.created_by.username} 
					</span>
					<span className="w3-right">
						Created on : {post.created_on_humanized}
					</span>
				</div>
				<div>
					<span class="w3-xlarge w3-text-dark-grey">❝</span>
					<div class="w3-text-dark-grey">{ post.message }</div>
					<span class="w3-xlarge w3-text-dark-grey">❞</span>
				</div>
				<PostFileAttachment file={post.file} />
				<div className="w3-margin-bottom">
					<button className="w3-button w3-padding-small w3-small w3-round w3-light-grey w3-border w3-border-dark-grey"
						onClick={this.onShowCommentButtonClick} >
						{!this.state.showComments ? "Show comments" : "Hide comments"}
					</button>
				</div>
				<div className={this.state.showComments ? "w3-show" : "w3-hide"} >
					<div className="w3-margin">
						<button className="w3-button w3-dark-grey w3-round-large w3-tiny" 
								onClick={this.toggleNewCommentForm} >
							New comment
						</button>

						<div className="w3-text-red">{this.state.comment_fetch_error}</div>
						
						<div className="w3-margin">
							{this.state.comments.length===0 ? (<i>{"No comments created"}</i>) : null}
							{this.state.comments.map((comment) => (<CommentTemplate key={comment.id} comment={comment} />))}
							
						</div>

						{/* modal form for new comment */}
						<div className={this.state.showNewCommentForm ? "w3-show" : "w3-hide"}>
							<div className="w3-modal w3-block w3-center" >
								<div className="w3-modal-content w3-animate-top w3-card-4" >
									<header className="w3-container w3-dark-grey" >
										<h3 className="w3-text-white">Create New Comment</h3>
										<span onClick={this.toggleNewCommentForm} className="w3-button w3-display-topright" >
											&times;
										</span>
									</header>
									<div className="w3-container  w3-text-dark-grey" >
										<form onSubmit={this.onFormSubmit}>
											<div>
												<span className="w3-text-red">{this.state.post_error}</span> 
											</div>
											<div>
												<span className="w3-vertical-align-middle">Message</span>
												<textarea rows="5" className="w3-form-element w3-width-60 w3-vertical-align-middle" name="message" value={this.state.message} onChange={this.onInputChange}  />
												<span className="w3-text-red">{this.state.message_error}</span>
											</div>
											<button className="w3-button w3-form-element w3-round-large w3-dark-grey" type="submit" >Post</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function PostFileAttachment(props){
	//if not file 
	if (!props.file){
		return null;
	}
	//if file is image png or jpg
	else if(props.file.toLowerCase().slice(-4) === ".png" || props.file.toLowerCase().slice(-4) === ".jpg" || props.file.toLowerCase().slice(-5) === ".jpeg"){
		return (
				<div className="w3-margin">
					<img src={API_MEDIA_URL + props.file} alt="imagefile" width="300" height="300" />
				</div>
			);
	}
	//if file is video mp4
	else if (props.file.toLowerCase().slice(-4) === ".mp4"){
		return (
				<div className="w3-margin">
					<video width="320" height="240" controls >
						<source src={API_MEDIA_URL + props.file} type="video/mp4" />
						{"Your browser does not support video tag"}
					</video>
				</div>
			);
	}
	//if file is not img or video
	else{
		return (
			<div className="w3-text-dark-grey w3-margin">
				Attachment : <a href={API_MEDIA_URL + props.file} >file</a>
			</div>
		);
	}
}


export default PostTemplate;