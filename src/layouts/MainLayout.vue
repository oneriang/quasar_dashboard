<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <q-btn flat round dense icon="add" @click="addTab" />
        <q-toolbar-title> Title </q-toolbar-title>

        <q-btn dense flat round icon="clear" @click="$q.localStorage.clear()" />
        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab
          v-for="(page, index) in pages"
          v-bind:key="index"
          :to="page.to"
          :label="page.label"
        />
      </q-tabs>
    </q-header>

    <q-drawer v-model="left" side="left" behavior="mobile" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer v-model="right" side="right" behavior="mobile" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <!-- <router-view /> -->
      <keep-alive>
        <router-view :key="$route.fullPath" />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
window.pageDatas = [];

export default {
  data() {
    return {
      left: false,
      right: false,
      pages: [],
    };
  },
  beforeCreate: function () {
    // this.$q.localStorage.clear()
    if (this.$q.localStorage.has("pageDatas")) {
      window.pageDatas = JSON.parse(this.$q.localStorage.getItem("pageDatas"));
    }
  },
  created: function () {
    if (window.pageDatas) {
      // this.pages = window.pageDatas.pages;
      for (let i = 0; i < window.pageDatas.length; i++) {
        const pageData = window.pageDatas[i];
        let pageRoute = {
          to: pageData.path,
          label: pageData.label,
        };
        this.pages.push(pageRoute);
      }
    }
  },
  methods: {
    addTab: function () {
      let pageId = 0;
      let arrPageId = [];
      if (window.pageDatas.length > 0) {
        arrPageId = window.pageDatas.map((p) => p.id);
        pageId =
          arrPageId.sort(function (a, b) {
            return b - a;
          })[0] + 1;
      }

      let pageData = {
        id: pageId,
        path: "/pages/" + pageId.toString(),
        label: "page" + pageId.toString(),
      };

      let pageRoute = {
        to: pageData.path,
        label: pageData.label,
      };

      this.pages.push(pageRoute);

      window.pageDatas.push(pageData);

      this.$q.localStorage.set("pageDatas", JSON.stringify(window.pageDatas));
    },
  },
};
</script>
