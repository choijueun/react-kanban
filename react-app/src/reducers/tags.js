const PROJECT = 'TAGS/PROJECT'
const STATUS = 'TAGS/STATUS'
const SETTAG = 'TAGS/SETTAG'

export const setProject = data=>({type:PROJECT, data:data})
export const setStatus = data=>({type:STATUS, data:data})
export const setTags = data=>({type:SETTAG, data:data})

const initialState = {
    project: [],
    status: []
}

const tags = (state=initialState, action)=>{
    switch(action.type) {
        case PROJECT:
            return {...state, project: action.data}
        case STATUS:
            return {...state, status: action.data}
        case SETTAG:
            return {...state, ...action.data}
        default:
            return state
    }
}
export default tags