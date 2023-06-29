import Alpine from "alpinejs";
import axios from "axios";
import JSONEditor from "jsoneditor";

window.Alpine = Alpine;
window.axios = axios;
window.JSONEditor = JSONEditor;

window.searchComponent = () => {
  return {
    search: "",
    async getVideoJSON() {
      console.log("starting");
      const { data } = await axios.post(`/api/youtube/video/${this.search}`);
      console.log(data);
      const container = document.getElementById("json-viewer");
      const editor = new JSONEditor(container);
      editor.set(data);
      return data;
    },
  };
};
Alpine.start();
