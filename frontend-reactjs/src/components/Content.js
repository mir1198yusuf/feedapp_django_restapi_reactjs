import React from "react";
import "./w3.css";
import API_URL from "./constants.js";
import axios from "axios";
import PostTemplate from "./PostTemplate.js";
import Pagination from "react-js-pagination";


class Content extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			showNewPostForm : false,
			message : '',
			file : null,
			message_error : undefined,
			file_error : undefined,
			post_error : undefined,
			posts : [],
			post_fetch_error : undefined,
			showFilterForm : false,
			keyword_filter : '',
			created_by_filter : '',
			activePage : 1
		};
		this.fileRef = React.createRef();

		this.PER_PAGE_COUNT = 4;
		this.PAGE_RANGE = 3;
	}

	componentDidMount(){
		this.fetchPosts(API_URL + "posts/");
	}

	fetchPosts = (url) => {
		axios.get(url).then(
				(response) => {
					this.setState({
						posts : response.data,
						post_fetch_error : undefined
					})
				}

			).catch(

				(error) => {
					this.setState({post_fetch_error : "Error at API endpoint to fetch posts"})
				}
			);
	};

	toggleNewPostForm = (ev) => {
		this.setState({showNewPostForm : !this.state.showNewPostForm});
		//clear all fields/errors before showing new form or after closing form to avoid previous data
		this.setState({
			message : '',
			file : null,
			message_error : undefined,
			file_error : undefined,
			post_error : undefined
		});
		//clear file value using ref else file name will be displayed though file will not be there
		this.fileRef.current.value = "";
	};

	onFormSubmit = (ev) => {
		ev.preventDefault();
		if (sessionStorage.getItem("api_token")){
			this.createPost();

		}
		else{
			this.setState({post_error : "Please Log in first"});
		}
	};

	onInputChange = (ev) => {
		let name, value;
		name = ev.target.name;
		value = ev.target.value;
		this.setState({[name]: value});
	};

	onFileInputChange = (ev) => {
		let value;
		value = ev.target.files[0];
		this.setState({file: value});
		//console.log(ev.target.files);
		//FileList {0: File, length: 1}
		//0: File {name: "runthis.txt", lastModified: 1591686628777, lastModifiedDate: Tue Jun 09 2020 12:40:28 GMT+0530 (India Standard Time), webkitRelativePath: "", size: 214, …}
		//length: 1
	};

	createPost = () => {
		let form_data = new FormData();

		form_data.append("message", this.state.message);
		if (this.state.file){
			form_data.append("file", this.state.file, this.state.file.name);
		}
		let form_params = {
			headers : {
				"content-type" : "multipart/form_data",
				"authorization" : "Token " + sessionStorage.getItem("api_token")
			}
		};
		axios.post(API_URL+ "posts/", form_data, form_params).then(
				() => {

					this.toggleNewPostForm();
					this.fetchPosts(API_URL + "posts/");
				}
			).catch(

				(error) => {
					let message_error, file_error, post_error;
					
					if (error.response){	//if response returned of error
						
						//message errors	
						if (error.response.data.message){
							message_error = error.response.data.message[0];
						}
						//file error
						if (error.response.data.file){
							file_error = error.response.data.file[0];
						}
						//general post creation error
						if (error.response.data.detail){
							post_error = error.response.data.detail;
						}
					}	
					else{		//if no response returned means api endpoint error
						post_error = "Error at API endpoint in creating post";
					}

					this.setState({

						message_error : message_error,
						file_error : file_error,
						post_error : post_error
					});
				}
			);
		
	};

	toggleFilterForm = (ev) => {
		//clear all fields before open/close filter form
		this.setState({
			showFilterForm : !this.state.showFilterForm,
			keyword_filter : '',
			created_by_filter : ''
		});
	};

	onFilterFormSubmit = (ev) => {
		ev.preventDefault();

		this.toggleFilterForm();

		//apend filter parameters in GET
		let url = API_URL + "posts/?keyword=" + this.state.keyword_filter + "&created_by=" + this.state.created_by_filter;
		this.fetchPosts(url);
	};

	handlePageChange = (pageNumber) => {
		this.setState({activePage: pageNumber});
	};

	render(){

		let start, end;
		if (this.activePage===1){
			start = 0;
		}
		else{
			start = (this.state.activePage-1) * this.PER_PAGE_COUNT;
		}
		end =  (this.state.activePage * this.PER_PAGE_COUNT);

		return (

			<div className="w3-container">
				<button className="w3-button w3-dark-grey w3-margin w3-round-large" onClick={this.toggleNewPostForm} >
					New Post
				</button>
				<button className="w3-button w3-dark-grey w3-margin w3-round-large" onClick={this.toggleFilterForm}>
					Filter
				</button>

				<div className="w3-text-red">{this.state.post_fetch_error}</div>

				<div>
					{this.state.posts.length===0 ? (<i>No posts created</i>) : null}
					{this.state.posts.slice(start,end).map((post) => (<PostTemplate key={post.id} post={post} />))}
				</div>

				{/* modal new post form  */}
				<div className={this.state.showNewPostForm ? "w3-show" : "w3-hide"} >
					<div className="w3-modal w3-block w3-center" >
						<div className="w3-modal-content w3-animate-top w3-card-4" >
							<header className="w3-container w3-dark-grey" >
								<h3 className="w3-text-white">Create New Post</h3>
								<span onClick={this.toggleNewPostForm} className="w3-button w3-display-topright" >
									&times;
								</span>
							</header>
							<div className="w3-container w3-text-dark-grey " >
								<form onSubmit={this.onFormSubmit} >
									<div>
										<span className="w3-text-red" >{this.state.post_error}</span>
									</div>
									<div>
										<span className="w3-vertical-align-middle">Message</span> 
										<textarea rows="5" className="w3-form-element w3-width-60 w3-vertical-align-middle" name="message" value={this.state.message} onChange={this.onInputChange} />
										<span className="w3-text-red">{this.state.message_error}</span>
									</div>	
									<div>
										File
										<input className="w3-form-element" type="file" name="file"  onChange={this.onFileInputChange} ref={this.fileRef} />
										<span className="w3-text-red">{this.state.file_error}</span>
									</div>
									<button className="w3-button w3-form-element w3-round-large w3-dark-grey" type="submit" >Post</button>
								</form>
							</div>
						</div>
					</div>
				</div>

				{/* modal form for filtering post*/}
				<div className={this.state.showFilterForm ? "w3-show" : "w3-hide"} >
					<div className="w3-modal w3-block w3-center">
						<div className="w3-modal-content w3-animate-top w3-card-4">
							<header className="w3-container w3-dark-grey">
								<h3 className="w3-text-white">Filter criteria</h3>
								<span onClick={this.toggleFilterForm} className="w3-button w3-display-topright" >
									&times;
								</span>
							</header>
							<div className="w3-container w3-text-dark-grey " >
								<form onSubmit={this.onFilterFormSubmit} >
									<div> 
										Keyword 
										<input type="text" className="w3-form-element" name="keyword_filter" value={this.state.keyword_filter} onChange={this.onInputChange} />
									</div>
									<div>
										Created by 
										<input type="text" className="w3-form-element" name="created_by_filter" value={this.state.created_by_filter} onChange={this.onInputChange} />
									</div>
									<button className="w3-button w3-form-element w3-round-large w3-dark-grey " type="submit">Apply</button>
								</form>
							</div>
						</div>
					</div> 
				</div>

				{/*Pagination*/}
				<Pagination 
					activePage={this.state.activePage}
					itemsCountPerPage={this.PER_PAGE_COUNT}
					totalItemsCount={this.state.posts.length}
					pageRangeDisplayed={this.PAGE_RANGE}
					onChange={this.handlePageChange}
					prevPageText='prev'
					nextPageText='next'
					firstPageText='first'
					lastPageText='last'
					innerClass='w3-bar'
					activeLinkClass='w3-dark-grey'
					itemClass='w3-bar-item '
					linkClass='w3-button w3-round-large'
					disabledClass='w3-disabled'
					/>

			</div>
		);
	}
}

export default Content;