import React, { useState } from 'react'
import { 
    Button
    , Modal, ModalBody
    , Nav, NavItem, NavLink
    , TabContent, TabPane 
} from 'reactstrap'

import './Setting.css'
import TagSetting from './TagSetting'

import * as common from '../../commons/common'
import { useDispatch, useSelector } from 'react-redux'
import { setProject, setTags } from '../../reducers/tags'

function Setting() {
    const [ isOpen, setIsOpen ] = useState(false)
    const toggle = e=>( setIsOpen(!isOpen) )
    const [ tabNo, setTabNo ] = useState(0)
    const dispatch = useDispatch()

    const tags = useSelector(state=>state.tags.project)
    
    const addForm = ()=>{
        const tmp = tags.concat({
            idx: '',
            type: 'project',
            value: '',
            label: '',
            color: ''
        })
        dispatch(setProject(tmp))
    }

    const submit = e=>{
        const rows = document.querySelectorAll('.task-setting-modal .tab-pane.active tbody tr')
        let form_data_list = []
        rows.forEach((tr, i)=>{
            const tmp = {
                idx : tr.querySelector("[name='idx']").value,
                value : tr.querySelector("[name='value']").value,
                label : tr.querySelector("[name='label']").value,
                color : tr.querySelector("[name='color']").value
            }
            if(tmp.value !== '' && tmp.label !== '') {
                form_data_list = form_data_list.concat(tmp)
            }
        })
        common.update_tags(form_data_list)
        common.get_tag(dispatch, setTags)
        toggle()
    }

    return (
    <div className='task-setting'>
        <Button className='task-setting-btn' size='sm' color='dark' onClick={toggle}>SETTING</Button>
        <Modal className='task-setting-modal' isOpen={isOpen} toggle={toggle}>
            <ModalBody>
                <Nav className='task-setting-tabnav' tabs>
                    <NavItem>
                        <NavLink onClick={ ()=>{setTabNo(0)} }>PROJECT TAG</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={tabNo}>
                    {/* TAB 0 : TAG */}
                    <TabPane tabId={0}>
                        <TagSetting tags={tags}/>
                    </TabPane>
                </TabContent>
                <div className='mb-3 task-setting-footer'>
                    <Button outline onClick={addForm}> 추가 </Button>
                    <Button color='primary' outline onClick={submit}> 저장 </Button>
                </div>
            </ModalBody>
        </Modal>
    </div>
    )
}

export default Setting