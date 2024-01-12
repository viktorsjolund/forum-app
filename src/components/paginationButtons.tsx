import { useRouter } from 'next/router'
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md'

type TPaginationButtonsProps = {
  pageNr: number
  handleNewPage: () => void
  numberOfPages: number
  postCount: number
}

export const PaginationButtons = (props: TPaginationButtonsProps) => {
  const router = useRouter()
  const { numberOfPages, postCount, handleNewPage, pageNr } = props

  const handlePageBtn = async (nr: number) => {
    if (pageNr === nr) return
    await router.replace({
      query: { ...router.query, page: nr }
    })

    handleNewPage()
  }

  const handleNextBtn = async () => {
    await router.replace({
      query: { ...router.query, page: pageNr + 1 }
    })

    handleNewPage()
  }

  const handlePrevBtn = async () => {
    await router.replace({
      query: { ...router.query, page: pageNr - 1 }
    })

    handleNewPage()
  }

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
    </div>
  )
}
