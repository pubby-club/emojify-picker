import { Vue } from "vue-property-decorator";
import { CreateElement } from "vue/types/umd";
export interface EmojiSheet {
    path: string;
    emojis: EmojiItem[];
    groups: EmojiGroup[];
}
export interface EmojiGroup {
    title: string;
    icon: string;
    subGroups: string[];
}
export interface EmojiItem {
    title: string;
    char?: string;
    short?: string[];
    group: number;
    codes: string;
    subGroup: number;
    file?: string;
}
export default class EmojifyPicker extends Vue {
    sheet: EmojiSheet;
    dark: boolean;
    emojiSize: number;
    themeColor: string;
    getFileName: (emoji: EmojiItem) => string;
    $refs: {
        scroll: HTMLDivElement;
    };
    currentGroupIndex: number;
    searchQuery: string;
    viewHeight: number;
    viewWidth: number;
    scrollTop: number;
    errorImages: Set<string>;
    listPadding: number;
    get emojiTree(): {
        title: string;
        icon: string;
        subGroups: {
            title: string;
            emojis: EmojiItem[];
        }[];
    }[];
    get currentGroup(): {
        title: string;
        icon: string;
        subGroups: {
            title: string;
            emojis: EmojiItem[];
        }[];
    };
    get filteredEmojis(): {
        title: string;
        emojis: EmojiItem[];
    }[];
    get itemSize(): number;
    get rowItems(): number;
    get columnItems(): number;
    get currentRow(): number;
    get startOffset(): number;
    get endOffset(): number;
    get itemCount(): number;
    get rowCount(): number;
    mounted(): void;
    $t(text: string): any;
    genEmojiGroups(): import("vue").VNode | import("vue").VNode[] | undefined;
    genGroupItem(group: EmojiGroup, index: number): import("vue").VNode | import("vue").VNode[] | undefined;
    genEmojiList(): import("vue").VNode | import("vue").VNode[] | undefined;
    genSubgroup(title: string, emojis: EmojiItem[], index: number): (import("vue").VNode | import("vue").VNode[] | undefined)[] | undefined;
    genEmojiItem(emoji: EmojiItem, index: number): import("vue").VNode | import("vue").VNode[] | undefined;
    genInputSearch(): import("vue").VNode | import("vue").VNode[] | undefined;
    getGroupImageUrl(group: EmojiGroup): string;
    getEmojiImageUrl(emoji: EmojiItem): string;
    onSelectEmoji(emoji: EmojiItem): void;
    onSelectGroup(group: EmojiGroup, index: number): void;
    render(h: CreateElement): import("vue").VNode;
}
