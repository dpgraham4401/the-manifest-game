import DOMPurify from 'dompurify';

interface HelpContentProps {
  html?: Node | string;
}

/**
 * Renders the textual help content
 * @constructor
 */
export const HtmlHelp = ({ html }: HelpContentProps) => {
  if (!html) return <p>Content is unavailable.</p>;

  return (
    <div
      className="text-black"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    ></div>
  );
};
