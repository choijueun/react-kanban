import axios from 'axios'
import Swal from 'sweetalert2'

export const sAlert = (title, msg, icon, timer=2000)=>{
    const option = {
        title: title,
        text: msg,
        icon: icon,
        position: 'center',

        showConfirmButton: false,
        // confirmButtonColor: '#3085d6',
        // confirmButtonText: 'O',
        // confirmButtonAriaLabel: 'delete',

        showCancelButton: false,
        // cancelButtonColor: '#d33',
        // cancelButtonText: 'X',
        // cancelButtonAriaLabel: 'cancel',

        timer: timer
    }
    Swal.fire(option)
}

// SET CSS VAR
export const setTagColors = (data)=>{
    const tags = data
    tags.forEach((e,i)=>{
        document.documentElement.style.setProperty('--badge-project-'+e.idx, '#'+e.color);
    })
}

// GET VALUES
export const get_today = ()=>{
    const now = new Date()
    return now.toISOString().substring(0,10)
}

export const get_bounding = (e)=>{
    const card = e.getBoundingClientRect()
    const bounding = {
        minX: card.x,
        maxX: card.x + card.width,
        minY: card.y,
        maxY: card.y + card.height
    }
    return bounding 
}

// CONVERT
export const get_status_obj = (sts=[], val)=>{
    let data = null
    sts.forEach((e)=>{
        if(e.value === val) {
            data = {
                value: e.value,
                label: e.label
            }
        }
    })
    return data
}


// TAG
export const get_tag = (dispatch, setTags)=>{
    // console.log('get_tag')
    axios.get('/tags')
        .then(res=>{
            const r = res.data
            if(r.success) {
                dispatch(setTags(r.data))
                setTagColors(r.data.project)
            }else {
                sAlert(null, '태그 불러오기 실패', 'error')
            }
        })
}

export const update_tags = (form_data_list)=>{
    // console.log('update_tags')
    // console.log(form_data_list)

    axios.post('/tags/update', form_data_list)
        .then(res=>{
            const r = res.data
            if(r.success) {
                sAlert('저장 성공', null, 'success')
            }else{
                sAlert('저장 실패', null, 'error')
            }
        })
}


// TASK
export const get_task = (dispatch, setTasks)=>{
    // console.log('get_task')
    axios.get('/task')
        .then(res=>{
            const r = res.data
            if(r.success) {
                dispatch(setTasks(r.data))
            }else {
                sAlert(null, '정보 불러오기 실패', 'error')
            }
    })
}

export const create_task = (form_data)=>{
    // console.log('create_task')
    // console.log(form_data)

    axios.post('/task/create', form_data)
    .then(res=>{
        const r = res.data
        if(r.success) {
            sAlert('등록 성공', null, 'success')
        }else{
            sAlert('등록 실패', null, 'error')
        }
    })
}

export const update_task = (form_data)=>{
    // console.log('update_task')
    // console.log(form_data)

    axios.post('/task/update', form_data)
        .then(res=>{
            const r = res.data
            if(r.success) {
                sAlert('수정 성공', null, 'success')
            }else{
                sAlert('수정 실패', null, 'error')
            }
        })
}

export const update_status = (idx, sts)=>{
    // console.log('update_status')
    // console.log('idx:',idx,'sts:',sts)

    axios.post('/task/update', {
        idx: idx,
        status: sts
    }).then(res=>{
        const r = res.data
        if(!r.success) {
            sAlert(null, '상태 변경에 실패했습니다.', 'error')
        }
    })
}

export const delete_task = (idx)=>{
    // console.log('delete_task')
    // console.log('idx:',idx)

    Swal.fire({
        text: '정말 삭제하시겠습니까?',
        icon: 'question',
        position: 'center',

        showConfirmButton: true,
        // confirmButtonColor: '#3085d6',
        confirmButtonText: 'O',
        confirmButtonAriaLabel: 'delete',

        showCancelButton: true,
        // cancelButtonColor: '#d33',
        cancelButtonText: 'X',
        cancelButtonAriaLabel: 'cancel'
    }).then(res=>{
        if(res.isConfirmed) {
            axios.post('/task/delete', {idx: idx})
                .then(res=>{
                    const r = res.data
                    if(r.success) {
                        sAlert('삭제 성공', null, 'success')
                        document.querySelector('#task-'+idx).remove()
                    }else {
                        sAlert('삭제 실패', null, 'error')
                    }
                })
        }
    })
}
