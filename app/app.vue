<script setup lang="ts">
const isLoading = ref(true);
</script>

<template>
  <UApp>
    <Transition name="fade" mode="out-in" appear>
      <AnimationsLoadingScreen
        v-if="isLoading"
        key="loading"
        @complete="isLoading = false"
      />
      <div v-else key="app">
        <AppHeader />
        <UMain>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </UMain>
        <UFooter />
      </div>
    </Transition>
  </UApp>
</template>
