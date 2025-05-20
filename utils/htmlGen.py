import os
from typing import List
from lib.spellData import readSpellFromFile
from lib.classData import readClassFromFile
from jinja2 import Environment, PackageLoader, select_autoescape, Template


FILES_TO_IGNORE = ["_folder.json"]
TEMPLATE_DIR = "utils\\htmlgen\\templates"
OUTPUT_DIR = "output"
OUTPUT_SUBDIRECTORIES = {
    "class": "classes",
    "spell": "spells",
}
SPELL_DIR_ROOT = "packs\\_source\\spells"
CLASS_DIR_ROOT = "packs\\_source\\classes"
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


def renderIndex(template: Template):
    indexOutput = template.render()
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
        classOutput = template.render({"class": classData})
        with open(
            os.path.join(
                OUTPUT_DIR, OUTPUT_SUBDIRECTORIES["class"], f"{classData['name'].replace(' ', '-').lower()}.html"
            ),
            "w",
        ) as htmlOutputFile:
            htmlOutputFile.write(classOutput)


if __name__ == "__main__":
    if not os.path.exists(OUTPUT_DIR):
        os.mkdir(OUTPUT_DIR)
    for _, dir in OUTPUT_SUBDIRECTORIES.items():
        if not os.path.exists(os.path.join(OUTPUT_DIR, dir)):
            os.mkdir(os.path.join(OUTPUT_DIR, dir))
    env = Environment(loader=PackageLoader("htmlgen"), autoescape=select_autoescape())
    # env.add_extension("jinja2.ext.debug")

    index_template = env.get_template("index.html")
    renderIndex(index_template)

    spells_template = env.get_template("spell.html")
    renderSpellData(SPELL_DIR_ROOT, SPELL_SUBDIR_LIST, spells_template)

    class_template = env.get_template("class.html")
    renderClassData(CLASS_DIR_ROOT, class_template)
