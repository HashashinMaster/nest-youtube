import Alpine from "alpinejs";
import axios from "axios";
import { JSONEditor } from "jsoneditor";

interface SearchComponentProps {
  search: string;
  getVideoJSON: () => Promise<any>;
}
declare global {
  interface Window {
    Alpine: Alpine;
    axios: axios;
    JSONEditor: JSONEditor;
    searchComponent: () => SearchComponentProps;
  }
}
