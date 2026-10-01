import { Fragment, type ReactNode } from "react";

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\n+/);
  const nodes: ReactNode[] = [];
  let list: string[] = [];

  function flush(key: string) {
    if (!list.length) return;
    nodes.push(
      <ul key={key} className="list-disc space-y-2 pl-5 text-ink/85">
        {list.map((item) => (
          <li key={item}>{inline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  }

  blocks.forEach((block, index) => {
    const lines = block.split("\n");
    if (lines.every((line) => line.startsWith("- "))) {
      list.push(...lines.map((line) => line.slice(2)));
      flush(`list-${index}`);
      return;
    }
    flush(`before-${index}`);
    if (block.startsWith("## ")) {
      nodes.push(
        <h2 key={index} className="mt-10 font-serif text-3xl text-ink md:text-4xl">
          {block.slice(3)}
        </h2>,
      );
      return;
    }
    nodes.push(
      <p key={index} className="text-ink/85">
        {inline(block)}
      </p>,
    );
  });

  return <div className="space-y-5">{nodes}</div>;
}
