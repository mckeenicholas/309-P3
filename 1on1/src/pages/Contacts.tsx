import React, {useState} from 'react';
import Card from '../components/ContactCard';
import ContactAddModal from '../components/ContactAddModal';
import '../styles/Contacts.css'
import useRequest from '../utils/requestHandler'

const Contacts = () => {
	//TODO: on load, get the user's contacts.
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [fullname, setFullname] = React.useState<string>("");
	const [username, setUsername] = React.useState<string>("");
	const [email, setEmail] = React.useState<string>("");
	const [phone, setPhone] = React.useState<string>("");
	const sendRequest = useRequest();

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	const saveChanges = async () => {
		console.log(fullname, email, phone);
		await sendRequest('/contacts/add/', {
			method: "POST",
			body: JSON.stringify({
				username: username
			})
		})
		// error checking in case the request method fails, i.e. username DNE
		// TODO
		closeModal();
	};
	return (
		<>
			<div className="cards-container">
				<Card
					name="John Doe"
					email="john.doe@example.com"
					phoneNumber="+1 (234) 567-890"
				/>
				<Card
					name="John Doe"
					email="john.doe@example.com"
					phoneNumber="+1 (234) 567-890"
				/>
				<Card
					name="John Doe"
					email="john.doe@example.com"
					phoneNumber="+1 (234) 567-890"
				/>
				<Card
					name="John Doe"
					email="john.doe@example.com"
					phoneNumber="+1 (234) 567-890"
				/>
				<Card
					name="John Doe"
					email="john.doe@example.com"
					phoneNumber="+1 (234) 567-890"
				/>
				<Card
					name="John Doe"
					email="john.doe@example.com"
					phoneNumber="+1 (234) 567-890"
				/>
			</div>
			<button className="add-contact-btn btn btn-outline-success mt-5" onClick={openModal}>Add New Contact</button>
			<ContactAddModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={saveChanges}
				fullname={fullname}
				setFullname={setFullname}
				username={username}
				setUsername={setUsername}
				email={email}
				setEmail={setEmail}
				phone={phone}
				setPhone={setPhone}
			/>
		</>
	);
};

export default Contacts;
