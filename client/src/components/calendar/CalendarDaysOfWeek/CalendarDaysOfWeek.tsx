import React from 'react';

import classes from './CalendarDaysOfWeek.module.scss';

const CalendarDaysOfWeek: React.FC = () => {
	const daysOfWeek = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

	return (
		<div className={classes.wrapper}>
			{daysOfWeek.map((day, index) => (
				<div key={`calendar-day-${index}`} className={classes.day}>
					{day}
				</div>
			))}
		</div>
	);
};

export default CalendarDaysOfWeek;
