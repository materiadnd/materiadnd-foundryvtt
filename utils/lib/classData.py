import json

from .formatters import formatPrimaryAbility, formatSkillList, formatSavingThrows, formatDescription, formatWeaponProfs
from .itemLookup import getItemByUuid


def readClassFromFile(path: str):
    with open(path, "r") as jsonFile:
        jsonObj = json.load(jsonFile)
        if jsonObj["type"] != "class" or "system" not in jsonObj:
            return None
        else:
            classData = {}
            classData["name"] = jsonObj["name"]
            classData["half_caster"] = jsonObj["system"]["spellcasting"]["progression"] == "half"
            classData["full_caster"] = jsonObj["system"]["spellcasting"]["progression"] == "full"
            classData["primary_ability"] = formatPrimaryAbility(jsonObj["system"]["primaryAbility"]["value"])
            classData["hit_point_die"] = jsonObj["system"]["hitDice"]
            advancementData = jsonObj["system"]["advancement"]
            # advancement values
            skillInfo = getSkillInfo(advancementData)
            classData["skill_choice_count"] = skillInfo["count"]
            classData["skill_list"] = formatSkillList(skillInfo["choices"])

            classData["saving_throws"] = formatSavingThrows(getSaves(advancementData))

            classData["weapon_profs"] = formatWeaponProfs(getWeaponProfs(advancementData))

            classData["tool_profs"] = getToolProfs(advancementData)

            # other class features
            classFeatures = getClassFeatures(advancementData)
            classData["features"] = classFeatures
            for i in range(1, 21):
                classData[f"level_{i}_features"] = [f for f in classFeatures if f["level"] == i]

            # scale values
            scaleValues = getScaleValues(advancementData)
            classData["scale_values"] = scaleValues

            return classData


def getSkillInfo(advancementData):
    skillInfo = {}
    for advItem in advancementData:
        if advItem["type"] != "Trait":
            continue
        elif advItem["level"] != 1:
            continue
        elif len(advItem["configuration"]["choices"]) != 1:
            continue
        elif not advItem["configuration"]["choices"][0]["pool"][0].startswith("skills:"):
            continue
        else:
            skillInfo["count"] = advItem["configuration"]["choices"][0]["count"]
            skillInfo["choices"] = [
                skillString.replace("skills:", "") for skillString in advItem["configuration"]["choices"][0]["pool"]
            ]
        return skillInfo
    return skillInfo


def getSaves(advancementData):
    for advItem in advancementData:
        if advItem["type"] != "Trait":
            continue
        elif advItem["level"] != 1:
            continue
        elif len(advItem["configuration"]["grants"]) == 0:
            continue
        elif not advItem["configuration"]["grants"][0].startswith("saves:"):
            continue
        else:
            return [save.replace("saves:", "") for save in advItem["configuration"]["grants"]]
    return []


def getWeaponProfs(advancementData):
    for advItem in advancementData:
        if advItem["type"] != "Trait":
            continue
        elif advItem["level"] != 1:
            continue
        elif len(advItem["configuration"]["grants"]) == 0:
            continue
        elif not advItem["configuration"]["grants"][0].startswith("weapon:"):
            continue
        else:
            return [weapon.replace("weapon:", "") for weapon in advItem["configuration"]["grants"]]
    return []


def getToolProfs(advancementData):
    for advItem in advancementData:
        if advItem["type"] != "Trait":
            continue
        elif advItem["level"] != 1:
            continue
        elif len(advItem["configuration"]["choices"]) != 1:
            continue
        elif not advItem["configuration"]["choices"][0]["pool"][0].startswith("tool:"):
            continue
        else:
            return [tool.replace("tool:", "") for tool in advItem["configuration"]["choices"][0]["pool"]]


def getClassFeatures(advancementData):
    classFeatures = []
    for advItem in advancementData:
        if advItem["type"] != "ItemGrant":
            continue
        elif len(advItem["configuration"]["items"]) == 0:
            continue
        else:
            for item in advItem["configuration"]["items"]:
                feature = {"level": advItem["level"]}
                featureItem = getItemByUuid(item["uuid"])
                if featureItem:
                    feature["name"] = featureItem["name"]
                    feature["description"] = formatDescription(
                        featureItem["system"]["description"]["value"], clean_html_tags=False
                    )
                    classFeatures.append(feature)

    return sorted(classFeatures, key=lambda x: x["level"])


def getScaleValues(advancementData):
    scaleValues = []
    for advItem in advancementData:
        if advItem["type"] != "ScaleValue":
            continue
        else:
            scaleValue = flattenScaleValue(advItem["configuration"]["scale"], advItem["configuration"]["type"])
            scaleValue["name"] = advItem["title"]
            scaleValues.append(scaleValue)
    return scaleValues


def flattenScaleValue(scaleConfig, scaleType):
    def formatValue(config, scaleType):
        if scaleType == "dice":
            return f"{config['number']}d{config['faces']}"
        elif scaleType == "number":
            return f"{config['value']}"

    # scaleConfigKeyInts = [int(k) for k in scaleConfig.keys()]
    # minLevel = sorted(scaleConfigKeyInts)[0]
    prevValue = ""
    accumValues = {}
    for i in range(1, 21):
        if str(i) in scaleConfig:
            prevValue = formatValue(scaleConfig[str(i)], scaleType)
        accumValues[i] = prevValue
    return accumValues
