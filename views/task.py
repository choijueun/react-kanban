# -*- coding: utf-8 -*-
from workingboard import Flask, app, request, jsonify, adb
import traceback
import json
from .tags import convert_tags 


# 조회
@app.route('/task', methods=['GET'])
def task():
    sql = """
        SELECT
            `no` as idx,
            task_name as title,
            task_tags as tags,
            task_status as status,
            task_date as date
        FROM taskboard_task
        ORDER BY `no` ASC;
    """
    try:
        db = adb.Adb()
        db.execute(sql)
        rs = db.fetchall_dict()
        db.close()
    except:
        traceback.print_exc()
        return jsonify(success=False)
    
    data = {}
    for r in rs:
        tmp = r.copy()
        tmp['tags'] = convert_tags(r['tags'], 'project')
        
        if r['status'] in data:
            data[r['status']].append(tmp)
        else:
            data[r['status']] = []
            data[r['status']].append(tmp)
        
    return jsonify(success=True, data=data)


# 등록
@app.route('/task/create', methods=['POST'])
def task_create():
    data = json.loads(request.data)
    name = data.get('name')
    tags = data.get('tags')
    status = data.get('status')
    date = data.get('date')
    
    sql = """
        INSERT INTO taskboard_task (task_name, task_tags, task_status, task_date, ctime)
        VALUES 
        (%(name)s, %(tags)s, %(status)s, %(date)s, NOW());
    """
    params = {
        'name': name,
        'tags': tags,
        'status': status,
        'date': date,
    }
    # print('params : %s' % params)
    try:
        db = adb.Adb()
        db.execute(sql, params)
        db.close()
    except:
        traceback.print_exc()
        return jsonify(success=False)
    
    return jsonify(success=True)


# 수정
@app.route('/task/update', methods=['POST'])
def task_update():
    data = json.loads(request.data)
    idx = data.get('idx')
    name = data.get('name', '')
    tags = data.get('tags', '')
    status = data.get('status', '')
    date = data.get('date', '')
    
    set = ''
    params = {'idx': str(idx)}
    if name:
        set += ",task_name = %(name)s "
        params['name'] = name.encode('utf-8')
    if tags:
        set += ",task_tags = %(tags)s "
        params['tags'] = tags.encode('utf-8')
    if status:
        set += ",task_status = %(status)s "
        params['status'] = status.encode('utf-8')
    if date:
        set += ",task_date = %(date)s "
        params['date'] = date.encode('utf-8')
    set = set.replace(',', '', 1)
    
    sql = """
        UPDATE taskboard_task
        SET {}
        WHERE no = %(idx)s
    """.format(set)

    try:
        db = adb.Adb()
        db.execute(sql, params)
        db.close()
    except:
        traceback.print_exc()
        return jsonify(success=False)
    
    return jsonify(success=True)


# 삭제
@app.route('/task/delete', methods=['POST'])
def task_delete():
    data = json.loads(request.data)
    idx = data['idx']
    
    sql = """
        DELETE FROM taskboard_task
        WHERE no = %(idx)s
    """
    params = {'idx': str(idx)}
    
    try:
        db = adb.Adb()
        db.execute(sql, params)
        db.close()
    except:
        traceback.print_exc()
        return jsonify(success=False)

    return jsonify(success=True)
    