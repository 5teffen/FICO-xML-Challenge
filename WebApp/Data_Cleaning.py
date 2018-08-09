
# --- Imports section --- 
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn import datasets, linear_model, preprocessing
import copy

class ModelError(Exception):
	pass

class Data_Cleaner():

	def __init__ (self, file_name, data = None):
	# --- Retrieves the data from CSV or array, as well as basic organisation ---

		# -- Get data from CSV or given array --
		if (data == None):
			self.data_set = pd.read_csv(file_name).values

		else:
			self.data_set = data

		# -- Converting target to binary --
		np.place(self.data_set, self.data_set == "Bad", 0)
		np.place(self.data_set, self.data_set == "Good", 1)

		# -- Creating Model Variable -- 
		self.model = None

		# -- Creating an Order Column --
		order = np.arange(self.data_set.shape[0])
		order = order.reshape((order.shape[0],1))

		# -- Scale and Split --
		# self.y = self.data_set[:,:1]
		# scaler = StandardScaler()
		# self.X = scaler.fit_transform(self.data_set[:,1:])

		self.y = self.data_set[:,:1]
		self.X = self.data_set[:,1:]


		# -- Needs to be retained for inserting new samples
		# self.mean = scaler.mean_
		# self.scale = scaler.scale_

		# -- Assiging general useful variables --
		self.num_samples , self.num_features = self.X.shape

		# -- Add the Order Column -- 
		self.X = np.append(order,self.X,axis=1)
		self.y = np.append(order,self.y,axis=1)

	def shift(self):
	# --- Perform the shift for the two categorical features --- 

		# -- Shift is hardcoded based on requirements -- 
		first_col = self.X[:,10]
		np.place(first_col, first_col == 1, 100) # hold value
		np.place(first_col, first_col == 6, 1)
		np.place(first_col, first_col == 5, 1)
		np.place(first_col, first_col == 4, 6)
		np.place(first_col, first_col == 3, 5)
		np.place(first_col, first_col == 2, 4)
		np.place(first_col, first_col == 100, 3)
		np.place(first_col, first_col == 0, 2)
		np.place(first_col, first_col == 8, 0)
		np.place(first_col, first_col == 9, 0)

		second_col= self.X[:,11]
		np.place(second_col, second_col == 1, 0)
		np.place(second_col, second_col == 9, 0)
		np.place(second_col, second_col == 7, 1)
		np.place(second_col, second_col == 8, 7)

		self.X[:,10] = first_col
		self.X[:,11] = second_col

	def __scaled_row(self,row,scaler):
	# --- Returns the Row Scaled ---
		mean = scaler.mean_
		scale = scaler.scale_
		scld = []
		for k in range(row.shape[0]):
			scld.append((row[k] - mean[k])/scale[k])
		scld = np.array(scld)

		return scld
	        
	def __masked_arr(self,orig_array, mask):
	# --- Returns XOR of Array and Mask --- 
		masked_array = []

		for i in range(len(orig_array)):
			row = []
			for j in range(len(orig_array[0])):
				if mask[j] != 0:
					row.append(orig_array[i][j])
			masked_array.append(row)

		masked_array = np.array(masked_array)

		return masked_array

	def __euc_distance(self,row1, row2):
	# --- Returns Euclidian Distance between Rows --- 
		dist = 0
		for i in range(len(row1)):
			t = (row1[i]-row2[i])**2
			dist += t
		dist = np.sqrt(dist)
		return dist

	def __predict_feature_weighted(self,row, good_data_masked, no_neighbours, orig_array, ft_idx):
	# --- Returns the single special value replaced by kNN imputation using weights---

		distances = []
		# -- Loops through the good data with no special values -- 
			# - Good data has the changing feature removed -
		for i in range(len(good_data_masked)):	
			distances.append(self.__euc_distance(row, good_data_masked[i]))

		distances = np.array(distances)
		max_dist = np.max(distances)
	    
		# -- Sorts the first no_neigbours features --
		idx = np.argpartition(distances, no_neighbours)

		values = []
		min_dists = []
	    
		# -- Retrieving values with which to replace -- 
		for i in range(no_neighbours):
			values.append(orig_array[idx[i]][ft_idx])
			min_dists.append(distances[idx[i]])

		values = np.array(values) 
		min_dists = np.array(min_dists)

		# -- Assigning the weights -- 
		weights = []
		for i in min_dists:
			weights.append(1 - (i/max_dist))
	    
	    # -- Calculating final result -- 
		imputed_val = 0
		for i in range(len(weights)):
			imputed_val += weights[i] * values[i]
	        
		return imputed_val    

	def __predict_feature_mean(self,row, good_data_masked, no_neighbours, orig_array, ft_idx):
	# --- Returns the single special value replaced by kNN imputation using the mean ---

		distances = []
		# -- Loops through the good data with no special values -- 
	    	# - Good data has the changing feature removed -
		for i in range(len(good_data_masked)):
			distances.append(self.__euc_distance(row,good_data_masked[i]))
		distances = np.array(distances)
	    
		# -- Sorts the first no_neigbours features --
		idx = np.argpartition(distances, no_neighbours)

		values = []
		min_dists = []
	    
		# -- Retrieving values with which to replace -- 
		for i in range(no_neighbours):
			values.append(orig_array[idx[i]][ft_idx])
			min_dists.append(distances[idx[i]])

		values = np.array(values) 
		min_dists = np.array(min_dists)
	    
		# -- Calculating final result -- 
		imputed_val = 0
		for i in range(len(values)):
			imputed_val += values[i]

		imputed_val = imputed_val/len(values)

		return imputed_val

	def __remove_row_with_vals(self, data, target, vals):
	# --- Returns the data/target without the rows that have any instance of vals list ---
		removed_data = []
		removed_target = []

		row_no = 0 
		for row in data:
			for col in row:
				if (col in vals):
					removed_data.append(data[row_no])
					data = np.delete(data, row_no, 0)

					removed_target.append(target[row_no])
					target = np.delete(target, row_no, 0) 
					row_no -= 1
					break
			row_no += 1

		removed_data = np.array(removed_data)
		removed_target = np.array(removed_target)

		return data, target, removed_data, removed_target

	def __remove_col_with_vals(self, data, vals):
	# --- Returns the data without the coloumns that have the desired special values ---
		no_cols = data.shape[1]
		no_rows = data.shape[0]
		row = 0
		while (no_rows > row):
			col = 0
			while (no_cols > col):
				if (data[row][col] in vals):
					data = np.delete(data, col, 1)
					no_cols -= 1
				else:
					col += 1
			row += 1     
		return data

	def __predict_values_lin_reg(self,X_tr,y_tr,X_test):
	# --- Uses linear regression to extrapolate values ---
		model = linear_model.LinearRegression()
		model.fit(X_tr, y_tr)
		pred = model.predict(X_test)
		return pred

	def __data_spliter(self,all_data,target_col,target_val):
	# --- Splits the data such to identify target col --- 
		target_col += 1

		y = all_data[:,target_col:target_col+1]
		X = np.delete(all_data,target_col,1)
	    
		# -- Will hold the X for the y values that need to be predicted--
		X_target = np.zeros((1,X.shape[1]))

		row_no = 0 
		# -- Finds the rows with a target val -- 
		for val in y:
			if (val[0] == target_val):
				X_target = np.append(X_target,X[row_no:row_no+1,:],axis=0)
				X = np.delete(X, row_no, 0)
				y = np.delete(y, row_no, 0) 
			else:
				row_no += 1

		X_target = np.delete(X_target,0,0)
	    
		return X,y,X_target # Note that the order column is still attached

	def __combine_parts_inorder(self,X,y,X_target,y_target,target_col):
	# --- Combines all the small parts into a single data matrix ---
		target_col += 1  # To account for the order column

		y_target = y_target.reshape((y_target.shape[0],1))
		y_full = np.append(y_target,y,axis=0)
		X_full = np.append(X_target,X,axis=0)

		data = np.append(X_full[:,:target_col],y_full,axis=1)
		data = np.append(data,X_full[:,target_col:],axis=1)
		return data

	def __average_each_feature(self,X):
	# --- Finds the mean values for each feature ---

		X_target = np.zeros((1,X.shape[1]))
	    
		for i in range(X.shape[1]):
			col = X[:,i]
			col = np.mean(col,axis=0)
			X_target[:,i] = col
	        
		return X_target

	def __process_and_predict(self,all_data,target_col,target_val,exclude=None,model="linear"):
		# -- Split data --
		X,y,X_target = self.__data_spliter(all_data,target_col,target_val)
		# -- Record order columns -- 

		order_data = X[:,0:1]
		order_target = X_target[:,0:1]
	    
	    # -- Remove certain columns --
		if (exclude != None or exclude == []):
			y_tr = np.copy(y)
			X_tr = self.__remove_col_with_vals(X,exclude)
			X_tr = np.delete(X_tr,0,axis=1) # Removes the order column
			X_pred = self.__remove_col_with_vals(X_target,exclude) # The x used to predict
			X_pred = np.delete(X_pred,0,axis=1)


		else:
			y_tr = np.copy(y)
			X_tr = np.delete(X,0,axis=1) # Removes the order column
			X_pred = np.delete(X_target,0,axis=1)


	    # -- Run regression --
		if (model == "linear"):
			y_target = self.__predict_values_lin_reg(X_tr,y_tr,X_pred)

		elif (model == "polynomial"):
			pass

		elif (model == "special"):
			X_avg = self.__average_each_feature(X_pred)
			pred = self.__predict_values_lin_reg(X_tr,y_tr,X_avg)
	    
		else:
			raise ModelError("Model currently not available")
	        
		final_data = self.__combine_parts_inorder(X,y,X_target,y_target,target_col)
		return final_data
	# --- Processes the data and uses linear regression to extrapolate --- 

	def remove_8(self, kNN, prediction_type):
	# --- Removes all the -8 values using kNN imputation ---
		# -- Remove the order column -- 
		order = self.X[:,0]
		order = order.reshape((order.shape[0],1))
		self.X = np.delete(self.X, 0, axis = 1)

		# -- Removes all special values (-7,-8,-9) --
		X_good, hold1, hold2, hold3 = self.__remove_row_with_vals(self.X, self.y, [-7,-8,-9])

		scaler = StandardScaler()
		X_good_scaled = scaler.fit_transform(X_good)

		# -- Create a copy of the data matrix X to edit -- 
		X_no_8 = np.copy(self.X)

		cols_with_8 = [1,8,14,17,18,19,20,21,22]

		# -- Fixing each -8 column -- 
		for fix_col in cols_with_8:
			print("Column being fixed:", str(fix_col))
			# -- Looping through all samples -- 
			for row in range(self.num_samples):

				if self.X[row][fix_col] == -8:
					row_to_comp = []
					mask = []
					scaled = self.__scaled_row(self.X[row],scaler)

					# -- Looping through each value --
					for col in range(self.num_features):
						if self.X[row][col] >= 0:
							mask.append(1)
							row_to_comp.append(scaled[col])
						else:
							mask.append(0)

					row_to_comp = np.array(row_to_comp)
					mask = np.array(mask)
		            
					# -- Getting the array of samples without special values in the good datasets-- 
					X_good_masked = self.__masked_arr(X_good_scaled, mask)

					if (prediction_type == "mean"):
						imputed = self.__predict_feature_mean(row_to_comp, X_good_masked, kNN, X_good_scaled, fix_col)

					elif (prediction_type == "weighted"):
						imputed = self.__predict_feature_weighted(row_to_comp, X_good_masked, kNN, X_good_scaled, fix_col)
					
					X_no_8[row][fix_col] = imputed*scaler.scale_[fix_col] + scaler.mean_[fix_col]

		self.X = X_no_8

		# -- Add back order column -- 
		self.X = np.append(order,self.X,axis=1)

	def remove_all_9(self):
	# --- Removes the columns with all -9 values -- 
		self.rem_X = []
		self.rem_y = []
		row_no = 0 
		for row in self.X:
			for col_i in range(1,row.shape[0]):
				if (row[col_i] == -9):
					remove = True
				else:
					remove = False
					break
			if remove:
				self.rem_X.append(self.X[row_no])
				self.X = np.delete(self.X, row_no, 0)

				self.rem_y.append(self.y[row_no])
				self.y = np.delete(self.y, row_no, 0)     

			else:
				row_no += 1

		self.rem_X = np.array(self.rem_X)
		self.rem_y = np.array(self.rem_y)

	def remove_9(self):
	# --- Removes the -9 values by using linear regression ---
		self.X = self.__process_and_predict(self.X,0,-9,[-7])

	def remove_7_reg(self):
	# --- Removes the -7 values by using linear regression ---
		self.X = self.__process_and_predict(X,8,-7,[-7],None,"special")
		self.X = self.__process_and_predict(X,14,-7,None,"special")

	def remove_7_est(self):
	# --- Removes the -7 values by using an approximated value ---
		value_replace = 150
		np.place(self.X, self.X == -7, value_replace)

	def output_all_data(self):
	# --- Combines all the data into a single array in order and outputs it ---
		all_X = np.append(self.X,self.rem_X,axis=0)
		all_y = np.append(self.y,self.rem_y,axis=0)

		all_X = all_X[all_X[:,0].argsort()]
		all_y = all_y[all_y[:,0].argsort()]

		all_X = np.delete(all_X, 0, axis=1) 
		all_y = np.delete(all_y, 0, axis=1) 
		
		data_output = np.append(all_y,all_X,axis=1)

		return data_output

	def output_to_CSV(self, filename):
	# --- Outputs the data to a CSV according to assigned filename --- 
		data_output = self.output_all_data()

		np.savetxt(filename, data_output.astype(int), fmt='%i', delimiter=",")

	def revert_to_original(self):
	# --- Allows to retrieve the original dataset ---
		self.__init__("pass",self.data_set)


testing123 = Data_Cleaner("xML Challenge Dataset and Data Dictionary/heloc_dataset_v1.csv")
testing123.shift()
testing123.remove_8(5,"mean")
testing123.remove_all_9()
testing123.remove_9()
testing123.remove_7_est()
testing123.output_to_CSV("test_file1.csv")






