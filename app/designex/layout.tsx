export default function DesignExLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Pretendard 폰트 CDN */}
      <link
        rel="stylesheet"
        as="style"
        crossOrigin="anonymous"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
      />
      {children}
    </>
  )
}
