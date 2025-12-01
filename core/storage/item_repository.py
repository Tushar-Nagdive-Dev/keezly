from core.storage.file_store import load_file_decrypted, save_file_encrypted

def get_all_items():
    return load_file_decrypted()

def save_item(new_item):
    items = load_file_decrypted()

    if new_item.get("id") is None:
        new_item["id"] = max([i["id"] for i in items], default=0) + 1
        items.append(new_item)
    else:
        for i, item in enumerate(items):
            if item["id"] == new_item["id"]:
                items[i] = new_item
                break

    save_file_encrypted(items)
    return {"success": True, "item": new_item}

def delete_item(item_id):
    try:
        items = load_file_decrypted()
        new_items = [it for it in items if it.get("id") != item_id]
        if len(new_items) == len(items):
            return {"success": False, "message": "Item not found."}
        save_file_encrypted(new_items)
        return {"success": True, "deleted_id": item_id}
    except PermissionError:
        return {"success": False, "message": "Application is locked."}
    except Exception as e:
        return {"success": False, "message": str(e)}