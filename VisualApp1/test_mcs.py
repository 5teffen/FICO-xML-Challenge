f_pre = open ("flask_pre_data_nums_new_debug_tryseed.csv", 'r')

f_fla = open ("test_msc.csv", 'r')
r1 = f_pre.readline().strip().split(',')

for i in range(150):
	r1 = f_pre.readline().strip().split(',')
	r2 = f_fla.readline().strip().split(',')

	if r1 != r2:
		print(r1,r2)

f_fla.close()

f_pre.close()