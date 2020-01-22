import * as timerUI from './TimerUi';
import * as timerQuery from './TimerQueries';

let timerID: any;

let timer = {

    paused: false,
    currentMinutes: 0,
    currentSeconds: 0,
    uiTimerCount: 0,
    clockTotal: 0,
    totalSeconds: 0,
    sessionCount: 0,
    breakInterval: 4,
    longBreakMinutes: 15,
    shortBreakMinutes: 5,
    sessionMinutes: 25
};

let runningTimer = {

    sessionTimer: true,
    breakTimer: false
};

const minutesToSeconds = (timerMinutes: any) =>
{
    return timerMinutes() * 60;
};

const updateTimerInputs = (input: any) =>
{
    let changedInput: string | undefined = '';
    let keys = Object.keys(timer);
 
    switch (input.id)
    {
        case 'long-break-minutes':

            changedInput = keys.find(key => key === 'longBreakMinutes');
            break;
        case 'short-break-minutes':

            changedInput = keys.find(key => key === 'shortBreakMinutes');
            break;
        case 'session-minutes':

            changedInput = keys.find(key => key === 'sessionMinutes');
            break;
        case 'break-interval':

            changedInput = keys.find(key => key === 'breakInterval');
            break;
        default:
            break;
    }

    let currentTimer = timerQuery.getCurrentTimerKey();

    if (changedInput === currentTimer)
    {
        clearInterval(timerID);
        timerUI.resetTimerUI();
        resetTimerCounter();
        setStartingTime();
    }
};

const finishSession = (timerMinutes: any) =>
{
    addSessionCount(timerMinutes);
    runningTimer.sessionTimer = !runningTimer.sessionTimer;
    runningTimer.breakTimer = !runningTimer.breakTimer;

    //reset all counters
    timerUI.resetTimerUI();
    resetTimerCounter();
    setStartingTime();

    let inputs: any | null = document.getElementById('timer-input');
    inputs.querySelectorAll('input');

    for (let index = 0; index < inputs.length; index++)
    {
        const input = inputs[index];
        updateTimerInputs(input);
    }
};

const addSessionCount = (timerMinutes: any) =>
{
    console.log(timerMinutes.name);
    if (timerMinutes.name === 'getSessionMinutes')
    {
        ++timer.sessionCount;
    }
};

const skipSession = (timerMinutes: any) =>
{
    clearInterval(timerID);
    finishSession(timerMinutes);
    timerUI.setMinutes(timerQuery.getCurrentTimer());
    timerUI.setSeconds(timer.currentSeconds);
};

const startSession = (timerMinutes: any) =>
{
    let button: any | undefined = document.getElementById('start');

    timer.currentMinutes = Math.floor(timer.clockTotal / 60);
    timer.currentSeconds = timer.clockTotal % 60;
    timerUI.setMinutes(timerQuery.getCurrentMinutes);
    timerUI.setSeconds(timer.currentSeconds);

    if (timer.paused)
    {
        button.textContent = 'Start';
        pauseSession();
        timer.paused = !timer.paused;
    } else
    {
        button.textContent = 'Pause';
        runSecondsTimer(timerMinutes);
        timer.paused = !timer.paused;
    }
};

const pauseSession = () =>
{
    clearInterval(timerID);
};

const runSecondsTimer = (timerMinutes: any) =>
{
    timerID = setInterval(() =>
    {
        --timer.clockTotal;
        ++timer.uiTimerCount;
        timer.currentMinutes = Math.floor(timer.clockTotal / 60);
        timer.currentSeconds = timer.clockTotal % 60;

        timerUI.setMinutes(timerQuery.getCurrentMinutes);
        timerUI.setSeconds(timer.currentSeconds);
        timerUI.updateClockFace(timer.uiTimerCount);

        if (timer.clockTotal < 0)
        {
            clearInterval(timerID);
            finishSession(timerMinutes);
        }
    }, 1000);
};

const resetTimerCounter = () =>
{
    let htmlElem: any | null = document.getElementById('start');
    htmlElem.textContent = 'Start';

    timer.paused = false;
    timer.uiTimerCount = 0;
    timer.currentMinutes = 0;
    timer.currentSeconds = 0;
};

const setStartingTime = () =>
{
    timer.totalSeconds = minutesToSeconds(timerQuery.getCurrentTimer());
    timer.clockTotal = timer.totalSeconds;
    timerUI.setMinutes(timerQuery.getCurrentTimer());
    timerUI.setSeconds(timer.currentSeconds);
};

//Setup Event-Handlers
const skipEvent = () =>
{
    let htmlElem: any | null = document.getElementById('skip');
    htmlElem.addEventListener('click', (event: any) =>
    {
        skipSession(timerQuery.getCurrentTimer());
    });
};

const startEvent = () =>
{
    let htmlElem: any | null = document.getElementById('start');
    htmlElem.addEventListener('click', (event: any) =>
    {
        startSession(timerQuery.getCurrentTimer());
    });
};

const showSettings = () =>
{
    let settingsBtn: any | null = document.getElementById('settings-button');

    settingsBtn.addEventListener('click', () =>
    {
        let settingsPage: any | null = document.querySelector('.settings-page');
        settingsPage.classList.add('show');
        settingsBtn.classList.toggle('d-none');
    });
};

const hideSettings = () =>
{
    let closeBtn: any | null = document.getElementById('settings-back-button');
    let settingsBtn: any | null = document.getElementById('settings-button');

    closeBtn.addEventListener('click', () =>
    {
        let settingsPage: any | null = document.querySelector('.settings-page');
        settingsPage.classList.remove('show');
        settingsBtn.classList.toggle('d-none');
    });
};

export
{
    setStartingTime,
    skipEvent,
    startEvent,
    timer,
    runningTimer,
    showSettings,
    hideSettings,
    updateTimerInputs
};