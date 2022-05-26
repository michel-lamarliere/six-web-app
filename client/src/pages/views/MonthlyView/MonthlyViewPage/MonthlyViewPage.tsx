import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getDay, format, isAfter, startOfMonth, isSameDay, addHours } from 'date-fns';

import { RootState } from '../../../../store/_store';

import { useRequest } from '../../../../hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../../../hooks/dates-hook';
import { useTaskClass } from '../../../../classes/task-class-hook';

import MonthlyViewCalendar from '../MonthlyViewCalendar/MonthlyViewCalendar';
import LogDataButton from '../../../../components/buttons/LogDataButton/LogDataButton';
import ViewsContainer from '../../../../containers/ViewsContainer/ViewsContainer';

import classes from './MonthlyViewPage.module.scss';

const MonthlyView: React.FC = () => {
	const { sendRequest } = useRequest();
	const { getMonthFn } = useDatesFn();
	const { Task } = useTaskClass();

	const userState = useSelector((state: RootState) => state.user);

	// CALENDAR
	const [chosenDate, setChosenDate] = useState<Date>(startOfMonth(new Date()));
	const [monthStr, setMonthStr] = useState('');
	const [monthlyArray, setMonthlyArray] = useState<[]>([]);
	const [chosenTask, setChosenTask] = useState('nutrition');
	const [emptyBoxes, setEmptyBoxes] = useState<0[]>([]);

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const dateAndTaskStr = (event.target as HTMLElement).id;
		const previousLevel = parseInt((event.target as HTMLButtonElement).value);

		const date = dateAndTaskStr.split('/')[0];
		const task = dateAndTaskStr.split('/')[1];

		const newTaskObj = {
			date,
			task,
			previousLevel,
		};

		await Task.save(newTaskObj);

		getMonthlyData();
	};

	const getMonthlyData = async () => {
		const chosenMonthStr = format(chosenDate, 'yyyy-MM-dd');

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/log/monthly/${userState.id}/${chosenMonthStr}/${chosenTask}`,
			method: 'GET',
		});

		if (!responseData) {
			return;
		}

		setMonthlyArray(responseData);
		getFirstDayOfWeek(chosenDate);
	};

	const getFirstDayOfWeek = (date: Date) => {
		let dayOfFirstOfMonth: number = getDay(startOfMonth(date));

		if (dayOfFirstOfMonth === 0) {
			dayOfFirstOfMonth = 7;
		}

		const emptyArray: 0[] = [];

		for (let i = 1; i < dayOfFirstOfMonth; i++) {
			emptyArray.push(0);
		}

		setEmptyBoxes(emptyArray);
	};

	useEffect(() => {
		if (userState.id) {
			getMonthlyData();
			getMonthFn({
				type: getMonthFnTypes.STATE,
				monthNumber: chosenDate.getMonth(),
				abbreviation: false,
				setState: setMonthStr,
			});
		}
	}, [chosenDate, chosenTask]);

	return (
		<ViewsContainer>
			<MonthlyViewCalendar
				chosenDate={chosenDate}
				setChosenDate={setChosenDate}
				chosenTask={chosenTask}
				setChosenTask={setChosenTask}
				headerText={`${monthStr} ${chosenDate.getFullYear()}`}
			/>
			<div className={classes.days}>
				<li>LUN</li>
				<li>MAR</li>
				<li>MER</li>
				<li>JEU</li>
				<li>VEN</li>
				<li>SAM</li>
				<li>DIM</li>
			</div>
			<div className={classes.calendar}>
				{emptyBoxes.length > 0 &&
					emptyBoxes.map((item, index) => (
						<div key={`emptyBox-${item}-${index}`}></div>
					))}
				{monthlyArray &&
					monthlyArray.map((item: { date: string; level: 0 }, index) => (
						<LogDataButton
							id={`${format(
								new Date(item.date),
								'yyyy-MM-dd'
							)}/${chosenTask}`}
							onClick={addData}
							value={item.level}
							key={`${format(
								new Date(item.date),
								'yyyy-MM-dd'
							)}/${chosenTask}-${index}`}
							disabled={
								isAfter(new Date(item.date), new Date()) &&
								!isSameDay(addHours(new Date(item.date), 0), new Date())
							}
							dayNumber={index + 1}
						/>
					))}
			</div>
		</ViewsContainer>
	);
};

export default MonthlyView;
