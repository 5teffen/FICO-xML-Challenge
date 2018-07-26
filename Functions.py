import numpy as np
import pandas as pd
from operator import itemgetter
import copy


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

def divide_data_bins(data, special=[]):
    no_feat = data.shape[1]
    bins_centred = []
    X_pos_array = []
    in_vals = []
    
    for i in range(no_feat):
        # Handles special case
        bins, new_col, val = separate_bins_feature(data[:,i].flatten(),(i in special))[:3]
        
        in_vals.append(val)
        bins_centred.append(bins)
        X_pos_array.append(new_col)
        
    # Convert to numpy array
    in_vals = np.array(in_vals).transpose()
    bins_centred = np.array(bins_centred)
    X_pos_array = (np.array(X_pos_array)).transpose() 

    return bins_centred, X_pos_array, in_vals

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
	for test in range(9,14):
		for s in range(pre_data.shape[0]):
			if (pre_data[s][test] == cols):
				if (pre_data[s][test+5] == height):
					change_samples.append(s)

	return change_samples

def get_anch_samples(pre_proc_file,all_data_file,anchs):
	# 0-4 General Data
	# 5-8 Anchor Cols
	# 9-12 Change Cols
	# 13-16 Col Heights

	pre_data = pd.read_csv(pre_proc_file).values
	all_data = pd.read_csv(all_data_file,header=None).values
	anch_samples = []

	# Identify Anchors
	for test in range(5,9):
		for s in range(pre_data.shape[0]):
			if (pre_data[s][test] == anchs):
				anch_samples.append(s)

	return anch_samples

def sample_transf(X):
	trans_dict = {}
	my_count = 0
	for sample in range(10459):
		if X[sample][0] != -9:
			trans_dict[str(sample)] = my_count
			my_count += 1
		else:
			trans_dict[str(sample)] = -9

	return trans_dict

def prep_for_D3_global(pre_proc_file,all_data_file,samples,bins_centred,positions,transform):

	names = ["External Risk Estimate","Months Since Oldest Trade Open","Months Since Last Trade Open"
		,"Average Months in File","Satisfactory Trades","Trades 60+ Ever","Trades 90+ Ever"
		,"% Trades Never Delq.","Months Since Last Delq.","Max Delq. Last 12M","Max Delq. Ever","Total Trades"
		,"Trades Open Last 12M","% Installment Trades", "Months Since Most Recent Inq","Inq Last 6 Months"
		,"Inq Last 6 Months exl. 7 days", "Revolving Burden","Installment Burden","Revolving Trades w/ Balance"
		,"Installment Trades w/ Balance","Bank Trades w/ High Utilization Ratio","% trades with balance"]
	pre_data = pd.read_csv(pre_proc_file).values
	all_data = pd.read_csv(all_data_file,header=None).values[:,1:]

	final_data = []
	
	for s in samples:
		single_dict_list = []
		for i in range(all_data.shape[1]):
			result = {}
			result["name"] = names[i]
			result["incr"] = 0 
			result["per"] = pre_data[s][1]
			result["anch"] = 0

			val = all_data[s][i].round(0)
			change = val

	        # -- Identify Anchors --
			for an in range(5,9):
				col = pre_data[s][an]
				if (i == col):
					result["anch"] = 1

			# -- Find Change -- 
			for a in range(9,14):
				col = pre_data[s][a]
				if (i == col):

					new_sample_ind = int(transform[str(s)])
					idx = positions[new_sample_ind][col]
					increments = pre_data[s][a+5]
					change = bins_centred[i][int(idx+increments)]



			max_bin = np.max(bins_centred[i])
			min_bin = np.min(bins_centred[i])

			if (min_bin == -1):
				min_bin = 0

			if (max_bin < 10):
				max_bin = 10

			scl_val = ((val-min_bin)/(max_bin-min_bin)).round(2)
			scl_change = ((change-min_bin)/(max_bin-min_bin)).round(2)

			if (scl_val < 0 ):
				scl_val = 0
			if (scl_change < 0):
				scl_change = 0

			result["val"] = int(val)
			result["scl_val"] = scl_val
			result["change"] = int(change)
			result["scl_change"] = scl_change

			single_dict_list.append(result)
			
		final_data.append(single_dict_list)

	return final_data

def occurance_counter(pre_proc_file):
	pre_data = pd.read_csv(pre_proc_file).values

	count_array = np.zeros((23,4))
	ratio_array = np.zeros((23,4))
	total = 0


	for sam in range(pre_data.shape[0]):
		total += 1
		for anc in range(5,9):
			col = pre_data[sam][anc]
			if col >= 0:
				if pre_data[sam][1] > 0.5:
					count_array[col][0] += 1
				else: 
					count_array[col][1] += 1

		for chn in range(9,14):
			col = pre_data[sam][chn]
			if col >= 0:

				if pre_data[sam][chn+5] >= 0:
					count_array[col][2] += 1
				else:
					count_array[col][3] += 1
	ratio_array = count_array/total				
	# for i in range(ratio_array.shape[1]):
	# 	ratio_array
	return ratio_array

