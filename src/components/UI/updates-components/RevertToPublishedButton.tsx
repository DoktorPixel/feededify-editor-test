// RevertToPublishedButton.tsx
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { ProjectData } from "../../../types";
import { useBanner } from "../../../context/BannerContext";
import { useConfig } from "../../../context/ConfigContext";
import { useProject } from "../../../utils/useSupabaseProject";
import { useTranslation } from "react-i18next";

export const RevertToPublishedButton: React.FC = () => {
  const { currentProjectId, addJson, setDynamicImgs, clearHistory } =
    useBanner();
  const { data: template, isLoading: isTemplateLoading } = useProject(
    currentProjectId ?? ""
  );

  const { setConfig } = useConfig();
  const { t } = useTranslation();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [isApplying, setIsApplying] = useState(false);

  const handleRevert = async () => {
    if (!currentProjectId) return;

    setIsApplying(true);
    try {
      if (!template) {
        throw new Error(
          t("revertTemplate.noTemplate", "Template data is not available")
        );
      }

      if (!template.config_prod || !template.config_prod.trim()) {
        throw new Error(
          t(
            "revertTemplate.noPublishedConfig",
            "No published configuration found for this template."
          )
        );
      }

      let parsedProd: ProjectData | null = null;
      try {
        parsedProd = JSON.parse(template.config_prod);
        clearHistory();
      } catch {
        throw new Error(
          t(
            "revertTemplate.parseError",
            "Failed to parse published configuration ."
          )
        );
      }

      const objects = parsedProd?.objects ?? [];
      const dynamicImgs = parsedProd?.dynamicImgs ?? [];

      if (parsedProd?.config?.canvasSize) {
        setConfig(parsedProd.config);
      }
      addJson(objects);
      if (setDynamicImgs) setDynamicImgs(dynamicImgs);

      setSnackbar({
        open: true,
        message: t(
          "revertTemplate.successMessage",
          "Reverted to published configuration."
        ),
        severity: "success",
      });
    } catch (error) {
      console.error("❌ Failed to revert to published template:", error);
      const message =
        error instanceof Error
          ? error.message
          : t(
              "revertTemplate.errorMessage",
              "Failed to revert to published configuration."
            );

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsApplying(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setConfirmOpen(true)}
        disabled={!currentProjectId || isTemplateLoading}
        variant="outlined"
        color="error"
        sx={{
          textTransform: "none",
          padding: "2px 4px 2px 4px",
          minWidth: "87px",
        }}
      >
        {t("revertTemplate.buttonLabel", "Revert to Published")}
      </Button>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ margin: "0 auto" }}>
          {t("revertTemplate.title", "Revert changes")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              "revertTemplate.subTitle",
              "This will discard current unsaved changes and load the last published version. Continue?"
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ margin: "0 auto", paddingBottom: "22px" }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={isApplying}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleRevert}
            disabled={isApplying}
            color="primary"
            variant="contained"
          >
            {isApplying
              ? t("revertTemplate.applying", "Applying...")
              : t("revertTemplate.confirm", "Revert")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RevertToPublishedButton;
