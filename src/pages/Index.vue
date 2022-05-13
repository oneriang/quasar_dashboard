<template>
  <q-page class="">
    <q-toolbar class="text-primary">
      <q-btn flat dense icon="add" @click="openDialog=true" />
      <q-toolbar-title>{{ storePages.counter }}</q-toolbar-title>
      <q-space />
      <q-btn
        flat
        dense
        icon="calendar_month"
        @click="
          {
          }
        "
      />
    </q-toolbar>
    <q-list bordered padding>
      <q-expansion-item
        v-for="(page, index) in storePages.data.pages"
        v-bind:key="index"
      >
        <template v-slot:header>
          <q-item-section side>
            <q-icon
              color="primary"
              name="open_in_new"
              @click="openPage(page, $event)"
            />
          </q-item-section>
          <q-item-section side>
            <q-icon
              color="primary"
              :name="page.editable ? 'save' : 'edit'"
              @click="editInfo(page, $event)"
            />
          </q-item-section>
          <q-item-section>{{ page.label }}</q-item-section>
          <q-item-section avatar>
            <q-icon color="primary" name="more_vert">
              <q-menu auto-close>
                <q-list style="min-width: 100px">
                  <q-item clickable @click="storePages.delete(page)">
                    <q-item-section avatar>
                      <q-icon color="negative" name="delete" />
                    </q-item-section>
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-icon>
          </q-item-section>
        </template>
        <q-card class="">
          <q-card-section>
            <div class="q-gutter-md" style="">
              <q-input
                v-model="page.name"
                label="Name"
                :readonly="!page.editable"
                :borderless="!page.editable"
              />
              <q-input
                v-model="page.label"
                label="Lavel"
                :readonly="!page.editable"
                :borderless="!page.editable"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <q-dialog v-model="openDialog">
      <q-card style="width: 400px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">New Page</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="newPage.name" label="Name" stack-label />
          <q-input v-model="newPage.label" label="Label" stack-label />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Add" color="primary" v-close-popup  no-caps @click="addPage()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { usePagesStore } from "../stores/pages";
export default {
  name: "Index",
  setup() {
    const storePages = usePagesStore();
    console.log(storePages);
    return {
      // you can return the whole storePages instance to use it in the template
      storePages,
    };
  },
  props: {
    //pageDatas: Object
  },
  data() {
    return {
      pages: [],
      // pageDatas: {
      //   pages: {},
      // },
      newPage: {
        name:'',
        label:''
      },
      openDialog: false,
    };
  },
  watch: {
    // この関数は question が変わるごとに実行されます。
    //pageDatas: function (newVal, oldVal) {
    //  console.log(newVal);
    //  this.pages = newVal.pages;
    //},
  },
  created: function () {
    // if (this.$route.path === "/home") {
    //   if (!window.pageDatas) {
    //     await window.getData();
    //     this.pageDatas = window.pageDatas;
    //   }
    // }
    //if (window.pageDatas) {
    //  this.pages = window.pageDatas.pages;
    //}
    console.log("index created");
  },
  mounted: function () {
    console.log("index mounted");
  },
  methods: {
    addPage1: function () {
      // window.add();
      let pageData = window.add();

      // this.$router.push({ path: pageData.to }, () => {});

      this.$api
        .put("/api/pages", JSON.stringify(window.pageDatas), {
          headers: { "content-Type": "application/json" },
        })
        .then((response) => {
          // this.data = response.data
          console.log(response.data);
        })
        .catch(() => {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    },
    addPage: function () {
      this.storePages.add(this.newPage);
      this.newPage = {
        name:'',
        label:''
      }
    },
    openPage: function (page, $e) {
      $e.stopPropagation();
      page.isOpened = true;
      this.$router.push({ path: page.to });
    },
    editInfo: function (page, $e) {
      $e.stopPropagation();
      page.editable = !page.editable;
    },
  },
};
</script>