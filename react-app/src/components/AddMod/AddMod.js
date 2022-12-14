import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'

import Select from 'react-select'
import DatePicker from "react-datepicker";

import { toggleModal } from '../../reducers/modals'
import './AddMod.css'
import * as common from '../../commons/common'
import { setTasks } from '../../reducers/tasks';


function DateComponent(props) {
    const selected = props.selected
    const onChange = props.onChange
    // FORMAT
    const dateToString = (val) => {
        const date = new Date(val)
        const [year, month, day] = [
            date.getFullYear(),
            (date.getMonth() + 1).toString().padStart(2, '0')
            ,date.getDate().toString().padStart(2, '0')]
        
        return year+'-'+month+'-'+day
    }

    const CustomInput = React.forwardRef(({value, onClick}, ref)=>(
        <Input id='task-modal-date' defaultValue={dateToString(value)} onClick={onClick} />
    ))

    return (
        <DatePicker
            selected={selected}
            onChange={onChange}
            customInput={<CustomInput />}
        />
    );
}


function AddMod() {
    // MODAL TOGGLE
    const isOpen = useSelector(state=>state.modals.isOpen)
    const dispatch = useDispatch()
    const toggle = ()=>{ dispatch(toggleModal()) }

    // ADD or MOD
    const type = useSelector(state=>state.modals.type)
    // OPTIONS
    const projects = useSelector(state=>state.tags.project)
    const sts_list = useSelector(state=>state.tags.status)
    
    // DEFAULT
    const default_task = useSelector(state=>state.modals.task)
    // SELECT VALUE
    const [ sel_tags, set_sel_tags ] = useState()
    const [ sel_sts, set_sel_sts ] = useState()
    const [ sel_date, set_sel_date ] = useState()
    const changeSelTags   = (val)=>{ set_sel_tags(val) }
    const changeSelStatus = (val)=>{ set_sel_sts(val) }
    const changeSelDate = (val)=>{ set_sel_date(val) }

    useEffect(()=>{
        const d = default_task
        set_sel_tags(d.tags)
        const sts_obj = common.get_status_obj(sts_list, d.status)
        set_sel_sts(sts_obj)
        set_sel_date(new Date(d.date))
    }, [isOpen, default_task, sts_list])

    // SUBMIT
    const submit = ()=>{
        const idx = document.querySelector('#task-modal-idx').value
        // ??????
        const name = document.querySelector('#task-modal-name').value
        if(!name) {
            common.sAlert(null, '????????? ???????????????.', 'warning')
            return
        }
        // ????????????
        // if(!sel_tags) {
        //     common.sAlert(null, '??????????????? ???????????????.', 'warning')
        //     return
        // }
        let tags = []
        if(sel_tags) {
            sel_tags.forEach((e, i)=>{
                tags = tags.concat(e.value)
            })
        }
        // ??????
        if(!sel_sts) {
            common.sAlert(null, '????????? ???????????????.', 'warning')
            return
        }
        // ??????
        const date = document.querySelector('#task-modal-date').value
        if(!date) {
            common.sAlert(null, '??????????????? ???????????????.', 'warning')
            return
        }

        const form_data = {
            idx: idx,
            name: name,
            tags: tags.join(','),
            status: sel_sts.value,
            date: date
        }
        if(type === 'add') {
            common.create_task(form_data)
        }else{
            common.update_task(form_data)
        }
        common.get_task(dispatch, setTasks)
        toggle()
    }
    
    return <>
        <Modal id='task-modal' isOpen={isOpen}>
            <ModalHeader toggle={toggle}>
                { type === 'add' ? '?????? ??????' : '?????? ??????' }
            </ModalHeader>
            <ModalBody>
                <div className='mb-3'>
                    <Label for='task-modal-name'>??????</Label>
                    <Input id='task-modal-name' type='text' placeholder='?????? ?????? - ?????????' defaultValue={ default_task.title } />
                    <Input id='task-modal-idx' type='hidden' value={ default_task.idx } />
                </div>
                <div className='mb-3'>
                    <Label for='task-modal-project'>????????????</Label>
                    <Select id='task-modal-project' 
                        closeMenuOnSelect={false}
                        isMulti
                        value={ sel_tags }
                        options={ projects }
                        onChange={changeSelTags} 
                    />
                </div>
                <div className='mb-3'>
                    <Label for='task-modal-status'>??????</Label>
                    <Select id='task-modal-status'
                        closeMenuOnSelect={true}
                        value={ sel_sts }
                        options={sts_list} 
                        onChange={changeSelStatus}
                    />
                </div>
                <div className='mb-3'>
                    <Label for='task-modal-date'>????????????</Label>
                    <DateComponent selected={sel_date} onChange={changeSelDate} />
                </div>
                <div className='mb-3 task-modal-buttons'>
                    <Button color='danger' outline onClick={toggle}>
                        ??????
                    </Button>
                    <Button color='primary' outline onClick={submit}>
                        { type === 'add' ? '??????' : '??????'}
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    </>
}

export default AddMod