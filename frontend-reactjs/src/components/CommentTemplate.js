import React from "react";
import "./w3.css";

class CommentTemplate extends React.Component{

	render(){
		let comment = this.props.comment;

		return (
			<div className="w3-panel w3-leftbar w3-border-dark-grey w3-small" >
				<div className="w3-text-white w3-dark-grey w3-panel">
					<span className="w3-left">Created by: {comment.created_by.username}</span>
					<span className="w3-right">Created on: {comment.created_on_humanized}</span>
				</div>
				<span className="w3-large w3-text-dark-grey" >❝</span>
				<div className="w3-text-dark-grey" >
					{comment.message}
				</div>
				<span className="w3-large w3-text-dark-grey" >❞</span>
			</div>

		);
	}
}

export default CommentTemplate;