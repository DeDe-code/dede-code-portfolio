export const useTheme = () => {
  const route = useRoute();

  const getThemeClass = (routeName) => {
    const themeMap = {
      index: "theme-home",
      about: "theme-about",
      code: "theme-code",
      acting: "theme-acting",
      contact: "theme-contact",
    };
    return themeMap[routeName] || "theme-home";
  };

  const currentThemeClass = computed(() => {
    return getThemeClass(route.name);
  });

  return {
    currentThemeClass,
    getThemeClass,
  };
};
