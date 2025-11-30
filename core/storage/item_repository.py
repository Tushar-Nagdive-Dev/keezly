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