import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import styles from './index.module.css'

const IndexPage = () => {
  fetch('/api/v1/todos')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(e => console.log(e))


  return (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1 className={styles.red}>Hello Next.js 👋</h1>
    <div>test</div>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
  )
}

export default IndexPage