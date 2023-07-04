import Alpine from "alpinejs";
import axios from "axios";
import JSONEditor from "jsoneditor";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faEye } from "@fortawesome/free-regular-svg-icons/faEye";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons/faThumbsUp";

library.add(faMagnifyingGlass, faEye, faThumbsUp);
dom.watch();

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
    data: "",
    /**
     * @description get response from my api with validation
     * and create a json editor to view the data and store it
     * @returns void
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
        const JSONContainer = document.getElementById("json-viewer");
        //remove previouse json-viewer
        JSONContainer.innerHTML = "";
        //display article element
        document.querySelector("article").classList.remove("is-hidden");
        // make json viewer object
        const editor = new JSONEditor(JSONContainer);
        // set data given from my api to the json viewer
        editor.set(data);

        // get videos-json container
        const VideoContainer = document.getElementById("videos-viewer")!;
        //remove previouse videos-viewer
        VideoContainer.innerHTML = "";
        //component query
        const { data: videoCard } = await axios.post(`/component`, [
          {
            url: data.data.original_url,
            uploader_url: data.data.uploader_url,
            channel: data.data.channel,
            uploader_id: data.data.uploader_id,
            title: data.data.title,
            thumbnail: data.data.thumbnail,
            duration_string: data.data.duration_string,
            view_count: data.data.view_count,
            like_count: data.data.like_count,
          },
        ]);
        VideoContainer.innerHTML = videoCard;
        this.data = data;
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
window.toggleResponseView = (
  $event: Event,
  JSONTab: HTMLLinkElement,
  VideoTab: HTMLLinkElement,
  JSONBlock: HTMLDivElement,
  VideosBlock: HTMLDivElement,
) => {
  //store panel tab
  const panelTab = $event.currentTarget as HTMLLinkElement;
  if (panelTab.innerHTML === "JSON") {
    JSONTab.classList.add("is-active");
    VideoTab.classList.remove("is-active");
    VideosBlock.style.display = "none";
    JSONBlock.style.display = "block";
  } else if (panelTab.innerHTML === "Video") {
    VideoTab.classList.add("is-active");
    JSONTab.classList.remove("is-active");
    JSONBlock.style.display = "none";
    VideosBlock.style.display = "flex";
  }
};

window.download = async (url: string, format: string) => {
  const formatType = (
    document.querySelector(`[value='${format}'`)
      .parentElement as HTMLOptGroupElement
  ).label;
  await axios.put("/api/youtube/video/download", {
    url,
    format: format,
    type: formatType.toLocaleLowerCase(),
  });
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
