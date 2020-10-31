import { Component, Prop, Vue } from "vue-property-decorator";
import { CreateElement } from "vue/types/umd";
import { defaultTranslator } from "./locale";

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

@Component
export default class EmojifyPicker extends Vue {
  @Prop(Object)
  sheet!: EmojiSheet;

  @Prop({
    type: Boolean,
    default: false,
  })
  dark!: boolean;

  @Prop({
    type: Number,
    default: 40,
  })
  emojiSize!: number;

  @Prop({
    type: String,
    default: "#0088dd",
  })
  themeColor!: string;

  @Prop({
    type: Function,
    default: (emoji: EmojiItem) =>
      emoji.codes
        .split(/\s+/)
        .join("_")
        .toLowerCase(),
  })
  getFileName!: (emoji: EmojiItem) => string;

  // Refs
  $refs!: {
    scroll: HTMLDivElement;
  };

  // Current opened group index
  currentGroupIndex = 0;

  // Emoji search query
  searchQuery = "";

  viewHeight = 0;
  viewWidth = 0;

  scrollTop = 0;

  errorImages = new Set<string>();

  itemGap = 4;

  get emojiTree() {
    return this.sheet.groups.map((group, groupIndex) => {
      return {
        title: group.title,
        icon: group.icon,
        subGroups: group.subGroups.map((subGroup, subGroupIndex) => {
          return {
            title: subGroup,
            emojis: this.sheet.emojis.filter(
              (emoji) =>
                emoji.group === groupIndex && emoji.subGroup === subGroupIndex
            ),
          };
        }),
      };
    });
  }

  get currentGroup() {
    return this.emojiTree[this.currentGroupIndex];
  }

  get filteredEmojis() {
    return this.currentGroup.subGroups.map((subGroup) => {
      return {
        title: subGroup.title,
        emojis: subGroup.emojis.filter((emoji) =>
          emoji.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        ),
      };
    });
  }

  get itemSize() {
    return this.emojiSize + 8; // 8px padding / 4px gap
  }

  get rowItems() {
    return Math.floor((this.viewWidth - this.itemGap) / this.itemSize);
  }

  get columnItems() {
    return Math.ceil(this.viewHeight / this.itemSize);
  }

  get currentRow() {
    return this.startOffset / this.rowItems;
  }

  get startOffset() {
    return Math.floor(this.scrollTop / this.itemSize) * this.rowItems;
  }

  get endOffset() {
    return this.startOffset + this.rowItems * this.columnItems;
  }

  get itemCount() {
    return this.filteredEmojis.flatMap((group) => group.emojis).length;
  }

  get rowCount() {
    return Math.ceil(this.itemCount / this.rowItems);
  }

  mounted() {
    this.viewHeight = this.$refs.scroll.clientHeight;
    this.viewWidth = this.$refs.scroll.clientWidth;
  }

  $t(text: string) {
    return defaultTranslator(text);
  }

  genEmojiGroups() {
    if (this.$scopedSlots.groups) {
      return this.$scopedSlots.groups(this);
    }

    const groupItems = this.sheet.groups.map((group, index) =>
      this.genGroupItem(group, index)
    );

    return this.$createElement(
      "div",
      {
        staticClass: "emojify-picker__group",
      },
      groupItems
    );
  }

  genGroupItem(group: EmojiGroup, index: number) {
    const selectGroup = () => this.onSelectGroup(group, index);

    if (this.$scopedSlots["group-item"]) {
      return this.$scopedSlots["group-item"]({ group, selectGroup, index });
    }

    return this.$createElement(
      "button",
      {
        staticClass: "emojify-picker__group-item",
        class: {
          active: this.currentGroupIndex === index,
        },
        on: {
          click: selectGroup,
        },
      },
      [
        this.$createElement("img", {
          attrs: {
            src: this.getGroupImageUrl(group),
          },
        }),
      ]
    );
  }

