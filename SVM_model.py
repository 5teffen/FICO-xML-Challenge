import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn import svm


class ModelError(Exception):
    pass

class SVM_model():
	def __init__ (self,file_name):
		data = pd.read_csv(file_name).values
		data = np.delete(data, 0, 1) # Deletes First Row
		self.model = None

		# -- Replace missing values (arbitraty approach)-- 
		np.place(data, data == -7, 150)

		# -- Seperate --
		self.y = data[:,:1]
		self.X = StandardScaler().fit_transform(data[:,1:])

		self.num_samples , self.num_attributes = self.X.shape


		# -- Split Training/Test -- 
		self.X_tr = self.X[:int(0.8*self.num_samples)]
		self.X_test = self.X[int(0.8*self.num_samples):]

		self.y_tr = self.y[:int(0.8*self.num_samples)]
		self.y_test = self.y[int(0.8*self.num_samples):]


	def train_model(self,c_val=1):
		self.model = svm.SVC(kernel='linear',C=c_val,probability=True)

		self.model.fit(self.X_tr,self.y_tr.reshape(self.y_tr.shape[0],))


	def test_model(self, X_ts=None, y_ts=None):
		if (not self.model):
			raise ModelError("Train Model First")

		train_pred = self.model.predict(self.X_tr)
		test_pred = self.model.predict(self.X_test)

		acc_train = round((np.mean(train_pred.reshape(train_pred.shape[0],1) == self.y_tr)* 100),2)
		acc_test = round((np.mean(test_pred.reshape(test_pred.shape[0],1) == self.y_test)* 100),2)

		print("Training Accuracy:", acc_train, '%')
		print("Test Accuracy:", acc_test, '%')

	def run_model(self,sample):
		if (not self.model):
			raise ModelError("Train Model First")

		result = self.model.predict(sample)[1]
		return result


testing = SVM_model("K-means results/datano8_mean5.csv")

testing.train_model(0.001)

testing.test_model()








