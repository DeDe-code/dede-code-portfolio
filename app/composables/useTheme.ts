export const useTheme = () => {
  const route = useRoute();

  type RouteTheme = "index" | "about" | "code" | "acting" | "contact";
  const getThemeClass = (routeName: string | null | undefined): string => {
    if (!routeName) return "theme-about";

    const themeMap: Record<RouteTheme, string> = {
      index: "theme-home",
      about: "theme-about",
      code: "theme-code",
      acting: "theme-acting",
      contact: "theme-contact",
    };
    return themeMap[routeName as RouteTheme] || "theme-home";
  };

  const currentThemeClass = computed(() => {
    return getThemeClass(route.name as string | null | undefined);
  });

  return {
    currentThemeClass,
    getThemeClass,
  };
};
