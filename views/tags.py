# -*- coding: utf-8 -*-
from workingboard import Flask, app, request, jsonify, adb
import traceback
import json

# 조회
@app.route('/tags', methods=['GET'])
def tags():
    data = get_tag_data()

    return jsonify(success=True, data=data)


# 등록/수정
@app.route('/tags/update', methods=['POST'])
def tags_update():
    data = json.loads(request.data)
    
    insert = ''
    for d in data:
        insert += """,({idx}, '{type}', '{code}', '{label}', '{color}')
        """.format( 
            idx = d['idx'].encode('utf-8'), 
            type = 'project', 
            code = d['value'].encode('utf-8'), 
            label = d['label'].encode('utf-8'), 
            color = d['color'].encode('utf-8') 
        )
    insert = insert.replace(',', '', 1)
    
    sql = """
        INSERT INTO taskboard_tags (no, tag_type, tag_code, tag_label, tag_color)
        VALUES
        {}
        ON DUPLICATE KEY UPDATE 
            tag_type=VALUES(tag_type),
            tag_code=VALUES(tag_code),
            tag_label=VALUES(tag_label),
            tag_color=VALUES(tag_color)
    """.format(insert)
        
    try:
        db = adb.Adb()
        db.execute(sql)
        db.close()
    except:
        traceback.print_exc()
        return jsonify(success=False)
    
    return jsonify(success=True)


def get_tag_data(key=None):
    where = ""
    if key:
        where = "WHERE `tag_type` = '%s'" % key
    
    sql = """
        SELECT 
            `no` as idx,
            tag_type as type,
            tag_code as value,
            tag_label as label,
            tag_color as color
        FROM taskboard_tags
        {}
        ORDER BY `no` ASC;
    """.format(where)
    
    try:
        db = adb.Adb()
        db.execute(sql)
        rs = db.fetchall_dict()
        db.close()
    except:
        traceback.print_exc()
        return {}
    
    data = {}
    for r in rs:
        if r['type'] in data:
            data[r['type']].append(r)
        else:
            data[r['type']] = []
            data[r['type']].append(r)
    
    return data


# arr=['daps','esc','tims']
def convert_tags(tag_str, key):
    tag_arr = tag_str.split(',')
    data = []
    
    tagdata = get_tag_data(key)
    if tagdata:
        for tag in tagdata[key]:
            if str(tag['value']) in tag_arr:
                data.append(tag)
    
    return data
