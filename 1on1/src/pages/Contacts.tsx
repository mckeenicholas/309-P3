import React, { useState, useEffect } from 'react';
import Card from '../components/ContactCard';
import ContactDeleteConfirmationModal from '../components/ContactDeleteConfirmationModal';
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
	contactee: number;
}

// TODO: make error messages more descriptive.

const Contacts = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [username, setUsername] = React.useState<string>("");
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
	const sendRequest = useRequest();

	useEffect(() => {
		const fetchContacts = async () => {
			try {
				const result = await sendRequest('/contacts/', { method: "GET" });
				if (result) {
					const contacts: Contact[] = result.map((contact: RawContact) => ({
						id: contact.id,
						email: contact.contactee_info.email,
						fullname: contact.contactee_info.first_name + contact.contactee_info.last_name,
						contactee: contact.contactee
					}));
					setContacts(contacts);
				}
			} catch (error) {
				console.error(error);
				alert("Failed to load contacts.");
			}
		};
		fetchContacts();
	}, [sendRequest]);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	const saveChanges = async () => {
		try {
			const result = await sendRequest('/contacts/add/', {
				method: "POST",
				body: JSON.stringify({
					username: username
				})
			})
			if (result && result.id) {
				setContacts(prev => [...prev, {
					id: result.id,
					email: result.contactee_info.email,
					fullname: `${result.contactee_info.first_name} ${result.contactee_info.last_name}`,
					contactee: result.contactee
				}]);
			} else {
				alert("Failed to add contact: this user does not exist");
			}
		} catch (error) {
			console.error(error);
			alert("Failed to add contact.");
		}
		closeModal();
	};

	const openDeleteModal = (contact: Contact) => {
		setContactToDelete(contact);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setContactToDelete(null);
	};
	const confirmDelete = async () => {
		if (contactToDelete) {
			await deleteContact(contactToDelete.contactee.toString());
			closeDeleteModal();
		}
	};
	const deleteContact = async (contactee: string) => {
		try {
			await sendRequest(`/contacts/delete/${contactee}/`, { method: "DELETE" });
			setContacts(contacts => contacts.filter(contact => contact.contactee.toString() !== contactee));
		} catch (error) {
			console.error(error);
			alert("Failed to delete contact.");
		}
	}

	return (
		<div id="wrapper" className="d-flex">
			<div id="page-content-wrapper">
				<div className="col-md-9">
					<div className="cards-container">
						{contacts.map(contact => (
							<Card
								key={contact.id}
								name={contact.fullname}
								email={contact.email}
								onDelete={() => openDeleteModal(contact)}
							/>
						))}
					</div>
					<button className="add-contact-btn btn btn-outline-success mt-5" onClick={openModal}>Add New Contact</button>
				</div>
			</div>

			<ContactAddModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={saveChanges}
				username={username}
				setUsername={setUsername}
			/>
			<ContactDeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				contactName={contactToDelete ? contactToDelete.fullname : ''}
			/>
		</div>
	);
};

export default Contacts;
