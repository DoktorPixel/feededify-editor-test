import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBanner } from "../context/BannerContext";
import Sidebar from "./Sidebar";
import BannerArea from "./BannerArea";
import ObjectProperties from "./ObjectProperties";
import { useConfig } from "../context/ConfigContext";
import { CircularProgress, Box, Typography, Link } from "@mui/material";
import { useProject } from "../utils/useSupabaseProject";
import { ProjectData } from "../types";
// import { useAuth } from "../utils/useAuth";
import { useAuthFromQuery } from "../utils/useAuthFromQuery";

const defaultConfig = {
  hiddenObjectIds: [],
  keyValuePairs: [
    { key: "example_title", value: "Назва продукту" },
    { key: "example_image_link", value: "https://placehold.co/300" },
  ],
  canvasSize: {
    width: 1080,
    height: 1080,
  },
};

const Layout: React.FC = () => {
  const {
    currentProjectId,
    setCurrentProjectId,
    addJson,
    setDynamicImgs,
    setCurrentProjectName,
    setFeedUrl,
    setFeedType,
  } = useBanner();
  // const { isAuthReady } = useAuth();

  const { isAuthReady } = useAuthFromQuery();

  const { setConfig, updateCanvasSize } = useConfig();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const { data: template, isLoading, error } = useProject(projectId ?? "");
  const environment = import.meta.env.VITE_DEVELOPMENT_ENVIRONMENT;

  useEffect(() => {
    if (!isAuthReady) return;

    if (template && !currentProjectId) {
      let parsed: ProjectData | null = null;
      try {
        if (template.config_dev?.trim()) {
          parsed = JSON.parse(template.config_dev);
        }
        console.log("Project template:", template);
        console.log("Parsed project configuration:", parsed);
        let parsed_prod: ProjectData | null = null;
        if (template.config_prod?.trim()) {
          parsed_prod = JSON.parse(template.config_prod);
          console.log("parsed_prod configuration:", parsed_prod);
        }
      } catch {
        console.error("Error parsing project configuration JSON");
      }

      const objects = parsed?.objects ?? [];
      const dynamicImgs = parsed?.dynamicImgs ?? [];

      if (parsed?.config?.canvasSize) {
        setConfig(parsed.config);
      } else if (parsed?.dimensions) {
        const { width, height } = parsed.dimensions;
        const newConfig = {
          ...defaultConfig,
          canvasSize: { width, height },
        };
        setConfig(newConfig);
        updateCanvasSize(width, height);
      } else {
        setConfig(defaultConfig);
      }

      if (template?.feed_format)
        setFeedType(template.feed_format as "xml" | "csv");

      if (template?.feed_url) {
        setFeedUrl(template.feed_url);
      }

      // else {
      //   // default value
      //   setFeedUrl("https://ivan-chohol.ua/price/facebook-catalog.xml");
      // }

      addJson(objects);
      setDynamicImgs?.(dynamicImgs);
      setCurrentProjectId(projectId!);
      setCurrentProjectName(template.name || "Untitled Project");

      // devMode
      if (environment !== "dev") {
        if (location.pathname !== `/${projectId}`) {
          navigate(`/${projectId}`, { replace: true });
        }
      }
    }
  }, [
    template,
    currentProjectId,
    setCurrentProjectId,
    addJson,
    setDynamicImgs,
    setCurrentProjectName,
    setConfig,
    updateCanvasSize,
    navigate,
    projectId,
    isAuthReady,
  ]);

  if (!isAuthReady || isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (
    error
    // || !template
  ) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        gap={2}
      >
        <Typography variant="h6" color="error" textAlign="center">
          {error instanceof Error
            ? error.message
            : "Unknown error loading project"}
        </Typography>
        <Typography variant="h6" color="info" textAlign="center">
          Сheck the data on the{" "}
          {environment === "dev" ? (
            <Link href="https://stagedashboard.feededify.app/">Dashboard</Link>
          ) : (
            <Link href="https://feededify.app/">Dashboard</Link>
          )}
        </Typography>
      </Box>
    );
  }
  return (
    <div className="app">
      <Sidebar />
      <BannerArea />
      <ObjectProperties />
    </div>
  );
};

export default Layout;
