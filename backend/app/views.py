from app import app

from flask import jsonify

@app.errorhandler(400)
def bad_request(e):
  response = {
    "message": "Bad request."
  }

  return jsonify(response), 400

@app.errorhandler(401)
def unauthorized(e):
  response = {
    "message": "You don't have permission."
  }

  return jsonify(response), 401

@app.errorhandler(404)
def not_found(e):
  response = {
    "message": "Resource not found."
  }

  return jsonify(response), 404

@app.errorhandler(500)
def not_found(e):
  response = {
    "message": "Internal server error."
  }

  return jsonify(response), 500

