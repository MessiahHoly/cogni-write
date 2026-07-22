import { verifyRouteAuth } from "@/lib/auth/server"
import {
  // attemptGeneration,
  fetchFirstComment, fetchLatestCommentByUserId, fetchNewerCommentsByOtherUsers, generateAndSaveComment
} from "@/lib/data/comment"
import { fetchOrCreateCogni } from "@/lib/data/user"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export const handleCommentGeneration = async (request: Request) => {
  const authFailed = verifyRouteAuth(request)
  if (authFailed) return authFailed

  //TODO: check if {data: {data|error}|error} should be returned. Same for article route. 

  const { data, error } = await fetchOrCreateCogni()
  if (!data) return NextResponse.json({ error })
  // if (!data) return { error }

  const [latestCommentByCogni, firstComment] = await Promise.all([fetchLatestCommentByUserId(data.id), fetchFirstComment()])

  const date = latestCommentByCogni ? latestCommentByCogni.createdAt : firstComment?.createdAt

  if (!date) return NextResponse.json({ error: "No existing comment." })
  // if (!date) return { error: "No existing comment." }

  const comments = await fetchNewerCommentsByOtherUsers(data.id)(date)

  const results = await Promise.all(
    comments.map(async comment => {
      const result = await generateAndSaveComment(comment)

      if ('error' in result) {
        return { error: result.error || 'Unknown error occurred.' }
      } else {
        revalidatePath(`/${comment.article.contentEngine.slug}/${comment.article.id}`)
        return { data: result.data }
      }
    })
  )

  return NextResponse.json(results)



  // const attemptGenerationWithsystemInstruction = attemptGeneration('')

  // const commentsByCogni = comments.map(async comment => {
  //   const attemptGenerationWithComment = attemptGenerationWithsystemInstruction(comment)

  //   type PipelineResult = Awaited<ReturnType<typeof attemptGenerationWithComment>>
  //   const initialAccumulator = Promise.resolve<PipelineResult>({ error: 'No attempts made yet.' })

  //   const commentsByCogni = await MODELS_FALLBACK_CHAIN.reduce(async (accumulatorPromise, model) => {
  //     const resolvedAccumulator = await accumulatorPromise

  //     if ('data' in resolvedAccumulator) {
  //       return resolvedAccumulator
  //     }

  //     return attemptGenerationWithComment(model)
  //   }, initialAccumulator)

  //   return commentsByCogni
  // })

  // return commentsByCogni

  // const attemptGenerationWithComments = comments.map(comment => attemptGenerationWithsystemInstruction(comment))
  // const generated = MODELS_FALLBACK_CHAIN.reduce(async (accumulatorPromise, model) => {
  //   const resolvedAccumulator = await accumulatorPromise


  // }, { error: 'No attempts made yet.' })

  // type PipelineResult = Awaited<ReturnType<typeof attemptGenerationWithsystemInstruction>>

  // const initialAccumulator = Promise.resolve<PipelineResult>({ error: 'No attempts made yet.' })

  // const commentsByCogni = comments.map(comment => {
  //   const attemtGenerationWithComment = attemptGenerationWithsystemInstruction(comment)
  //   const generated = MODELS_FALLBACK_CHAIN.reduce(async (accumulatorPromise, model) => {
  //     const resolvedAccumulator = await accumulatorPromise

  //     if ('data' in resolvedAccumulator) {
  //       return resolvedAccumulator
  //     }

  //     return attemtGenerationWithComment(model)
  //   },)
  // })
}