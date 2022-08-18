import React, { useEffect, useRef, useState } from 'react'
import {
    Card, CardBody, CardTitle, CardFooter,
    Badge
} from 'reactstrap'
import PropTypes from 'prop-types'

import './Content.css'
import Options from './Options'
import { useDispatch, useSelector } from 'react-redux'
import * as common from '../../commons/common'
import { setTasks } from '../../reducers/tasks'

// 날짜 & 상태
function TaskMarks(props) {
    const [dateColor, setDateColor] = useState('')
    const [taskDate, setTaskDate] = useState(props.date)

    useEffect(()=>{
        const target_date = new Date(props.date)
        // 목표일자 오늘 또는 그 이전 => RED
        const now = new Date()
        const diffDays = Math.round((target_date - now) / (1000 * 60 * 60 * 24)); 
        if ( diffDays < 1 ){
            setDateColor('danger')
        }else {
            setDateColor('secondary')
        }
        // DATE FORMAT
        setTaskDate(target_date.toISOString().substring(0,10))
    }, [props])


    return <>
        <Badge className={'task-end-date'} color={dateColor}>{taskDate}</Badge>
        {/* <Badge className={'task-'+props.status.code} color={props.status.color}>{props.status.name}</Badge> */}
    </>
}

// 프로젝트 태그
function TaskTags(props) {
    let [tagList, setTagList] = useState([])
    useEffect(()=>{
        let tmp = []
        for(let i in props.tags) {
            const tag = props.tags[i]
            tmp = tmp.concat(<Badge key={i} 
                className={'project-'+tag.idx}
                pill>{tag.label}</Badge>)
        }
        setTagList(tmp)
    }, [props])

    return <>
        {tagList}
    </>
}

function Content(props) {
    const {idx, title, tags, status, date} = props.data

    const dispatch = useDispatch()
    const cardRef = useRef()
    const blankRef = useRef()
    
    const bounding = useSelector(state=>state.bounding)

    useEffect(()=>{
        class dragNdrop {
            constructor(card, blank){
                this.card = card
                // this.blank = blank
                this.card.style.position = 'fixed'
                this.card.style.zIndex = 1000;
                // this.blank.style.display = 'none'
            }
            grapCard = (x, y)=>{
                this.card.style.left = (x - this.card.offsetWidth/2) + 'px'
                this.card.style.top = (y - this.card.offsetHeight/2) + 'px'
                // this.blank.style.display = 'block'
            }
            dragCard = (e)=>{
                this.grapCard(e.pageX, e.pageY)
            }
            dropCard = (e)=>{
                this.card.style.position = 'static'
                this.card.style.zIndex = 0;
                // this.blank.style.display = 'none'
            }

            move_card = (x,y)=>{
                for(let key in bounding) {
                    if( x >= bounding[key].minX && x <= bounding[key].maxX
                        && y >= bounding[key].minY ) {
                        common.update_status(idx, key)
                        common.get_task(dispatch, setTasks)
                    }
                }
            }
        }
        
        const card = cardRef.current
        const blank = blankRef.current
        card.onmousedown = (e)=>{
            card.ondragstart = null
            // right click or option button
            if(e.which === 3 || e.target.closest('.card-option')) {
                return false
            }
            const dnd = new dragNdrop(card, blank)
            // drag
            dnd.grapCard(e.pageX, e.pageY)
            document.addEventListener('mousemove', dnd.dragCard);
            // drop
            card.onmouseup = (e)=>{
                // right click or option button
                if(e.which === 3 || e.target.closest('.card-option')) {
                    return false
                }
                dnd.move_card(e.pageX, e.pageY)

                document.removeEventListener('mousemove', dnd.dragCard);
                dnd.dropCard(e)
            }
        }
    }, [dispatch, bounding, idx])

    return <>
    <div ref={cardRef} >
        <Card id={'task-'+idx} className='task-card'>
            <CardBody>
                <CardTitle> 
                    {title} 
                </CardTitle>
                <div className='card-tags'>
                    <TaskTags tags={tags}/>
                </div>
            </CardBody>
            <CardFooter>
                <div className='card-marks'>
                    <TaskMarks date={date} status={status} />
                </div>
                <div className='card-option'>
                    <Options idx={idx} />
                </div>
            </CardFooter>
        </Card>
    </div>
    <div className='task-blank' ref={blankRef} />
    </>
}
Content.propTypes = {
    data: PropTypes.shape({
        idx: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        tags: PropTypes.array.isRequired,
        status: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
    })
}

export default Content