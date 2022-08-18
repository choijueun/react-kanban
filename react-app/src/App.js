import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import './App.css';
import * as common from './commons/common';
import TaskBoard from './components/TaskBoard/TaskBoard';

import { setTags } from './reducers/tags';
import { setTasks } from './reducers/tasks';

function App() {
    const dispatch = useDispatch()
    useEffect(()=>{
        // GET TASK
        common.get_task(dispatch, setTasks)
        // GET TAG & STATUS
        common.get_tag(dispatch, setTags)
    }, [])

    return (
        <div className="App">
            <TaskBoard />
        </div>
    );
}

export default App;
