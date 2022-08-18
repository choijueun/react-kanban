const SETTING = 'BOUNDING/SETTING'

export const boundingSetting = data =>  ( { type: SETTING,  data: data } )

const initialState = {
    todo: {},
    doing: {},
    done: {}
}

const bounding = (state=initialState, action)=>{
    switch(action.type) {
        case SETTING:
            return {...state, ...action.data}
        default:
            return state
    }
}
export default bounding