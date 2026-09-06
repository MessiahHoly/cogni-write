'use client'

import { highlightText } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Children, cloneElement, isValidElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// const hasChildren = (props: unknown): props is { children: ReactNode } => {
//   return typeof props === "object" && props !== null && "children" in props
//     && (props as { children: Record<string, unknown> }).children !== undefined;
// }

const highlightChildren = (node: ReactNode, query: string): ReactNode => {
  if (typeof node === "string") {
    return highlightText(node, query)
  }

  if (Array.isArray(node)) {
    return Children.map(node, child => highlightChildren(child, query))
  }

  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children) {
    return cloneElement(node, {
      ...node.props,
      children: highlightChildren(node.props.children, query)
    })
  }

  return node
}

export default function ArticleBody({ bodyMarkdown }: { bodyMarkdown: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
      // text({ children }) {
      //   if (typeof children === "string") {
      //     return <>{highlightText(children, query)}</>
      //   }
      //   return <>{children}</>
      // }
      p:({ children }) => <p>{highlightChildren(children, query)}</p>,
      h1:({ children }) => <h1>{highlightChildren(children, query)}</h1>,
      h2:({ children }) => <h2>{highlightChildren(children, query)}</h2>,
      h3:({ children }) => <h3>{highlightChildren(children, query)}</h3>,
      h4:({ children }) => <h4>{highlightChildren(children, query)}</h4>,
      h5:({ children }) => <h5>{highlightChildren(children, query)}</h5>,
      h6:({ children }) => <h6>{highlightChildren(children, query)}</h6>,
      li:({ children }) => <li>{highlightChildren(children, query)}</li>,
      blockquote:({ children }) => <blockquote>{highlightChildren(children, query)}</blockquote>,
    }}>
      {bodyMarkdown}
    </ReactMarkdown >
  )
}