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
    activeSetting: boolean
}

export const TimerSetting = (props: any) => {

    const [authenticated, setAuthentication] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [timerSettings, setTimerSettings] = useState<ITimerSetting[]>([]);
    const [currentSetting, setCurrentSetting] = useState<ITimerSetting>({
        id: 0,
        description: 'Default',
        sessionMinutes: 15,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        longBreakInterval: 4,
        activeSetting: true
    });

    const getAllTimerSettings = async () => {

        setAuthentication(await authService.isAuthenticated());
        if (authenticated) {

            let response: ITimerSetting[] = await apiRequest('api/timerSettings', 'get');
            if (response.length > 0) {
                setTimerSettings(response);
            }
        }
    }

    const timerSettingUpdating = async (event: any) => {
        switch (event.target.id) {
            case 'session-minutes':
                setCurrentSetting({ ...currentSetting, sessionMinutes: parseInt(event.target.value) });
                break;
            case 'short-break-minutes':
                setCurrentSetting({ ...currentSetting, shortBreakMinutes: parseInt(event.target.value) });
                break;
            case 'long-break-minutes':
                setCurrentSetting({ ...currentSetting, longBreakMinutes: parseInt(event.target.value) });
                break;
            case 'break-interval':
                setCurrentSetting({ ...currentSetting, longBreakInterval: parseInt(event.target.value) });
                break;
        }
    }

    const toggleSettingsView = async () => {

        setShowSettings(!showSettings);
        await updateTimerSetting();      
    }

    //TODO - continue on finishing timer setting logic
    const updateTimerSetting = async () => {

        if (authenticated) {

            if (currentSetting.id === 0) {
                await addTimerSetting();
            }
            else {
                await apiRequest('api/timerSettings', 'put', currentSetting.id, currentSetting);
            }
        }
    }

    const addTimerSetting = async () => {

        if (authenticated) {

            let response: ITimerSetting = await apiRequest('api/timerSettings', 'post', 0, currentSetting);
            console.log('added timer setting');
            console.log(response);
            setCurrentSetting(response);

            if (timerSettings.length > 0) {

                timerSettings.forEach(async setting => {

                    if (setting.activeSetting) {

                        setting.activeSetting = false;
                        await apiRequest('api/timerSettings', 'put', setting.id, setting);
                    }
                });
            }

            setTimerSettings([...timerSettings, response]);
        }
    }

    useEffect(() => {
        getAllTimerSettings();
    }, []);

    useEffect(() => {

    }, [currentSetting]);

    return (
        <>
            <Timer timerSetting={currentSetting} />
            <div className={`settings-page ${showSettings ? 'show' : ''}`} id="settings-page-slide">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card mb-2">
                            <div className="card-header py-2">
                                <Button onClick={toggleSettingsView}
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
                                        <label>Description</label>
                                        <div className="d-flex flex-lg-row">
                                            <input type="number" className="form-control"
                                                id="session-minutes"
                                                value={currentSetting.description}
                                                onChange={timerSettingUpdating} />
                                            <label className="p-2">Minutes</label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Session Duration</label>
                                        <div className="d-flex flex-lg-row">
                                            <input type="number" className="form-control"
                                                id="session-minutes"
                                                value={currentSetting.sessionMinutes}
                                                onChange={timerSettingUpdating} />
                                            <label className="p-2">Minutes</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Short Break Duration</label>
                                        <div className="d-flex flex-lg-row">
                                            <input type="number" className="form-control"
                                                id="short-break-minutes"
                                                value={currentSetting.shortBreakMinutes}
                                                onChange={timerSettingUpdating} />
                                            <label className="p-2">Minutes</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Long Break Duration</label>
                                        <div className="d-flex flex-lg-row">
                                            <input type="number" className="form-control"
                                                id="long-break-minutes"
                                                value={currentSetting.longBreakMinutes}
                                                onChange={timerSettingUpdating} />
                                            <label className="p-2">Minutes</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Long Break Interval</label>
                                        <div className="d-flex flex-lg-row">
                                            <input type="number" className="form-control"
                                                id="break-interval"
                                                value={currentSetting.longBreakInterval}
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