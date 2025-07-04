import os
import re
import json
###
# This (re)generates two things:
# 1. The parent feat descriptions (which list the bullet options)
# 2. The journal page for rules for each faet (which list the bullet options and has the descriptions)
#

FEATS_SOURCE_DIR = "packs\\_source\\feats"
FILES_TO_IGNORE = ["_folder.json"]
FEAT_DIRS_TO_IGNORE = ["epic-boon-feats", "half-feats", "int-bonus", "species-feats"]
PARENT_FEAT_ID_TO_JOURNAL_PAGE_ID = {
    "matFeaAlacrity00": "matJrnFeaAlacrit",
    "matFeaArmorSpeci": "matJrnFeaArmorSp",
    "matFeaBattleMagi": "matJrnFeaBattleM",
    "matFeaCombatRefl": "matJrnFeaCombatR",
    "matFeaDualWeapon": "matJrnFeaDualWea",
    "matFeaElohian000": "matJrnFeaElohian",
    "matFeaMagicalTra": "matJrnFeaMagicTr",
    "matFeaMountedCom": "matJrnFeaMounted",
    "matFeaNaturalWea": "matJrnFeaNatWeap",
    "matFeaPracticedC": "matJrnFeaPractic",
    "matFeaPsiTouched": "matJrnFeaPsiTouc",
    "matFeaRangedComb": "matJrnFeaRangedC",
    "matFeaSavageComb": "matJrnFeaSavageC",
    "matFeaSharpIntel": "matJrnFeaSharpIn",
    "matFeaSingleHand": "matJrnFeaSingleH",
    "matFeaSkillSpeci": "matJrnFeaSkillSp",
    "matFeaSkulker000": "matJrnFeaSkulker",
    "matFeaSurvivor00": "matJrnFeaSurvivo",
    "matFeaTactician0": "matJrnFeaTactici",
    "matFeaThaumaturg": "matJrnFeaThaumat",
    "matFeaToughAsNai": "matJrnFeaToughAs",
    "matFeaTwoHandedW": "matJrnFeaTwoHand",
    "matFeaWeaponAndS": "matJrnFeaWeapShl",
}


def create_feat_list_description(feat_entries):
    desc = '<div class="auto-generated-feat-entries"><p><em>Options:</em></p><ul>'
    for entry in feat_entries:
        desc += f"<li><p><strong>@UUID[{entry.id}]{{entry.name}}<span>{entry.description}</span></p></li>\n"
    desc += "</ul></div>"


# for each folder in the configured feats source directory
# 1. iterate over the feat .json files in the "-options" directory and
#    accumulate their names and descriptions
# 2. update the parent feat (the only one in the root source dir) with
#    the descriptions
# 3. update the journal page with the descriptions
for entry in os.scandir(FEATS_SOURCE_DIR):
    if entry.is_dir():
        feat_entries = []
        options_feats_dir = os.path.join(entry.path, f"{entry.name}-options")
        for options_entry in os.scandir(options_feats_dir):
            if options_entry.is_file() and options_entry.name not in FILES_TO_IGNORE:
                with open(options_entry.path, "r") as jsonFile:
                    jsonObj = json.load(jsonFile)
                    if all(
                        [
                            "_id" in jsonObj,
                            "name" in jsonObj,
                            "type" in jsonObj,
                            jsonObj["type"] == "feat",
                            "system" in jsonObj,
                            "description" in jsonObj["system"],
                            "value" in jsonObj["system"]["description"],
                        ]
                    ):
                        feat_entries.append(
                            {
                                "name": jsonObj["name"],
                                "description": jsonObj["system"]["description"]["value"],
                                "id": f"Compendium.materia-dnd.feats.Item.{jsonObj['_id']}",
                            }
                        )
        feat_list_description = create_feat_list_description(feat_entries)
        parent_feat_file = os.path.join(entry.path, f"{entry.name}.json")
        jsonObj = None
        with open(parent_feat_file, "r") as jsonFile:
            jsonObj = json.load(jsonFile)
            origDesc = jsonObj["system"]["description"]["value"]
            newDesc = re.sub('<div class=\\"auto-generated-feat-entries\\">.*?</div>', feat_list_description, origDesc)
            jsonObj["system"]["description"]["value"] = newDesc
        if jsonObj is not None:
            with open(parent_feat_file, "w") as updatedFile:
                json.dump(jsonObj, updatedFile, indent=2)
                print(f"Updated file: {parent_feat_file}")
