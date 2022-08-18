import { combineReducers } from "redux"

import bounding from './bounding'
import tasks from './tasks'
import modals from './modals'
import tags from './tags'

// 여러 reducer를 하나로 묶어준다
const rootReducer = combineReducers({
    bounding, tasks, modals, tags
})

export default rootReducer;