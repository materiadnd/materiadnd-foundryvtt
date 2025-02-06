import os
import csv
import json

DIR_ROOT = "packs\\_source\\spells"
FILES_TO_IGNORE = ["_folder.json"]
TYPES_TO_CHECK = ["spell"]
OUTPUT_FILE = "spellData.csv"

SPELL_DATA = {}  # dict keyed by ID

SPELL_SCHOOLS = {
    "abj": "Abjuration",
    "con": "Conjuration",
    "div": "Divination",
    "enc": "Enchantment",
    "evo": "Evocation",
    "ill": "Illusion",
    "nec": "Necromancy",
    "trs": "Transmutation",
}


def findJsonFiles(rootDir, func):
    for root, dirs, files in os.walk(rootDir):
        for file in [
            f
            for f in files
            if os.path.splitext(f)[1] == ".json" and f not in FILES_TO_IGNORE
        ]:
            fullPath = os.path.join(root, file)
            func(fullPath)


def formatCastingTime(activation):
    if activation["type"] in ["action", "reaction"]:
        return activation["type"].title()
    elif activation["type"] == "bonus":
        return "Bonus Action"
    elif "value" in activation and activation["value"] and int(activation["value"]) > 1:
        return f"{activation['value']} {activation['type']}s".title()
    elif "value" in activation:
        return f"{activation['value']} {activation['type']}".title()
    else:
        return "Other"


def formatDuration(duration):
    if duration["units"] == "inst":
        return "Instantaneous"
    elif duration["units"] == "disp":
        return "Until Dispelled"
    elif "value" in duration:
        return f"{duration['value']} {duration['units']}"
    else:
        return "Other"


def formatRange(range):
    if "value" in range and range["value"]:
        return f"{range['value']} {range['units']}"
    else:
        return "Other"


def formatSchool(school):
    return SPELL_SCHOOLS[school]


def formatTarget(target):
    value = "value" in target and target["value"] or ""
    units = "units" in target and target["units"] or ""
    targetType = "type" in target and target["type"] or ""
    formatStr = " ".join([str(value), units, targetType])
    if "template" in target:
        template = target["template"]
        templateCt = "count" in template and template["count"] or ""
        templateSize = "size" in template and template["size"] or ""
        templateUnits = "units" in template and template["units"] or ""
        templateType = "type" in template and template["type"] or ""
        formatStr += " ".join([templateCt, templateSize, templateUnits, templateType])
    if "affects" in target:
        affects = target["affects"]
        affectsCt = "count" in affects and affects["count"] or ""
        affectsUnits = "units" in affects and affects["units"] or ""
        affectsType = "type" in affects and affects["type"] or ""
        formatStr += " ".join([affectsCt, affectsUnits, affectsType])
    return formatStr


def getComponents(properties):
    components = []
    if "vocal" in properties:
        components.append("V")
    if "somatic" in properties:
        components.append("S")
    if "material" in properties:
        components.append("M")
    return components


def getSpellData(filePath):
    with open(filePath, "r") as jsonFile:
        jsonObj = json.load(jsonFile)
        if "type" not in jsonObj or jsonObj["type"] not in TYPES_TO_CHECK:
            return
        id = jsonObj["_id"]
        name = jsonObj["name"]
        school = formatSchool(jsonObj["system"]["school"])
        level = jsonObj["system"]["level"]
        castingTime = formatCastingTime(jsonObj["system"]["activation"])
        range = formatRange(jsonObj["system"]["range"])
        target = formatTarget(jsonObj["system"]["target"])
        components = "/".join(getComponents(jsonObj["system"]["properties"]))
        materials = jsonObj["system"]["materials"]["value"]
        consumeMaterials = jsonObj["system"]["materials"]["consumed"]
        duration = formatDuration(jsonObj["system"]["duration"])
        concentration = "concentration" in jsonObj["system"]["properties"]
        ritual = "ritual" in jsonObj["system"]["properties"]
        description = jsonObj["system"]["description"]["value"]
        activityNames = []
        if "activities" in jsonObj["system"]:
            for key in jsonObj["system"]["activities"].keys():
                if "name" in jsonObj["system"]["activities"][key]:
                    activityNames.append(jsonObj["system"]["activities"][key]["name"])
                else:
                    activityNames.append("Cast")
        SPELL_DATA[id] = {
            "spellName": name,
            "school": school,
            "level": level,
            "castingTime": castingTime,
            "range": range,
            "target": target,
            "components": components,
            "materials": materials,
            "consumeMaterials": consumeMaterials,
            "duration": duration,
            "concentration": concentration,
            "ritual": ritual,
            "description": description,
            "activityNames": activityNames,
        }


def exportCsv(spellData):
    with open(OUTPUT_FILE, "w", newline="") as csvFile:
        fieldNames = [
            "spellName",
            "school",
            "level",
            "castingTime",
            "range",
            "target",
            "components",
            "materials",
            "consumeMaterials",
            "duration",
            "concentration",
            "ritual",
            "description",
            "activityNames",
        ]
        writer = csv.DictWriter(csvFile, fieldnames=fieldNames)
        writer.writeheader()
        for k, v in SPELL_DATA.items():
            writer.writerow(v)


if __name__ == "__main__":
    findJsonFiles(DIR_ROOT, getSpellData)
    exportCsv(SPELL_DATA)
