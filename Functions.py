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

	for i in range(no_bins):
		range_str = ""
		if (centre <= max_val):
			for val_i in range(feat_column.shape[0]):
					if (i == 0):
						range_str = "x < " + str(ceil)
						if (feat_column[val_i] < ceil):
							new_col[val_i] = i

					elif (i == no_bins-1) or ((centre + single_bin) > max_val):
						range_str = str(floor) + " < x"
						if (feat_column[val_i] >= floor):
							new_col[val_i] = i

					else:
						range_str = str(floor) +" < x < " + str(ceil)
						if ((ceil > feat_column[val_i]) and (feat_column[val_i] >= floor)):
							new_col[val_i] = i
			bins[i] = centre
			ranges.append(range_str)
		
		else:
			bins[i] = -1
			ranges.append("-1")


		floor += single_bin
		ceil += single_bin
		centre += single_bin


	return bins, new_col, ranges


# data = pd.read_csv("working_data_full.csv").values
# data = np.delete(data, 0, 1) # Deletes First Row

# bins, new_col, ranges = separate_bins_feature(data[:,6])

# print(bins)
# print(new_col)
# print(ranges)


