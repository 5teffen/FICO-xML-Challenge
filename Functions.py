import numpy as np
import pandas as pd


def separate_bins_feature(feat_column,special_case = False):

	no_bins = 10


	if special_case:
		# -- Solves the two special cases --
		max_val = 7
		min_val = 0
		single_bin = 1

	else:
		# -- All other cases --
		feat_column = feat_column.flatten()
		two_std = 2*np.std(feat_column)
		avg_val = np.mean(feat_column)

		# -- Finding the Range --
		if (avg_val - two_std < 0):
			min_val = 0
		else:
			min_val = round((avg_val - two_std),0)
		max_val = round((avg_val + two_std),0)

		# -- Creating the Bins --
		single_bin = (max_val - min_val) // no_bins
		if (single_bin == 0):
			single_bin = 1
	
	centre = min_val + (single_bin // 2)
	floor = min_val
	ceil = min_val + single_bin

	ranges = []
	bins = np.zeros(10)
	new_col = np.zeros(feat_column.shape[0])
	new_col_vals = np.zeros(feat_column.shape[0])

	for i in range(no_bins):
		range_str = ""
		if (centre <= max_val):
			for val_i in range(feat_column.shape[0]):
					if (i == 0):
						range_str = "x < " + str(ceil)
						if (feat_column[val_i] < ceil):
							new_col[val_i] = i
							new_col_vals[val_i] = centre

					elif (i == no_bins-1) or ((centre + single_bin) > max_val):
						range_str = str(floor) + " < x"
						if (feat_column[val_i] >= floor):
							new_col[val_i] = i
							new_col_vals[val_i] = centre

					else:
						range_str = str(floor) +" < x < " + str(ceil)
						if ((ceil > feat_column[val_i]) and (feat_column[val_i] >= floor)):
							new_col[val_i] = i
							new_col_vals[val_i] = centre
			bins[i] = centre
			ranges.append(range_str)
		
		else:
			bins[i] = -1
			ranges.append("-1")


		floor += single_bin
		ceil += single_bin
		centre += single_bin

	return bins, new_col, new_col_vals, ranges



def prepare_for_analysis(filename):
	data_array = pd.read_csv(filename,header=None).values

	# -- Removes the columns with all -9 values -- 
	row_no = 0 
	for row in data_array:
		for col_i in range(1,row.shape[0]):
			if (row[col_i] == -9):
				remove = True
			else:
				remove = False
				break

		if remove:
			data_array = np.delete(data_array, row_no, 0)

		else:
			row_no += 1

	return data_array


def get_change_samples(pre_proc_file,all_data_file,cols,height):
	# 0-4 General Data
	# 5-8 Anchor Cols
	# 9-12 Change Cols
	# 13-16 Col Heights

	pre_data = pd.read_csv(pre_proc_file).values
	all_data = pd.read_csv(all_data_file,header=None).values

	change_samples = []

	# Identify Changes
	for test in range(8,12):
		for s in range(pre_data.shape[0]):
			if (pre_data[s][test] == cols):
				if (pre_data[s][test+4] == height):
					change_samples.append(pre_data[s][0])

	return anch_samples,change_samples

def get_change_samples(pre_proc_file,all_data_file,anchs):
	# 0-4 General Data
	# 5-8 Anchor Cols
	# 9-12 Change Cols
	# 13-16 Col Heights

	pre_data = pd.read_csv(pre_proc_file).values
	all_data = pd.read_csv(all_data_file,header=None).values
	anch_samples = []
	change_samples = []

	# Identify Anchors
	for test in range(5,9):
		for s in range(pre_data.shape[0]):
			if (pre_data[s][test] == anchs):
				anch_samples.append(pre_data[s][0])

	return anch_samples


changes = get_samples("pre_data1.csv","final_data_file.csv",3,1)


