import os
import re
import copy
import json
import itertools


DIR_ROOT = 'packs\\_source'
FLAGS_TO_ADD = [
    {
        "materia-dnd": {
            "sourceId": "Compendium.materia-dnd.%%0%%.Item.{{_id}}"
        }
    }
]
FILES_TO_IGNORE = [ '_folder.json' ]
TYPES_TO_UPDATE = [ 'equipment', 'weapon', 'spell' ]

def updateJsonFiles(rootDir, func):
    for root, dirs, files in os.walk(rootDir):
        for file in [f for f in files if os.path.splitext(f)[1] == '.json' and f not in FILES_TO_IGNORE]:
            fullPath = os.path.join(root, file)
            func(fullPath)

def addFlags(filePath, flagsToAdd = FLAGS_TO_ADD):
    updated = False
    jsonObj = None
    with open(filePath, 'r') as jsonFile:
        jsonObj = json.load(jsonFile)
        if 'type' not in jsonObj or jsonObj['type'] not in TYPES_TO_UPDATE:
            return
        for flag in flagsToAdd:
            updatedFlag = updateFlagFields(flag, jsonObj, filePath)
            if 'flags' not in jsonObj:
                jsonObj['flags'] = updatedFlag
                updated = True
            else:
                flagNamespace = [k for k in updatedFlag.keys()][0]
                if flagNamespace not in jsonObj['flags']:
                    jsonObj['flags'][flagNamespace] = updatedFlag[flagNamespace]
                    updated = True
                else:
                    for valueKey in updatedFlag[flagNamespace]:
                        jsonObj['flags'][flagNamespace][valueKey] = updatedFlag[flagNamespace][valueKey]
                        updated = True

    if updated and jsonObj is not None:
        with open(filePath, 'w') as updatedFile:
            json.dump(jsonObj, updatedFile, indent=2)
            print(f'Updated file: {filePath}')
    

def updateFlagFields(flag, fullObj, filePath):
    """Updates a templatized flag to have the appropriate values for the provided full object.
    Template values are {{}} with the property path from the full object expected as the substitution.
    As these are flags, there's an expected structure:
    { 'namespace': { 'keyName': 'value' } }
    The only thing we check for templates are the values.
    """
    newFlag = copy.deepcopy(flag)
    namespace = [k for k in flag.keys()][0]
    for k in newFlag[namespace].keys():
        templateBlocks = re.findall(r"{{\w+}}", newFlag[namespace][k])
        for block in templateBlocks:
            objPath = block[2:-2]
            templateValue = getValueFromObj(objPath, fullObj)
            newFlag[namespace][k] = re.sub(block, templateValue, newFlag[namespace][k])
        pathBlocks = re.findall(r"%%\d%%", flag[namespace][k])
        for block in pathBlocks:
            pathPartNumber = int(block[2:-2])
            relativePath = removeRootDirectory(DIR_ROOT, filePath)
            pathParts = relativePath.split(os.sep)
            newFlag[namespace][k] = re.sub(block, pathParts[pathPartNumber], newFlag[namespace][k])
    return newFlag
    
def getValueFromObj(path, obj):
    if '.' not in path:
        return obj[path]
    else:
        parts = path.split(',', 1)
        return getValueFromObj(parts[1], obj[parts[0]])

def removeRootDirectory(rootDir, fullPath):
    filePathParts = fullPath.split(os.sep)
    rootDirParts = rootDir.split(os.sep)
    normalizedPathParts = []
    for filePathPart, rootDirPart in itertools.zip_longest(filePathParts, rootDirParts):
        if filePathPart == rootDirPart:
            continue
        else:
            normalizedPathParts.append(filePathPart)
    return os.sep.join(normalizedPathParts)

if __name__ == '__main__':
    updateJsonFiles('packs\\_source', addFlags)