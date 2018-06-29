
def divide_data_bins(data, special=[]):
    no_feat = data.shape[1]
    bins_centred = np.empty()
    X_pos_array = np.empty()
    
    for i in range(no_feat):
        # Handles special case
        bins, new_col = separate_bins_feature(X[:,i].flatten(),(i in special))[:2]
        
        bins_centred.append(bins)
        X_pos_array.append(new_col)
        
    # Convert to numpy array
    bins_centred = np.array(bins_centred)
    X_pos_array = (np.array(X_pos_array)).transpose() 

    return bins_centred,X_pos_array


def find_anchors(model, sample, avg_lst, std_lst, no_val):
    features = sample.shape[0]
    
    # Identify original result from sample
    initial_percentage = model.run_model(sample)
    print("Initial %",initial_percentage)
    decision = np.round(initial_percentage,0)
    
    # Create mask 
    mask = np.zeros(features)
    
    # Allows tracking the path
    locked = []
    
    # Iterations allowed
    iterations = 4
    
    while (iterations > 0):
        # Retains best result and the corresponding index
        max_ind = (0,0)
    
        # Assign column that is being tested
        for test_col in range(features):
            mask[test_col] = 1
            new_data = np.empty([features, no_val])

            # Perturb data
            for ind in range(features):
                if (ind == test_col or (ind in locked)):
                    new_data[ind] = np.array(np.repeat(sample[ind],no_val))
                else:
                    new_data[ind] = np.random.normal(avg_list[ind], std_list[ind], no_val)
            new_data = new_data.transpose()

            # Run Model 
            pred = model.run_model_data(new_data)
            acc = (np.mean(pred == decision))

            # Keeping track of the mask
            if (acc >= 0.95):
                return mask
            elif (acc > max_ind[0]):
                mask[max_ind[1]] = 0
                max_ind = (acc,test_col)
            elif (test_col not in locked):
                mask[test_col] = 0
                
        print(max_ind[0])
        print(mask)
        locked.append(max_ind[1])
        iterations -= 1



# -- Replace missing values (arbitraty approach)-- 
np.place(data, data == -7, 150)

def brute_force_test(data,left,right):
    col_1 = data[:,9]
    np.place(col_1, col_1 == -7, left)
    
    col_2 = data[:,15]
    np.place(col_2, col_2 == -7, right)

    data[:,9] = col_1
    data[:,15] = col_2
    
    return data




left = [100,120,150,200,250,1000]
right = [50,80,100,150,250,1000]

for l in left:
    for r in right:
        df = pd.read_csv("K-means results/datano8_mean5.csv")
        data = df.values
        data = np.delete(data, 0, 1) # Deleting dataframe extra column
        
        data = brute_force_test(data,l,r)
        y = data[:,:1]
        X = data[:,1:]
        num_samples , num_attributes = X.shape

        # --- Scaling ---
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # --- Separating Data ---
        X_tr = X_scaled[:int(0.5*num_samples)]
        X_val = X_scaled[int(0.5*num_samples):int(0.75*num_samples)]
        X_test = X_scaled[int(0.75*num_samples):]

        y_tr = y[:int(0.5*num_samples)]
        y_val = y[int(0.5*num_samples):int(0.75*num_samples)]
        y_test = y[int(0.75*num_samples):]
        
        svc = svm.SVC(kernel='linear',C=1)

        svc.fit(X_tr,y_tr.reshape(y_tr.shape[0],))

        y_lin = svc.predict(X_test)
        acc_lin = np.mean(y_lin.reshape(y_lin.shape[0],1) == y_test)

        print("Accuracy:", acc_lin*100, "%", "Left:",l , "Right:",r)




def average_each_feature(X):
    X_target = np.zeros((1,X.shape[1]))
    
    for i in range(X.shape[1]):
        col = X[:,i]
        col = np.mean(col,axis=0)
        print(col)
        X_target[:,i] = col
        
    return X_target


X_tr = X_scaled[:int(0.5*num_samples)]
X_val = X_scaled[int(0.5*num_samples):int(0.75*num_samples)]
X_test = X_scaled[int(0.75*num_samples):]

y_tr = y[:int(0.5*num_samples)]
y_val = y[int(0.5*num_samples):int(0.75*num_samples)]
y_test = y[int(0.75*num_samples):]

print("Training samples: ", X_tr.shape[0])
print("Validation samples: ", X_val.shape[0])
print("Test samples: ", X_test.shape[0])



from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

for x in range(1,25):

    clf = RandomForestClassifier(max_depth=x, random_state=0)
    clf.fit(X_tr, y_tr.reshape(y_tr.shape[0],))

    y_lin = clf.predict(X_test)
    acc_lin = np.mean(y_lin.reshape(y_lin.shape[0],1) == y_test)

    print("Max Depth:",x,"Accuracy:", acc_lin*100, "%")