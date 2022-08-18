import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, CardTitle } from 'reactstrap'

import { useDispatch, useSelector } from 'react-redux';
import { toggleModal, setTask, setType } from '../../reducers/modals'

import * as common from '../../commons/common'
import Content from '../Content/Content'
import './CardList.css'

function CardList(props) {
    const dispatch = useDispatch()
    const id = props.status.value
    const name = props.status.label
    
    // TASK
    const task_data = useSelector(state=>state.tasks[id])
    const [ CONTENTS, setCONTENTS ] = useState([])
    useEffect(()=>{
        // CONTENT LIST
        let cont_list = []
        task_data.forEach((el, idx)=>{
            // el : {idx, title, tags, status, date}
            cont_list = cont_list.concat(<Content key={idx} data={el} />)
        })
        setCONTENTS(cont_list)
    }, [props, task_data])

    // ADD
    const openAdd = ()=>{
        // modal type
        dispatch(setType('add'))
        let set_default = {
            idx : '',
            name : '',
            tags : '',
            status : id,
            date : common.get_today()
        }
        // modal values
        dispatch(setTask(set_default))
        // modal open
        dispatch(toggleModal()) 
    }

    return (
    <div id={id+'-list'} className='task-list'>
        <Card>
            <CardTitle className='task-title'>
                <Badge className={'task-title-'+id}>
                    {name}
                </Badge>
                <Button className='task-add' size='sm' color='light' onClick={openAdd}>
                    +
                </Button>
            </CardTitle>

            {CONTENTS}
        </Card>
    </div>
    )
}

export default CardList