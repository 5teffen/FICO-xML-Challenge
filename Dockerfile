FROM python:3.6
RUN mkdir /app
WORKDIR /app
RUN pip install pandas flask numpy scipy sklearn
ADD . /app
WORKDIR /app/WebApp/
CMD python hello.py
