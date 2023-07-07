import Alpine from "alpinejs";
import axios from "axios";
import JSONEditor from "jsoneditor";
import { io } from "socket.io-client";

window.Alpine = Alpine;
window.axios = axios;
window.JSONEditor = JSONEditor;
interface VideoJSON {
  success: boolean;
  data: any;
}

/**
 * send socket event when user close o refresh tab
 * to remove medias he downloaded from my poor
 * server
 */
const socket = io();
const uuid = (document.querySelector("meta[name='uuid']") as HTMLMetaElement)
  .content;
window.addEventListener("beforeunload", () => {
  socket.emit("userDisconnect", { uuid });
});

window.searchComponent = () => {
  return {
    search: "",
    data: "",
    /**
     * @description get response from my api with validation
     * and create a json editor to view the data and store it
     * @returns void
     */
    async getData() {
      //check if input value is valid url
      console.log(validURL(this.search), this.search);
      if (!validURL(this.search)) {
        //display no url alert
        displayAlert("no URL");
        return;
      }
      //validate url
      const { allGood, videoId } = validateUrl(this.search);
      if (!allGood) {
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
        //display json data in json viewer
        displayJsonViewer(data);
        await generateVideosCards([
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
        this.data = data;
      } catch (error) {
        console.log(error.mesage);
      }
    },
  };
};

/**
 *
 * @param url string
 * @description verify youtube hostname
 * @returns Object
 */
const validateUrl = (url: string) => {
  //create URL object
  let searchLink = new URL(url);
  let videoId: string;
  if (location.pathname === "/video") {
    //checks the youtube url type and extract video id from it
    if (searchLink.hostname === "youtu.be")
      videoId = searchLink.pathname.slice(1);
    else if (searchLink.searchParams.get("v")) {
      videoId = searchLink.searchParams.get("v");
      return { allGood: true, videoId };
    } else {
      //display invalid url
      displayAlert("invalid URL");
      return { allGood: false };
    }
  }
  if (location.pathname === "/playlist") {
    console.log(searchLink.hostname);
    if (
      searchLink.hostname === "www.youtube.com" &&
      searchLink.searchParams.get("list")
    ) {
      videoId = searchLink.searchParams.get("list");
      return { allGood: true, videoId };
    } else {
      //display invalid url
      displayAlert("invalid URL");
      return { allGood: false };
    }
  }
};
/**
 *
 * @param data object
 * @description display json data in json viewer
 */
const displayJsonViewer = (data: VideoJSON) => {
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
};
const generateVideosCards = async (data: any) => {
  // get videos-json container
  const VideoContainer = document.getElementById("videos-viewer")!;
  //remove previouse videos-viewer
  VideoContainer.innerHTML = "";
  //component query
  const { data: videoCard } = await axios.post(`/component`, data);
  VideoContainer.innerHTML = videoCard;
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
/**
 *
 * @param $event Event: alpine event
 * @param JSONTab HTMLinkElement: json tab element
 * @param VideoTab HTMLinkElement: video tab element
 * @param JSONBlock HTMLDivElement: block where to store json
 * @param VideosBlock HTMLDivElement: block where to store videos
 * @description togggle between json tab and video tab
 */
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

interface VideoDownloadResponse {
  success: boolean;
  path: string;
}
/**
 *
 * @param $event string: alpine Event
 * @param url string: url of the video
 * @param format string: format of the video
 * @param title string: title of the video
 * @description send put request to the server to download
 *              the video and prompt download on client side
 */
window.download = async (
  $event: Event,
  url: string,
  format: string,
  title: string,
) => {
  ($event.target as HTMLButtonElement).disabled = true;
  const formatType = (
    document.querySelector(`[value='${format}'`)
      .parentElement as HTMLOptGroupElement
  ).label;

  const { data } = await axios.put<VideoDownloadResponse>(
    "/api/youtube/video/download",
    {
      url,
      format: format,
      type: formatType.toLocaleLowerCase(),
      uuid,
    },
  );
  ($event.target as HTMLButtonElement).disabled = false;

  if (data.success) {
    const a = document.createElement("a");
    a.href = `/temp/${uuid}/${formatType.toLocaleLowerCase()}/${title}.${format}`;
    console.log(a.href);
    a.download = `${title}.${format}`;
    a.click();
  }
};
//stackoverflow stuff
function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // fragment locator
  return !!pattern.test(str);
}

Alpine.start();