def big_scraper(pre_proc_file,desired_cols):
	# Note: desired_cols is a list

	pre_data = pd.read_csv(pre_proc_file).values

	all_changes = []
	all_counts = []
	all_per = []

	no_of_cols = len(desired_cols)
	changes_lst = [0]*(no_of_cols) #Last column is count

	matches = 0

	# -- Finding all the change combinations --
	for sam in range(pre_data.shape[0]):
		for test in range(9,14):
			if (pre_data[sam][test] in desired_cols):
				changes_lst[matches] = pre_data[sam][test+5]
				matches += 1

				if (matches == no_of_cols):
					if (changes_lst in all_changes):
						idx = all_changes.index(changes_lst)
						all_counts[idx] += 1
					else:
						all_changes.append(changes_lst)
						all_counts.append(1)
						all_per.append(int(np.round(pre_data[sam][1],0)))

		# - Resets changes list -
		changes_lst = [0]*no_of_cols
		matches = 0


	if (all_changes == []):
		return None
	# -- Sorting Changes by Count-- 
	all_changes = np.array(all_changes)

	all_counts = np.array(all_counts)
	all_counts = all_counts.reshape((all_counts.shape[0],1))

	all_per = np.array(all_per)
	all_per = all_per.reshape((all_per.shape[0],1))
	
	sort_array = np.append(all_counts,all_per,axis=1)
	sort_array = np.append(sort_array,all_changes,axis=1)

	sort_array = sort_array[(-sort_array[:,0]).argsort()]

	all_counts = sort_array[:,0].flatten()
	all_per = sort_array[:,1]
	all_changes = sort_array[:,2:]

	names = ["External Risk Estimate","Months Since Oldest Trade Open","Months Since Last Trade Open"
		,"Average Months in File","Satisfactory Trades","Trades 60+ Ever","Trades 90+ Ever"
		,"% Trades Never Delq.","Months Since Last Delq.","Max Delq. Last 12M","Max Delq. Ever","Total Trades"
		,"Trades Open Last 12M","% Installment Trades", "Months Since Most Recent Inq","Inq Last 6 Months"
		,"Inq Last 6 Months exl. 7 days", "Revolving Burden","Installment Burden","Revolving Trades w/ Balance"
		,"Installment Trades w/ Balance","Bank Trades w/ High Utilization Ratio","% trades with balance"]

	total_count = np.sum(all_counts)
	all_dicts = []
	for i in range(all_counts.shape[0]):
		single_dicts = []
		single_change = all_changes[i]

		for n in range(single_change.shape[0]):
			result = {}
			result["name"] = names[desired_cols[n]]
			result["label"] = "Ft." + str(n+1)
			result["inc_change"] = int(single_change[n])
			result["occ"] = float(np.round((all_counts[i]/total_count),2))
			result["per"] = float(all_per[i])

			single_dicts.append(result)

		all_dicts.append(single_dicts)


	return all_dicts

def my_combinations(target,data,limit):
	result = []
	for i in range(len(data)):
		new_target = copy.copy(target)
		new_data = copy.copy(data)
		new_target.append(data[i])
		new_data = data[i+1:]
		if (4 >= len(new_target) >= limit):
			result.append(new_target)
		result += my_combinations(new_target,new_data,limit)
	return result

def combination_finder(pre_proc_file,cols_lst):
	pre_data = pd.read_csv(pre_proc_file).values
	all_combinations = {}

	for sample in range(pre_data.shape[0]):

		cur_lst = []
		for c in range(9,14):
			val = pre_data[sample][c]
			if (val < 0 or len(cur_lst) > 5):
				break
			cur_lst.append(val)

		if (set(cols_lst).issubset(cur_lst)):
			new_key = ','.join(str(x) for x in cols_lst)
			if new_key in all_combinations:
				all_combinations[new_key] += 1
			else:
				all_combinations[new_key] = 1

			left_over = [x for x in cur_lst if (x not in cols_lst)]

			if len(left_over) > 0:
				possible_combs = my_combinations([],left_over,0)

			# -- Add the leftovers -- 
			for ending in possible_combs:
				sorted_cols = sorted(cols_lst+ending)
				new_key = ','.join(str(x) for x in sorted_cols)
				if new_key in all_combinations:
					all_combinations[new_key] += 1
				else:
					all_combinations[new_key] = 1

	ones = []
	twos = []
	threes = []
	fours = []
	fives = []

	for one_case in all_combinations:
		lst_case = one_case.split(',')
		if len(lst_case) == 1:
			ones.append((lst_case,all_combinations[one_case]))
			ones = sorted(ones, key=itemgetter(1), reverse=True)
		elif len(lst_case) == 2:
			twos.append((lst_case,all_combinations[one_case]))
			twos = sorted(twos, key=itemgetter(1), reverse=True)
		elif len(lst_case) == 3:
			threes.append((lst_case,all_combinations[one_case]))
			threes = sorted(threes, key=itemgetter(1), reverse=True)
		elif len(lst_case) == 4:
			fours.append((lst_case,all_combinations[one_case]))
			fours = sorted(fours, key=itemgetter(1), reverse=True)
		else:
			fives.append((lst_case,all_combinations[one_case]))
			fives = sorted(fives, key=itemgetter(1), reverse=True)

	big_list = ones+twos+threes+fours+fives

	final_result = []
	for item_pair in big_list:
		final_result.append(item_pair[0])

	return final_result




changes = get_change_samples("pre_data1.csv","final_data_file.csv",3,4)

vals = pd.read_csv("final_data_file.csv",header=None).values
X = vals[:,1:]
y = vals[:,0]

X_no_9 = prepare_for_analysis("final_data_file.csv")[:,1:]

no_samples, no_features = X.shape
combinations = combination_finder("pre_data1.csv",[3])
# all_results = big_scraper("pre_data1.csv",[4])

# print(all_results)
# print(all_results)

# count_total = occurance_counter("pre_data1.csv")


# trans_dict = sample_transf(X)

# bins_centred, X_pos_array, init_vals = divide_data_bins(X_no_9,[9,10])

# testing = prep_for_D3_global("pre_data1.csv","final_data_file.csv",changes, bins_centred, X_pos_array,trans_dict)
# print(len(testing[0]))
