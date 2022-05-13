<template>
  <div style="background-color: white">
    <q-toolbar class="text-primary">
      <q-btn flat round dense icon="open_with" class="vue-draggable-handle" style="cursor: grabbing" v-if="editable">
        <q-tooltip class="bg-accent">Drag & Drop</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="edit" @click="edit()" v-if="editable && !options.editable">
        <q-tooltip class="bg-accent">Edit</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="save" @click="save()" v-if="editable && options.editable">
        <q-tooltip class="bg-accent">Save</q-tooltip>
      </q-btn>
      <q-btn flat dense icon="cancel" @click="cancel()" v-if="editable && options.editable">
        <q-tooltip class="bg-accent">Cancel</q-tooltip>
      </q-btn>
      <q-toolbar-title>
        <!-- {{id}} -->
        <q-input v-model="title" dense :readonly="!options.editable" :borderless="!options.editable"
          class="q-toolbar__title" />
      </q-toolbar-title>
      <q-space />
      <q-btn flat round dense :icon="expandIcon" @click="toggleExpand">
        <q-tooltip class="bg-accent">Expand</q-tooltip>
      </q-btn>
      <q-btn flat round dense @click="toggle" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'">
        <q-tooltip class="bg-accent">Full Screen</q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="delete" v-if="!$q.fullscreen.isActive && editable">
        <q-tooltip class="bg-accent">Delete</q-tooltip>
        <q-popup-proxy transition-show="flip-up" transition-hide="flip-down" v-model="openDialog">
          <q-banner class="text-negative">
            Are you sure want to delete?
            <q-btn icon="done" flat dens round @click="removeItem()" class="text-primary">
              <q-tooltip class="bg-accent">Delete</q-tooltip>
            </q-btn>
            <q-btn icon="cancel" flat dens round @click="openDialog=false" class="text-primary">
              <q-tooltip class="bg-accent">Cancel</q-tooltip>
            </q-btn>
          </q-banner>
        </q-popup-proxy>
      </q-btn>
    </q-toolbar>
    <quasar-tiptap v-bind="options" @update="onUpdate" class="no-drag" v-show="isExpaned || editable"
      style="cursor: initial !important; bottom: 0px; position: absolute; top: 50px;" />
    <!-- <q-dialog v-model="openDialog">
        <q-card style="width: 400px; max-width: 80vw;">
  
          <q-card-section>
          </q-card-section>
          
          <q-card-section class="q-pt-none">
            <div class="text-h6">Are you sure want to delete? </div>
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Delete" color="negative" v-close-popup  no-caps @click="removeItem()"/>
            <q-btn flat label="Cancel" color="primary" v-close-popup  no-caps @click="openDialog=false"/>
          </q-card-actions>
        </q-card>
      </q-dialog> -->
  </div>
</template>

<style>
  .tiptap.tiptap-editor.quasar-tiptap {
    /* height: 100%;
    padding-bottom: 100px; */
  }

  .tiptap.tiptap-editor.quasar-tiptap>div {
    width: 100%;
    /* height: 100%; */
    position: absolute;
    bottom: 0px;
    top: 40px;
    /* overflow: auto;*/
  }

  .tiptap .tiptap-menubar,
  .tiptap .tiptap-menububble {
    height: unset;
  }

  .tiptap .editor__content {
    /* height: 80%; */
    /* padding-bottom: 50px; */
    height: 100%;
    position: absolute;
    bottom: 0px;
    /* top: 50px; */
    width: 100%;
    overflow: auto;
  }

  .o-image-view.full-screen {
    background-color: white;
  }
</style>

