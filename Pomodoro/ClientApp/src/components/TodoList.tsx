import React, { useState, useEffect } from 'react';
import { Button, InputGroup, Input, InputGroupAddon, Card, CardHeader, CardBody } from 'reactstrap';
import { apiRequest } from '../helpers/AuthorizeTokenHelper';
import authService from './api-authorization/AuthorizeService';
import * as SignalR from '@aspnet/signalr';
import { ITodoItem, TodoItem } from './TodoItem';
import toast from 'toasted-notes';
import 'toasted-notes/src/styles.css';
import './TodoList.css';

interface ITodoList
{
    id?: number,
    description: string,
    mainList: boolean,
    todoItems: ITodoItem[]
}

export const TodoList = (props: any) =>
{
    const urlPath = props.location.pathname;
    const [lists, setLists] = useState<ITodoList[]>([]);
    const [newList, setNewList] = useState({});
    const [deletedList, setDeletedList] = useState({});
    const [newListDescription, setNewListDescription] = useState('');
    const [listToUpdate, setListToUpdate] = useState<ITodoList>({ description: '', todoItems: [], mainList: false });
    const [addedItem, setAddedItem] = useState<ITodoItem>({ description: '', finished: false });
    const [deletedItem, setDeletedItem] = useState<ITodoItem>({});
    const [inputDisabled, setInputDisabled] = useState(true);
    const [signalR, setSignalR] = useState();
    const [authUser, setAuthUser] = useState();

    const showAddListArea = () =>
    {
        let element: any;

        if (urlPath === '/todo-lists')
        {
            element =
                <>
                    <h2>Your Todos</h2>
                    <InputGroup className="col-lg-6">
                        <Input disabled={inputDisabled}
                            placeholder="List Description"
                            value={newListDescription}
                            onChange={newListChanged} />
                        <InputGroupAddon addonType="append">
                            <Button disabled={inputDisabled} title="add todo list"
                                onClick={handleAddList}>Add list</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </>
        } else
        {
            element = <h3>Your pinned task</h3>
        }
        return element;
    }

    const getAllLists = async () =>
    {
        let response: any;
        if (urlPath === '/todo-lists')
        {
            response = await apiRequest('api/todoLists', 'get');
        }
        else
        {
            response = await apiRequest('api/mainList', 'get');
        }

        const data: ITodoList[] = response;
        setLists(data);
        console.log(lists);
    };

    const handleAddList = async () =>
    {
        await signalR.invoke("SendListAdded", `${authUser.name} created a list just now`);
        await addList();
    };

    const addList = async () =>
    {
        let newList: ITodoList = {
            description: newListDescription ? newListDescription : 'New List',
            mainList: false,
            todoItems: []
        };

        await apiRequest('api/todoLists', 'post', 0, newList);
        setNewList({});
    };

    const newListChanged = (event: any) =>
    {
        setNewListDescription(event.target.value);
    };

    const pinToHomePage = async (item: ITodoList, id: number) =>
    {
        lists.forEach(async (list) =>
        {
            //only one list item can be put in the home page, this makes sure all the other lists
            //will have the flag set to false. The downside is all the calls back to the server
            if (list.id === id)
            {
                item = { ...list };
                item.mainList = true;
                await updateList(item, id);
            }
            else if (list.mainList)
            {
                //maybe this branch would at least help? only two calls back to the server.
                list.mainList = false;
                await updateList(list, list.id);
            }
        });
    }

    const updateList = async (item?: ITodoList, id?: number) =>
    {
        await apiRequest('api/todoLists', 'put', id, item);
    };

    const listUpdating = (event: any) =>
    {
        const value = event.target.value;

        lists.forEach((list) =>
        {
            //look for the correct list item to update
            if (list.id === parseInt(event.target.id))
            {
                list.description = value;
                setListToUpdate({ ...list });
            }
        });

        setLists(lists);
    };

    const deleteList = async (id?: number) =>
    {
        const deletedList:ITodoList = await apiRequest('api/todoLists', 'delete', id);
        setDeletedList(deletedList);
    };

    const handleAddItem = async (id?: number) =>
    {
        await signalR.invoke("SendItemAdded", `${authUser.name} added a todo item just now`);
        await addTodoItem(id);
    };

    const addTodoItem = async (id?: number) =>
    {
        let item: ITodoItem = {
            description: 'New Item',
            finished: false,
            todoListId: id
        }

        const response:ITodoItem = await apiRequest('api/todoItems', 'post', 0, item);
        setAddedItem(response);
    };

    const deleteTodoItem = async (id?: number) =>
    {
        const response:ITodoItem = await apiRequest('api/todoItems', 'delete', id);
        setDeletedItem(response);
    };

    useEffect(() =>
    {
        getAllLists();

    }, [newList, deletedList, addedItem, deletedItem]);

    useEffect(() =>
    {
        authService.getUser().then((result) =>
        {
            setAuthUser(result);
        }).catch((error) => console.log(error.toString()));

        //setup SignalR

        let connection = new SignalR.HubConnectionBuilder()
            .withUrl('/stats-hub').build();

        connection.on("ReceiveListAdded", (message) =>
        {
            toast.notify(message, {
                position: 'bottom-right'
            });
        });

        connection.on("ReceiveItemAdded", (message) =>
        {
            toast.notify(message, {
                position: 'bottom-right'
            });
        });

        connection.start().then((result) =>
        {
            setInputDisabled(false);

            return result;
        }).catch((error) => console.log(error.toString()));

        setSignalR(connection);

        return () =>
        {
            connection.off("ReceiveListAdded");
            connection.off("ReceiveItemAdded");
        };

    }, []);

    return (
        <>
            {showAddListArea()}
            <div className="row">
                {
                    lists.map((list: ITodoList) => (
                        <Card className="col-lg-5 m-2" key={list.id}>
                            <CardHeader className="pb-2">
                                <InputGroup className="col-lg-12">
                                    <InputGroupAddon addonType="prepend">
                                        <Button title="pin to home page" onClick={(event) =>
                                            pinToHomePage(listToUpdate, list.id as unknown as number)}
                                            className="btn-light">
                                            <i className="fas fa-thumbtack"></i>
                                        </Button>
                                    </InputGroupAddon>
                                    <Input id={list.id as unknown as string}
                                        value={list.description}
                                        onChange={listUpdating}
                                        onBlur={() => updateList(listToUpdate, list.id)} />
                                    <InputGroupAddon addonType="append">
                                        <Button className="btn-light" title="update description"
                                            onClick={() => updateList(listToUpdate, list.id)}>
                                            <i className="fas fa-pen"></i>
                                        </Button>
                                    </InputGroupAddon>
                                    <InputGroupAddon addonType="append">
                                        <Button className="btn-light" title="delete list"
                                            onClick={() => deleteList(list.id)}>
                                            <i className="fas fa-times"></i>
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                                <div className="col-lg-12">
                                    <Button disabled={inputDisabled} title="add todo item"
                                        className="btn-block"
                                        onClick={(event) => handleAddItem(list.id)}>Add Item</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {
                                    list.todoItems.map((item: ITodoItem) =>
                                        (<TodoItem key={item.id} todoListId={list.id}
                                            {...item}
                                            delete={deleteTodoItem}
                                        />))
                                }
                            </CardBody>
                        </Card>))
                }
            </div>

        </>
    );
};