import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialState: State = {
	show: false,
};

export enum TaskSelectorActionTypes {
	SHOW_TASK_SELECTOR = 'SHOW_TASK_SELECTOR',
	HIDE_TASK_SELECTOR = 'HIDE_TASK_SELECTOR',
}

const taskSelectorReducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case TaskSelectorActionTypes.SHOW_TASK_SELECTOR:
			return { show: true };

		case TaskSelectorActionTypes.HIDE_TASK_SELECTOR:
			return { show: false };

		default:
			return state;
	}
};

export default taskSelectorReducer;
