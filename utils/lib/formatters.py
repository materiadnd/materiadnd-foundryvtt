import re
from typing import List

FORMAT_TAGS_RE = r"<.*?>"
PARA_TAGS_RE = r"<p\s?.*?>(.*?)</p>"  # replace with contents and a newline
SECRET_TAGS_RE = r"<section .*?class=\"secret\" .*?>.*?</section>"  # remove entirely
ENRICHER_RE = r"\[\[/(.*?)]\]({.*?})?"
REF_TAGS_RE = r"\&amp;Reference\[(.*?)\]"
UUID_TAGS_RE = r"@UUID\[.*?\]\{(.*?)\}"

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
    "per": "Persuasion",
    "rel": "Religion",
    "slt": "Sleight of Hand",
    "ste": "Stealth",
    "sur": "Survival",
}

ARMOR_NAMES = {"lgt": "Light Armor", "med": "Medium Armor", "hvy": "Heavy Armor", "shl": "Shields"}

WEAPON_NAMES = {
    "sim": "Simple Weapons",
    "mar": "Martial Weapons",
    "ballista": "Ballista",
    "battleaxe": "Battleaxe",
    "blowgun": "Blowgun",
    "boomerang": "Boomerang",
    "club": "Club",
    "compositelongbow": "Composite Longbow",
    "compositeshortbow": "Composite Shortbow",
    "compositewarbow": "Composite Warbow",
    "dagger": "Dagger",
    "dart": "Dart",
    "dbscimitar": "Double-Bladed Scimitar",
    "flail": "Flail",
    "glaive": "Glaive",
    "greataxe": "Greataxe",
    "greatclub": "Greatclub",
    "greatsword": "Greatsword",
    "halberd": "Halberd",
    "handaxe": "Handaxe",
    "handcrossbow": "Hand Crossbow",
    "heavycrossbow": "Heavy Crossbow",
    "heavyspear": "Heavy Spear",
    "javelin": "Javelin",
    "lance": "Lance",
    "lightcrossbow": "Light Crossbow",
    "lighthammer": "Light Hammer",
    "longbow": "Longbow",
    "longknife": "Longknife",
    "longsword": "Longsword",
    "mace": "Mace",
    "maul": "Maul",
    "morningstar": "Morningstar",
    "musket": "Musket",
    "net": "Net",
    "pike": "Pike",
    "pistol": "Pistol",
    "quarterstaff": "Quarterstaff",
    "rapier": "Rapier",
    "rod": "Rod",
    "scimitar": "Scimitar",
    "shortbow": "Shortbow",
    "shortspear": "Shortspear",
    "shortsword": "Shortsword",
    "sickle": "Sickle",
    "sling": "Sling",
    "spear": "Spear",
    "trident": "Trident",
    "warbow": "Warbow",
    "warhammer": "Warhammer",
    "warpick": "Warpick",
    "whip": "Whip",
    "yklwa": "Yklwa",
}

TOOL_NAMES = {
    "art:*": "Any Artisan's Tools",
    "music:*": "Any Musical Instruments",
    "vehicle:land": "Land Vehicles",
    "vehicle:water": "Water Vehicles",
}


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


def formatDescription(desc, clean_html_tags=True):
    clean_desc = re.sub(SECRET_TAGS_RE, "", desc)
    if clean_html_tags:
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
                elif enricher_type == "roll" or enricher_type == "r" or enricher_type == "item":
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


def formatPrimaryAbility(abilityList: List[str]) -> str:
    scoreNames = []
    for ability in abilityList:
        scoreNames.append(SCORE_NAMES[ability])
    return commaAndify(scoreNames)


def formatSkillList(skillList: List[str]) -> str:
    skillNames = []
    for skill in skillList:
        if skill == "*":
            skillNames.append("Any Skill Proficiency")
        else:
            skillNames.append(SKILL_NAMES[skill])
    return commaAndify(skillNames)


def formatSavingThrows(saveList: List[str]) -> str:
    saveNames = []
    for save in saveList:
        saveNames.append(SCORE_NAMES[save])
    return commaAndify(saveNames)


def formatWeaponProfs(weaponList: List[str]) -> str:
    weaponNames = []
    for weapon in weaponList:
        if ":" in weapon:
            weapon = weapon.split(":")[-1]
        weaponNames.append(WEAPON_NAMES[weapon])
    return commaAndify(weaponNames)


def formatToolProfs(toolList: List[str]) -> str:
    toolNames = []
    for tool in toolList:
        toolNames.append(TOOL_NAMES[tool])
    return commaAndify(toolNames)


def formatArmorProfs(armorList: List[str]) -> str:
    armorNames = []
    for armor in armorList:
        armorNames.append(ARMOR_NAMES[armor])
    return commaAndify(armorNames)


def commaAndify(items: List[str], andWord: str = "and") -> str:
    if len(items) == 0:
        return ""
    elif len(items) == 1:
        return "".join(items)
    elif len(items) == 2:
        items.insert(1, andWord)
        return " ".join(items)
    else:
        items[-1] = f"{andWord} {items[-1]}"
        return ", ".join(items)


def slugify(id: str) -> str:
    return id.replace(" ", "-").lower()
