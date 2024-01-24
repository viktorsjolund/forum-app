import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'

export const usePageQueryParam = (): [number, Dispatch<SetStateAction<number>>] => {
  const router = useRouter()
  const { page } = router.query as { page?: string }
  const [pageNr, setPageNr] = useState(page ? parseInt(page) : 1)

  return [pageNr, setPageNr] 
}
