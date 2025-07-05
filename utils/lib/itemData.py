import json
from .formatters import formatDescription, formatProperties, formatRarity, formatUses, formatAttunement

VALID_ITEM_TYPES = ["loot", "armor", "weapon", "consumable", "equipment", "tool"]


def readItemFromFile(path: str):
    with open(path, "r") as jsonFile:
        jsonObj = json.load(jsonFile)
        if jsonObj["type"] not in VALID_ITEM_TYPES or "system" not in jsonObj:
            return None
        else:
            item = {}
            item["_id"] = jsonObj["_id"]
            item["name"] = jsonObj["name"]
            item["price"] = jsonObj["system"]["price"]
            item["weight"] = jsonObj["system"]["weight"]
            item["rarity"] = formatRarity(jsonObj["system"]["rarity"])
            item["properties"] = formatProperties(jsonObj["system"]["properties"])
            item["description"] = formatDescription(jsonObj["system"]["description"]["value"], clean_html_tags=False)
            if "uses" in jsonObj["system"]:
                item["uses"] = formatUses(jsonObj["system"]["uses"])
            item["systemType"] = jsonObj["system"]["type"]
            if "mastery" in jsonObj["system"]:
                item["mastery"] = jsonObj["system"]["mastery"]
            if "range" in jsonObj["system"]:
                item["range"] = jsonObj["system"]["range"]
            if "damage" in jsonObj["system"]:
                item["damage"] = jsonObj["system"]["damage"]
            if "armor" in jsonObj["system"]:
                item["armor"] = jsonObj["system"]["armor"]
            if "strength" in jsonObj["system"]:
                item["strength"] = jsonObj["system"]["strength"]
            if "versatile" in jsonObj["system"]:
                item["versatile"] = jsonObj["system"]["versatile"]
            if "attunement" in jsonObj["system"]:
                item["attunement"] = formatAttunement(jsonObj["system"]["attunement"])
            return item
