#from flask-api import FlaskAPI
from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
import pandas as pd
# import csv
# import re
import numpy as np
from numpy import array
import json
import pandasql as ps

pd.set_option('display.max_colwidth', -1)

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    CORS(app)

    @app.route('/myapi/', methods=['GET'])
    def ask():
        if request.method == "GET":
            my_data = pd.read_csv('/Users/uditmarolia/Downloads/Backend/app/Placement_Data_Full_Class.csv')

            print(my_data.head(50))
            
            response = jsonify({'msg': "Success!"})
            response.status_code = 200
            
            return response
        else:
            response = jsonify({'msg': "Failure, not appropriate request"})
            response.status_code = 400
            return response

    @app.route('/piesearch/<col>', methods=['GET'])
    def search(col):
        if request.method == "GET":
            print(col)
            data = pd.read_csv('/Users/uditmarolia/Downloads/Backend/app/Placement_Data_Full_Class.csv')
            l1 = []
            for values in data[col].unique():
                l1.append(values)   
            result = {}
            co = data[col].value_counts()
            for i in range(len(co)):
                result[l1[i]] = int(co[i])
            
            # final = []
            # for key in l2.keys():
            #     dic = {}
            #     dic['label'] = key
            #     dic['value'] = result[key]
            #     final.append(dic)
            return json.dumps(result)
        else:
            response = jsonify({'msg': "Failure, not appropriate request"})
            response.status_code = 400
            return response

            
    @app.route('/barsearch', methods=['GET'])
    def barsearch():
        print("Outside if")
        if request.method == "GET":
            data = pd.read_csv('/Users/uditmarolia/Downloads/Backend/app/Placement_Data_Full_Class.csv')
            data_hsc = data['hsc_s'].unique()
            data_specilaisation = data['specialisation'].unique()
            data_status = data['status'].unique()
            q1 = """select count(hsc_s) from data where hsc_s='Science' and specialisation='Mkt&HR' and status='Placed'"""
            d1 = {}
            for v1 in data_hsc:
                for v2 in data_specilaisation:
                    for v3 in data_status:
                        q1 = """select count(hsc_s) from data where hsc_s='{0}' and specialisation='{1}' and status='{2}'""".format(v1,v2,v3)
                        d1[v1[0]+v2[0]+v2[4]+v3[0]] = int(ps.sqldf(q1,locals()).values[0][0]) 
            my_dict = {}
            for v1 in data_hsc:
                for v2 in data_specilaisation:
                    my_dict[v1[0]+v2[0]+v2[4]] = v1+"_"+v2  
            ddl = [my_dict]
            placed_data = {}
            not_placed_data ={}
            for value in d1:
                if value[-1] == 'P':
                    placed_data[value[:-1]] = d1[value]
                else:
                    not_placed_data[value[:-1]] = d1[value] 
            placed_list = []
            for key in placed_data.keys():
                temp = {}
                temp["label"] = key
                temp["value"] = placed_data[key]
                temp["meaning"] = my_dict[key]
                placed_list.append(temp)
            not_placed_list = []
            for key in not_placed_data.keys():
                temp = {}
                temp["label"] = key
                temp["value"] = not_placed_data[key]
                temp["meaning"] = my_dict[key]
                not_placed_list.append(temp)
            final = [placed_list, not_placed_list]
            return json.dumps(final)


    return app
