import sanitizeHtml from 'sanitize-html';

// Tags allowed in user-written rich text. Everything else (scripts, iframes, styles...) is stripped.
const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
    allowedTags: [
        'p',
        'br',
        'b',
        'strong',
        'i',
        'em',
        'u',
        's',
        'ul',
        'ol',
        'li',
        'a',
        'h1',
        'h2',
        'h3',
        'blockquote',
        'code',
        'pre',
    ],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto'],
};

// Returns safe HTML, or null if there is no visible text left (e.g. "<p></p>").
export function sanitizeRichText(html: string | null): string | null
{
    if (!html)
    {
        return null;
    }
    const clean = sanitizeHtml(html, RICH_TEXT_OPTIONS);
    const text = sanitizeHtml(clean, { allowedTags: [], allowedAttributes: {} }).trim();
    return text ? clean : null;
}
