import Alpine from "alpinejs";
import axios from "axios";
import { JSONEditor } from "jsoneditor";

interface SearchComponentProps {
  search: string;
  getData: () => Promise<any>;
}
declare global {
  interface Window {
    Alpine: Alpine;
    axios: axios;
    JSONEditor: JSONEditor;
    searchComponent: () => SearchComponentProps;
    toggleResponseView(
      $event: Event,
      JSONTab: HTMLLinkElement,
      VideoTab: HTMLLinkElement,
      JSONBlock: HTMLDivElement,
      VideosBlock: HTMLDivElement,
    ): void;
    download: (
      $event: Event,
      url: string,
      format: string,
      title: string,
    ) => void;
  }
}