<script>
  import Vue from "vue";
  import {
    QuasarTiptap,
    QuasarTiptapPlugin,
    // RecommendedExtensions,
  } from "quasar-tiptap";
  import "quasar-tiptap/lib/index.css";

  Vue.use(QuasarTiptapPlugin, {
    language: "zh-hans",
    spellcheck: true,
  });

  import { usePagesStore } from "../stores/pages";

  // --------------------------------------------------------------------------------
  // Exposed Extension List
  // --------------------------------------------------------------------------------
  export const TipTapExtensions = [
    "Bold",
    "Italic",
    "Strike",
    "Underline",
    "Code",
    "CodeBlock",
    "CodeBlockHighlight",
    "BulletList",
    "OrderedList",
    "ListItem",
    "TodoList",
    "HorizontalRule",
    "Table",
    "Link",
    // 'Image',
  ];

  export const QuasarTipTapExtensions = [
    // 'OTitle',
    // 'ODoc',
    "OParagraph",
    "OBlockquote",
    "OTodoItem",
    "OHeading",
    "OAlignment",
    "OIndent",
    "OLineHeight",
    "OForeColor",
    "OBackColor",
    "OFontFamily",
    "OIframe",
    "ODiagram",
    "OKatexBlock",
    "OKatexInline",
    "OFormatClear",
    "OPrint",
    "OImage",
    "OEmbed",
    "OInsertHtml",
    "OLink",
  ];

  export const RecommendedExtensions = [
    ...TipTapExtensions,
    ...QuasarTipTapExtensions,
  ];

  export default {
    name: "Editor",
    setup() {
      const storePages = usePagesStore();
      console.log(storePages);
      return {
        storePages,
      };
    },
    data() {
      return {
        title: "Title",
        options: {
          content: "",
          editable: false,
          showToolbar: false,
          showBubble: false,
          extensions: [
            ...RecommendedExtensions,
            // other extenstions
            // name string, or custom extension
          ],
          toolbar: [
            "bold",
            "italic",
            "strike",
            "underline",
            "code",
            "code_blok",
            "bullet_list",
            "ordered_list",
            "todo_list",
            "horizontal",
            "table",
            "photo",
            "blockquote",
            "heading",
            "indent",
            "outdent",
            "align-dropdown",
            "align-group",
            "line-height",
            "fore-color",
            "back-color",
            "font-family",
            "format_clear",
            "print",
          ],
        },
        json: "",
        html: "",
        editIcon: "edit",
        expandIcon: "expand_more",
        // pageData: {},
        grid: {},
        layout: [],
        isExpaned: true,
        openDialog: false,
      };
    },
    components: {
      QuasarTiptap,
    },
    props: ["id", "pageId", "editable"],
    beforeCreate: function () { },
    created: function () {
      // this.options.editable = this.editable;
      this.layout = this.storePages.getGrid(this.pageId, this.id);
      if (this.layout.isExpaned !== undefined) {
        this.isExpaned = this.layout.isExpaned;
        // if (this.isExpaned) {
        //   this.layout.h = this.layout.expanedH;
        //   this.expandIcon = 'expand_less';
        // } else {
        //   this.expandIcon = 'expand_more';
        // }
      } else {
      }
      if (this.isExpaned) {
        if (this.layout.expanedH) {
          this.layout.h = this.layout.expanedH;
        }
        this.expandIcon = 'expand_less';
      } else {
        this.expandIcon = 'expand_more';
        this.layout.h = 1;
      }
      this.title = this.layout.grid.title;
      this.options.content = this.layout.grid.content;
    },
    methods: {
      onUpdate({ getJSON, getHTML }) {
        this.json = getJSON();
        this.html = getHTML();
        console.log("html", this.html);
      },
      edit() {
        this.options.editable = !this.options.editable;
        this.options.showToolbar = !this.options.showToolbar;
        this.expand();
      },
      save() {
        this.options.editable = !this.options.editable;
        this.options.showToolbar = !this.options.showToolbar;
        this.layout.grid.title = this.title;
        this.layout.grid.content = this.html;
      },
      cancel() {
        this.options.editable = !this.options.editable;
        this.options.showToolbar = !this.options.showToolbar;
      },
      toggleExpand() {
        if (this.isExpaned) {
          if (!this.layout.expanedH) {
            this.layout.expanedH = this.layout.h;
          }
          this.layout.h = 1;
          this.layout.isExpaned = false;
          this.isExpaned = false;
          this.expandIcon = 'expand_more';
        } else {
          if (this.layout.expanedH) {
            this.layout.h = this.layout.expanedH;
          }
          this.layout.isExpaned = true;
          this.isExpaned = true
          this.expandIcon = 'expand_less';
        }
        this.$parent.$parent.layoutUpdate();
      },
      expand() {
        if (this.layout.expanedH) {
          this.layout.h = this.layout.expanedH;
        }
        this.layout.isExpaned = true;
        this.isExpaned = true
        this.expandIcon = 'expand_less';
        this.$parent.$parent.layoutUpdate();
      },
      removeItem: function () {
        this.$emit("removeItem", this.id);
      },
      toggle(e) {
        const target = this.$el;

        this.$q.fullscreen
          .toggle(target)
          .then(() => {
            // success!
          })
          .catch((err) => {
            alert(err);
          });
      },
    },
    mounted() {
      // set language dynamically
      this.$o.lang.set("en-us");
      // if (this.$q.localStorage.has('grid' + this.id)) {
      //   const gridData = JSON.parse(this.$q.localStorage.getItem('grid' + this.id));
      //   this.title = gridData['title'];
      //   this.options.content = gridData['content'];
      // }
    },
  };
</script>