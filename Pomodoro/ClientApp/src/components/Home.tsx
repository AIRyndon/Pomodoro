import React, { Component } from 'react';
import { Timer } from './Timer';
import { TodoList } from './TodoList';
import authService from './api-authorization/AuthorizeService'
import { TimerSetting } from './TimerSetting';

export class Home extends Component
{
    static displayName = Home.name;
    loggedIn = false;
    state = { mainList: <i></i> };

    constructor(props: any)
    {
        super(props);
    }

    componentDidMount = async () =>
    {
        this.loggedIn = await authService.isAuthenticated();
        let list = this.displayList();
        this.setState({ mainList: list });
    };

    displayList = () =>
    {
        let element;
        if (this.loggedIn)
        {
            element = <TodoList {...this.props} />;
        }
        else
        {
            element = <i></i>;
        }
        return element;
    }

    render()
    {
        return (
            <>
                <TimerSetting />
                {this.state.mainList}
            </>
        );
    }
}
