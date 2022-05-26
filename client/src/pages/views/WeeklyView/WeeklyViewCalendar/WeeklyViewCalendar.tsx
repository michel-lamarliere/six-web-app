import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
	addDays,
	addMonths,
	addYears,
	format,
	getDay,
	getWeek,
	getWeeksInMonth,
	getYear,
	isBefore,
	isSameWeek,
	startOfMonth,
} from 'date-fns';

import { CalendarActionTypes } from '../../../../store/calendar';
import { OverlayActionTypes } from '../../../../store/overlay';

import { getMonthFnTypes, useDatesFn } from '../../../../hooks/dates-hook';

import Calendar, {
	calendarTypes,
} from '../../../../components/calendar/Calendar/Calendar';

import calendarClasses from '../../../../components/calendar/Calendar/Calendar.module.scss';

const WeeklyCalendar: React.FC<{
	chosenDate: Date;
	setChosenDate: Dispatch<SetStateAction<Date>>;
	headerText: string;
}> = (props) => {
	const dispatch = useDispatch();
	const { getMonthFn } = useDatesFn();

	const [calendarDate, setCalendarDate] = useState(new Date());
	const [calendarMonthStr, setCalendarMonthStr] = useState('');
	const [weeks, setWeeks] = useState<Date[][]>([]);
	const [weekNumbers, setWeekNumbers] = useState<number[]>([]);

	const createWeekCalendar = () => {
		const weeksInMonth = getWeeksInMonth(calendarDate, { weekStartsOn: 1 });
		const firstDateOfMonth = startOfMonth(calendarDate);
		const dayOfFirstDateOfMonth = getDay(firstDateOfMonth);

		let firstDateOfFirstWeekOfMonth = addDays(
			firstDateOfMonth,
			-dayOfFirstDateOfMonth + 1
		);

		const weeks: Date[][] = [];
		const weekNumbers = [];
		for (let i = 0; i < weeksInMonth; i++) {
			const week: Date[] = [];
			for (let y = 0; y < 7; y++) {
				week.push(addDays(firstDateOfFirstWeekOfMonth, y));
			}
			weekNumbers.push(
				getWeek(firstDateOfFirstWeekOfMonth, {
					weekStartsOn: 1,
					firstWeekContainsDate: 4,
				})
			);

			firstDateOfFirstWeekOfMonth = addDays(firstDateOfFirstWeekOfMonth, 7);

			weeks.push(week);
		}

		setWeeks(weeks);
		setWeekNumbers(weekNumbers);
	};

	const weekOnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const year = (event.target as HTMLElement).id.slice(0, 4);
		const month = (event.target as HTMLElement).id.slice(5, 7);
		const day = (event.target as HTMLElement).id.slice(8, 10);

		props.setChosenDate(new Date(+year, +month - 1, +day));

		dispatch({ type: CalendarActionTypes.HIDE_CALENDAR });
		dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
	};

	useEffect(() => {
		getMonthFn({
			type: getMonthFnTypes.STATE,
			monthNumber: calendarDate.getMonth(),
			abbreviation: true,
			setState: setCalendarMonthStr,
		});
		createWeekCalendar();
	}, [calendarDate]);

	return (
		<Calendar
			calendar={calendarTypes.WEEKLY}
			chosenDate={props.chosenDate}
			setChosenDate={props.setChosenDate}
			calendarDate={calendarDate}
			setCalendarDate={setCalendarDate}
			headerText={props.headerText}
			calendarText={`${calendarMonthStr} ${getYear(calendarDate)}`}
		>
			<div className={calendarClasses.week}>
				<div className={calendarClasses.week__numbers}>
					{weekNumbers.map((weekNumber, index) => (
						<div
							className={calendarClasses.week__numbers__number}
							key={`calendarWeek-${weekNumber}-${index}`}
						>
							{weekNumber}
						</div>
					))}
				</div>
				<div className={calendarClasses.week__calendar}>
					{weeks.length > 0 &&
						weeks.map((week, index) => (
							<button
								className={`${calendarClasses.week__calendar__week} ${
									!isBefore(new Date(week[0]), new Date()) &&
									calendarClasses['week__calendar__week--disabled']
								}`}
								onClick={weekOnClickHandler}
								disabled={!isBefore(new Date(week[0]), new Date())}
								id={`${format(new Date(week[6]), 'yyyy-MM-dd')}`}
								key={`${format(
									new Date(week[6]),
									'yyyy-MM-dd'
								)}-${index}`}
							>
								{week.map((day: Date, index) => (
									<div
										className={`${calendarClasses.day}
										${!isBefore(day, new Date()) && calendarClasses['day--disabled']}
										 ${
												!isBefore(day, new Date()) &&
												isSameWeek(day, new Date(), {
													weekStartsOn: 1,
												}) &&
												calendarClasses[
													'day--disabled--same-week'
												]
											}`}
										id={`${format(new Date(week[6]), 'yyyy-MM-dd')}`}
										key={`${format(
											new Date(week[6]),
											'yyyy-MM-dd'
										)}-${index}`}
									>
										{format(day, 'd')}
									</div>
								))}
							</button>
						))}
				</div>
			</div>
		</Calendar>
	);
};

export default WeeklyCalendar;
