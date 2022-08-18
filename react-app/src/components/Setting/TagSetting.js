import React, { useEffect, useState } from 'react'
import { Input, InputGroup, InputGroupText, Table } from 'reactstrap'

function TagSetting(props) {
    const tags = props.tags
    const [ trs, setTrs ] = useState([])
    useEffect(()=>{
        let tlist = []
        tags.forEach((e,i)=>{
            tlist = tlist.concat(<tr key={i}>
                <td>
                    <Input type='hidden' name='idx' defaultValue={e.idx} />
                    {e.idx ?
                        <Input type='text' name='value' defaultValue={e.value} disabled />
                    :
                        <Input type='text' name='value' defaultValue={e.value} />
                    }
                </td>
                <td>
                    <Input type='text' name='label' defaultValue={e.label}/>
                </td>
                <td>
                    <InputGroup>
                        <InputGroupText>#</InputGroupText>
                        <Input type='text' name='color'
                            defaultValue={e.color} style={{backgroundColor: '#'+e.color, color: '#FFF', border: '1px solid #'+e.color}}/>
                    </InputGroup>
                </td>
            </tr>)
        })
        setTrs(tlist)
    }, [tags])

    return <>
    <Table borderless>
        <thead>
            <tr>
                <th>tag</th>
                <th>name</th>
                <th>color</th>
            </tr>
        </thead>
        <tbody>
            {trs}
        </tbody>
    </Table>
    </>
}

export default TagSetting