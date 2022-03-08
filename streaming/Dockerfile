FROM alpine

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update && apk add python3 py3-pip ffmpeg
RUN apk add python3-dev postgresql-dev gcc musl-dev libffi-dev 

RUN pip3 install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip3 install -r requirements.txt

VOLUME /data

COPY ./app/ /usr/src/app/

CMD gunicorn --bind 0.0.0.0:8000 app:app
