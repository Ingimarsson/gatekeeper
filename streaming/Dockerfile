FROM alpine

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update && apk add python3 ffmpeg

VOLUME /data

COPY ./app/ /usr/src/app/

CMD ["python3", "main.py"]

