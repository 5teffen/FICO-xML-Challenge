from flask import Flask
from flask import request, jsonify, json
from flask import render_template
import pandas as pd
import numpy as np
from SVM_model import SVM_model
 

# ------ Initialize model ------- #

from ILE import instance_explanation, prepare_for_D3, divide_data_bins

df = pd.read_csv("working_data_full.csv")
vals = df.values
X = vals[:,2:]
y = vals[:,1]

no_samples, no_features = X.shape

svm_model = SVM_model(None,"working_data_full.csv")
svm_model.train_model(0.001)
svm_model.test_model()

bins_centred, X_pos_array, init_vals = divide_data_bins(X,[9,10])


#------ Initialize WebApp ------- #

app = Flask(__name__, static_folder="C:/Users/Oscar/Documents/UGR 2018/Fico-Challenge-master/VisualApp1/static")

@app.route('/intro')
def loading_site():
	return render_template("index_intro.html")

@app.route('/')
def main_site():
    return render_template("scratchindex.html")

@app.route('/instance', methods=['GET'])
def handle_request():
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
				if predicted != ground_truth:
					model_correct = 0
				category = "NN";
				if (predicted, model_correct) == (0,0):
					category = "FN"
				elif (predicted, model_correct) == (0,1):
					category = "TN"
				elif (predicted, model_correct) == (1,0):
					category = "FP"
				elif (predicted, model_correct) == (1,1):
					category = "TP"

				### Run MSC Algorithm 
				change_vector, change_row, anchors, percent = instance_explanation(svm_model, X, X[sample], sample, X_pos_array, bins_centred)

				### Parse values into python dictionary
				ret_string = ""
				data_array = prepare_for_D3(X[sample], bins_centred, change_row, anchors, percent)
				for dct in data_array:
					ret_string += json.dumps(dct)
					ret_string += "~"
				ret_string += json.dumps({'sample': sample, 'good_percent': good_percent, 'model_correct': model_correct, 'category': category, 'predicted': predicted})

				return ret_string

if __name__ == '__main__':

	app.run(port=5005, debug=True)
