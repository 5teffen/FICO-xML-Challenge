from flask import Flask
from flask import request, jsonify, json
from flask import render_template
import pandas as pd
import numpy as np
from SVM_model import SVM_model


# ------ Initialize model ------- #

df = pd.read_csv("working_data_full.csv")
vals = df.values
X = vals[:,2:]
y = vals[:,1]

no_samples, no_features = X.shape

svm_model = SVM_model(None, "working_data_full.csv")
svm_model.train_model(0.001)
svm_model.test_model()


# ------ Initialize WebApp ------- #

app = Flask(__name__, static_folder="C:/Users/Oscar/Documents/UGR 2018/Fico-Challenge-master/VisualApp1/static")

@app.route('/')
def my_form():
    return render_template("scratchindex.html")

@app.route('/instance', methods=['GET'])
def my_form_post():
	if request.method == 'GET':
		sample = 0
		try:
			sample = int(request.args.get('sample'))
		except:
			return "Please enter a sample number in the range (1, 10459)."
		if sample:
			print(sample)
			if sample<1 or sample>10459:
				return "Please enter a sample number in the range (1, 10459)."
			else:
				good_percent = svm_model.run_model(X[sample])
				predicted = 0
				if good_percent>.5:
					predicted = 1
				ground_truth = y[sample]
				model_correct = 1
				if predicted!=ground_truth:
					model_correct=0
				return jsonify({'sample': sample, 'good_percent': good_percent, 'model_correct': model_correct})

				### Run MSC Algorithm 

				### Parse values into python dictionary

				###

				

if __name__ == '__main__':
	print(type(json.dumps({'sample': 'a', 'good_percent': 'b', 'model_correct': 'c'})))
	app.run(port=5005, debug=True)
