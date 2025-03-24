import os
import json
from ..lib.formatters import (
    formatCastingTime,
    formatDescription,
    formatDuration,
    formatRange,
    formatSchool,
    getComponents,
)

SPELL_DIR_ROOT = "packs\\_source\\spells"
FILES_TO_IGNORE = ["_folder.json"]

SUBDIR_LIST = [
    "cantrips",
    "1st-level-spells",
    "2nd-level-spells",
    "3rd-level-spells",
    "4th-level-spells",
    "5th-level-spells",
    "6th-level-spells",
    "7th-level-spells",
    "8th-level-spells",
    "9th-level-spells",
]

TEMPLATE_DIR = "utils\\htmlgen\\templates"


def getSpellData(rootDir):
    spellData = []
    for root, dirs, files in os.walk(rootDir):
        for file in [f for f in files if os.path.splitext[f][1] == ".json" and f not in FILES_TO_IGNORE]:
            fullPath = os.path.join(root, file)
            with open(fullPath, "r") as jsonFile:
                jsonObj = json.load(jsonFile)
                if jsonObj["type"] != "spell" or "system" not in jsonObj:
                    continue
                else:
                    spell = {}
                    spell["name"] = jsonObj["name"]
                    spell["level"] = jsonObj["system"]["level"]
                    spell["school"] = formatSchool(jsonObj["system"]["school"])
                    spell["castingTime"] = formatCastingTime(jsonObj["system"]["activation"])
                    spell["range"] = formatRange(jsonObj["system"]["range"])
                    spell["components"] = ", ".join(getComponents(jsonObj["system"]["properties"]))
                    spell["duration"] = formatDuration(jsonObj["system"]["duration"])
                    spell["description"] = formatDescription(jsonObj["system"]["description"]["value"])
                    spellData.append(spell)


def renderHtml(spellData):
    print(spellData)
    print()


if __name__ == "__main__":
    spellData = []
    for subdir in SUBDIR_LIST:
        spellData.append(getSpellData(os.path.join(SPELL_DIR_ROOT, subdir)))
    renderHtml(spellData)
