import React, { useState, useEffect } from 'react';
import Card from '../components/ContactCard';
import ContactAddModal from '../components/ContactAddModal';
import '../styles/Contacts.css'
import useRequest from '../utils/requestHandler'

interface RawContact {
	id: string;
	contactee: number;
	contactee_info: {
		email: string;
		first_name: string;
		last_name: string;
	};
}

interface Contact {
	id: string;
	email: string;
	fullname: string;
}

const Contacts = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [fullname, setFullname] = React.useState<string>("");
	const [username, setUsername] = React.useState<string>("");
	const [email, setEmail] = React.useState<string>("");
	const [phone, setPhone] = React.useState<string>("");
	const [contacts, setContacts] = useState<Contact[]>([]);
	const sendRequest = useRequest();

	useEffect(() => {
		const fetchContacts = async () => {
			try {
				const result = await sendRequest('/contacts/', { method: "GET" });
				if (result) {
					console.log(result)
					const contacts: Contact[] = result.map((contact: RawContact) => ({
						id: contact.id,
						email: contact.contactee_info.email,
						fullname: contact.contactee_info.first_name + contact.contactee_info.last_name
					}));
					setContacts(contacts);
					console.log(contacts)
				}
			} catch (error) {
				console.error('Failed to fetch contacts:', error);
				// Handle error condition, possibly set an error state
			}
		};
		fetchContacts();
	}, [sendRequest]);

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
				{contacts.map(contact => (
					<Card
						key={contact.id}
						name={contact.fullname}
						email={contact.email}
						phoneNumber={'111-222-7878'}
					/>
				))}
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
