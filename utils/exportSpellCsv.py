import os
import re
import csv
import json

DIR_ROOT = "packs\\_source\\spells"
FILES_TO_IGNORE = ["_folder.json"]
TYPES_TO_CHECK = ["spell"]
OUTPUT_FILE = "spellData.csv"

FORMAT_TAGS_RE = r"<.*?>"
PARA_TAGS_RE = r"<p\s?.*?>(.*?)</p>"  # replace with contents and a newline
SECRET_TAGS_RE = r"<section .*?class=\"secret\" .*?>.*?</section>"  # remove entirely
ENRICHER_RE = r"\[\[/(.*?)]\]({.*?})?"
REF_TAGS_RE = r"\&amp;Reference\[(.*?)\]"
UUID_TAGS_RE = r"@UUID\[.*?\]\{(.*?)\}"

SPELL_DATA = {}  # dict keyed by ID

SCORE_NAMES = {
    "str": "Strength",
    "dex": "Dexterity",
    "con": "Constitution",
    "int": "Intelligence",
    "wis": "Wisdom",
    "cha": "Charisma",
}

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

SKILL_NAMES = {
    "acr": "Acrobatics",
    "ani": "Animal Handling",
    "arc": "Arcana",
    "ath": "Athletics",
    "dec": "Deception",
    "his": "History",
    "ins": "Insight",
    "itm": "Intimidation",
    "inv": "Investigation",
    "med": "Medicine",
    "nat": "Nature",
    "prc": "Perception",
    "prf": "Performance",
    "prs": "Persuasion",
    "rel": "Religion",
    "slt": "Sleight of Hand",
    "ste": "Stealth",
    "sur": "Survival",
}


def findJsonFiles(rootDir, func):
    for root, dirs, files in os.walk(rootDir):
        for file in [f for f in files if os.path.splitext(f)[1] == ".json" and f not in FILES_TO_IGNORE]:
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
    elif "cost" in activation and activation["cost"] and int(activation["cost"]) > 1:
        return f"{activation['cost']} {activation['type']}s".title()
    elif "cost" in activation:
        return f"{activation['cost']} {activation['type']}".title()
    else:
        return "Other"


def formatDescription(desc):
    clean_desc = re.sub(SECRET_TAGS_RE, "", desc)
    clean_desc = re.sub(PARA_TAGS_RE, r"\1\n", clean_desc)
    clean_desc = re.sub(FORMAT_TAGS_RE, "", clean_desc)
    clean_desc = formatEnrichers(clean_desc)
    clean_desc = re.sub(REF_TAGS_RE, r"\1", clean_desc)
    clean_desc = re.sub(UUID_TAGS_RE, r"\1", clean_desc)
    clean_desc = re.sub(" apply=false", "", clean_desc)  # hack to handle reference notation
    clean_desc = clean_desc.rstrip("\n")
    return clean_desc


def formatDuration(duration):
    if duration["units"] == "inst":
        return "Instantaneous"
    elif duration["units"] == "disp":
        return "Until Dispelled"
    elif duration["units"] == "dstr":
        return "Until Dispelled or Triggered"
    elif "value" in duration:
        return f"{duration['value']} {duration['units']}"
    else:
        return "Other"


