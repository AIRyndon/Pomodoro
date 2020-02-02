import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'reactstrap';
import './Timer.css';

export const Timer = (props: any) =>
{
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerMinutes, setTimerMinutes] = useState(props.timerSetting.sessionMinutes);
    const [onSession, setOnSession] = useState(true);
    const [timerStarted, setTimerStarted] = useState(false);
    const [timerCounter, setTimerCounter] = useState(0);
    const [sessionCount, setSessionCount] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [pieClock, setPieClock] = useState(0);
    const [pie, setPie] = useState({});

    //Function from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
    const useInterval = (callback: any, isRunning: any) =>
    {
        const savedCallback: any = useRef();
        useEffect(() =>
        {
            savedCallback.current = callback;
        });

        useEffect(() =>
        {
            function tick()
            {
                savedCallback.current();
            }

            if (isRunning)
            {
                let id = setInterval(tick, 1000);
                return () => clearInterval(id);
            }
        }, [isRunning]);
    }

    const tickTimer = () =>
    {
        setPieClock(pieClock + 1);
        setTimerCounter(timerCounter - 1);
    }

    const updateClock = () =>
    {
        if (timerCounter >= 0)
        {
            setTimerSeconds(timerCounter % 60);
            setTimerMinutes(Math.floor(timerCounter / 60));
        }
        else
        {
            resetTimer();
        }
    }

    const updateClockFace = () =>
    {
        let clockHandColor = '#1fbb39';
        let percentRatio = 0.277777777777778; //percentRatio is percentage / degree(100/360)
        let percent = pieClock / totalSeconds * 100;
        let degree = percent / percentRatio;

        if (percent <= 100)
        {
            if (percent < 50)
            {
                degree += 90;
                setPie({
                    backgroundImage: `linear-gradient(${degree}deg, transparent 50%, ${clockHandColor} 50%),
                    linear-gradient(90deg, ${clockHandColor} 50%, transparent 50%)`
                });
            } else if (percent === 50)
            {
                setPie({ backgroundImage: `linear-gradient(90deg, ${clockHandColor} 50%, transparent 50%)` });
            } else
            {
                degree -= 90;
                setPie({
                    backgroundImage: `linear-gradient(${degree}deg, transparent 50%, #ffffff 50%),
                    linear-gradient(90deg, ${clockHandColor} 50%, transparent 50%)`
                });
            }
        }
    }

    const toggleTimerStatus = () =>
    {
        setTimerStarted(!timerStarted);
    }

    const setUpTimer = () =>
    {
        console.log("Setup Timer");
        if (onSession)
        {
            setTotalSeconds(props.timerSetting.sessionMinutes * 60);
            setTimerCounter(props.timerSetting.sessionMinutes * 60);

        } else if (sessionCount % props.timerSetting.longBreakInterval === 0)
        {
            setTotalSeconds(props.timerSetting.longBreakMinutes * 60);
            setTimerCounter(props.timerSetting.longBreakMinutes * 60);
        } else
        {
            setTotalSeconds(props.timerSetting.shortBreakMinutes * 60);
            setTimerCounter(props.timerSetting.shortBreakMinutes * 60);
        }
        setPieClock(0);
    }

    const resetTimer = () =>
    {
        console.log("At reset timer");
        setTimerStarted(false);

        if (onSession)
        {
            setSessionCount(sessionCount + 1);
        }

        setOnSession(!onSession);
    }

    useEffect(() =>
    {
        updateClock();
        updateClockFace();
    }, [timerCounter])

    useEffect(() =>
    {
        setUpTimer();
    }, [onSession, props.timerSetting]);

    useEffect(() =>
    {
        setSessionCount(0);
    }, [props.timerSetting.longBreakInterval])

    useInterval(tickTimer, timerStarted);

    return (
        <>
            <div id="timer-container">
                <div className="pie degree" style={pie}>
                    <span className="block"></span>
                    <div id="clock-body">
                        <div id="timer-status">{onSession ? "Focus Time!!" : "Break Time!!"}</div>
                        <span id="clock-minutes">{`${timerMinutes < 10 ? '0' + timerMinutes : timerMinutes}`}</span>
                        <span>:</span>
                        <span id="clock-seconds">{`${timerSeconds < 10 ? '0' + timerSeconds : timerSeconds}`}</span>

                    </div>
                    <div className="timer-buttons">
                        <div className="btn-group" role="group">
                            <Button onClick={toggleTimerStatus}
                                type="button" title="toggle timer state"
                                className="btn-lg btn-light" id="start">{timerStarted ? "Pause" : "Start"}</Button>
                            <Button onClick={resetTimer}
                                type="button" title="skip session"
                                className="btn-lg btn-light" id="skip">Skip</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};