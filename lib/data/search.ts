import { formatQuery } from "../utils"
import { searchArticles } from "./article"
import { searchComments } from "./comment"

const searchAll = async (query: string) => {
  const formattedQuery = formatQuery(query)

  if (!formattedQuery) return { articles: [], comments: [] }

  const [articles, comments] = await Promise.all([searchArticles(formattedQuery), searchComments(formattedQuery)])

  return { articles, comments }
}