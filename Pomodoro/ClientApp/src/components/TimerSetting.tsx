import React, { useState, useEffect } from 'react'
import './Timer.css'
import './TimerSetting.css'
import { apiRequest } from '../helpers/AuthorizeTokenHelper';
import { Button } from 'reactstrap';
import authService from './api-authorization/AuthorizeService';
import { Timer } from './Timer';

export interface ITimerSetting {
    id?: number,
    description?: string,
    sessionMinutes: number,
    shortBreakMinutes: number,
    longBreakMinutes: number,
    longBreakInterval: number,
    activeSetting: false
}

export const TimerSetting = (props: any) => {

    const [authenticated, setAuthentication] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [timerSetting, setTimerSetting] = useState<ITimerSetting>({
        id: 0,
        sessionMinutes: 15,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        longBreakInterval: 4,
        activeSetting: false
    });

    const getTimerSetting = async () => {

        setAuthentication(await authService.isAuthenticated());
        if (authenticated) {
            let data: ITimerSetting = await apiRequest('api/timerSettings', 'get');

            if (data !== null) {
                setTimerSetting(data);
            }
        }
    }

    const timerSettingUpdating = async (event: any) => {
        switch (event.target.id) {
            case 'session-minutes':
                setTimerSetting({ ...timerSetting, sessionMinutes: parseInt(event.target.value) });
                break;
            case 'short-break-minutes':
                setTimerSetting({ ...timerSetting, shortBreakMinutes: parseInt(event.target.value) });
                break;
            case 'long-break-minutes':
                setTimerSetting({ ...timerSetting, longBreakMinutes: parseInt(event.target.value) });
                break;
            case 'break-interval':
                setTimerSetting({ ...timerSetting, longBreakInterval: parseInt(event.target.value) });
                break;
        }
    }

    const toggleSettingsView = async () => {
        setShowSettings(!showSettings);
    }

    //TODO - continue on finishing timer setting logic
    const updateTimerSetting = async () => {
        toggleSettingsView();

        if (authenticated) {
            let method = timerSetting.id === 0 ? 'post' : 'put';
            await apiRequest('api/timerSettings', method, timerSetting.id, timerSetting);
        }
    }

    const addTimerSetting = async () => {
        if (authenticated) {
            let method = timerSetting.id == 0 ? 'post' : 'put';
            //await apiRequest('api/timerSettings', method, timerSetting.id, timerSetting);
            console.log('authenticated');
        }
        console.log('Hello');
    }

    useEffect(() => {
        getTimerSetting();
    }, []);

    useEffect(() => {

    }, [timerSetting]);

    return (
        <>
            <Timer timerSetting={timerSetting} />
            <div className={`settings-page ${showSettings ? 'show' : ''}`} id="settings-page-slide">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card mb-2">
                            <div className="card-header py-2">
                                <Button onClick={updateTimerSetting}
                                    className="btn-light float-right"
                                    id="settings-back-button">
                                    <i className="fas fa-times"></i>
                                </Button>
                            </div>
                            <div className="card-body">
                                <p className="mb-4">Set how long you want your <code> Work</code> and <code> Break </code>
                                    should be.
                                </p>
                                <Button onClick={addTimerSetting}
                                    className={`btn-light float-right ${authenticated ? '' : 'hide'}`}
                                    id="add-timer-setting">
                                    <i className="far fa-arrow-alt-circle-right"></i>
                                </Button>
                                <div id="timer-input">
                                    <div className="form-group">
                                        <label>Session Duration</label>
                                        <div className="d-flex flex-lg-row">
                                            <input type="number" className="form-control"
                                                id="session-minutes"
                                                value={timerSetting.sessionMinutes}
                                                onChange={timerSettingUpdating} />
                                            <label className="p-2">Minutes</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Short Break Duration</label>
                                        <div className="d-flex flex-lg-row">
                                            <input type="number" className="form-control"
                                                id="short-break-minutes"
                                                value={timerSetting.shortBreakMinutes}
                                                onChange={timerSettingUpdating} />
                                            <label className="p-2">Minutes</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Long Break Duration</label>
                                        <div className="d-flex flex-lg-row">
                                            <input type="number" className="form-control"
                                                id="long-break-minutes"
                                                value={timerSetting.longBreakMinutes}
                                                onChange={timerSettingUpdating} />
                                            <label className="p-2">Minutes</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Long Break Interval</label>
                                        <div className="d-flex flex-lg-row">
                                            <input type="number" className="form-control"
                                                id="break-interval"
                                                value={timerSetting.longBreakInterval}
                                                onChange={timerSettingUpdating} />
                                            <label className="p-2">Sessions</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer fixed-bottom">
                <Button onClick={toggleSettingsView}
                    className={`btn-light float-left ${showSettings ? 'd-none' : ''}`}
                    id="settings-button">
                    <i className="fas fa-cog"></i>
                </Button>
            </footer>
        </>
    );
};