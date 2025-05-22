import json
from lib.formatters import formatDescription


def readFeatFromFile(path: str):
    with open(path, "r") as jsonFile:
        jsonObj = json.load(jsonFile)
        if jsonObj["type"] != "feat" or "system" not in jsonObj:
            return None
        elif (
            "flags" not in jsonObj
            or "materia-dnd" not in jsonObj["flags"]
            or "feats" not in jsonObj["flags"]["materia-dnd"]
        ):
            return None
        else:
            featData = {}
            featData["id"] = jsonObj["_id"]
            featData["name"] = jsonObj["name"]
            featData["description"] = formatDescription(
                jsonObj["system"]["description"]["value"], clean_html_tags=False
            )
            featData["featType"] = jsonObj["flags"]["materia-dnd"]["feats"]["type"]
            featData["featParent"] = jsonObj["flags"]["materia-dnd"]["feats"].get("parent")
            featData["featCost"] = jsonObj["flags"]["materia-dnd"]["feats"].get("cost")
            return featData
