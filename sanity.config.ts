import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
    name: "default",
    title: "The Car Website",
    projectId: "gzwu6ixu",
    dataset: "production",
    plugins: [structureTool()],
    schema: {
        types: [],
    },
});