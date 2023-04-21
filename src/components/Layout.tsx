import Navbar from './Navbar'


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main
              className="flex flex-col items-center justify-start w-full h-full min-h-screen
              p-4
              "
            >{children}
            </main>
        </>
    )
}