<template>
  <div class="video">
    <sub-page
      :pageType="'video'"
    ></sub-page>
  </div>
</template>

<script>
import subPage from '@/components/SubPage.vue'
export default {
  components: {
    subPage
  }
}
</script>