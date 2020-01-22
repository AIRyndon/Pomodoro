import
{
    timer,
    runningTimer
} from './TimerActions';

const updateClockFace = (uiTimerCount: any) =>
{
    let pieTimer: any | null = document.querySelector('.degree');
    let clockHandColor = '#1fbb39';
    let percentRatio = 0.277777777777778; //percentRatio is percentage / degree

    let percent = 100 - (timer.totalSeconds - uiTimerCount) / timer.totalSeconds * 100;
    let degree = percent / percentRatio;

    if (percent <= 100)
    {
        if (percent < 50)
        {
            degree += 90;
            pieTimer.style.backgroundImage = `linear-gradient(${degree}deg, transparent 50%, ${clockHandColor} 50%),
                    linear-gradient(90deg, ${clockHandColor} 50%, transparent 50%)`;
        } else if (percent === 50)
        {
            pieTimer.style.backgroundImage = `linear-gradient(90deg, ${clockHandColor} 50%, transparent 50%)`;
        } else
        {
            degree -= 90;
            pieTimer.style.backgroundImage = `linear-gradient(${degree}deg, transparent 50%, #ffffff 50%),
                    linear-gradient(90deg, ${clockHandColor} 50%, transparent 50%)`;
        }
    }
};

const resetTimerUI = () =>
{
    let timerStatus: any | null = document.getElementById('timer-status');
    let htmlElem: any | null = document.querySelector('.degree');
    htmlElem.style.backgroundImage = `linear-gradient(#1fbb39,#1fbb39)`;

    // Tells the user if they should be working or having a break
    if (runningTimer.sessionTimer)
    {
        timerStatus.textContent = 'Time to work';

    } else if (runningTimer.breakTimer)
    {
        timerStatus.textContent = 'Have a break';
    }
};

const setMinutes = (callback: any) =>
{
    let minutes = callback();
    if (minutes >= 0)
    {
        let htmlElem: any | null = document.getElementById('clock-minutes');
        if (minutes < 10)
        {
            htmlElem.textContent = '0' + minutes;
        } else
        {
            htmlElem.textContent = minutes;
        }
    }
};

const setSeconds = (seconds: any) =>
{
    if (seconds >= 0)
    {
        let htmlElem: any | null = document.getElementById('clock-seconds');

        if (seconds === 60)
        {
            htmlElem.textContent = '00';
        } else if (seconds < 10)
        {
            htmlElem.textContent = '0' + seconds;
        } else
        {
            htmlElem.textContent = seconds;
        }
    }
};

export
{
    setMinutes,
    setSeconds,
    updateClockFace,
    resetTimerUI
};