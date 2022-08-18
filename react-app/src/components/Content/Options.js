import React, {useEffect, useState} from 'react'
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'

import * as common from '../../commons/common'

import { useDispatch, useSelector } from 'react-redux'
import { setTask, setType, toggleModal } from '../../reducers/modals'
import Swal from 'sweetalert2'


function Options(props) {
    const idx = props.idx

    // dropdown
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false)
    const dropDownToggle = (e)=>{ setIsDropdownOpen(!isDropdownOpen) }

    // mod & del
    const dispatch = useDispatch()
    const all_task = useSelector(state=>state.tasks)

    const openMod = ()=>{
        // modal type
        dispatch(setType('mod'))
        // modal value
        for(let key in all_task) {
            const task_list = all_task[key]
            task_list.forEach(task => {
                if(task.idx === idx) {
                    dispatch(setTask(task))
                }
            });
        }
        // modal open
        dispatch(toggleModal()) 
    }

    const delTask = ()=>{
        common.delete_task(idx)
        // Swal.fire({
        //     text: '정말 삭제하시겠습니까?',
        //     icon: 'question',
        //     position: 'center',
    
        //     showConfirmButton: true,
        //     // confirmButtonColor: '#3085d6',
        //     confirmButtonText: 'O',
        //     confirmButtonAriaLabel: 'delete',
    
        //     showCancelButton: true,
        //     // cancelButtonColor: '#d33',
        //     cancelButtonText: 'X',
        //     cancelButtonAriaLabel: 'cancel'
        // }).then(res=>{
        //     if(res.isConfirmed) {
        //         common.delete_task(idx)
        //     }
        // })
    }

    return <>
        <ButtonDropdown isOpen={isDropdownOpen} toggle={dropDownToggle}>
            <DropdownToggle className='task-option-toggle' color='light' caret size='sm' />
            <DropdownMenu>
                <DropdownItem onClick={openMod}>수정</DropdownItem>
                {/* <DropdownItem>복제</DropdownItem> */}
                <DropdownItem onClick={delTask}>삭제</DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>
    </>
}

export default Options