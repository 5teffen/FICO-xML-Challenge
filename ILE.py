# --- Instance Level Explanation --- 


import pandas as pd
import numpy as np
from SVM_model import SVM_model
from Functions import separate_bins_feature


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

def evaluate_data_set(data):
    no_features = data.shape[1]
    avg_list = []
    std_list = []
    for i in range(no_features):
        current_col = data[:,i].flatten()
        std_list.append(np.std(current_col))
        avg_list.append(np.mean(current_col))
          
    return avg_list, std_list


def perturb_special(min_val,max_val,avg,std,no_val):
    new_col = np.random.normal(avg, std, no_val)
    # Note: these functions have poor time complexity
    np.place(new_col,new_col < min_val, min_val)
    np.place(new_col,new_col > max_val, max_val)
    new_col = new_col.round(0)
    return new_col
    

def find_anchors(model, data_set, sample, no_val):
    # Account for the special categorical columns
    special_cols = [9,10]
    
    features = sample.shape[0]
    avg_list, std_list = evaluate_data_set(data_set)

    # Precision Treshold
    treshold = 0.95
    
    # Identify original result from sample
    initial_percentage = model.run_model(sample)
    decision = np.round(initial_percentage,0)

    # Create empty mask 
    mask = np.zeros(features)
    
    # Allows tracking the path
    locked = []
    
    # Iterations allowed
    iterations = 4

    # Setting random seed
    np.random.seed(0)
    
    while (iterations > 0):
        # Retains best result and the corresponding index
        max_ind = (0,0)
    
        # Assign column that is being tested
        for test_col in range(features):
            new_data = np.empty([features, no_val])

            # Perturb data
            for ind in range(features):
                if (ind == test_col) or (ind in locked):
                    new_data[ind] = np.array(np.repeat(sample[ind],no_val))
                else:
                    if (ind in special_cols):
                        new_data[ind] = perturb_special(0,7,avg_list[ind],std_list[ind],no_val)
                    else:
                        new_data[ind] = np.random.normal(avg_list[ind], std_list[ind], no_val)
            
            new_data = new_data.transpose()

            # Run Model 
            pred = model.run_model_data(new_data)
            acc = (np.mean(pred == decision))
            
            if (acc > max_ind[0]):
                max_ind = (acc,test_col)
                

        locked.append(max_ind[1])
            
        for n in locked:
            mask[n] = 1
            
        if (max_ind[0] >= treshold):
            return mask
        iterations -= 1
        
    print("!!! No anchors found !!!")
    return None


def perturb_row_feature(model, row, row_idx, feat_idx, current_bins, X_bin_pos, mean_bins, mono_arr, improve):
    
    monot_arr = np.copy(mono_arr)                        
    
    c_current_bins = np.copy(current_bins)
    direction = monot_arr[feat_idx]
    current_bin = np.copy(c_current_bins[feat_idx])
    
    if current_bin != 9:
        next_value = mean_bins[feat_idx][int(current_bin+1)]
    if current_bin != 0:
        prev_value = mean_bins[feat_idx][int(X_bin_pos[row_idx][feat_idx]-1)]
    
    # Check if in boundary and return the same row
    if direction == -1:
        if current_bin == 0:
            direction = 1
        elif current_bin == 9 or next_value == -1:
            direction = 0
    if direction == 1:
        if current_bin == 9 or next_value == -1:
            return (row, c_current_bins)
    elif direction == 0 and current_bin ==  0:
            return (row, c_current_bins)
    
    # Decide direction in special case
    if direction == -1:
        row_up = np.copy(row)
        row_down = np.copy(row)
        row_up[feat_idx] = next_value
        row_down[feat_idx] = prev_value
        percent_1 = model.run_model(row_up)
        percent_0 = model.run_model(row_down)
        if percent_1 >= percent_0:
            if improve:
                c_current_bins[feat_idx] += 1
                return (row_up, c_current_bins)
            else:
                c_current_bins[feat_idx] -= 1
                return (row_down, c_current_bins)
        elif not improve:
            c_current_bins[feat_idx] -= 1
            return (row_down, c_current_bins)
        else:
            c_current_bins[feat_idx] += 1
            return (row_up, c_current_bins)
        
    else:
        p_row = np.copy(row)
        if direction == 1:
            c_current_bins[feat_idx] += 1
            p_row[feat_idx] = next_value
        elif direction == 0:
            c_current_bins[feat_idx] -= 1
            p_row[feat_idx] = prev_value
        
        return (p_row, c_current_bins)
    
    
def percent_cond (improve, percent):
    if improve and percent <= 0.5:
        return True
    elif (not improve) and percent > 0.5:
        return True
    else:
        return False
    
    
