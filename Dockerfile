FROM python:3.12-slim-bookworm

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN --mount=type=cache,target=/root/.cache \
    pip install -r requirements.txt

EXPOSE 8000

CMD ["/app/manage.py", "runserver_plus", "0.0.0.0:8000"]
