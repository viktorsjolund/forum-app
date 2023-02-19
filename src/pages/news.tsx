import { trpc } from "@/utils/trpc"

const News = () => {
  const { data } = trpc.useQuery(['news.latest'])
  console.log(data)
  return <h1>news</h1>
}

export default News