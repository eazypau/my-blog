// components
import Text from "./Text";
// lib
import {
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

/**
 * List of components to render
 * - text (paragraph, headings)
 * - list (ordered and non ordered)
 * - divider
 * - image
 * - code block
 * - videos
 * - link preview
 * - quote
 * @returns Component
 */
export default function renderBlock({ block }: { block: any }) {
  const { type, id } = block;

  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p key={id}>
          <Text values={value} />
        </p>
      );
    case "heading_1":
      return (
        <h1 key={id} className="blog-heading-1">
          <Text values={value} />
        </h1>
      );
    case "heading_2":
      return (
        <h2 key={id} className="blog-heading-2">
          <Text values={value} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 key={id} className="blog-heading-3">
          <Text values={value} />
        </h3>
      );
    case "bulleted_list":
      return (
        <ul key={id} className="list-disc list-outside pl-7">
          {block.children.map((item: BulletedListItemBlockObjectResponse) => {
            return (
              <li key={item.id}>
                <Text values={item.bulleted_list_item} />
              </li>
            );
          })}
        </ul>
      );
    case "numbered_list":
      return (
        <ol key={id} className="list-decimal list-outside pl-7">
          {block.children.map((item: NumberedListItemBlockObjectResponse) => {
            return (
              <li key={item.id}>
                <Text values={item.numbered_list_item} />
              </li>
            );
          })}
        </ol>
      );
    case "divider":
      return <hr key={id} />;
    case "code":
      return (
        <pre key={id} className="code-block">
          <code>{value.rich_text[0].plain_text}</code>
        </pre>
      );
    case "bookmark":
      return (
        <a
          key={id}
          href={value.url}
          rel="noreferrer noopener"
          className="resource-link"
        >
          {value.url}
        </a>
      );
    case "image":
      const src =
        value.type === "external" ? value.external.url : value.file?.url;
      const caption = value.caption.length ? value.caption[0].plain_text : "";
      return (
        <figure key={id}>
          <img src={src} alt={caption} loading="lazy" />
        </figure>
      );
    case "video":
      return <video key={id} src={block.external.url}></video>;
    default:
      break;
  }
}
