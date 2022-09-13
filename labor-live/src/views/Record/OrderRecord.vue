<template>
  <div class="orderRecord">
    <iframe
      style="width: 100%; height: 100vh"
      id="orderRecordFrame"
      frameborder="0"
      src="https://chgyx.qdszgh.cn/#/mine/orders"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, onUnmounted } from "vue";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "orderRecord",
  setup() {
    // let paymentFrame = ref<null | HTMLElement>(null);
    const store = userStore();
    const { userPhone } = storeToRefs(store);
    onMounted(() => {
      let orderRecordFrame = document.getElementById("orderRecordFrame");

      let query = {
        userPhone: userPhone.value,
      };

      (orderRecordFrame as any).onload = function () {
        (orderRecordFrame as any).contentWindow.postMessage(
          query,
          "https://chgyx.qdszgh.cn"
        );
      };
    });
    return {};
  },
});
</script>
