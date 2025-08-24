import remarkToc from "remark-toc";
import rehypeToc from "rehype-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkCodeTitles from "remark-code-titles";
import rehypeSlug from "rehype-slug";
import { remarkReadingTime } from "./remark-reading-time.mjs";

const customizeTOC = (toc) => {
  try {
    const { children } = toc;
    const childrenOfChildren = children?.[0]?.children;
    if (!children?.length || !childrenOfChildren?.length) return null;
  } catch (e) {}
  return {
    type: "element",
    tagName: "div",
    properties: { className: "toc" },
    children: [
      {
        type: "element",
        tagName: "p",
        properties: { className: "title mt-0" },
        children: [
          {
            type: "text",
            value: "Índice",
          },
        ],
      },
      ...(toc.children || []),
    ],
  };
};

export default {
  remarkPlugins: [remarkCodeTitles, remarkReadingTime],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "prepend" }],
  ],
};
