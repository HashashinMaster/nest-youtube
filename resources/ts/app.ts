import Alpine from "alpinejs";
import axios from "axios";
import JSONEditor from "jsoneditor";

window.Alpine = Alpine;
window.axios = axios;
window.JSONEditor = JSONEditor;
interface VideoJSON {
  success: boolean;
  data: any;
}
window.searchComponent = () => {
  return {
    search: "",
    async getVideoJSON() {
      try {
        startLoading();

        const { data } = await axios.post<VideoJSON>(
          `/api/youtube/video/${this.search}`,
        );
        stopLoading();
        if (!data.success) {
          return;
        }
        const container = document.getElementById("json-viewer");
        const editor = new JSONEditor(container);
        editor.set(data);
        return data;
      } catch (error) {
        console.log(error.mesage);
      }
    },
  };
};

const loadingContainer =
  document.querySelector<HTMLDivElement>("#loading-container")!;
const searchInput = document.querySelector<HTMLDivElement>("#search")!;
const startLoading = () => {
  loadingContainer.classList.add("is-loading");
  searchInput.setAttribute("readonly", "true");
};
const stopLoading = () => {
  loadingContainer.classList.remove("is-loading");
  searchInput.removeAttribute("readonly");
};
Alpine.start();
