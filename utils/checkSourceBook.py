import os
import json

DIR_ROOT = 'packs\\_source'
FILES_TO_IGNORE = [ '_folder.json' ]

def findJsonFiles(rootDir, func):
    for root, dirs, files in os.walk(rootDir):
        for file in [f for f in files if os.path.splitext(f)[1] == '.json' and f not in FILES_TO_IGNORE]:
            fullPath = os.path.join(root, file)
            func(fullPath)

def findSource(filePath):
    with open(filePath, 'r') as jsonFile:
        jsonObj = json.load(jsonFile)
        if 'system' not in jsonObj or 'source' not in jsonObj['system'] or 'book' not in jsonObj['system']['source']:
            print(f'{filePath} is missing one of the source paths')
            return
        if jsonObj['system']['source']['book'] != 'Materia':
            print(f'{filePath} does not have correct source')
        if len(jsonObj['system']['source'].keys()) > 1:
            print(f'{filePath} has source {jsonObj['system']['source']}')

if __name__ == '__main__':
    findJsonFiles(DIR_ROOT, findSource)