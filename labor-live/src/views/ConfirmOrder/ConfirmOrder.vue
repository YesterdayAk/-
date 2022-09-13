<template>
  <div class="confirmOrder">
    <iframe
      style="width: 100%; height: 100vh"
      id="confirmOrderFrame"
      frameborder="0"
      scrolling="no"
      src="https://chgyx.qdszgh.cn/#/confirmOrder"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, onUnmounted } from "vue";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "confirmOrder",
  setup() {
    // let paymentFrame = ref<null | HTMLElement>(null);
    const store = userStore();
    const { buyGoodsInfo, userPhone, liveId } = storeToRefs(store);
    onMounted(() => {
      let confirmOrderFrame = document.getElementById("confirmOrderFrame");
      let buygoods = [
        {
          shopName: buyGoodsInfo.value.shopName,
          isMode: 0,
          shopData: [
            {
              buyNum: buyGoodsInfo.value.buyNum,
              goodsName: buyGoodsInfo.value.goodsName,
              picture: buyGoodsInfo.value.picture,
              goodsId: buyGoodsInfo.value.goodsId,
              skuPrice: buyGoodsInfo.value.skuPrice,
              skuId: buyGoodsInfo.value.skuId,
              specName: buyGoodsInfo.value.specName,
            },
          ],
          isSetPublic: 0,
        },
      ];
      let query = {
        type: 5,
        enterType: 5, //直播带货
        buygoods,
        userPhone: userPhone.value,
        liveId: liveId.value,
      };

      (confirmOrderFrame as any).onload = function () {
        (confirmOrderFrame as any).contentWindow.postMessage(
          query,
          "https://chgyx.qdszgh.cn"
        );
      };
    });
    return {};
  },
});
</script>
