from flask import Flask
from flask import request
from flask import render_template


def check(text1, text2):
	if text1 == text2:
		return 100
	else: return 0

app = Flask(__name__)
# app = Flask(__name__, static_folder='C:/Users/Oscar/Documents/UGR 2018/Fico-Challenge-master/WebApp-Flask/static')
@app.route('/')
def my_form():
    return render_template("scratchindex.html") # this should be the name of your html file

# @app.route('/', methods=['POST'])
# def my_form_post():
#     text1 = request.form['text1']
#     text2 = request.form['text2']
#     plagiarismPercent = check(text1,text2)
#     if plagiarismPercent > 50 :
#         return "<h1>Plagiarism Detected !</h1>"
#     else :
#         return "<h1>No Plagiarism Detected !</h1>"

if __name__ == '__main__':
    app.run()