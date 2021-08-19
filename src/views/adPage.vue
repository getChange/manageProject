<template>
  <div class="ad">
    <sub-page
      :pageType="'ad'"
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