<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="less">
// * {
//   color: @my-text-color;
// }
/*每个页面公共css */
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}

page {
  --bg-color: #28272a;
  --theme-color: #000;
  --font-color: #fff;

  background: @my-background-color;
}
</style>
