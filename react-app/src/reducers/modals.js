const TOGGLE = 'MODALS/TOGGLE'
const TYPE = 'MODALS/TYPE'
const TASK = 'MODALS/TASK'

export const toggleModal = data=>({type:TOGGLE})
export const setType = data=>({type:TYPE, data:data})
export const setTask = data=>({type:TASK, data:data})

const initialState = {
    isOpen: false,
    type: 'add',
    task: {
        idx : '',
        name : '',
        tags : '',
        status : 'todo',
        date : ''
    }
}

const modals = (state=initialState, action)=>{
    switch(action.type) {
        case TOGGLE:
            return {...state, isOpen: !state.isOpen}
        case TYPE:
            return {...state, type: action.data}
        case TASK:
            return {...state, task: action.data}
        default:
            return state
    }
}
export default modals