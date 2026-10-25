import ReactMarkdown, { type Components } from "react-markdown";

// react-markdown never renders raw HTML from the model, so its output is safe to display.
const components: Components = {
    h1: ({ children }) => <h3 className="text-lg font-semibold mt-5 mb-2 first:mt-0">{children}</h3>,
    h2: ({ children }) => <h3 className="text-lg font-semibold mt-5 mb-2 first:mt-0">{children}</h3>,
    h3: ({ children }) => <h4 className="text-base font-semibold mt-4 mb-2 first:mt-0">{children}</h4>,
    p: ({ children }) => <p className="text-sm sm:text-base leading-relaxed mb-3 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-3 text-sm sm:text-base">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-3 text-sm sm:text-base">{children}</ol>,
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    a: ({ children, href }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 underline">
            {children}
        </a>
    ),
};

export default function AiMarkdown({ content }: { content: string }) {
    return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}
