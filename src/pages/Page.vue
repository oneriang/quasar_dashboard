<template>
  <div class="" style="">
    <q-toolbar class="text-primary">
      <q-btn flat round dense icon="add" @click="addItem" />
    </q-toolbar>
    <grid-layout
      :layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :responsive="true"
      :vertical-compact="true"
      :margin="[20, 20]"
      :use-css-transforms="true"
      @layout-updated="layoutUpdatedEvent"
    >
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        drag-allow-from=".vue-draggable-handle"
        drag-ignore-from=".no-drag"
        class="vue-draggable-handle"
      >
        <editor
          style="width: 100%; height: 100%"
          :id="item.i"
          :pageId="id"
          v-on:removeItem="removeItem"
        />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import Editor from "components/Editor.vue";
import VueGridLayout from "vue-grid-layout";
export default {
  name: "Page",
  components: {
    Editor,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  props: ["id"],
  data() {
    return {
      text: "",
      layout: [],
      gridIndex: 0,
      pageData: {},
    };
  },
  beforeCreate: function () {},
  created: function () {
    console.log(this.id);
    if (window.pageDatas.length > 0) {
      console.log(this.id);
      console.log(window.pageDatas[this.id]);
      this.pageData = window.pageDatas[this.id];
      if (this.pageData.layout) {
        this.layout = this.pageData.layout;
      }
    }
  },
  methods: {
    addItem: function () {
      // Add a new item. It must have a unique key!
      // this.layout.push({
      //   x: (this.layout.length * 2) % (this.colNum || 12),
      //   y: this.layout.length + (this.colNum || 12), // puts it at the bottom
      //   w: 2,
      //   h: 2,
      //   i: this.gridIndex,
      // });
      this.layout.push({
        x: (this.layout.length * 2) % (this.colNum || 12),
        y: this.layout.length + (this.colNum || 12), // puts it at the bottom
        w: 12,
        h: 10,
        i: this.gridIndex,
      });
      // Increment the counter to ensure key is always unique.
      this.gridIndex++;

      this.pageData.layout = this.layout;

      this.$q.localStorage.set("pageDatas", JSON.stringify(window.pageDatas));
    },
    removeItem: function (val) {
      const gridIndex = this.layout.map((item) => item.i).indexOf(val);
      this.layout.splice(gridIndex, 1);
    },
    layoutUpdatedEvent: function (newLayout) {
      console.log("Updated layout: ", newLayout);
    },
  },
};
</script>

<style scoped>
:root {
  --bg-color: #f4f5f6;
  --primary: #445eee;
  --muted: #a4aabc;
  --radius: 20px;
  --padding: 15px;
  --white: #fff;
  --black: #000;
}

.vue-grid-layout {
  /* background: #eee; */
  width: 100%;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  /* background: #ccc; */
  border: 1px solid black;
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
/* .vue-grid-item .static {
  background: #cce;
} */
.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .minMax {
  font-size: 12px;
}
.vue-grid-item .add {
  cursor: pointer;
}
.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}

.vue-grid-item {
  border-radius: var(--radius);
  padding: var(--padding);
  background-color: var(--white);
  box-sizing: box-sizing;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.vue-grid-item > .vue-resizable-handle {
  bottom: 10px;
  right: 10px;
}
</style>
