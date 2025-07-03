import os
import shutil
from typing import Any, Dict, List
from jinja2 import Environment, PackageLoader, select_autoescape, Template
from lib.classData import readClassFromFile
from lib.featData import readFeatFromFile
from lib.formatters import slugify
from lib.itemData import readItemFromFile
from lib.itemLookup import splitUuidIntoParts
from lib.speciesData import readSpeciesFromFile
from lib.spellData import readSpellFromFile
from lib.subclassData import readSubclassData


FILES_TO_IGNORE = ["_folder.json"]
TEMPLATE_DIR = "utils\\htmlgen\\templates"
OUTPUT_DIR = "output"
OUTPUT_SUBDIRECTORIES = {
    "class": "classes",
    "spell": "spells",
    "feat": "feats",
    "css": "css",
    "species": "species",
    "item": "item",
}
SPELL_DIR_ROOT = "packs\\_source\\spells"
CLASS_DIR_ROOT = "packs\\_source\\classes"
ITEM_DIR_ROOTS = ["packs\\_source\\items", "packs\\_source\\magic-items"]
FEATS_DIR_ROOT = "packs\\_source\\feats"
SPECIES_DIR_ROOT = "packs\\_source\\species"
SUBCLASS_DIR_ROOT = "packs\\_source\\subclasses"
SPELL_SUBDIR_LIST = [
    "cantrips",
    "1st-level-spells",
    "2nd-level-spells",
    "3rd-level-spells",
    "4th-level-spells",
    "5th-level-spells",
    "6th-level-spells",
    "7th-level-spells",
    "8th-level-spells",
    "9th-level-spells",
]


def getSpellData(rootDir: str):
    spellData = []
    for root, dirs, files in os.walk(rootDir):
        for file in [f for f in files if os.path.splitext(f)[1] == ".json" and f not in FILES_TO_IGNORE]:
            fullPath = os.path.join(root, file)
            spellData.append(readSpellFromFile(fullPath))
    return spellData


def getSubclassData(identifier: str) -> List[Dict[str, Any]]:
    subclassData = []
    for root, dirs, files in os.walk(SUBCLASS_DIR_ROOT):
        for file in [f for f in files if os.path.splitext(f)[1] == ".json" and f not in FILES_TO_IGNORE]:
            fullPath = os.path.join(root, file)
            subclass = readSubclassData(fullPath, identifier)
            if subclass is not None:
                subclassData.append(subclass)
    return subclassData


def renderIndex(template: Template, **kwargs):
    indexOutput = template.render(**kwargs)
    with open(os.path.join(OUTPUT_DIR, "index.html"), "w") as htmlOutputFile:
        htmlOutputFile.write(indexOutput)


def renderSpellData(spellDirRoot: str, spellSubdirList: List[str], template: Template):
    spellData = {}
    for subdir in spellSubdirList:
        spellData[subdir] = getSpellData(os.path.join(spellDirRoot, subdir))
    for dirName, spellObjects in spellData.items():
        spellOutput = template.render(spells=spellObjects)
        with open(os.path.join(OUTPUT_DIR, OUTPUT_SUBDIRECTORIES["spell"], f"{dirName}.html"), "w") as htmlOutputFile:
            htmlOutputFile.write(spellOutput)


def renderClassData(classDirRoot: str, template: Template):
    for classFile in os.listdir(classDirRoot):
        fullPath = os.path.join(classDirRoot, classFile)
        classData = readClassFromFile(fullPath)
        subclassData = getSubclassData(classData["identifier"])

        classOutput = template.render({"class": classData, "subclasses": subclassData})
        with open(
            os.path.join(OUTPUT_DIR, OUTPUT_SUBDIRECTORIES["class"], f"{slugify(classData['name'])}.html"),
            "w",
        ) as htmlOutputFile:
            htmlOutputFile.write(classOutput)


def renderSpeciesData(speciesDirRoot: str, template: Template):
    for root, dirs, files in os.walk(speciesDirRoot):
        for file in [f for f in files if os.path.splitext(f)[1] == ".json" and f not in FILES_TO_IGNORE]:
            fullPath = os.path.join(root, file)
            speciesData = readSpeciesFromFile(fullPath)
            if speciesData is not None:
                pass
    return None


def renderItemData(itemDirRoots: List[str], template: Template):
    for itemDir in itemDirRoots:
        for root, dirs, files in os.walk(itemDir):
            for file in [f for f in files if os.path.splitext(f)[1] == ".json" and f not in FILES_TO_IGNORE]:
                fullPath = os.path.join(root, file)
                itemData = readItemFromFile(fullPath)
                if itemData:
                    itemOutput = template.render(item=itemData)
                    with open(
                        os.path.join(OUTPUT_DIR, OUTPUT_SUBDIRECTORIES["item"], f"{slugify(itemData['_id'])}.html"),
                        "w",
                    ) as htmlOutputFile:
                        htmlOutputFile.write(itemOutput)


