import { createClient } from "@sanity/client";

export const sanity = createClient({
    projectId: "gzwu6ixu",
    dataset: "production",
    apiVersion: "2026-09-04",
    useCdn: true,
});