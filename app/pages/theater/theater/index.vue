<template>
  <div>
    <div class="w-full lg:hidden">
      <ULink
        to="/theater"
        class="w-full flex flex-col justify-center py-spacing-100 px-spacing-200 text-gray-700 hover:bg-gray-100 inset-shadow-stone-600"
      >
        ..
        <!-- <i class="hn hn-arrow-up"></i> -->
      </ULink>
      <ContentSideDropdownMenu />
    </div>
    <div class="hidden lg:block">
      <h1 class="uppercase">Welcome to the theater page!</h1>
    </div>
  </div>
</template>
