import React, { useState, useEffect } from 'react';
import { Button, InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap';
import { apiRequest } from '../helpers/AuthorizeTokenHelper';
import './TodoItem.css';

export interface ITodoItem
{
    id?: number,
    todoListId?: number,
    description?: string,
    finished?: boolean
};

export const TodoItem: any = (props: any) =>
{
    const [updateItem, setUpdateItem] = useState<ITodoItem>({});

    const getItemCopy = () =>
    {
        let todoItem: ITodoItem = {
            id: props.id,
            description: props.description,
            finished: props.finished,
            todoListId: props.todoListId
        };
        return todoItem;
    };

    const todoItemChanged = (event: any) =>
    {
        setUpdateItem({ ...updateItem, description: event.target.value });
    };

    const updateTodoItem = async (event: any, id?: number) =>
    {
        let item = getItemCopy();
        if (event.target.type === 'checkbox')
        {
            item.finished = props.finished ? false : true;
        } else
        {
            item.description = updateItem.description;
        }

        await apiRequest('api/todoitems', 'put', id, item);
        setUpdateItem(item);
    };

    const deleteTodoItem = async (id?: number) =>
    {
        props.delete(id);
    };

    useEffect(() =>
    {
        setUpdateItem(getItemCopy());
    }, []);

    return (
        <InputGroup className="col-lg-12">
            <InputGroupAddon addonType="prepend">
                <InputGroupText>
                    <Input addon type="checkbox" title="mark as finished"
                        defaultChecked={props.finished}
                        onClick={(event) => updateTodoItem(event, props.id)}
                        onTouchEnd={(event) => updateTodoItem(event, props.id)} />
                </InputGroupText>
            </InputGroupAddon>
            <Input defaultValue={props.description}
                onChange={todoItemChanged}
                onBlur={(event) => updateTodoItem(event, props.id)} />
            <InputGroupAddon addonType="append">
                <Button className="btn-light" title="update description"
                    onClick={(event) => updateTodoItem(event, props.id)}>
                    <i className="fas fa-pen"></i>
                </Button>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
                <Button className="btn-light" title="delete todo item"
                    onClick={() => deleteTodoItem(props.id)}>
                    <i className="fas fa-times"></i>
                </Button>
            </InputGroupAddon>
        </InputGroup>
    );
};