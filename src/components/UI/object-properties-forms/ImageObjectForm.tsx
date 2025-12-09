import { useState } from "react";
import { BannerObject } from "../../../types";
import { useBanner } from "../../../context/BannerContext";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  InputAdornment,
  Box,
  Switch,
} from "@mui/material";
import UpdateImageDialog from "../dialogs/UpdateImageDialog";
import { ConditionSelector } from "../selectors/ConditionSelector";
import ManageDynamicImgsComponent from "../ManageDynamicImgsComponent";
import { useTranslation } from "react-i18next";

interface ImageObjectFormProps {
  object: BannerObject;
  onChange: (key: keyof BannerObject, value: string | number) => void;
}

export const ImageObjectForm: React.FC<ImageObjectFormProps> = ({
  object,
  onChange,
}) => {
  const { combinedPairs } = useBanner();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const { t } = useTranslation();
  const handleUpdateUrl = (newUrl: string) => {
    onChange("src", newUrl);
  };

  const handleInputChange = (
    key: keyof BannerObject,
    value: string | number
  ) => {
    onChange(key, value);
  };

  return (
    <Box>
      <Typography
        variant="subtitle1"
        className="padding-wrapper"
        sx={{ mb: 1 }}
      >
        {t("sidebar.image")}
      </Typography>
      {/* <div>zIndex:{object.zIndex} </div> */}
      <div className="grey-line"></div>
      <ConditionSelector objectId={object.id} condition={object.condition} />
      <div className="grey-line"></div>
      <div className="padding-wrapper">
        <Typography variant="subtitle2">{t("sidebar.general")}</Typography>
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
          {t("selectors.position")}
        </InputLabel>
        <div className="auto-size">
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {t("selectors.left")}
                  </InputAdornment>
                ),
              },
            }}
            type="number"
            value={object.x || 0}
            onChange={(e) => onChange("x", parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />

          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {" "}
                    {t("selectors.top")}
                  </InputAdornment>
                ),
              },
            }}
            type="number"
            value={object.y || 0}
            onChange={(e) => onChange("y", parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />
        </div>
      </div>
      <div className="grey-line"></div>
      <div className="padding-wrapper">
        <Typography variant="subtitle2"> {t("sidebar.layouts")}</Typography>
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
          {t("sidebar.size")}
        </InputLabel>
        <div className="auto-size">
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {t("selectors.width")}
                  </InputAdornment>
                ),
              },
            }}
            type="number"
            value={Math.round(object.width || 300)}
            onChange={(e) =>
              onChange("width", Math.round(parseInt(e.target.value, 10)))
            }
            fullWidth
            disabled={object.autoWidth}
            margin="normal"
          />

          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {t("selectors.height")}
                  </InputAdornment>
                ),
              },
            }}
            type="number"
            value={Math.round(object.height || 50)}
            onChange={(e) => onChange("height", parseInt(e.target.value, 10))}
            fullWidth
            disabled={object.autoHeight}
            margin="normal"
          />
        </div>
      </div>

      {/* {object.dynamics && (
        <div className="padding-wrapper">
          <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>URL</InputLabel>
          <TextField
            type="text"
            value={object.src}
            onChange={(e) => onChange("src", e.target.value)}
            fullWidth
            margin="normal"
          />
        </div>
      )} */}

      {object.dynamics && (
        <div className="padding-wrapper">
          <div
            className="auto-size"
            style={{
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <div style={{ flex: "0 0 calc(55% - 10px)" }}>
              <InputLabel sx={{ mt: 1, fontSize: "12px" }}>
                {t("sidebar.variable")}
              </InputLabel>
              <Select
                size="small"
                value={
                  object.src?.match(/\{\{(.+?)(?:\[\d+\])?\}\}/)?.[1] || ""
                }
                onChange={(e) => {
                  const newKey = e.target.value;
                  const isArray = object.src?.includes("[");
                  const indexMatch = object.src?.match(/\[(\d+)\]/);
                  const index = indexMatch ? Number(indexMatch[1]) : 0;

                  if (isArray) {
                    onChange("src", `{{${newKey}[${index}]}}`);
                  } else {
                    onChange("src", `{{${newKey}}}`);
                  }
                }}
                fullWidth
                displayEmpty
              >
                {combinedPairs?.map((pair) => (
                  <MenuItem key={pair.key} value={pair.key}>
                    {pair.key}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div
              style={{
                // marginLeft: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: "0 0 calc(20% - 10px)",
              }}
            >
              <InputLabel sx={{ mt: 1, mb: 0, fontSize: "12px" }}>
                {t("sidebar.array")}
              </InputLabel>
              <Switch
                checked={object.src?.includes("[")}
                onChange={(e) => {
                  const isArray = e.target.checked;
                  const keyMatch = object.src?.match(
                    /\{\{(.+?)(?:\[\d+\])?\}\}/
                  );
                  const key = keyMatch ? keyMatch[1] : "";
                  if (!key) return;
                  if (isArray) {
                    onChange("src", `{{${key}[0]}}`);
                  } else {
                    onChange("src", `{{${key}}}`);
                  }
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flex: "0 0 25%",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {object.src?.includes("[") && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <InputLabel sx={{ mt: 1, mb: 0, fontSize: "12px" }}>
                    {t("sidebar.pictureNumber")}
                  </InputLabel>
                  <Select
                    size="small"
                    value={
                      Number(object.src.match(/\[(\d+)\]/)?.[1]) >= 0
                        ? Number(object.src.match(/\[(\d+)\]/)?.[1])
                        : 0
                    }
                    onChange={(e) => {
                      const index = Number(e.target.value);
                      const keyMatch = object.src?.match(
                        /\{\{(.+?)(?:\[\d+\])?\}\}/
                      );
                      const key = keyMatch ? keyMatch[1] : "";
                      onChange("src", `{{${key}[${index}]}}`);
                    }}
                  >
                    {[...Array(11)].map((_, i) => (
                      <MenuItem key={i} value={i}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="padding-wrapper">
        <InputLabel sx={{ mt: 1, mb: -2, fontSize: "12px" }}>
          {t("sidebar.objectFit.label")}
        </InputLabel>
        <FormControl fullWidth margin="normal">
          <Select
            value={object.objectFit || "fill"}
            onChange={(e) => handleInputChange("objectFit", e.target.value)}
          >
            <MenuItem value="fill">{t("sidebar.objectFit.fill")}</MenuItem>
            <MenuItem value="contain">
              {t("sidebar.objectFit.contain")}
            </MenuItem>
            <MenuItem value="cover">{t("sidebar.objectFit.cover")}</MenuItem>
            <MenuItem value="none">{t("sidebar.objectFit.none")}</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="grey-line"></div>
      <div className="padding-wrapper" style={{ marginTop: "10px" }}>
        <div className="auto-size">
          <TextField
            label={t("sidebar.rotate")}
            type="number"
            value={object.rotate || 0}
            onChange={(e) => onChange("rotate", parseInt(e.target.value, 10))}
            fullWidth
            margin="normal"
          />
          <TextField
            label={t("sidebar.opacity")}
            type="number"
            slotProps={{
              input: {
                inputProps: {
                  step: 1,
                  min: 1,
                  max: 100,
                },
              },
            }}
            value={Math.round((Number(object.opacity) || 1) * 100)}
            onChange={(e) => {
              let newValue = parseInt(e.target.value, 10);
              if (isNaN(newValue)) newValue = 100;
              newValue = Math.min(100, Math.max(1, newValue));
              onChange("opacity", newValue / 100);
            }}
            fullWidth
            margin="normal"
          />
        </div>
      </div>
      <div className="grey-line"></div>

      {object.dynamicsLogo && (
        <div className="padding-wrapper">
          <ManageDynamicImgsComponent
            object_id={object.object_id}
            logoName={object.logoName}
            onChange={onChange as (key: string, value: string) => void}
          />
        </div>
      )}

      <UpdateImageDialog
        open={isDialogOpen}
        initialUrl={object.src || ""}
        onClose={handleDialogClose}
        onUpdate={handleUpdateUrl}
      />
    </Box>
  );
};
