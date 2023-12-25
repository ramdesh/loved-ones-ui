from python:3.7

copy . /app
WORKDIR /app

CMD python -m http.server 8080

EXPOSE 8080