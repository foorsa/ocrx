import json

TABLES = [
    {
        "0": {
            "0": "Column 1 - Row 1",
            "1": "Column 1 - Row 2",
            "2": "Column 1 - Row 3",
            "3": "Column 1 - Row 4",
            "4": "Column 1 - Row 5",
            "5": "Column 1 - Row 6",
            "6": "Column 1 - Row 7",
        },
        "1": {
            "0": "Column 2 - Row 1",
            "1": "Column 2 - Row 2",
            "2": "Column 2 - Row 3",
            "3": "Column 2 - Row 4",
            "4": "Column 2 - Row 5",
            "5": "Column 2 - Row 6",
            "6": "Column 2 - Row 7",
        },
        "2": {
            "0": "Column 3 - Row 1",
            "1": "Column 3 - Row 2",
            "2": "Column 3 - Row 3",
            "3": "Column 3 - Row 4",
            "4": "Column 3 - Row 5",
            "5": "Column 3 - Row 6",
            "6": "Column 3 - Row 7",
        },
    }
]


PROCESSED_TABLES = []
for TABLE in TABLES:
    TABLE_DATA = []

    # Get the Columns Count
    COL_COUNT = len(TABLE)

    # Get the Rows Count
    ROW_COUNT = len(TABLE["0"])

    # Concat Columns to Array of Rows
    for ROW in range(ROW_COUNT):
        ROW_DATA = []
        for COL in range(COL_COUNT):
            ROW_DATA.append(TABLE[str(COL)][str(ROW)])
        TABLE_DATA.append(ROW_DATA)

    PROCESSED_TABLES.append(TABLE_DATA)


# Beautify the JSON Output
print(json.dumps(PROCESSED_TABLES, indent=4))
