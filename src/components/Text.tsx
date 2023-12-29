import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import React from "react";

export default function Text({ values }: { values: any }) {
  if (!values) {
    return null;
  }
  const textBlocks = values.rich_text as RichTextItemResponse[];

  return textBlocks.map((block) => {
    const { bold, code, color, italic, strikethrough, underline } =
      block.annotations;
    return (
      <span
        key={block.plain_text}
        className={[
          bold ? "font-bold" : "",
          code ? "text-red-500 bg-gray-200" : "text-gray-700",
          italic ? "italic" : "",
          strikethrough ? "line-through" : "",
          underline ? "underline" : "",
        ].join(" ")}
        style={color !== "default" ? { color } : {}}
      >
        {block.plain_text}
      </span>
    );
  });
}
