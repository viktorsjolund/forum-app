import { Button } from '@mui/material'
import Link from 'next/link'

const Home = () => {
  return (
    <div>
      <Link href={`/view-post/${encodeURIComponent(1)}`}>
        <a>
          <Button>
            Post
          </Button>
        </a>
      </Link>
    </div>
  )
}

export default Home
