import { defineField, defineType } from "sanity";

export const articleType = defineType({
    name: "article",
    title: "Article",
    type: "document",

    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
            },
        }),
    ],
});