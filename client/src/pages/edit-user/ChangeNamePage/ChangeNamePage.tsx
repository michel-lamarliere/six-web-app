import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store/_store';

import { useInput, useInputTypes } from '../../../hooks/input-hook';
import { useRequest } from '../../../hooks/http-hook';
import { useUserClass } from '../../../classes/user-class-hook';

import Input, { InputStyles } from '../../../components/form-elements/Input';
import EditProfileFormWrapper, {
	EditProfileFormWrapperTypes,
} from '../../../containers/EditUserContainer/EditUserContainer';

const ChangeName: React.FC = () => {
	const { sendRequest } = useRequest();
	const { User } = useUserClass();

	const userState = useSelector((state: RootState) => state.user);

	const [response, setResponse] = useState('');
	const [inputErrorMessage, setInputErrorMessage] = useState('');

	const {
		input: newName,
		setInput: setNewName,
		inputOnChangeHandler: newNameOnChangeHandler,
		inputOnBlurHandler: newNameOnBlurHandler,
	} = useInput({ type: useInputTypes.NAME, validate: true });

	const validateName = () => {
		if (!userState.name) {
			return false;
		}

		if (newName.value.trim().toLowerCase() === userState.name.trim().toLowerCase()) {
			setNewName((prev) => ({ ...prev, isValid: false, isTouched: true }));
			setInputErrorMessage("Veuillez choisir un nom différent de l'actuel.");
			return false;
		}

		if (
			newName.value.trim().length < 2 ||
			!newName.value.trim().match(/^['’\p{L}\p{M}]*-?['’\p{L}\p{M}]*$/giu)
		) {
			setNewName((prev) => ({ ...prev, isValid: false, isTouched: true }));
			setInputErrorMessage(
				'Minimum 2 caractères, sans espaces et sans caractères spéciaux.'
			);
			return false;
		}

		return true;
	};

	const changeNameHandler = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!validateName()) {
			return;
		}

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user/modify/name`,
			method: 'PATCH',
			body: JSON.stringify({
				id: userState.id,
				newName: newName.value.trim().toLowerCase(),
			}),
		});

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			setNewName((prev) => ({ ...prev, isValid: false, isTouched: true }));

			if (responseData.details.sameName) {
				setInputErrorMessage("Veuillez choisir un nom différent de l'actuel.");
			} else if (responseData.details.format) {
				setInputErrorMessage(
					'Minimum 2 caractères, sans espaces et sans caractères spéciaux.'
				);
			}
			return;
		}

		setResponse(responseData.message);

		setTimeout(() => {
			setResponse('');
		}, 3000);

		User.refreshInfo();

		setNewName({ value: '', isValid: false, isTouched: false });
	};

	return (
		<EditProfileFormWrapper
			formAction={changeNameHandler}
			title={'Nom'}
			type={EditProfileFormWrapperTypes.MODIFY}
			displaySubmitButton={true}
			response={response}
		>
			<Input
				styling={InputStyles.BLACK_FORM}
				id='Nouveau Nom'
				type='text'
				placeholder={userState.name ? userState.name : 'Jean'}
				errorText={inputErrorMessage}
				value={newName.value}
				isValid={newName.isValid}
				isTouched={newName.isTouched}
				onChange={newNameOnChangeHandler}
				onBlur={newNameOnBlurHandler}
			/>
		</EditProfileFormWrapper>
	);
};

export default ChangeName;
