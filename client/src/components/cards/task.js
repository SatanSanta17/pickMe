import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskCard = ({ title, company, role, deadline }) => {
	return (
		<div className="card mb-3" style={{ maxWidth: "300px" }}>
			<div className="card-body">
				<h5 className="card-title">{title}</h5>
				<h6 className="card-subtitle mb-2 text-muted">{company}</h6>
				<p className="card-text">
					<strong>Role:</strong> {role}
				</p>
				<p className="card-text">
					<strong>Deadline:</strong> {new Date(deadline).toLocaleDateString()}
				</p>
			</div>
		</div>
	);
};

export default TaskCard;
