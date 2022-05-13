<template>
  <div class="" style="">
    <q-toolbar class="text-primary">
      <q-btn flat dense icon="edit" @click="editable = true" v-if="!editable">
        <q-tooltip class="bg-accent">Edit</q-tooltip>
      </q-btn>
      <q-btn flat dense icon="save" @click="savePageData()" v-if="editable">
        <q-tooltip class="bg-accent">Save</q-tooltip>
      </q-btn>
      <q-btn flat dense icon="cancel" @click="cancel()" v-if="editable">
        <q-tooltip class="bg-accent">Cancel</q-tooltip>
      </q-btn>
      <q-separator vertical inset class="bg-primary" style="margin-left: 2px; margin-right: 2px;" v-if="editable" />
      <q-btn flat dense icon="add" @click="addItem" v-if="editable">
        <q-tooltip class="bg-accent">Add</q-tooltip>
      </q-btn>
    </q-toolbar>
    <grid-layout :layout="page.layout" :col-num="12" :row-height="50" :is-draggable="editable" :is-resizable="editable"
      :is-mirrored="false" :responsive="false" :vertical-compact="true" :margin="[20, 20]" :use-css-transforms="true"
      @layout-updated="layoutUpdatedEvent" @layout-created="layoutCreatedEvent"
      @layout-before-mount="layoutBeforeMountEvent" @layout-mounted="layoutMountedEvent"
      @layout-ready="layoutReadyEvent">
      <grid-item v-for="item in page.layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.i"
        drag-allow-from=".vue-draggable-handle" drag-ignore-from=".no-drag" class="vue-draggable-handle"
        @resize="resizeEvent" @move="moveEvent" @resized="resizedEvent" @container-resized="containerResizedEvent"
        @moved="movedEvent">
        <editor style="width: 100%; height: 100%;" :id="item.i" :pageId="id" :editable="editable"
          v-on:removeItem="removeItem" />
      </grid-item>
    </grid-layout>
    <q-carousel swipeable animated arrows v-model="slide" :fullscreen="fullscreen" infinite v-if="false">
      <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
      <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
      <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
      <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

      <template v-slot:control>
        <q-carousel-control position="bottom-right" :offset="[18, 18]">
          <q-btn push round dense color="white" text-color="primary"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="fullscreen = !fullscreen" />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script>
  import Editor from "components/Editor.vue";
  import VueGridLayout from "vue-grid-layout";
  import { usePagesStore } from "../stores/pages";
  import { uid } from "quasar";
  export default {
    name: "Page",
    setup() {
      const storePages = usePagesStore();
      console.log(storePages);
      return {
        // you can return the whole storePages instance to use it in the template
        storePages,      };
    },
    components: {
      Editor,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
    },
    props: ["id"],
    data() {
      return {
        editable: false,
        text: "",
        // layout: [],
        gridIndex: 0,
        // pageData: {},
        page: {
          layout: [],
        },
        eventLog: [],

        slide: 1,
        fullscreen: false,

      };
    },
    watch: {
      eventLog: function () {
        // const eventsDiv = this.$refs.eventsDiv;
        // eventsDiv.scrollTop = eventsDiv.scrollHeight;
      },
    },
    beforeCreate: function () { },
    created: function () {
      console.log(this.id);
      // if (window.pageDatas && window.pageDatas.pages.length > 0) {
      //   console.log(this.id);
      //   console.log(window.pageDatas.pages[this.id]);
      //   this.pageData = window.pageDatas.pages[this.id];
      //   if (this.pageData.layout) {
      //     this.page.layout = this.pageData.layout;
      //   }
      // }
      this.page = this.storePages.getPage(this.id);
      if (!this.page.layout) {
        this.page.layout = [];
      }
    },
    methods: {
      addItem: function () {
        this.page.layout.push({
          x: 0,
          y: 10,
          w: 12,
          h: 10,
          // i: this.gridIndex,
          i: uid(),
        });
        // this.gridIndex++;
        console.log(this.storePages);
      },
      removeItem: function (val) {
        const gridIndex = this.page.layout.map((item) => item.i).indexOf(val);
        this.page.layout.splice(gridIndex, 1);
      },
      savePageData: function () {
        this.storePages.updateData();
        this.storePages.updatePage(this.id);
        console.log("savePageData");
        this.editable = false;
      },
      cancel: function () {
        console.log("savePageData");
        this.editable = false;
      },
      moveEvent: function (i, newX, newY) {
        const msg = "MOVE i=" + i + ", X=" + newX + ", Y=" + newY;
        this.eventLog.push(msg);
        console.log(msg);
      },
      movedEvent: function (i, newX, newY) {
        const msg = "MOVED i=" + i + ", X=" + newX + ", Y=" + newY;
        this.eventLog.push(msg);
        console.log(msg);
      },
      resizeEvent: function (i, newH, newW, newHPx, newWPx) {
        const msg =
          "RESIZE i=" +
          i +
          ", H=" +
          newH +
          ", W=" +
          newW +
          ", H(px)=" +
          newHPx +
          ", W(px)=" +
          newWPx;
        this.eventLog.push(msg);
        console.log(msg);
      },
      resizedEvent: function (i, newX, newY, newHPx, newWPx) {
        const msg =
          "RESIZED i=" +
          i +
          ", X=" +
          newX +
          ", Y=" +
          newY +
          ", H(px)=" +
          newHPx +
          ", W(px)=" +
          newWPx;
        this.eventLog.push(msg);
        console.log(msg);

        console.log(i);
        for (let idx = 0; idx < this.page.layout.length; idx++) {
          const el = this.page.layout[idx];
          if (i === el.i) {
            el.expanedH = el.h;
            if (el.h > 1) {
              el.isExpaned = true;
            }
            break;
          }
        }
      },
      containerResizedEvent: function (i, newH, newW, newHPx, newWPx) {
        const msg =
          "CONTAINER RESIZED i=" +
          i +
          ", H=" +
          newH +
          ", W=" +
          newW +
          ", H(px)=" +
          newHPx +
          ", W(px)=" +
          newWPx;
        this.eventLog.push(msg);
        console.log(msg);
      },
      layoutCreatedEvent: function (newLayout) {
        this.eventLog.push("Created layout");
        console.log("Created layout: ", newLayout);
      },
      layoutBeforeMountEvent: function (newLayout) {
        this.eventLog.push("beforeMount layout");
        console.log("beforeMount layout: ", newLayout);
      },
      layoutMountedEvent: function (newLayout) {
        this.eventLog.push("Mounted layout");
        console.log("Mounted layout: ", newLayout);
      },
      layoutReadyEvent: function (newLayout) {
        this.eventLog.push("Ready layout");
        console.log("Ready layout: ", newLayout);
      },
      layoutUpdatedEvent: function (newLayout) {
        this.eventLog.push("Updated layout");
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
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
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
    z-index: 1;
  }

  .vue-grid-item>.vue-resizable-handle {
    bottom: 10px;
    right: 10px;
  }
</style>