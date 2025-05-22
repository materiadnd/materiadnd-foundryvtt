import os
import json
from collections import deque
from typing import Any, Dict

FILES_TO_IGNORE = ["_folder.json"]
COLLECTION_DIR_MAP = {"materia-dnd.class-and-subclass-features": "packs\\_source\\class-and-subclass-features"}


def splitUuidIntoParts(uuid: str) -> Dict[str, str]:
    parts = deque(uuid.split("."))
    if parts[0] == "Compendium":
        parts.popleft()  # remove "Compendium"
        scope = parts.popleft()
        packName = parts.popleft()
        primaryType = parts.popleft()
        primaryId = parts.popleft()
    else:
        primaryType = parts.popleft()
        primaryId = parts.popleft()

    if len(parts) > 0:
        if (len(parts) % 2) != 0:
            raise Exception
        else:
            id = parts[-1]
            type = parts[-2]
    else:
        id = primaryId
        type = primaryType
        primaryId = ""
        primaryType = ""

    return {
        "type": type,
        "id": id,
        "collection": f"{scope}.{packName}",
        "primaryType": primaryType,
        "primaryId": primaryId,
        "documentType": primaryType or type,
        "documentId": primaryId or id,
    }


def getItemByUuid(uuid: str) -> Any:
    parsedUuid = splitUuidIntoParts(uuid)
    if parsedUuid["collection"] not in COLLECTION_DIR_MAP:
        return None
    else:
        dir = COLLECTION_DIR_MAP[parsedUuid["collection"]]
        for root, dirs, files in os.walk(dir):
            for file in [f for f in files if os.path.splitext(f)[1] == ".json" and f not in FILES_TO_IGNORE]:
                fullPath = os.path.join(root, file)
                with open(fullPath, "r") as jsonFile:
                    jsonObj = json.load(jsonFile)
                    if jsonObj["_id"] == parsedUuid["documentId"]:
                        return jsonObj
        return None
