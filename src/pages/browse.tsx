import { Header } from '@/components/header'
import { MinifiedPost } from '@/components/minifiedPost'
import { PaginationButtons } from '@/components/paginationButtons'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { VscLoading } from 'react-icons/vsc'
const POST_LIMIT = 2 as const

const Browse = () => {
  const router = useRouter()
  const { sort, page, q } = router.query as { sort?: string; page?: string; q?: string }
  let pageNr = page ? parseInt(page) : 1
  if (isNaN(pageNr)) {
    pageNr = 1
  } else if (pageNr < 1) {
    pageNr = 1
  }

  const [posts, setPosts] = useState<any[]>([])
  const [isInitialFetch, setIsIntitialFetch] = useState(true)
  const [search, setSearch] = useState('')
  const { data: topPosts, refetch: topPostsRefetch } = trpc.useQuery(
    ['post.allByLikes', { skip: (pageNr - 1) * POST_LIMIT, take: POST_LIMIT }],
    { enabled: false }
  )
  const { data: newPosts, refetch: newPostsRefetch } = trpc.useQuery(
    ['post.allByNew', { skip: (pageNr - 1) * POST_LIMIT, take: POST_LIMIT }],
    { enabled: false }
  )
  const {
    data: searchedPosts,
    refetch: searchedPostsRefetch,
    isLoading: searchIsLoading
  } = trpc.useQuery(
    [
      'search.posts',
      { skip: (pageNr - 1) * POST_LIMIT, take: POST_LIMIT, search: decodeURIComponent(q || '') }
    ],
    { enabled: false }
  )
  const { data: postCount } = trpc.useQuery(['post.count'])
  const { data: searchPostCount, refetch: searchPostCountRefetch } = trpc.useQuery(
    ['search.postCount', { search: decodeURIComponent(q || '') }],
    { enabled: false }
  )
  const numberOfPages = useMemo(() => {
    if (typeof searchPostCount !== undefined && q) {
      return Math.ceil((searchPostCount || 1) / POST_LIMIT)
    } else {
      return Math.ceil((postCount || 1) / POST_LIMIT)
    }
  }, [postCount, searchPostCount, q])

  useEffect(() => {
    if (searchedPosts && q) {
      setPosts([...searchedPosts])
    } else if (topPosts && sort === 'top') {
      setPosts([...topPosts])
    } else if (newPosts && (sort === 'new' || !sort)) {
      setPosts([...newPosts])
    }

    if (isInitialFetch) {
      if (q) {
        searchedPostsRefetch()
        searchPostCountRefetch()
      } else if (pageNr <= numberOfPages) {
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
      setIsIntitialFetch(false)
    }
  }, [
    sort,
    newPosts,
    topPosts,
    isInitialFetch,
    topPostsRefetch,
    newPostsRefetch,
    numberOfPages,
    pageNr,
    router,
    searchedPosts,
    searchedPostsRefetch,
    q,
    searchPostCountRefetch
  ])

  const handleSortTop = async () => {
    if (sort === 'top' && !q) return
    await router.replace({
      query: { sort: 'top', page: '1' }
    })
    topPostsRefetch()
  }

  const handleSortNew = async () => {
    if (sort === 'new' && !q) return
    await router.replace({
      query: { sort: 'new', page: '1' }
    })
    newPostsRefetch()
  }

  const handleNewPage = async () => {
    if (q) {
      searchedPostsRefetch()
      return
    }

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

  const handleSearch = async (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== 'Enter') return
    if (!search) return

    await router.replace({
      query: { q: encodeURIComponent(search), page: '1' }
    })

    searchedPostsRefetch()
    searchPostCountRefetch()
  }

  return (
    <>
      <Header />
      <div className='flex justify-center h-max min-h-full bg-gradient-to-tr from-main-purple-light to-main-purple via-main-purple-dark'>
        <div className='w-4/5 bg-[#212529] p-4 min-h-[100vh] h-fit'>
          <div className='mb-4'>
            <PaginationButtons
              handleNewPage={handleNewPage}
              numberOfPages={numberOfPages}
              pageNr={pageNr}
              postCount={postCount || 1}
            />
          </div>
          <div className='flex mb-4'>
            <button
              onClick={handleSortNew}
              className={`flex transition-colors justify-center items-center w-14 h-6 rounded-md bg-main-purple font-medium text-sm ${
                sort === 'new' ? 'border-2 cursor-default' : 'hover:bg-main-purple-dark'
              }`}
            >
              NEW
            </button>
            <button
              onClick={handleSortTop}
              className={`flex transition-colors justify-center items-center ml-2 w-14 h-6 rounded-md bg-main-purple font-medium text-sm ${
                sort === 'top' ? 'border-2 cursor-default' : 'hover:bg-main-purple-dark'
              }`}
            >
              TOP
            </button>
            <div className='ml-auto flex items-center bg-midnight-dark rounded border-[1px] pr-1 pl-1 border-slate-700'>
              <div className='pl-2 pr-2'>
                <FaSearch />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='bg-midnight-dark pr-2 pt-2 pb-2'
                onKeyDown={handleSearch}
              />
              <div
                onClick={() => handleSearch()}
                className='flex transition-colors justify-center items-center w-20 h-4/5 rounded cursor-pointer pr-2 pl-2 bg-main-purple font-medium text-sm hover:bg-main-purple-dark'
              >
                {searchIsLoading ? (
                  <VscLoading
                    size={20}
                    className='animate-spin'
                  />
                ) : (
                  'SEARCH'
                )}
              </div>
            </div>
          </div>
          <div className='bg-midnight-light rounded p-1 min-h-[5rem]'>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className='mb-2 last:mb-0'
                >
                  <MinifiedPost post={post} />
                </div>
              ))
            ) : (
              <div className='text-center w-full leading-[5rem]'>
                <span>No results found.</span>
              </div>
            )}
          </div>
          <div className={`${posts.length < POST_LIMIT ? 'mt-24' : 'mt-4'}`}>
            <PaginationButtons
              handleNewPage={handleNewPage}
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
