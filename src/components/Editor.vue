<template>
  <div style="background-color: white;">
    <q-toolbar class="text-primary">
      <q-btn flat round dense :icon="editIcon" @click="toggleEdit" />
      <q-toolbar-title>
        <q-input v-model="title" dense :readonly="!options.editable" :borderless="!options.editable"
          class="q-toolbar__title" />
      </q-toolbar-title>
      <q-space />
      <q-btn flat round dense @click="toggle" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" />
      <q-btn flat round dense icon="close" @click="removeItem" v-if="!$q.fullscreen.isActive" />
    </q-toolbar>
    <quasar-tiptap v-bind="options" @update="onUpdate" class="no-drag"
      style="cursor: initial !important; height: 100%" />
  </div>
</template>

<style>
  .tiptap.tiptap-editor.quasar-tiptap {
    height: 100%;
    padding-bottom: 100px;
  }

  .tiptap.tiptap-editor.quasar-tiptap>div {
    overflow: auto;
    height: 100%;
  }

  .tiptap .tiptap-menubar,
  .tiptap .tiptap-menububble {
    height: unset;
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
    data() {
      return {
        title: 'Title',
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
        pageData: {},
      };
    },
    components: {
      QuasarTiptap,
    },
    props: ["id", "pageId"],
    beforeCreate: function () { },
    created: function () {
      console.log(this.id);
      console.log(this.pageId);
      if (window.pageDatas.length > 0) {
        this.pageData = window.pageDatas[this.pageId];
        if (!this.pageData.grid) {
          this.pageData.grid = {};
        }
        if (this.id in this.pageData.grid) {
          let grid = this.pageData.grid[this.id];
          this.title = grid.title;
          this.options.content = grid.content;
        }
      }
    },
    methods: {
      onUpdate({ getJSON, getHTML }) {
        this.json = getJSON();
        this.html = getHTML();
        console.log("html", this.html);
      },
      toggleEdit() {
        this.options.editable = !this.options.editable;
        this.options.showToolbar = !this.options.showToolbar;
        this.options.showBubble = !this.options.showBubble;
        if (this.options.editable) {
          this.editIcon = "save";
        } else {
          this.editIcon = "edit";
          const gridData = {
            title: '',
            content: ''
          };
          gridData.title = this.title;
          gridData.content = this.html;
          this.pageData.grid[this.id] = gridData;
          this.$q.localStorage.set("pageDatas", JSON.stringify(window.pageDatas));
        }
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
      if (this.$q.localStorage.has('grid' + this.id)) {
        const gridData = JSON.parse(this.$q.localStorage.getItem('grid' + this.id));
        this.title = gridData['title'];
        this.options.content = gridData['content'];
      }
    },
  };
</script>