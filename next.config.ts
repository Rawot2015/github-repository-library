import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

const sharePointPathFile = path.join(process.cwd(), "sharepoint-path.txt");

function readSharePointBasePath() {
  if (!fs.existsSync(sharePointPathFile)) return "";

  const value = fs.readFileSync(sharePointPathFile, "utf8").trim();
  if (!value) return "";

  const normalized = `/${value.replace(/^\/+|\/+$/g, "")}`;
  return normalized;
}

const basePath = readSharePointBasePath();

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },

  // When sharepoint-path.txt exists, export the app as a static site
  // whose asset URLs point to the SharePoint document-library path.
  ...(basePath
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