def formatEnrichers(desc):
    match_found = True
    while match_found:
        match = re.search(ENRICHER_RE, desc)
        if not match:
            match_found = False
        else:
            if match.group(2):
                # there's a text replace thing already
                cleaned_caption = match.group(2).lstrip("{").rstrip("}")
                desc = desc.replace(match.group(0), cleaned_caption)
            else:
                enricher_string = match.group(1)
                enricher_type, *properties = enricher_string.split(" ")
                if enricher_type == "check" or enricher_type == "skill":
                    kvps = [prop.split("=") for prop in properties if "=" in prop]
                    if kvps:
                        skill = None
                        ability = None
                        for kvp in kvps:
                            if kvp[0] == "ability":
                                ability = SCORE_NAMES[kvp[1].lower()]
                            elif kvp[0] == "skill":
                                skill = SKILL_NAMES[kvp[1].lower()]
                        # all current examples have an ability
                        if skill and ability:
                            desc = desc.replace(match.group(0), f"{skill.title()} ({ability.title()}) check")
                        elif ability:
                            desc = desc.replace(match.group(0), f"{ability.title()} check")
                        else:
                            desc = desc.replace(match.group(0), f"{properties[0].title()} check")
                    else:
                        # just return the first property
                        desc = desc.replace(match.group(0), f"{properties[0].title()} check")
                elif enricher_type == "damage":
                    # all damages should just be a dice formula followed by an optional damage type
                    if len(properties) > 1:
                        desc = desc.replace(match.group(0), f"{properties[0]} {properties[1].title()}")
                    else:
                        desc = desc.replace(match.group(0), f"{properties[0]}")
                elif enricher_type == "heal":
                    kvps = [prop.split("=") for prop in properties if "=" in prop]
                    if kvps:
                        for kvp in kvps:
                            if kvp[0] == "type":
                                healType = kvp[1]
                        desc = desc.replace(match.group(0), f"{properties[0]} {healType}")
                    else:
                        desc = desc.replace(match.group(0), f"{properties[0]} healing")
                elif enricher_type == "roll" or enricher_type == "r":
                    desc = desc.replace(match.group(0), properties[0])
                elif enricher_type == "save" or enricher_type == "concentration":
                    kvps = [prop.split("=") for prop in properties if "=" in prop]
                    if kvps:
                        ability = None
                        longFormat = False
                        for kvp in kvps:
                            if kvp[0] == "ability":
                                ability = SCORE_NAMES[kvp[1].lower()]
                            elif kvp[0] == "format" and kvp[1] == "long":
                                longFormat = True
                        # all current examples have an ability
                        if longFormat:
                            if ability:
                                desc = desc.replace(match.group(0), f"{ability.title()} saving throw")
                            else:
                                desc = desc.replace(match.group(0), f"{properties[0].title()} saving throw")
                        else:
                            if ability:
                                desc = desc.replace(match.group(0), f"{ability.title()}")
                            else:
                                desc = desc.replace(match.group(0), f"{properties[0].title()}")
                    else:
                        # just return the first property
                        desc = desc.replace(match.group(0), f"{properties[0].title()} check")
                else:
                    desc = desc.replace(match.group(0), enricher_type)
    return desc


def formatRange(range):
    if "value" in range and range["value"]:
        return f"{range['value']} {range['units']}"
    elif "units" in range and range["units"] in ["touch", "self"]:
        return range["units"].title()
    else:
        return "Other"


def formatSchool(school):
    return SPELL_SCHOOLS[school]


def formatTarget(target):
    parts = []
    parts.append(str("value" in target and target["value"] or ""))
    parts.append("units" in target and target["units"] or "")
    parts.append("type" in target and target["type"] or "")
    if "template" in target:
        template = target["template"]
        parts.append("count" in template and template["count"] or "")
        parts.append("size" in template and template["size"] or "")
        parts.append("units" in template and template["units"] or "")
        parts.append("type" in template and template["type"] or "")
    if "affects" in target:
        affects = target["affects"]
        if "type" in affects and affects["type"] == "self":
            parts.append("emanation")
        else:
            parts.append("count" in affects and affects["count"] or "")
            parts.append("units" in affects and affects["units"] or "")
            parts.append("type" in affects and affects["type"] or "")
    parts = [part for part in parts if part != ""]
    return " ".join(parts)


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
        target = formatTarget(jsonObj["system"]["target"]).strip()
        components = "/".join(getComponents(jsonObj["system"]["properties"]))
        materials = jsonObj["system"]["materials"]["value"]
        consumeMaterials = jsonObj["system"]["materials"]["consumed"]
        duration = formatDuration(jsonObj["system"]["duration"])
        concentration = "concentration" in jsonObj["system"]["properties"]
        ritual = "ritual" in jsonObj["system"]["properties"]
        description = formatDescription(jsonObj["system"]["description"]["value"])
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
