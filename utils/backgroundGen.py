import os
import re
import copy
import json
import time
import string
import random
####
# this will
# 1. remove all existing background source files (.json)
# 2. look through the feats source folder for all parent feats (ones in top-level directory, as others are bullets), and for each parent feat found:
#    a. get the IDs of the options (in -options dirs)
# 3. for each found parent feat
#    a. generate new background source file from template
#    b. update choice selections to include each of the options found

BACKGROUND_DIR_ROOT = "packs\\_source\\backgrounds"
FEATS_DIR_ROOT = "packs\\_source\\feats"
FILES_TO_IGNORE = ["_folder.json"]
FEAT_DIRS_TO_IGNORE = ["epic-boon-feats", "half-feats", "int-bonus", "species-feats"]
BACKGROUND_TEMPLATE = {
    "name": "[[name]]",
    "type": "background",
    "_id": "[[id]]",
    "img": "[[img]]",
    "system": {
        "description": {
            "value": '<div class="prerequisite">[[prerequisiteText]]</div><p><strong>Ability Scores:</strong> Any</p><p><strong>Feat: </strong>@UUID[[[parentFeatUuid]]]{[[name]]}</p><p><strong>Skill Proficiencies: </strong>Choose any two</p><p><strong>Tool Proficiencies: </strong>Choose any two</p><p><strong>Equipment: </strong>50 GP</p><div class="flavorText">[[flavorText]]</div>',
            "chat": "",
        },
        "identifier": "[[identifier]]",
        "source": {"revision": 1, "rules": "2024", "book": "Materia"},
        "startingEquipment": [],
        "advancement": [
            {
                "_id": "%%generateId%%",
                "type": "AbilityScoreImprovement",
                "configuration": {
                    "cap": 2,
                    "fixed": {"str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0},
                    "locked": [],
                    "points": 3,
                },
                "value": {"type": "asi"},
                "level": 0,
                "title": "Background Ability Score Improvement",
                "hint": "Your background allows you to increase your ability scores: increase one of them by 2 and a different one by 1, or increases all three by 1. None of these increases can raise a score above 20.",
            },
            {
                "_id": "%%generateId%%",
                "type": "Trait",
                "configuration": {
                    "allowReplacements": False,
                    "choices": [{"count": 2, "pool": ["languages:standard:*"]}],
                    "grants": ["languages:standard:common"],
                    "mode": "default",
                },
                "value": {"chosen": []},
                "level": 0,
                "title": "Choose Languages",
                "hint": "Your character knows at least three languages: Common plus two languages you roll or choose from the Standard Languages table.",
            },
            {
                "_id": "%%generateId%%",
                "type": "Trait",
                "configuration": {
                    "allowReplacements": False,
                    "choices": [
                        {
                            "count": 2,
                            "pool": [
                                "tool:*",
                            ],
                        },
                        {
                            "count": 2,
                            "pool": [
                                "skills:*",
                            ],
                        },
                    ],
                    "grants": [],
                    "mode": "default",
                },
                "value": {"chosen": []},
                "level": 0,
                "title": "Background Proficiencies",
                "hint": "Your background grants you proficiency in two skills of your choice. It also grants you proficiency in two tools of your choice.",
            },
            {
                "_id": "%%generateId%%",
                "type": "ItemGrant",
                "configuration": {
                    "items": [
                        {
                            "optional": False,
                            "uuid": "[[parentFeatUuid]]",
                        }
                    ],
                    "optional": False,
                    "spell": None,
                },
                "value": {},
                "level": 0,
                "title": "Background Feat",
                "hint": "Your background grants you the [[name]] feat.",
            },
            {
                "_id": "%%generateId%%",
                "type": "ItemChoice",
                "configuration": {
                    "allowDrops": True,
                    "choices": {
                        "1": {"count": 3, "replacement": False},
                        "2": {"count": None, "replacement": True},
                        "3": {"count": None, "replacement": True},
                        "4": {"count": None, "replacement": True},
                        "5": {"count": None, "replacement": True},
                        "6": {"count": None, "replacement": True},
                        "7": {"count": None, "replacement": True},
                        "8": {"count": None, "replacement": True},
                        "9": {"count": None, "replacement": True},
                        "10": {"count": None, "replacement": True},
                        "11": {"count": None, "replacement": True},
                        "12": {"count": None, "replacement": True},
                        "13": {"count": None, "replacement": True},
                        "14": {"count": None, "replacement": True},
                        "15": {"count": None, "replacement": True},
                        "16": {"count": None, "replacement": True},
                        "17": {"count": None, "replacement": True},
                        "18": {"count": None, "replacement": True},
                        "19": {"count": None, "replacement": True},
                        "20": {"count": None, "replacement": True},
                    },
                    "pool": [
                        # this will be replaced with entries for the options
                    ],
                    "spell": None,
                    "type": "feat",
                    "restriction": {"type": "", "subtype": ""},
                },
                "value": {"added": {}, "replaced": {}},
                "title": "Background Feat Options",
                "hint": "Choose three options to specialize your background feat. You may replace one specialization every time you reach a new level.",
            },
        ],
        "wealth": "50",
    },
    "effects": [],
    "folder": None,
    "sort": "%%generated%%",
    "ownership": {"default": 0},
    "flags": {},
    "_stats": {
        "duplicateSource": None,
        "coreVersion": "12.343",
        "systemId": "dnd5e",
        "systemVersion": "4.3.9",
        "createdTime": 1745147305373,
        "modifiedTime": 1745147305373,
        "lastModifiedBy": "dnd5mbuilder0000",
    },
    "_key": "!items![[id]]",
}


def prune_existing_background_source_files(background_dir):
    for entry in os.scandir(background_dir):
        if entry.is_file() and entry.name not in FILES_TO_IGNORE:
            os.unlink(entry.path)


def parse_parent_feat_desc_for_parts(desc):
    prereq_text_match = re.search('<div class="prerequisite">(.*?)</div>', desc)
    prereq_text = prereq_text_match.group(1) if prereq_text_match else ""

    flavor_text_match = re.search('<div class="flavor-text">(.*?)</div>', desc)
    flavor_text = flavor_text_match.group(1) if flavor_text_match else ""

    return (prereq_text, flavor_text)


# iterates over the feat directories and accumulates feat data
def get_feat_data(feats_dir):
    feat_data = {}
    for entry in os.scandir(feats_dir):
        if entry.is_dir() and entry.name not in FEAT_DIRS_TO_IGNORE:
            feat_entries = []
            options_feats_dir = os.path.join(entry.path, f"{entry.name}-options")
            for options_entry in os.scandir(options_feats_dir):
                if options_entry.is_file() and options_entry.name not in FILES_TO_IGNORE:
                    with open(options_entry.path, "r") as optionsJsonFile:
                        optionsJsonObj = json.load(optionsJsonFile)
                        if all(["_id" in optionsJsonObj, "type" in optionsJsonObj, optionsJsonObj["type"] == "feat"]):
                            feat_entries.append(f"Compendium.materia-dnd.feats.Item.{optionsJsonObj['_id']}")
            parent_feat_path = os.path.join(entry.path, f"{entry.name}.json")
            with open(parent_feat_path, "r") as parentJsonFile:
                parentJsonObj = json.load(parentJsonFile)
                prereq_text, flavor_text = parse_parent_feat_desc_for_parts(
                    parentJsonObj["system"]["description"]["value"]
                )
                feat_data[entry.name] = {
                    "name": parentJsonObj["name"],
                    "id": parentJsonObj["_id"].replace("Fea", "Bgr"),
                    "img": parentJsonObj["img"],
                    "prerequisiteText": prereq_text,
                    "parentFeatUuid": f"Compendium.materia-dnd.feats.Item.{parentJsonObj['_id']}",
                    "flavorText": flavor_text,
                    "identifier": parentJsonObj["name"].lower(),
                    "options": feat_entries,
                }
    return feat_data


def generate_uuid():
    return "".join(random.choice(string.ascii_letters + string.digits) for _ in range(16))


def create_background_source(feat_data):
    for i, (key, item) in enumerate(feat_data.items()):
        data = copy.deepcopy(BACKGROUND_TEMPLATE)
        data["name"] = item["name"]
        data["_id"] = item["id"]
        data["img"] = item["img"]
        data["system"]["description"]["value"] = (
            data["system"]["description"]["value"]
            .replace("[[prerequisiteText]]", item["prerequisiteText"])
            .replace("[[parentFeatUuid]]", item["parentFeatUuid"])
            .replace("[[flavorText]]", item["flavorText"])
        )
        data["system"]["identifier"] = item["identifier"]
        data["_key"] = data["_key"].replace("[[id]]", item["id"])
        for advItem in data["system"]["advancement"]:
            advItem["_id"] = generate_uuid()
        data["system"]["advancement"][3]["configuration"]["items"][0]["uuid"] = item["parentFeatUuid"]
        data["system"]["advancement"][3]["hint"] = data["system"]["advancement"][3]["hint"].replace(
            "[[name]]", item["name"]
        )
        data["sort"] = (i + 1) * 100000
        data["_stats"]["createdTime"] = int(time.time())
        data["_stats"]["modifiedTime"] = int(time.time())
        data["system"]["advancement"][4]["configuration"]["pool"] = [{"uuid": uuid} for uuid in item["options"]]
        file_path = os.path.join(BACKGROUND_DIR_ROOT, f"{key}.json")
        with open(file_path, "w") as sourceFile:
            json.dump(data, sourceFile, indent=2)


if __name__ == "__main__":
    prune_existing_background_source_files(BACKGROUND_DIR_ROOT)
    feat_data = get_feat_data(FEATS_DIR_ROOT)
    create_background_source(feat_data)
