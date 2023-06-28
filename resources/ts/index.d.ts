import Alpine from "alpinejs";
import axios from "axios";
import { JSONEditor } from "vanilla-jsoneditor";

declare global {
  interface Window {
    Alpine: Alpine;
    axios: axios;
    JSONEditor: JSONEditor;
  }
}
