# pull official base image
FROM python:3.8.0-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add build-base postgresql-dev gcc python3-dev musl-dev libffi-dev

# install python dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

VOLUME /data

# copy project
COPY . /usr/src/app/

# Start command
CMD gunicorn --bind 0.0.0.0:5000 wsgi:app