
import { readingTime } from "reading-time-estimator";
import { toString } from "mdast-util-to-string";

export function remarkReadingTime() {
  return function (tree, { data }) {
      const textOnPage = toString(tree);
    const rt = readingTime(textOnPage,230,'es');
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.readingTime = rt.text;
  };
}
