import { ContentBlock } from "draft-js";

export default function blockStyleFn(contentBlock: ContentBlock) {
  const type = contentBlock.getType();

  switch (type) {
    case "header-one":
      return "text-2xl font-bold";
    case "header-two":
      return "text-2xl font-semibold";
    case "header-three":
      return "text-xl font-semibold";
    case "blockquote":
      return "font-bold";
    case "unstyled":
      return "font-light";

  }

  return "";
}
