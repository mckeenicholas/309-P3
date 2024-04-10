import React from 'react';
import '../styles/ContactCard.css';

interface CardProps {
	name: string;
	email: string;
	onDelete: () => void;
}

const Card: React.FC<CardProps> = ({ name, email, onDelete }) => {
	return (
		<div className="card-container card border-dark">
			<button className="delete-button" onClick={onDelete}>&times;</button>
			<div className="avatar"></div>
			<div className="info">
				<h2>{name}</h2>
				<p>{email}</p>
			</div>
		</div>
	);
};

export default Card;