def renderFeatsData(featsDirRoot: str, template: Template):
    parentFeatList = []
    featsMap: dict[str, Any] = {}
    parentFeats = {}
    # Half, Species, and Epic Boon feats are special cases (no parents, not parents themselves)
    halfFeats = []
    speciesFeats = []
    epicFeats = []
    for root, dirs, files in os.walk(featsDirRoot):
        for file in [f for f in files if os.path.splitext(f)[1] == ".json" and f not in FILES_TO_IGNORE]:
            fullPath = os.path.join(root, file)
            featData = readFeatFromFile(fullPath)
            if featData is not None:
                # Parents we store in parentFeats dict for retrieval later (we render the parent and all its children
                # on a single page), and we append it to the list that will be returned for the rendering of the index page
                if featData["featType"] == "parent":
                    parentFeats[featData["id"]] = featData
                    parentFeatList.append(featData)
                elif featData["featType"] == "half":
                    halfFeats.append(featData)
                elif featData["featType"] == "species":
                    speciesFeats.append(featData)
                elif featData["featType"] == "epic":
                    epicFeats.append(featData)
                else:
                    if featData["featParent"] in featsMap:
                        featsMap[featData["featParent"]].append(featData)
                    else:
                        featsMap[featData["featParent"]] = [featData]
    # now that we have all the child feats grouped by their parents we can
    # render the parent pages with all their children
    for parentId, children in featsMap.items():
        # the parentId is a full UUID, the ID we have in the parentFeatsList is only one segment of that
        uuidParts = splitUuidIntoParts(parentId)
        for parentFeat in parentFeatList:
            if parentFeat["id"] == uuidParts["documentId"]:
                break
        featOutput = template.render(
            parentFeat=parentFeat,
            feats=sorted(children, key=lambda f: f["name"].replace("*", "")),
            title=parentFeat["name"],
        )
        with open(
            os.path.join(OUTPUT_DIR, OUTPUT_SUBDIRECTORIES["feat"], f"{slugify(parentFeat['name'])}.html"),
            "w",
        ) as htmlOutputFile:
            htmlOutputFile.write(featOutput)

    haflFeatOutput = template.render(feats=halfFeats, title="Half Feat Options")
    with open(
        os.path.join(OUTPUT_DIR, OUTPUT_SUBDIRECTORIES["feat"], "half-feats.html"),
        "w",
    ) as halfFeatOutputFile:
        halfFeatOutputFile.write(haflFeatOutput)

    speciesFeatOutput = template.render(feats=speciesFeats, title="Species Feat Options")
    with open(
        os.path.join(OUTPUT_DIR, OUTPUT_SUBDIRECTORIES["feat"], "species-feats.html"),
        "w",
    ) as speciesFeatOutputFile:
        speciesFeatOutputFile.write(speciesFeatOutput)

    epicFeatOutput = template.render(feats=epicFeats, title="Epic Boon Feats")
    with open(
        os.path.join(OUTPUT_DIR, OUTPUT_SUBDIRECTORIES["feat"], "epic-feats.html"),
        "w",
    ) as epicFeatOutputFile:
        epicFeatOutputFile.write(epicFeatOutput)

    # the actual list we need to return needs to just have the url and name so let's return a simpler projection
    return [{"url": f"feats/{slugify(feat['name'])}.html", "name": feat["name"]} for feat in parentFeatList]


if __name__ == "__main__":
    if not os.path.exists(OUTPUT_DIR):
        os.mkdir(OUTPUT_DIR)
    for _, dir in OUTPUT_SUBDIRECTORIES.items():
        if not os.path.exists(os.path.join(OUTPUT_DIR, dir)):
            os.mkdir(os.path.join(OUTPUT_DIR, dir))

    # copy CSS
    shutil.copyfile("utils\\htmlgen\\css\\base.css", os.path.join(OUTPUT_DIR, "css", "base.css"))

    # initialize jijna2 template environment
    env = Environment(loader=PackageLoader("htmlgen"), autoescape=select_autoescape())
    # env.add_extension("jinja2.ext.debug")

    item_template = env.get_template("item.html")
    renderItemData(ITEM_DIR_ROOTS, item_template)

    feats_template = env.get_template("feats.html")
    parentFeats = renderFeatsData(FEATS_DIR_ROOT, feats_template)

    spells_template = env.get_template("spell.html")
    renderSpellData(SPELL_DIR_ROOT, SPELL_SUBDIR_LIST, spells_template)

    class_template = env.get_template("class.html")
    renderClassData(CLASS_DIR_ROOT, class_template)

    species_template = env.get_template("species.html")
    renderSpeciesData(SPECIES_DIR_ROOT, species_template)

    index_template = env.get_template("index.html")
    renderIndex(index_template, feats=parentFeats)
