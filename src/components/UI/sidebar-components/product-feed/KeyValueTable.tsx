// KeyValueTable.tsx (заменяет оригинал полностью или вставь эти изменения в твой файл)

import React from "react";
import { TextField, IconButton } from "@mui/material";
import {
  AddButton,
  DeleteFile,
  AddFile,
  ClearFile,
} from "../../../../assets/icons";
import { useTranslation } from "react-i18next";
import type { ExtendedPair } from "../../../../types";

interface Props {
  combinedPairs: ExtendedPair[];
  onEditKey: (oldKey: string, newKey: string) => void;
  onEditValue: (key: string, value: string) => void;
  onRemoveByKey: (key: string) => void;
  onAddCustom: () => void;
  onAddText: (text: string) => void;
  onAddImage: (url: string) => void;
  onCommitProductValue: (key: string, value: string) => void;
}

const isImageUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(url.pathname);
  } catch {
    return false;
  }
};

// displayToStored: user types spaces -> we save as underscores
const displayToStored = (display: string): string => {
  return display.replace(/ /g, "__");
};

// storedToDisplay: stored underscores -> show as spaces
// Handles repeated underscores: every 2 underscores => 1 space.
// If an odd underscore remains, it is left as an underscore.
const storedToDisplay = (stored: string): string => {
  return stored.replace(/_+/g, (m) => {
    const pairs = Math.floor(m.length / 2);
    const rem = m.length % 2;
    const spaces = " ".repeat(pairs);
    return spaces + (rem ? "_" : "");
  });
};

const KeyValueTable: React.FC<Props> = React.memo(
  ({
    combinedPairs,
    onEditKey,
    onEditValue,
    onRemoveByKey,
    onAddCustom,
    onAddText,
    onAddImage,
    onCommitProductValue,
  }) => {
    const { t } = useTranslation();
    const uniquePairs = React.useMemo(() => {
      const seen = new Set<string>();
      return combinedPairs.filter((pair) => {
        if (seen.has(pair.key)) return false;
        seen.add(pair.key);
        return true;
      });
    }, [combinedPairs]);

    const handleAddFile = (pair: ExtendedPair) => {
      const trimmedKeyStored = pair.key.trim();
      const trimmedValue = pair.value.trim();

      if (!trimmedKeyStored || trimmedValue === "{{}}") return;
      // Use stored key (with __ ) when creating placeholder,
      // because internal replacement expects stored-key format.
      if (isImageUrl(trimmedValue)) {
        onAddImage(`{{${trimmedKeyStored}}}`);
      } else {
        onAddText(`{{${trimmedKeyStored}}}`);
      }
    };

    return (
      <div className="variables-panel">
        <div className="table-header" style={{ display: "flex" }}>
          <div
            className="table-cell"
            style={{ flex: "0 0 35%", padding: "6px" }}
          >
            {t("property")}
          </div>
          <div
            className="table-cell"
            style={{ flex: "0 0 50%", padding: "6px" }}
          >
            {t("value")}
          </div>
          <div
            className="table-cell table-actions"
            style={{ flex: "0 0 15%", marginLeft: "-6px" }}
          >
            <IconButton onClick={onAddCustom}>
              <AddButton />
            </IconButton>
          </div>
        </div>

        {uniquePairs.map((pair, index) => {
          const displayKey = storedToDisplay(pair.key);

          return (
            <div className="table-row" key={index} style={{ display: "flex" }}>
              <div className="table-cell" style={{ flex: "0 0 35%" }}>
                <TextField
                  fullWidth
                  variant="standard"
                  value={displayKey}
                  onChange={(e) =>
                    onEditKey(pair.key, displayToStored(e.target.value))
                  }
                  placeholder="key"
                  slotProps={{
                    input: {
                      disableUnderline: true,
                      sx: { padding: "4px 4px 4px 6px", lineHeight: "120%" },
                    },
                  }}
                  sx={{ "& .MuiInputBase-root": { backgroundColor: "white" } }}
                  disabled={!pair.custom}
                />
              </div>

              <div className="table-cell" style={{ flex: "0 0 50%" }}>
                <TextField
                  fullWidth
                  variant="standard"
                  value={pair.editable ? pair.value : ""}
                  placeholder={!pair.editable ? pair.value : "value"}
                  onChange={(e) => {
                    if (pair.editable) onEditValue(pair.key, e.target.value);
                  }}
                  onBlur={(e) => {
                    if (!pair.editable)
                      onCommitProductValue(pair.key, e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (!pair.editable && e.key === "Enter") {
                      onCommitProductValue(
                        pair.key,
                        (e.target as HTMLInputElement).value
                      );
                      e.currentTarget.blur();
                    }
                  }}
                  onMouseDown={() => {
                    if (!pair.editable)
                      onCommitProductValue(pair.key, pair.value);
                  }}
                  multiline
                  maxRows={3}
                  slotProps={{
                    input: {
                      disableUnderline: true,
                      sx: { padding: "4px 4px 4px 6px", lineHeight: "120%" },
                    },
                  }}
                  sx={{ "& .MuiInputBase-root": { backgroundColor: "white" } }}
                />
              </div>

              <div
                className="table-cell table-actions"
                style={{
                  flex: "0 0 15%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                {pair.editable && (
                  <IconButton
                    sx={{ padding: "0" }}
                    onClick={() => onRemoveByKey(pair.key)}
                  >
                    {pair.custom ? <DeleteFile /> : <ClearFile />}
                  </IconButton>
                )}
                <IconButton
                  sx={{ padding: "0" }}
                  onClick={() => handleAddFile(pair)}
                >
                  <AddFile />
                </IconButton>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

export default KeyValueTable;
