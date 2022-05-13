<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <!-- <q-btn flat round dense icon="add" @click="add()" /> -->
        <!-- <q-toolbar-title> <router-link to="/">Quasar Dashboard</router-link> </q-toolbar-title> -->

        <q-toolbar-title @click="$router.push('/')"
          >Quasar Dashboard</q-toolbar-title
        >

        <!-- <q-btn dense flat round icon="clear" @click="$q.localStorage.clear()" /> -->
        <q-btn dense flat round icon="person" @click="right = !right" />
      </q-toolbar>

      <q-tabs align="left" dense no-caps inline-label>
        <span
          class="q-tab-span"
          :class="{ 'q-tab-span-selected': '/home' === $route.path }"
        >
          <q-route-tab to="/home" label="Home" style="text-align: center" />
        </span>
        <!--  <template v-if="pagesData.pages.length > 0"> -->
        <span
          v-for="(page, index) in storePages.data.pages"
          v-bind:key="index"
          style=""
          :style="{}"
          v-show="page.isOpened"
          class="q-tab-span"
          :class="{ 'q-tab-span-selected': page.to === $route.path }"
        >
          <q-route-tab
            v-if="page.isOpened"
            class="all-pointer-events ellipsis"
            :to="page.to"
            :label="page.label"
            exact
            style="width: 100%"
          >
            <!-- <q-space /> -->
          </q-route-tab>
          <q-btn
            v-if="page.isOpened"
            dense
            flat
            icon="close"
            style="font-size: 10px"
            class="all-pointer-events"
            @click="closePage(page, $event)"
          />
          <q-tooltip content-style="font-size: 16px">
            {{ page.label }}
          </q-tooltip>
        </span>
        <!-- </template> -->
      </q-tabs>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="mobile" bordered>
      <!-- drawer content -->
      <q-btn label="Standard"  @click="test()" />
      <div>{{JSON.stringify(storePages.data)}}</div>
    </q-drawer>

    <q-drawer v-model="right" side="right" behavior="mobile" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <!-- <routeor-view /> -->
      <keep-alive>
        <router-view :key="$route.fullPath" />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<style>
.q-tab {
  padding: 0 0 0 5px;
  margin: 0px;
  min-width: 100px;
  max-width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.q-tab__label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100px;
}

.q-tab-span {
  display: inherit;
  border-style: solid;
  margin-left: 5px;
  margin-right: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.q-tab-span-selected {
  background-color: #5829e8;
}
</style>


<script>
window.add = function () {
  let pageId = 0;
  let arrPageId = [];
  if (!window.pagesData.pages) {
    window.pagesData.pages = [];
  }

  if (window.pagesData.pages.length > 0) {
    arrPageId = window.pagesData.pages.map((p) => p.id);
    pageId =
      arrPageId.sort(function (a, b) {
        return b - a;
      })[0] + 1;
  }

  let pageData = {
    id: pageId,
    to: "/pages/" + pageId.toString(),
    label: "page" + pageId.toString(),
    name: "page" + pageId.toString(),
    isOpened: false,
    editable: false,
    layout: [],
  };

  window.pagesData.pages.push(pageData);

  return pageData;
};

// window.getData = async function () {
//   await api
//     .get("/api/pages")
//     .then((response) => {
//       console.log(response.data);
//       window.pagesData = response.data;
//     })
//     .catch(() => {
//       this.$q.notify({
//         color: "negative",
//         position: "top",
//         message: "Loading failed",
//         icon: "report_problem",
//       });
//     });
// };

// import { api } from "boot/axios";
import { usePagesStore } from "../stores/pages";
// const storePages = usePagesStore();
// console.log(storePages);

export default {
  setup() {
    const storePages = new usePagesStore();
    console.log(storePages);
    return {
      // you can return the whole storePages instance to use it in the template
      storePages,
    };
  },
  data() {
    return {
      left: false,
      right: false,
      pagesData: {},
      pageSelected: false,
    };
  },
  computed: {},
  beforeCreate: function () {
  },
  created: function () {

    this.storePages.getData();
    console.log("layout created");
  },
  mounted: async function () {
    // if (!window.pagesData) {
    //   await window.getData();
    //   this.pagesData = window.pagesData;
    // }
    // console.log(this.$route.path);
    // console.log("layout mounted");
    
  },
  methods: {
    closePage(page, event) {
      event.stopPropagation();
      for (const p of this.storePages.data.pages) {
        if (p.to == page.to) {
          p.isOpened = false;
          break;
        }
      }
      if (this.$route.path !== "/home") {
        this.$router.push({ path: "/home" });
      }
      this.storePages.updateData();
    },
  },
};
</script>