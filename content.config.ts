import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const codeProjectItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string().optional(),
  imageCount: z.number(),
  imageExt: z.string().optional(),
});

const codeProjectSchema = z.object({
  items: z.array(codeProjectItemSchema),
});

const showItemSchema = z.object({
  year: z.string(),
  title: z.string(),
  role: z.string(),
  director: z.string(),
  imageCount: z.number(),
});

const showSchema = z.object({
  items: z.array(showItemSchema),
});

const filmItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageCount: z.number(),
});

const filmSchema = z.object({
  items: z.array(filmItemSchema),
});

export default defineContentConfig({
  collections: {
    codeProjects: defineCollection({
      type: "data",
      source: "code/projects.json",
      schema: codeProjectSchema,
    }),
    theaterShows: defineCollection({
      type: "data",
      source: "theater/shows.json",
      schema: showSchema,
    }),
    theaterFilms: defineCollection({
      type: "data",
      source: "theater/films.json",
      schema: filmSchema,
    }),
  },
});
