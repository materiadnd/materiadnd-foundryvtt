import json
from typing import Any, Dict
from .classData import getClassFeatures, getScaleValues
from .formatters import slugify

THIRD_CASTER_SLOTS_BY_LEVEL = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [2, 0, 0, 0],
    [3, 0, 0, 0],
    [3, 0, 0, 0],
    [3, 0, 0, 0],
    [4, 2, 0, 0],
    [4, 2, 0, 0],
    [4, 2, 0, 0],
    [4, 3, 0, 0],
    [4, 3, 0, 0],
    [4, 3, 0, 0],
    [4, 3, 2, 0],
    [4, 3, 2, 0],
    [4, 3, 2, 0],
    [4, 3, 3, 0],
    [4, 3, 3, 0],
    [4, 3, 3, 0],
    [4, 3, 3, 1],
    [4, 3, 3, 1],
]


def readSubclassData(filePath: str, identifier: str) -> Dict[str, Any] | None:
    with open(filePath, "r") as jsonFile:
        jsonObj = json.load(jsonFile)
        if (
            "type" in jsonObj
            and jsonObj["type"] == "subclass"
            and "system" in jsonObj
            and "classIdentifier" in jsonObj["system"]
            and jsonObj["system"]["classIdentifier"] == identifier
        ):
            subclassData = {}
            subclassData["name"] = jsonObj["name"]
            subclassData["slug"] = slugify(jsonObj["name"])
            subclassData["description"] = jsonObj["system"]["description"]["value"]
            subclassData["third_caster"] = jsonObj["system"]["spellcasting"]["progression"] == "third"
            features = getClassFeatures(jsonObj["system"]["advancement"])
            subclassData["features"] = features
            subclassData["feature_levels"] = sorted(set([feature["level"] for feature in features]))
            if subclassData["third_caster"]:
                subclassData["features_by_level"] = {}
                subclassData["third_caster_slots"] = {}
                for i in range(1, 21):
                    subclassData["features_by_level"][i] = [f for f in features if f["level"] == i]
                    subclassData["third_caster_slots"][i] = THIRD_CASTER_SLOTS_BY_LEVEL[i - 1]
            else:
                subclassData["features_by_level"] = {}
                for level in subclassData["feature_levels"]:
                    subclassData["features_by_level"][level] = [f for f in features if f["level"] == level]
            subclassData["scale_values"] = getScaleValues(jsonObj["system"]["advancement"])

            return subclassData
        else:
            return None
