import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders a card field. Short reads are plain text; long reads are markdown with figures. */
export function Prose({ text, long }: { text: string; long: boolean }) {
  if (!long) return <div className="body">{text}</div>;
  return (
    <div className="body long">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt, title }) => (
            <figure>
              <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" />
              {(title || alt) && <figcaption>{(title ?? alt ?? "").toUpperCase()}</figcaption>}
            </figure>
          ),
          p: ({ children, node }) => {
            // Unwrap a paragraph that only holds an image so <figure> isn't inside <p>.
            const only = node?.children?.length === 1 && (node.children[0] as { tagName?: string }).tagName === "img";
            return only ? <>{children}</> : <p>{children}</p>;
          },
          a: ({ href, children }) => <a href={href} target={href?.startsWith("/") ? undefined : "_blank"} rel="noreferrer">{children}</a>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
