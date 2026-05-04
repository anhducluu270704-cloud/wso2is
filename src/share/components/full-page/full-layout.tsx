export default function FullPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-1 justify-center items-start mt-[85px] md:mt-16 py-16 bg-grey-11 overflow-hidden">
      {children}
    </div>
  )
}
