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
      //https://youtu.be/M_wZpSEvOkc
      let searchLink = new URL(this.search);
      let videoId: string;
      if (searchLink.hostname === "youtu.be")
        videoId = searchLink.pathname.slice(1);
      else if (searchLink.searchParams.get("v") != null) {
        videoId = searchLink.searchParams.get("v");
      } else {
        displayAlert();
      }
      try {
        startLoading();
        const { data } = await axios.post<VideoJSON>(
          `/api/youtube/video/${videoId}`,
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
// start and stop loading
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
const displayAlert = () => {};
Alpine.start();