def find_MSC (model, data, k_row, row_idx, X_bin_pos, mean_bins):
    
    row = np.copy(k_row)
    percent = model.run_model(row)
    features_moved = np.zeros(23)
    times_moved = np.zeros(23)
    change_vector = np.zeros(23)
    
    original_bins = np.copy(X_bin_pos[row_idx])
    current_bins = np.copy(X_bin_pos[row_idx])
    
    # Decides class to change into
    improve = True
    if percent >= .5:
        improve = False
        
    # Hardcodes the constraints for the direction in which to move
    # 1: Move up to to improve
    # 0: Move down to improve
    # -1: Needs check
    monotonicity_arr = np.array([1,1,1,1,1,0,0,1,1,1,1,-1,0,-1,1,0,0,0,0,-1,-1,0,-1])
    monotonicity_arr_c = np.copy(monotonicity_arr)
    if not improve:
        for i in range(len(monotonicity_arr)):
            if monotonicity_arr[i] == 1:
                monotonicity_arr_c[i] = 0
            elif monotonicity_arr[i] == 0:
                monotonicity_arr_c[i] = 1
    monotonicity_arr = np.copy(monotonicity_arr_c)
    
    while percent_cond(improve, percent) and (features_moved == 1).sum() < 5 and max(times_moved) < 5:
        new_percents = []
        pert_rows = []
        new_curr_bins = []
        
        # Avoids moving ExternalScore
        for i in range(1,len(row)):
            t_row, t_current_bins = perturb_row_feature(model, row, row_idx, i, current_bins, X_bin_pos, mean_bins, monotonicity_arr, improve)
            pert_rows.append(t_row)
            new_curr_bins.append(t_current_bins)
            new_percents.append(model.run_model(t_row))

        new_percents = np.array(new_percents)
        
        if improve:
            idx = np.argmax(new_percents)
        else:
            idx = np.argmin(new_percents)
        
        row = pert_rows[idx]
        percent = new_percents[idx]
        current_bins = new_curr_bins[idx]

        features_moved[idx] = 1
        times_moved[idx] += 1
    
    for l in range(23):
        change_vector[l] = current_bins[l] - original_bins[l]
        
    if not percent_cond(improve, percent):
        return change_vector, row
    else:
        print("Decision can't be moved within thresholds:")
        return None,None


def instance_explanation(model, data, k_row, row_idx, X_bin_pos, mean_bins):
    
    initial_percentage = model.run_model(k_row)

    change_vector, change_row = find_MSC(model, data, k_row, row_idx, X_bin_pos, mean_bins)
    anchors = find_anchors(model, data, k_row, 100)

    return change_vector, change_row, anchors, initial_percentage


def prepare_for_D3(sample, bins_centred, change_row, change_vector, anchors, percent):
    data = []
    
    names = ["External Risk Estimate","Months Since Oldest Trade Open","Months Since Last Trade Open"
             ,"Average Months in File","Satisfactory Trades","Trades 60+ Ever","Trades 90+ Ever"
            ,"% Trades Never Delq.","Months Since Last Delq.","Max Delq. Last 12M","Max Delq. Ever","Total Trades"
             ,"Trades Open Last 12M","% Installment Trades", "Months Since Most Recent Inq","Inq Last 6 Months"
             ,"Inq Last 6 Months exl. 7 days", "Revolving Burden","Installment Burden","Revolving Trades w/ Balance"
            ,"Installment Trades w/ Balance","Bank Trades w/ High Utilization Ratio","% trades with balance"]
    
    for i in range(bins_centred.shape[0]):
        result = {}
        result["name"] = names[i]
        
        if len(names[i]) > 20:
            result["short_name"] = names[i][:20] + "..."
        else:
            result["short_name"] = names[i]
        
        if (change_vector is not None):
            result["incr"] = abs(change_vector[i])
        else:
            result["incr"] = 0 
        
        if (percent > 0.5):
            result["dir"] = 1
        else:
            result["dir"] = 0
        
        if (anchors is not None):
            if (anchors[i] == 1):
                result["anch"] = 1
            else:
                result["anch"] = 0
        else:
            result["anch"] = 0
        
        val = sample[i].round(0)
    
        if (change_row is None):
            change = val
        else:
            change = change_row[i].round(0)
        
        max_bin = np.max(bins_centred[i])
        min_bin = np.min(bins_centred[i])
        
        if (min_bin == -1):
            min_bin = 0

        if (max_bin < 10):
            max_bin = 10
        
        scl_val = (val-min_bin)/(max_bin-min_bin)
        scl_change = (change-min_bin)/(max_bin-min_bin)

        if (scl_val < 0 ):
            scl_val = 0
        if (scl_change < 0):
            scl_change = 0


        
        result["val"] = val
        result["scl_val"] = scl_val
        result["change"] = change
        result["scl_change"] = scl_change
        
#         print("Val:",result["val"])
#         print("Scl_Val:",result["scl_val"])
#         print("Change:",result["change"])
#         print("Scl_Change",result["scl_change"])
        
        data.append(result)
        
    return data
        

def scaling_data_density(data, bins_centred):
    new_data = np.empty(data.shape)
    output_array = []
    
    for col in range(bins_centred.shape[0]):
        values_dict = {}
        
        max_bin = np.max(bins_centred[col])
        min_bin = np.min(bins_centred[col])

        if (min_bin == -1):
            min_bin = 0

        if (max_bin < 10):
            max_bin = 10
    
        for row in range(data.shape[0]):
            new_val = ((data[row][col]-min_bin)/(max_bin-min_bin)).round(2)
            if (new_val <= 0):
                new_val = 0
            if (new_val > 1):
                new_val = 1
                
            new_data[row][col] = new_val
                
            if (str(new_val) in values_dict):
                values_dict[str(new_val)] += 1
            else:
                values_dict[str(new_val)] = 1

        output_array.append(values_dict)

    return output_array



"""
from IVE import instance_explanation, prepare_for_D3

df = pd.read_csv("working_data_full.csv")
vals = df.values
X = vals[:,2:]
y = vals[:,1]

no_samples, no_features = X.shape

svm_model = SVM_model(None,"working_data_full.csv")
svm_model.train_model(0.001)
svm_model.test_model()

sample = 1 # NOTE THIS VALUE

bins_centred, X_pos_array, init_vals = divide_data_bins(X,[9,10])
change_vector, change_row, anchors, percent = instance_explanation(svm_model, X, X[sample], sample, X_pos_array, bins_centred)
data_array = prepare_for_D3(X[sample], bins_centred, change_row, change_vector, anchors, percent)
dict_array = scaling_data_density(X, bins_centred)
"""
