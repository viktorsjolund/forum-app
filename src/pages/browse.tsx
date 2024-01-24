import { Header } from '@/components/header'
import { MinifiedPost } from '@/components/minifiedPost'
import { PaginationButtons } from '@/components/paginationButtons'
import { usePageQueryParam } from '@/hooks/usePageQueryParam'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { VscLoading } from 'react-icons/vsc'
const POST_LIMIT = 15 as const

const Browse = () => {
  const router = useRouter()
  const { sort, q } = router.query as { sort?: string; q?: string }

  const [pageNr, setPageNr] = usePageQueryParam()
  const [posts, setPosts] = useState<any[]>([])
  const [isInitialFetch, setIsIntitialFetch] = useState(true)
  const [search, setSearch] = useState('')
  const [searchIsLoading, setSearchIsLoading] = useState(false)
  const [queryEnable, setQueryEnable] = useState({
    topEnabled: false,
    newEnabled: false,
    searchedEnabled: false,
    searchedCountEnabled: false
  })
  const { data: topPosts, refetch: topPostsRefetch } = trpc.post.allByLikes.useQuery(
    { skip: (pageNr - 1) * POST_LIMIT, take: POST_LIMIT },
    { enabled: queryEnable.topEnabled }
  )
  const { data: newPosts, refetch: newPostsRefetch } = trpc.post.allByNew.useQuery(
    { skip: (pageNr - 1) * POST_LIMIT, take: POST_LIMIT },
    { enabled: queryEnable.newEnabled }
  )
  const { data: searchedPosts, refetch: searchedPostsRefetch } = trpc.search.posts.useQuery(
    { skip: (pageNr - 1) * POST_LIMIT, take: POST_LIMIT, search: decodeURIComponent(q || '') },
    { enabled: queryEnable.searchedEnabled }
  )
  const { data: postCount } = trpc.post.count.useQuery()
  const { data: searchPostCount, refetch: searchPostCountRefetch } = trpc.search.postCount.useQuery(
    { search: decodeURIComponent(q || '') },
    { enabled: queryEnable.searchedCountEnabled }
  )

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
      } else {
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
    isInitialFetch,
    newPostsRefetch,
    q,
    searchPostCount,
    searchPostCountRefetch,
    topPosts,
    topPostsRefetch,
    searchedPosts,
    searchedPostsRefetch
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

  const handleNewPage = async (newPageNr: number) => {
    setPageNr(newPageNr)

    if (q) {
      setQueryEnable(() => ({
        newEnabled: false,
        searchedCountEnabled: true,
        searchedEnabled: true,
        topEnabled: false
      }))
      return
    }

    switch (sort) {
      case 'top':
        setQueryEnable(() => ({
          newEnabled: false,
          searchedCountEnabled: false,
          searchedEnabled: false,
          topEnabled: true
        }))
        break
      case 'new':
        setQueryEnable(() => ({
          newEnabled: true,
          searchedCountEnabled: false,
          searchedEnabled: false,
          topEnabled: false
        }))
        break
      default:
        setQueryEnable(() => ({
          newEnabled: true,
          searchedCountEnabled: false,
          searchedEnabled: false,
          topEnabled: false
        }))
        break
    }
  }

  const handleSearch = async (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== 'Enter') return
    if (!search) return

    setSearchIsLoading(true)
    await router.replace({
      query: { q: encodeURIComponent(search), page: '1' }
    })

    await searchedPostsRefetch()
    await searchPostCountRefetch()
    setSearchIsLoading(false)
  }

  const getPostCount = () => {
    if (q && typeof searchPostCount !== 'undefined') {
      return searchPostCount
    } else if (typeof postCount !== 'undefined') {
      return postCount
    } else {
      return 0
    }
  }

  return (
    <>
      <Header />
      <div className='flex justify-center h-max min-h-full bg-gradient-to-tr from-main-purple-light to-main-purple via-main-purple-dark'>
        <div className='w-4/5 bg-[#212529] p-4 min-h-[100vh] h-fit'>
          <div className='mb-4'>
            {getPostCount() > 0 && (
              <PaginationButtons
                handleNewPage={handleNewPage}
                pageNr={pageNr}
                postCount={getPostCount()}
                postLimit={POST_LIMIT}
              />
            )}
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
          <div className='bg-midnight-light rounded p-2 min-h-[5rem] border-[1px] border-midnight-lighter'>
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
            {getPostCount() > 0 && false && (
              <PaginationButtons
                handleNewPage={handleNewPage}
                pageNr={pageNr}
                postCount={getPostCount()}
                postLimit={POST_LIMIT}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Browse
