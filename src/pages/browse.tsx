import { Header } from '@/components/header'
import { MinifiedPost } from '@/components/minifiedPost'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
const LIMIT = 20

type TPaginationButtonsProps = {
  pageNr: number
  handlePageBtn: (nr: number) => void
  handleNextBtn: () => Promise<void>
  handlePrevBtn: () => Promise<void>
  numberOfPages: number
  postCount: number
}

const PagnationButtons = (props: TPaginationButtonsProps) => {
  const { pageNr, handlePageBtn, numberOfPages, postCount, handleNextBtn, handlePrevBtn } = props

  const pageNumbers = () => {
    const pageNumbers = []
    const startPage = Math.max(1, pageNr - 2)
    const endPage = Math.min(postCount, pageNr + 2)
    const endPageNr = endPage > numberOfPages ? numberOfPages : endPage

    if (startPage !== 1) {
      pageNumbers.push(1)
    }

    for (let i = startPage; i <= endPageNr; i++) {
      pageNumbers.push(i)
    }

    if (endPageNr !== numberOfPages) {
      pageNumbers.push(numberOfPages)
    }

    if (pageNumbers.length === 0) {
      pageNumbers.push(1)
    }

    return pageNumbers
  }

  return (
    <div className='flex'>
      {pageNr > 1 && (
        <button
          onClick={handlePrevBtn}
          className='bg-midnight-dark min-w-[2rem] flex justify-center items-center w-fit rounded-sm border-[1px] border-slate-600 text-sm h-5 font-medium pr-2 pl-2 mr-3 hover:border-main-purple-light'
        >
          PREV
        </button>
      )}
      {pageNumbers().map((nr, i) => (
        <button
          key={i}
          className={`min-w-[2rem] w-fit rounded-sm border-[1px] flex justify-center items-center border-slate-600 text-sm h-5 font-medium ${
            pageNr === nr
              ? 'border-main-purple bg-main-purple-dark font-bold cursor-default'
              : 'bg-midnight-dark hover:border-main-purple-light'
          }`}
          onClick={() => handlePageBtn(nr)}
        >
          {nr}
        </button>
      ))}
      {numberOfPages !== pageNr && (
        <button
          onClick={handleNextBtn}
          className='bg-midnight-dark min-w-[2rem] flex justify-center items-center w-fit rounded-sm border-[1px] border-slate-600 text-sm h-5 font-medium pr-2 pl-2 ml-3 hover:border-main-purple-light'
        >
          NEXT
        </button>
      )}
    </div>
  )
}

const Browse = () => {
  const router = useRouter()
  const { sort, page } = router.query as { sort?: string; page?: string }
  let pageNr = page ? parseInt(page) : 1
  if (isNaN(pageNr)) {
    pageNr = 1
  } else if (pageNr < 1) {
    pageNr = 1
  }

  const [posts, setPosts] = useState<any[]>([])
  const [isInitialFetch, setIsIntitialFetch] = useState(true)
  const { data: topPosts, refetch: topPostsRefetch } = trpc.useQuery(
    ['post.allByLikes', { skip: (pageNr - 1) * LIMIT, take: LIMIT }],
    { enabled: false }
  )
  const { data: newPosts, refetch: newPostsRefetch } = trpc.useQuery(
    ['post.allByNew', { skip: (pageNr - 1) * LIMIT, take: LIMIT }],
    { enabled: false }
  )
  const { data: postCount } = trpc.useQuery(['post.count'])
  const numberOfPages = useMemo(() => Math.ceil((postCount || 1) / LIMIT), [postCount])

  useEffect(() => {
    if (topPosts && sort === 'top') {
      setPosts([...topPosts])
    } else if (newPosts && (sort === 'new' || !sort)) {
      setPosts([...newPosts])
    }

    if (pageNr > numberOfPages) {
      router.replace({
        query: { ...router.query, page: '1' }
      })
    }

    if (isInitialFetch && pageNr <= numberOfPages) {
      switch (sort) {
        case 'top':
          topPostsRefetch()
          break
        case 'new':
          newPostsRefetch()
          break
        default:
          newPostsRefetch()
          break
      }
      setIsIntitialFetch(false)
    }
  }, [sort, newPosts, topPosts, isInitialFetch, topPostsRefetch, newPostsRefetch, numberOfPages, pageNr, router])

  const handleSortTop = async () => {
    if (sort === 'top') return
    await router.replace({
      query: { ...router.query, sort: 'top', page: '1' }
    })
    topPostsRefetch()
  }

  const handleSortNew = async () => {
    if (sort === 'new') return
    await router.replace({
      query: { ...router.query, sort: 'new', page: '1' }
    })
    newPostsRefetch()
  }

  const handlePageBtn = async (nr: number) => {
    if (pageNr === nr) return
    await router.replace({
      query: { ...router.query, page: nr }
    })
    switch (sort) {
      case 'top':
        topPostsRefetch()
        break
      case 'new':
        newPostsRefetch()
        break
      default:
        newPostsRefetch()
        break
    }
  }

  const handleNextBtn = async () => {
    await router.replace({
      query: { ...router.query, page: ++pageNr }
    })
    switch (sort) {
      case 'top':
        topPostsRefetch()
        break
      case 'new':
        newPostsRefetch()
        break
      default:
        newPostsRefetch()
        break
    }
  }

  const handlePrevBtn = async () => {
    await router.replace({
      query: { ...router.query, page: --pageNr }
    })
    switch (sort) {
      case 'top':
        topPostsRefetch()
        break
      case 'new':
        newPostsRefetch()
        break
      default:
        newPostsRefetch()
        break
    }
  }

  return (
    <>
      <Header />
      <div className='flex justify-center h-max min-h-full bg-gradient-to-tr from-main-purple-light to-main-purple via-main-purple-dark'>
        <div className='w-4/5 bg-[#212529] p-4 min-h-[100vh] h-fit'>
          <div className='mb-4'>
            <PagnationButtons
              handlePageBtn={handlePageBtn}
              handleNextBtn={handleNextBtn}
              handlePrevBtn={handlePrevBtn}
              numberOfPages={numberOfPages}
              pageNr={pageNr}
              postCount={postCount || 1}
            />
          </div>
          <div className='flex mb-4'>
            <button
              onClick={handleSortNew}
              className='flex transition-colors justify-center items-center w-14 h-6 rounded-md bg-main-purple hover:bg-main-purple-dark font-medium text-sm'
            >
              NEW
            </button>
            <button
              onClick={handleSortTop}
              className='flex transition-colors justify-center items-center ml-2 w-14 h-6 rounded-md bg-main-purple hover:bg-main-purple-dark font-medium text-sm'
            >
              TOP
            </button>
          </div>
          {posts?.map((post) => (
            <div
              key={post.id}
              className='mb-2'
            >
              <MinifiedPost post={post} />
            </div>
          ))}
          <div className={`${posts.length < LIMIT ? 'mt-24' : 'mt-4'}`}>
            <PagnationButtons
              handlePageBtn={handlePageBtn}
              handleNextBtn={handleNextBtn}
              handlePrevBtn={handlePrevBtn}
              numberOfPages={numberOfPages}
              pageNr={pageNr}
              postCount={postCount || 1}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Browse