  genEmojiList() {
    if (this.$scopedSlots.list) {
      return this.$scopedSlots.list(this);
    }

    const emojiItems = this.filteredEmojis
      .flatMap((subGroup, index) => {
        return this.genSubgroup(subGroup.title, subGroup.emojis, index);
      })
      .slice(this.startOffset, this.endOffset);

    return this.$createElement(
      "div",
      {
        staticClass: "emojify-picker__list",
        style: {
          paddingTop: `${this.currentRow * this.itemSize}px`,
          paddingBottom: `${(this.rowCount -
            this.columnItems -
            this.currentRow) *
            this.itemSize}px`,
        },
      },
      emojiItems
    );
  }

  genSubgroup(title: string, emojis: EmojiItem[], index: number) {
    if (this.$scopedSlots.subgroup) {
      return this.$scopedSlots.subgroup({ title, emojis, index });
    }
    return emojis.map((emoji, emojiIndex) =>
      this.genEmojiItem(emoji, emojiIndex)
    );
  }

  genEmojiItem(emoji: EmojiItem, index: number) {
    const selectItem = () => this.onSelectEmoji(emoji);

    if (this.$scopedSlots["emoji-item"]) {
      return this.$scopedSlots["emoji-item"]({
        emoji,
        index,
        selectItem,
      });
    }

    const itemContent =
      this.sheet.path && !this.errorImages.has(emoji.codes)
        ? this.$createElement("img", {
            staticClass: "emoji-img",
            attrs: {
              src: this.getEmojiImageUrl(emoji),
              alt: emoji.char,
              title: emoji.title,
            },
            on: {
              error: () => {
                this.errorImages.add(emoji.codes);
                this.errorImages = new Set(this.errorImages);
              },
            },
          })
        : emoji.char;

    return this.$createElement(
      "button",
      {
        staticClass: "emojify-picker__list-item",
        key: emoji.codes,
        keepAlive: true,
        on: {
          click: selectItem,
        },
      },
      [itemContent]
    );
  }

  genInputSearch() {
    return this.$createElement("div");
  }

  getGroupImageUrl(group: EmojiGroup) {
    const fileName = group.icon;
    return /^https?:\/\//.test(fileName)
      ? fileName
      : `${this.sheet.path}${fileName}`;
  }

  getEmojiImageUrl(emoji: EmojiItem) {
    const fileName = emoji.file ?? this.getFileName(emoji) + ".png";

    return /^https?:\/\//.test(fileName)
      ? fileName
      : this.sheet.path + fileName;
  }

  onSelectEmoji(emoji: EmojiItem) {
    this.$emit("select", emoji);
  }

  onSelectGroup(group: EmojiGroup, index: number) {
    this.currentGroupIndex = index;
    this.$emit("select:group", group, index);

    this.$nextTick(() => {
      if (this.$refs.scroll) {
        this.scrollTop = 0;
        this.viewWidth = this.$refs.scroll.clientWidth;
        this.viewHeight = this.$refs.scroll.clientHeight;
        this.$refs.scroll.scrollTop = 0;
      }
    });
  }

  render(h: CreateElement) {
    console.log(this.itemSize);
    return h(
      "div",
      {
        staticClass: "emojify-picker",
        class: {
          "theme-dark": this.dark,
        },
        style: {
          "--emoji-size": this.emojiSize + "px",
          "--theme-color": this.themeColor,
          "--item-gap": this.itemGap + "px",
        },
      },
      [
        this.genEmojiGroups(),
        this.genInputSearch(),
        this.$createElement(
          "div",
          {
            ref: "scroll",
            staticClass: "emojify-picker__scroll",
            key: this.currentGroupIndex,
            on: {
              scroll: () => {
                this.scrollTop = this.$refs.scroll.scrollTop;
              },
            },
          },
          [this.genEmojiList()]
        ),
      ]
    );
  }
}
