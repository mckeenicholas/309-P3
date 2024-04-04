import React from 'react';
import '../styles/ContactCard.css';

interface CardProps {
	name: string;
	email: string;
	phoneNumber: string;
}

const Card: React.FC<CardProps> = ({ name, email, phoneNumber }) => {
	return (
		<div className="card-container card border-dark">
			<div className="avatar"></div>
			<div className="info">
				<h2>{name}</h2>
				<p>{email}</p>
				<p>{phoneNumber}</p>
			</div>
		</div>
	);
};

export default Card;
