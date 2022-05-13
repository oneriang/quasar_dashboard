import { defineStore } from 'pinia';
import { api } from "boot/axios";
import { uid } from 'quasar'
export const usePagesStore = defineStore('pages', {
  state: () => ({
    data: {},
  }),
  getters: {
  },
  actions: {
    updateData() {
      api
        .put("/api/pages", JSON.stringify(this.data), {
          headers: { "content-Type": "application/json" },
        })
        .then((response) => {
          // this.data = response.data
          console.log(response.data);
        })
        .catch(() => {
          //this.$q.notify({
          //  color: "negative",
          //  position: "top",
          //  message: "Loading failed",
          //  icon: "report_problem",
          //});
        });
    },
    updatePage(pageId) {
      let page = this.getPage(pageId);
      api
        .put("/api/page", JSON.stringify(page), {
          headers: { "content-Type": "application/json" },
        })
        .then((response) => {
          // page = response.data;
          console.log(response.data);
        })
        .catch(() => {
          //this.$q.notify({
          //  color: "negative",
          //  position: "top",
          //  message: "Loading failed",
          //  icon: "report_problem",
          //});
        });
    },
    async getData() {
      await api
        .get("/api/pages")
        .then((response) => {
          console.log(response.data);
          this.data = response.data;
        })
        .catch(() => {
          // this.$q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: "Loading failed",
          //   icon: "report_problem",
          // });
        });
    },
    // add() {
    //   let pageId = 0;
    //   let arrPageId = [];

    //   if (this.data.pages.length > 0) {
    //     arrPageId = this.data.pages.map((p) => p.id);
    //     pageId =
    //       arrPageId.sort(function (a, b) {
    //         return b - a;
    //       })[0] + 1;
    //   }

    //   let pageData = {
    //     id: pageId,
    //     to: "/pages/" + pageId.toString(),
    //     label: "page" + pageId.toString(),
    //     name: "page" + pageId.toString(),
    //     isOpened: false,
    //     editable: false,
    //     layout: [],
    //   };

    //   this.data.pages.push(pageData);

    //   this.updateData();

    // },
    add(page) {

      let pageData = {
        id: uid(),
        to: "/pages/" + page.name,
        label: page.label,
        name: page.name,
        isOpened: false,
        editable: false,
        layout: [],
      };

      this.data.pages.push(pageData);

      this.updateData();

    },
    delete(page) {
      for (let i = 0; i < this.data.pages.length; i++) {
        if (this.data.pages[i].to == page.to) {
          this.data.pages.splice(i, 1)
          break;
        }
      }

      this.updateData();
    },
    getPage(pageId) {
      for (let i = 0; i < this.data.pages.length; i++) {
        if (this.data.pages[i].name == pageId) {
          return this.data.pages[i];
        }
      }
      return false;
    },
    getGrid(pageId, gridId) {
      let page = this.getPage(pageId);
      for (let i = 0; i < page.layout.length; i++) {
        if (page.layout[i].i == gridId) {
          if (!page.layout[i].grid) {
            page.layout[i].grid = {
              title: '',
              content: ''
            };
          }
          // return page.layout[i].grid;
          return page.layout[i];
        }
      }
      return false;
    }
  },
});
