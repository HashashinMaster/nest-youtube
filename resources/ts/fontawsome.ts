import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faEye } from "@fortawesome/free-regular-svg-icons/faEye";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons/faThumbsUp";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";
import { faRectangleList } from "@fortawesome/free-regular-svg-icons/faRectangleList";

library.add(
  faMagnifyingGlass,
  faEye,
  faThumbsUp,
  faDownload,
  faVideo,
  faRectangleList,
);
dom.watch();
