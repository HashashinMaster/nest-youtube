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
    /**
     * @description get response from my api with validation
     * and create a json editor to view returned data
     * @returns yt-dlp json
     */
    async getVideoJSON() {
      //check if input value is valid url
      if (!isURL(this.search)) {
        //display no url alert
        displayAlert("no URL");
        return;
      }
      //create URL object
      let searchLink = new URL(this.search);
      let videoId: string;
      //checks the youtube url type and extract video id from it
      if (searchLink.hostname === "youtu.be")
        videoId = searchLink.pathname.slice(1);
      else if (searchLink.searchParams.get("v")) {
        videoId = searchLink.searchParams.get("v");
      } else {
        //display invalid url
        displayAlert("invalid URL");
        return;
      }
      try {
        //start loading animation
        startLoading();
        //fetch data
        const { data } = await axios.post<VideoJSON>(
          `/api/youtube/video/${videoId}`,
        );
        //stop loading animation
        stopLoading();
        //if success props is set to false return
        if (!data.success) {
          return;
        }
        //get json-viewer container
        const container = document.getElementById("json-viewer");
        //display article element
        document.querySelector("article").classList.remove("is-hidden");
        // make json viewer object
        const editor = new JSONEditor(container);
        // set data given from my api to the json viewer
        editor.set(data);
        return data;
      } catch (error) {
        console.log(error.mesage);
      }
    },
  };
};
// store search input and it's container
const loadingContainer =
  document.querySelector<HTMLDivElement>("#loading-container")!;
const searchInput = document.querySelector<HTMLInputElement>("#search")!;

//start loading and set input to readonly
const startLoading = () => {
  loadingContainer.classList.add("is-loading");
  searchInput.setAttribute("readonly", "true");
};

//stop loading and remove readonly
const stopLoading = () => {
  loadingContainer.classList.remove("is-loading");
  searchInput.removeAttribute("readonly");
};
/**
 *
 * @param type string
 * @param message string
 * @description making reusable alert component
 * @returns string
 */
const alertComponent = (type: string, message: string) => `
        <div class="notification is-${type} ">
            <button class="delete" onclick="this.parentElement.remove()"></button>
            ${message}
        </div>`;

const displayAlert = (type: string) => {
  const alertContainer =
    document.querySelector<HTMLDivElement>("#alerts-container")!;
  const wrongURLMessage = `The URL you entered (${searchInput.value}) is invalid!
    </br>
    URL formats are:
    <ul>
        <li>https://www.youtube.com/watch?v=<strong>videoId</strong></li>
        <li>https://youtu.be/<strong>videoId</strong></li>
    </ul>`;

  if (type === "invalid URL") {
    alertContainer.innerHTML = alertComponent("danger", wrongURLMessage);
  }
  if (type === "no URL") {
    alertContainer.innerHTML = alertComponent(
      "danger",
      "Invalid input! enter a valid youtube URL",
    );
  }
};

//stackoverflow stuff
function isURL(str: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // fragment locator
  return pattern.test(str);
}
Alpine.start();
