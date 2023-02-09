import requests
from flask import Flask, request, jsonify
from flask_cors import cross_origin

import rate_my_professor

rmp = rate_my_professor.RateMyProfessor()
app = Flask(__name__)


@app.route('/teacher-ratings/', methods=['GET'])
@cross_origin()
def get_teacher_ratings():
    """
    Returns a teacher's rating data based on their name.
    """
    teacher_name = request.args.get('name')
    search_result = rmp.search_teachers(teacher_name)

    if teacher_name in search_result:
        teacher_id = search_result[teacher_name]
        return jsonify(rmp.get_teacher_ratings(teacher_id))
    else:
        return jsonify({})


@app.route('/schedule/', methods=['GET'])
@cross_origin()
def get_schedule():
    """
    Returns schedule data by proxying UF SOC API
    using same query parameters as accessed with this URL.
    """
    payload = request.args
    response = requests.get(
        "https://one.ufl.edu/apix/soc/schedule/",
        params=payload,
        timeout=10,
    )
    return jsonify(response.json())


if __name__ == '__main__':
    app.run()
