# Fico-Challenge
Explainable Machine Learning Challenge

This is the submission for the FICO Explainable Machine Learning Challenge created by Oscar Gomez and Steffen Holter. By combining instance level explanations and a general global model interpretation we have created an interactive application to visualize the logic behind each of the model’s decisions.

### Individual Explanation
The local explanation visualizes each individual sample by showing the comparative values of each feature and their relative density distribution across the data set. Each explanation highlights the key features that the model used to make the decision. In addition, where applicable the solution suggests the necessary changes needed to reverse the decision. 

### Global Explanation
The global explanation acts as a way to aggregate the individual results across the whole data set. By either choosing to examine the key features or the necessary changes, the interactive hierarchy creates a comprehensive overview. Each click reveals an additional level of depth within the solution revealing more information.

<br/>

#### Available Online at
http://nyuvis-web.poly.edu/projects/fico

#### To run locally
* Install python 3.6 or above
* Pip install pandas, flask, numpy, scipy, sklearn
* Open Webapp folder
* Run hello.py
