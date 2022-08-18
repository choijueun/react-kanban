import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import * as common from '../../commons/common'
import { boundingSetting } from '../../reducers/bounding'

import AddMod from '../AddMod/AddMod'
import CardList from '../CardList/CardList'
import Setting from '../Setting/Setting'
import './TaskBoard.css'

function TaskBoard() {
    const dispatch = useDispatch()
    const status_tags = useSelector(state=>state.tags.status)

    const [ cardList, setCardList ] = useState([])

    // TODO DOING DONE SECTIONS
    useEffect(()=>{
        let tmpList = []
        for(let i in status_tags) {
            tmpList = tmpList.concat(<CardList key={i} status={status_tags[i]} />)
        }
        setCardList(tmpList)
    }, [status_tags])
    
    // ELEMENT BOUNDARY
    useEffect(()=>{
        const all_cards = document.querySelectorAll('.task-list')
        let data = {}
        all_cards.forEach((e, i)=>{
            const key = e.id.split('-')[0]
            data[key] = common.get_bounding(e)
        })
        dispatch(boundingSetting(data))
    }, [dispatch, cardList])


    return <>
        <Setting/>
        <div className='task-board'>
            {cardList}
        </div>
        <AddMod/>
    </>
}

export default TaskBoard