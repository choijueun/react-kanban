const TASKSETTING = 'TASKS/SETTING'

export const setTasks = data =>  ( { type: TASKSETTING,  data } )

const initialState = {
    todo: [],
    doing: [],
    done: []
}

const tasks = (state=initialState, action)=>{
    switch(action.type) {
        case TASKSETTING:
            return {...state, ...action.data}
        default:
            return state
    }
}
export default tasks