import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const projectItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string().optional(),
  images: z.array(z.string()),
});

const projectSchema = z.object({
  items: z.array(projectItemSchema),
});

export default defineContentConfig({
  collections: {
    codeProjects: defineCollection({
      type: "data",
      source: "code/projects.json",
      schema: projectSchema,
    }),
    theaterShows: defineCollection({
      type: "data",
      source: "theater/shows.json",
      schema: projectSchema,
    }),
    theaterFilms: defineCollection({
      type: "data",
      source: "theater/films.json",
      schema: projectSchema,
    }),
  },
});
