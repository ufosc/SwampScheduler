# # import json
# #
# # f = open('jsonformatter.json', encoding='utf8')
# #
# # location = json.load(f)
# #
# # uniqueSet = set()
# #
# # for i in location['courses']:
# #     for x in i['sections']:
# #         for g in x['meetTimes']:
# #             if g['meetBldgCode'] != "" and g['meetBldgCode'] != 'WEB' and not uniqueSet.__contains__(g['meetBldgCode']):
# #                 uniqueSet.add(g['meetBldgCode'])
# #
# #
# #
# # print(uniqueSet.__len__())
#
# # Authors: Javier Martinex & Alexander Wang
#
# '''
# 1) Extract locations.json and parse it to show only locations with JTYPE = "BLDG"
# 2) Use Open route service api to make a matrix of locations
# 3) Enter data into CSV file
# Origin | Destination | Distance | Estimated Time (minutes)
# xxxxxx | yyyyyyyyyyy | gggggggg | hhhhhhhhhhhhhhhhhhhhhhh
# xxxxxx | yyyyyyyyyyy | gggggggg | hhhhhhhhhhhhhhhhhhhhhhh
# xxxxxx | yyyyyyyyyyy | gggggggg | hhhhhhhhhhhhhhhhhhhhhhh
# xxxxxx | yyyyyyyyyyy | gggggggg | hhhhhhhhhhhhhhhhhhhhhhh
# '''
#
# import json
# import openrouteservice as ors
# import csv
#
#
#
# def writeToMatrixCSV():
#     f = open('locationdata/data.json')
#     testLoc = json.load(f)
#     with open('locationdata/matrix.csv', 'w', newline='') as file:
#         writer = csv.writer(file)
#         writer.writerow(testLoc["metadata"]["query"]["locations"])
#
#         for x in testLoc["distances"]:
#             writer.writerow(x)
#
#
# def allBuildingsLocations():
#     f = open('locationdata/locations.json')
#     g = open('locationdata/jsonformatter.json', encoding='utf8')
#
#     classLocations = json.load(g)
#
#     uniqueSet = set()
#
#     for i in classLocations['courses']:
#         for x in i['sections']:
#             for g in x['meetTimes']:
#                 if g['meetBldgCode'] != "" and g['meetBldgCode'] != 'WEB' and not uniqueSet.__contains__(
#                         g['meetBldgCode']):
#                     uniqueSet.add(str(g['meetBldgCode']))
#
#     bldgLocations = json.load(f)
#
#     filteredLocations = []
#
#     for i in bldgLocations:
#         if uniqueSet.__contains__(i['BLDG']):
#             filteredLocations.append(i)
#             uniqueSet.remove(str(i['BLDG']))
#
#     coordArrayRow = []
#
#     index = 1
#
#     for x in filteredLocations:
#         coordArrayRow.append([x['LON'], x['LAT']])
#
#     coordArrayCol = coordArrayRow
#
#     print(coordArrayCol)
#
#
# if __name__ == '__main__':
#
#     buildingNames = ["Marston Science Library",
#                      "New Physics Building",
#                      "Cypress Hall",
#                      "Matherly Hall",
#                      "Springs Residential Complex"]
#
#     # coordsX = ["Marston Science Library",
#     #                  "New Physics Building",
#     #                  "Cypress Hall",
#     #                  "Matherly Hall",
#     #                  "Springs Residential Complex"]
#     #
#     # coordsY = ["Marston Science Library",
#     #                  "New Physics Building",
#     #                  "Cypress Hall",
#     #                  "Matherly Hall",
#     #                  "Springs Residential Complex"]
#
#     coordsX = [["-82.34358891053401", "29.648249392235076"],
#                ["-82.3498861546414", "29.64418783373911"],
#                ["-82.33985165091272", "29.645862976265853"],
#                ["-82.34098076679759", "29.65171467893051"],
#                ["-82.35702497638673", "29.64883538564013"]]
#
#     coordsY = [["-82.34358891053401", "29.648249392235076"],
#                ["-82.3498861546414", "29.64418783373911"],
#                ["-82.33985165091272", "29.645862976265853"],
#                ["-82.34098076679759", "29.65171467893051"],
#                ["-82.35702497638673", "29.64883538564013"]]
#
#     clientORS = ors.Client(key="5b3ce3597851110001cf6248b5572d28507d4d8097e3630d88f745a7")
#
#     for i in range(0, 5, 2):
#         xLoc = []
#         for x in coordsX[i: i + 2]:
#             xLoc.append(x)
#
#         for g in range(0, 5, 2):
#             yLoc = []
#             for y in coordsY[g: g + 2]:
#                 yLoc.append(y)
#
#             matrix = ors.client.distance_matrix(client=ors.Client(key="5b3ce3597851110001cf6248b5572d28507d4d8097e3630d88f745a7"),locations=xLoc, profile='foot-walking', metrics=['distance'], validate=False)
#             print(matrix)
#
#

# def search_building_coords(building, key):
#     coordinates_base_url = "https://api.tomtom.com/search/2/search/" + urlparse.quote(building) + ".json?minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&relatedPois=off&key=" + key
#     json_response = requests.get(coordinates_base_url).json()
#     latitude = json_response['results'][0]['position']['lat']
#     longitude = json_response['results'][0]['position']['lon']
#     position = str(latitude) + "," + str(longitude)
#     return position
#
# departure_point = "1310 Museum Rd, Gainesville, FL 32612"
# arrival_point = "1310 Museum Rd, Gainesville, FL 32612"
# #Route Parameters
# start = "29.651989,-82.340536"
# end = "29.644952,-82.339475"
# routeType = "fastest"
# travelMode = "pedestrian"
# departAt = "now"
# key = "89kvYiCK6GOJGjb7DbtyMoW7KXy1d3R3"
#
# baseUrl = "https://api.tomtom.com/routing/1/calculateRoute/"
#
# requestsParams = (urlparse.quote(start) + ":" + urlparse.quote(end)
#                   + "/json?routeType=" + routeType
#                   + "&travelMode=" + travelMode
#                   + "&departAt=" + urlparse.quote(departAt))
#
# requestUrl = baseUrl + requestsParams + "&key=" + key
#
# response = requests.get(requestUrl)
#
# if response.status_code == 200:
#     jsonResult = response.json()
#
#
#     routeSummary = jsonResult['routes'][0]['summary']
#
#     distance = routeSummary["lengthInMeters"]
#
#     travelTime = routeSummary['travelTimeInSeconds'] / 60
#
#     print(f"Distance(m): {distance}, Travel time: {travelTime:.2f}min")
# else:
#     print("Error")
#     print(response.status_code)
# #Matherly: 29.651989,-82.340536
# #Cypresss: 29.644952,-82.339475

for x in range(0, 95):
    print(x)