import os
import json

DIR_ROOT = 'packs\\_source\\spells\\cantrips'
FILES_TO_IGNORE = [ '_folder.json' ]

def updateJsonFiles(rootDir, func):
    for root, dirs, files, in os.walk(rootDir):
        for file in [f for f in files if os.path.splitext(f)[1] == '.json' and f not in FILES_TO_IGNORE]:
            fullPath = os.path.join(root, file)
            func(fullPath)

def matchKeyToId(filePath):
    updated = False
    jsonObj = None
    with open(filePath, 'r') as jsonFile:
        jsonObj = json.load(jsonFile)
        if '_key' not in jsonObj or "_id" not in jsonObj:
            return  # should never happen I think
        key = jsonObj['_key']
        id = jsonObj['_id']
        if key.split("!")[-1] != id:
            keyParts = key.split("!")
            keyParts[-1] = id
            newKey = "!".join(keyParts)
            jsonObj['_key'] = newKey
            updated = True
    if updated and jsonObj is not None:
        with open(filePath, 'w') as updatedFile:
            json.dump(jsonObj, updatedFile, indent=2)
            print(f'Updated file: {filePath}')

if __name__ == '__main__':
    updateJsonFiles(DIR_ROOT, matchKeyToId)