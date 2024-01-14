/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/login',
        has: [
          {
            type: 'cookie',
            key: 'token'
          }
        ],
        permanent: false,
        destination: '/'
      }
    ]
  }
}

module.exports = nextConfig
