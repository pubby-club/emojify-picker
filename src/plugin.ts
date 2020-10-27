import Vue from "vue";
import EmojifyPicker from "./EmojifyPicker";

interface PluginOptions {
  translator?: (text: string) => string;
}

export default function(vue: typeof Vue, options: PluginOptions = {}) {
  if (options.translator) {
    EmojifyPicker.prototype.$t = options.translator;
  }
}
