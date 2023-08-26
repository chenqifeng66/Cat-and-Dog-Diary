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

<style>
/*每个页面公共css */
/* * {
  padding: 0;
  margin: 0;
} */

page {
  --bg-color: #28272a;
  --theme-color: #000;
  --font-color: #fff;

  background: #28272a;
}
</style>
