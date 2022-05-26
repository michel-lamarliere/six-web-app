import { RequestHandler } from 'express';

const database = require('../utils/db-connect');
const sendEmail = require('../utils/send-email');

const sendMessage: RequestHandler = async (req, res, next) => {
	const {
		name: reqName,
		email: reqEmail,
		message: reqMessage,
		isLoggedIn: reqIsLoggedIn,
	} = req.body;

	const databaseConnect = await database.getDb().collection('users');

	if (reqIsLoggedIn) {
		const user = await databaseConnect.findOne({ email: reqEmail });

		if (!user) {
			res.status(404).json({ fatal: true });
		}
	}

	if (!reqIsLoggedIn) {
		if (reqMessage.trim().length < 10) {
			res.status(404).json({ error: true, message: '10 caractères minimum.' });
			return;
		}
	} else {
		let validInputs = {
			name: false,
			email: false,
			message: false,
		};

		if (reqName.trim().length >= 2) {
			validInputs.name = true;
		}

		if (
			reqEmail.match(
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		) {
			validInputs.email = true;
		}

		if (reqMessage.trim().length > 10) {
			validInputs.message = true;
		}

		if (!validInputs.name || !validInputs.email || !validInputs.message) {
			res.json({ error: true, validInputs });
			return;
		}
	}

	const confirmationEmail = await sendEmail({
		to: reqEmail,
		subject: 'Prise de contact',
		text: `Merci ${reqName} pour votre message envoyé, nous ferons notre maximum afin de répondre à votre message rapidement.`,
	});

	const emailToUs = await sendEmail({
		to: process.env.NODEMAILER_EMAIL,
		subject: `Message via le site de ${reqName}: ${reqEmail}`,
		text: `${reqMessage}`,
	});

	if (!confirmationEmail || !emailToUs) {
		res.status(400).json({
			error: true,
			message: `Erreur lors de l'envoi des mails`,
		});
		return;
	}

	res.status(200).json({ success: true, message: 'Email envoyés.' });
};

exports.sendMessage = sendMessage;
