import Vue from "vue";
interface PluginOptions {
    translator?: (text: string) => string;
}
export default function (vue: typeof Vue, options?: PluginOptions): void;
export {};
