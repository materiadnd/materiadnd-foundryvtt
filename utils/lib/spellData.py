import json
from .formatters import formatSchool, formatCastingTime, formatRange, getComponents, formatDuration, formatDescription


def readSpellFromFile(path: str):
    with open(path, "r") as jsonFile:
        jsonObj = json.load(jsonFile)
        if jsonObj["type"] != "spell" or "system" not in jsonObj:
            return None
        else:
            spell = {}
            spell["name"] = jsonObj["name"]
            spell["level"] = jsonObj["system"]["level"]
            spell["school"] = formatSchool(jsonObj["system"]["school"])
            spell["castingTime"] = formatCastingTime(jsonObj["system"]["activation"])
            spell["range"] = formatRange(jsonObj["system"]["range"])
            spell["components"] = ", ".join(getComponents(jsonObj["system"]["properties"]))
            spell["duration"] = formatDuration(jsonObj["system"]["duration"])
            spell["description"] = formatDescription(jsonObj["system"]["description"]["value"], clean_html_tags=False)
            spell["concentration"] = "conecntration" in jsonObj["system"]["properties"]
            spell["materials"] = jsonObj["system"]["materials"]["value"]
            spell["ritual"] = "ritual" in jsonObj["system"]["properties"]
            return spell
