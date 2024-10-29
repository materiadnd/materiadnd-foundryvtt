import os
import json

DIR_ROOT = 'packs\\_source\\spells'
FILES_TO_IGNORE = [ '_folder.json' ]
TYPES_TO_CHECK = [ 'spell', 'weapon' ]

def findJsonFiles(rootDir, func):
    for root, dirs, files in os.walk(rootDir):
        for file in [f for f in files if os.path.splitext(f)[1] == '.json' and f not in FILES_TO_IGNORE]:
            fullPath = os.path.join(root, file)
            func(fullPath)

def printIfMissingActivity(filePath):
    with open(filePath, 'r') as jsonFile:
        jsonObj = json.load(jsonFile)
        if 'type' not in jsonObj or jsonObj['type'] not in TYPES_TO_CHECK:
            return
        if 'system' not in jsonObj:
            return
        if 'activities' not in jsonObj['system']:
            print(f'File {filePath} has no activities.')

if __name__ == '__main__':
    findJsonFiles(DIR_ROOT, printIfMissingActivity)