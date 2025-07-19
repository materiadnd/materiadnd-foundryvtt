import os
import json

DIR_ROOT = "packs\\_source"
TYPES_TO_UPDATE = [
    "spell",
    "equipment",
    "consumable",
    "tool",
    "loot",
    "container",
    "class",
    "feat",
    "background",
    "npc",
    "subclass",
    "weapon",
]
FILES_TO_IGNORE = ["_folder.json"]


def updateJsonFiles(rootDir, func):
    for (
        root,
        dirs,
        files,
    ) in os.walk(rootDir):
        for file in [f for f in files if os.path.splitext(f)[1] == ".json" and f not in FILES_TO_IGNORE]:
            fullPath = os.path.join(root, file)
            func(fullPath)


def addOrUpdateSource(filePath):
    updated = False
    jsonObj = None
    with open(filePath, "r") as jsonFile:
        jsonObj = json.load(jsonFile)
        if "type" not in jsonObj or "system" not in jsonObj:
            return  # should never happen I think
        if jsonObj["type"] not in TYPES_TO_UPDATE:
            print(f"Ignoring file: {filePath}, type is not in list to update.")
            return
        jsonObj["system"]["source"] = {
            "rules": "2024",
            "revision": 1,
            "book": "Materia",
        }
        updated = True
    if updated and jsonObj is not None:
        with open(filePath, "w") as updatedFile:
            json.dump(jsonObj, updatedFile, indent=2, ensure_ascii=True)
            print(f"Updated file: {filePath}")


if __name__ == "__main__":
    updateJsonFiles(DIR_ROOT, addOrUpdateSource)
