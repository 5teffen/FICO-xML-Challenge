import numpy as np
import pandas as pd

def separate_bins_feature(feat_column):

	no_bins = 10

	feat_column = feat_column.flatten()
	two_std = 2*np.std(feat_column)
	avg_val = np.mean(feat_column)

	# -- Finding the Range --
	if (avg_val - two_std < 0):
		min_val = 0
	else:
		min_val = avg_val - two_std
	max_val = avg_val + two_std

	# -- Creating the Bins --
	single_bin = (max_val - min_val) // no_bins
	centre = round(min_val + (single_bin // 2),0)
	
	floor = round(min_val,0)
	ceil = round((min_val + single_bin),0)

	ranges = []
	bins = np.zeros(10)
	new_col = np.zeros(feat_column.shape[0])

	for i in range(no_bins):
		range_str = ""
		for val_i in range(feat_column.shape[0]):

			if (i == 0):
				range_str = "x < " + str(ceil)
				if (feat_column[val_i] < ceil):
					new_col[val_i] = centre 

			elif (i == no_bins-1):
				range_str = str(floor) + " < x"
				if (feat_column[val_i] >= floor):
					new_col[val_i] = centre 

			else:
				range_str = str(floor) +" < x < " + str(ceil)
				if ((ceil > feat_column[val_i]) and (feat_column[val_i] >= floor)):
					new_col[val_i] = centre 

		bins[i] = centre
		ranges.append(range_str)

		floor += single_bin
		ceil += single_bin
		centre += single_bin


	return bins, new_col, ranges
