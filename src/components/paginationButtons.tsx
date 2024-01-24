import { useRouter } from 'next/router'
import { ChangeEvent, createRef, useEffect, useMemo, useState } from 'react'
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md'
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa'
import { StyledButton } from './styledButton'
import { useOutsideClick } from '@/hooks/useOutsideClick'

type TPaginationButtonsProps = {
  handleNewPage: (newPageNr: number) => void
  postCount: number
  postLimit: number
  pageNr: number
}

export const PaginationButtons = (props: TPaginationButtonsProps) => {
  const { postCount, handleNewPage, postLimit, pageNr } = props

  const router = useRouter()
  const [showPageMenu, setShowPageMenu] = useState(false)
  const [customPageNr, setCustomPageNr] = useState(pageNr)
  const numberOfPages = useMemo(() => Math.ceil(postCount / postLimit), [postCount, postLimit])
  const { triggerRef, refArray } = useOutsideClick<any, HTMLDivElement, HTMLButtonElement>(() =>
    setShowPageMenu(false)
  )

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const searchParams = url.split('?')[1]
      handleNewPage(parseInt(new URLSearchParams(searchParams).get('page') || '1'))
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [handleNewPage, router.events])

  const handlePageBtn = async (nr: number) => {
    if (pageNr === nr) return
    await router.replace({
      query: { ...router.query, page: nr }
    })
  }

  const handleNextBtn = async () => {
    await router.replace({
      query: { ...router.query, page: pageNr + 1 }
    })
  }

  const handlePrevBtn = async () => {
    await router.replace({
      query: { ...router.query, page: pageNr - 1 }
    })
  }

  const handleGoTo = async () => {
    await router.replace({
      query: { ...router.query, page: customPageNr }
    })
  }

  const pageNumbers = () => {
    const pageNumbers: { nr: number; type?: 'dots' }[] = []
    const startPage = Math.max(1, pageNr - 2)
    const endPage = Math.min(postCount, pageNr + 2)
    const endPageNr = endPage > numberOfPages ? numberOfPages : endPage

    if (startPage !== 1) {
      pageNumbers.push({ nr: 1 })
      if (startPage - 1 !== 1) {
        pageNumbers.push({ nr: 1, type: 'dots' })
      }
    }

    for (let i = startPage; i <= endPageNr; i++) {
      pageNumbers.push({ nr: i })
    }

    if (endPageNr !== numberOfPages) {
      if (endPageNr + 1 !== numberOfPages) {
        pageNumbers.push({ nr: 1, type: 'dots' })
      }
      pageNumbers.push({ nr: numberOfPages })
    }

    if (pageNumbers.length === 0) {
      pageNumbers.push({ nr: 1 })
    }

    refArray.current = new Array(pageNumbers.length)
      .fill(null)
      .map((_, i) => refArray.current[i] || null)
    return pageNumbers
  }

  const handleCustomPageNr = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.match('^[0-9]*$')) return

    if (parseInt(e.target.value) > numberOfPages || parseInt(e.target.value) < 1) return

    setCustomPageNr(parseInt(e.target.value))
  }

  const handleSubtractPageNr = () => {
    const nr = customPageNr
    if (nr <= 1) return

    const newNr = nr - 1
    setCustomPageNr(newNr)
  }

  const handleAddPageNr = () => {
    const nr = customPageNr
    if (nr >= numberOfPages) return

    const newNr = nr + 1
    setCustomPageNr(newNr)
  }

  return (
    <div className='flex relative'>
      {pageNr > 1 && numberOfPages > 0 && (
        <div
          onClick={handlePrevBtn}
          className='bg-midnight-dark min-w-[2rem] cursor-pointer flex justify-center items-center w-fit rounded-sm border-[1px] border-slate-600 text-sm h-5 font-medium pr-2 pl-1 mr-3 hover:border-main-purple-light'
        >
          <div>
            <MdKeyboardArrowLeft size={17} />
          </div>
          <span>PREV</span>
        </div>
      )}
      {pageNumbers().map((pn, i) => {
        if (pn.type === 'dots') {
          return (
            <button
              key={i}
              className='min-w-[2rem] w-fit rounded-sm border-[1px] flex justify-center items-center bg-midnight-dark hover:border-main-purple-light border-slate-600 text-sm h-5 font-medium'
              onClick={() => setShowPageMenu((s) => !s)}
              ref={(el) => (refArray.current[i] = el)}
            >
              ...
            </button>
          )
        } else {
          return (
            <button
              key={i}
              className={`min-w-[2rem] w-fit rounded-sm border-[1px] flex justify-center items-center border-slate-600 text-sm h-5 font-medium ${
                pageNr === pn.nr
                  ? 'border-main-purple bg-main-purple-dark font-bold cursor-default'
                  : 'bg-midnight-dark hover:border-main-purple-light'
              }`}
              onClick={() => handlePageBtn(pn.nr)}
            >
              {pn.nr}
            </button>
          )
        }
      })}
      {numberOfPages !== pageNr && numberOfPages > 0 && (
        <div
          onClick={handleNextBtn}
          className='bg-midnight-dark min-w-[2rem] cursor-pointer flex justify-center items-center w-fit rounded-sm border-[1px] border-slate-600 text-sm h-5 font-medium pr-1 pl-2 ml-3 hover:border-main-purple-light'
        >
          <span>NEXT</span>
          <div>
            <MdKeyboardArrowRight size={17} />
          </div>
        </div>
      )}
      {showPageMenu && (
        <div
          className='flex absolute flex-col left-32 top-6 w-32 h-fit bg-midnight-dark justify-center items-center rounded border-2 border-slate-800 pb-1 z-50'
          ref={triggerRef}
        >
          <span className='w-full text-center border-b-[1px] border-slate-700 h-8 leading-8'>
            Go to page
          </span>
          <div
            id='page-menu-2'
            className='flex justify-center items-center pt-2'
          >
            <div
              className='cursor-pointer pr-1'
              onClick={handleSubtractPageNr}
            >
              <FaMinusCircle
                size={12}
                className='pointer-events-none'
              />
            </div>
            <input
              className='bg-midnight-light w-6 text-sm pl-1 pr-1 rounded'
              value={customPageNr}
              onChange={handleCustomPageNr}
            />
            <div
              className='cursor-pointer pl-1'
              onClick={handleAddPageNr}
            >
              <FaPlusCircle
                size={12}
                className='pointer-events-none'
              />
            </div>
          </div>
          <div className='w-full h-6 flex'>
            <div
              className='w-8 h-5 text-sm ml-auto mr-2 mt-1'
              onClick={handleGoTo}
            >
              <StyledButton type='button'>GO</StyledButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
