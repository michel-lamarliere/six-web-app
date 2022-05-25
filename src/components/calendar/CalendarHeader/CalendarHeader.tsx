import React from 'react';

import { calendarTypes } from '../Calendar/Calendar';

import doubleLeftArrowIcon from '../../../assets/icons/calendar/double-left-arrow.svg';
import leftArrowIcon from '../../../assets/icons/calendar/left-arrow.svg';
import rightArrowIcon from '../../../assets/icons/calendar/right-arrow.svg';
import doubleRightArrowIcon from '../../../assets/icons/calendar/double-right-arrow.svg';

import classes from './CalendarHeader.module.scss';
import { addDays, addMonths, addYears, isBefore } from 'date-fns';

interface Props {
	calendar: calendarTypes;
	calendarText?: string;
	chosenDate: Date;
	setChosenDate: (arg0: Date) => void;
	calendarDate: Date;
	setCalendarDate: (arg0: Date) => void;
}

const CalendarHeader: React.FC<Props> = (props) => {
	let calendarPreviousMonthHandler;
	let calendarNextMonthHandler;

	const calendarPreviousYearHandler = () => {
		props.setCalendarDate(addYears(props.calendarDate, -1));
	};

	const calendarNextYearHandler = () => {
		props.setCalendarDate(addYears(props.calendarDate, 1));
	};

	const calendarPreviousYearHandlerDisabled = () => {
		return isBefore(addYears(props.calendarDate, -1), new Date(2020, 0, 1));
	};
	const calendarPreviousMonthHandlerDisabled = () => {
		return isBefore(addMonths(props.calendarDate, -1), new Date(2020, 0, 1));
	};

	const calendarNextMonthHandlerDisabled = () => {
		return !isBefore(addMonths(props.calendarDate, 1), new Date());
	};
	const calendarNextYearHandlerDisabled = () => {
		return !isBefore(addYears(props.calendarDate, 1), new Date());
	};

	if (
		props.calendar === calendarTypes.DAILY ||
		props.calendar === calendarTypes.WEEKLY
	) {
		calendarPreviousMonthHandler = () => {
			props.setCalendarDate(addMonths(props.calendarDate, -1));
		};

		calendarNextMonthHandler = () => {
			props.setCalendarDate(addMonths(props.calendarDate, 1));
		};
	}

	return (
		<div className={classes.wrapper}>
			{calendarPreviousYearHandlerDisabled &&
				!calendarPreviousYearHandlerDisabled() && (
					<button
						className={`${classes.button} ${classes['button--double-left']}`}
						onClick={calendarPreviousYearHandler}
					>
						<img src={doubleLeftArrowIcon} alt='Flèche Année Précédente' />
					</button>
				)}
			{(props.calendar === calendarTypes.DAILY ||
				props.calendar === calendarTypes.WEEKLY) &&
				calendarPreviousMonthHandlerDisabled &&
				!calendarPreviousMonthHandlerDisabled() && (
					<button
						className={`${classes.button} ${classes['button--left']}`}
						onClick={calendarPreviousMonthHandler}
					>
						<img src={leftArrowIcon} alt='Flèche Mois Précédente' />
					</button>
				)}
			<div className={classes.text}>{props.calendarText}</div>
			{(props.calendar === calendarTypes.DAILY ||
				props.calendar === calendarTypes.WEEKLY) &&
				calendarNextMonthHandlerDisabled &&
				!calendarNextMonthHandlerDisabled() && (
					<button
						className={`${classes.button} ${classes['button--right']}`}
						onClick={calendarNextMonthHandler}
					>
						<img src={rightArrowIcon} alt='Flèche Mois Suivant' />
					</button>
				)}
			{calendarNextYearHandlerDisabled && !calendarNextYearHandlerDisabled() && (
				<button
					className={`${classes.button} ${classes['button--double-right']}`}
					onClick={calendarNextYearHandler}
				>
					<img src={doubleRightArrowIcon} alt='Flèche Année Suivante' />
				</button>
			)}
		</div>
	);
};

export default CalendarHeader;
