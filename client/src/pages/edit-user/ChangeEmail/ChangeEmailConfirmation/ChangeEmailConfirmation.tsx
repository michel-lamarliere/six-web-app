import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AlertPopUpActionTypes } from '../../../../store/pop-ups/alert-pop-up';

import { useUserClass } from '../../../../classes/user-class-hook';
import { useRequest } from '../../../../hooks/http-hook';

const ChangeEmailConfirm: React.FC = () => {
	const dispatch = useDispatch();

	const { oldEmail, newEmail } = useParams();

	const { sendRequest } = useRequest();
	const { User } = useUserClass();

	const [response, setResponse] = useState('');

	const modifyEmailAddressHandler = async () => {
		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user/modify/email/confirmation`,
			method: 'PATCH',
			body: JSON.stringify({
				oldEmail,
				newEmail,
			}),
		});

		if (responseData.error) {
			setResponse(responseData.message);
			return;
		}

		User.logOut({ redirect: true });

		dispatch({
			type: AlertPopUpActionTypes.SET_AND_SHOW_ALERT_POP_UP,
			message: responseData.message,
		});
	};

	useEffect(() => {
		modifyEmailAddressHandler();
	}, []);

	return <div>{response}</div>;
};

export default ChangeEmailConfirm;
