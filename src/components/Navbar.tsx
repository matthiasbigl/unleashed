import Link from "next/link";

export default function Navbar() {
    return (
        <nav
            className="flex z-10 flex-row justify-between items-center  h-16 border-b border-neutral-800 bg-gradient-to-b bg-zinc-800/30 ">
            <div className="flex flex-row items-center justify-start w-1/2 h-full px-6">
                <h1>
                    <a href="/" className="text-3xl font-semibold">Unleashed</a>
                </h1>
            </div>
            <div className="flex flex-row items-center justify-end w-1/2 h-full px-6 gap-x-5">

                <div
                    className={`flex flex-row items-center justify-center rounded-md border border-neutral-800 bg-zinc-800/30 w-24 h-10
                hover:scale-105 hover:shadow-lg hover:bg-zinc-800/50 transition duration-150 ease-in-out
                cursor-pointer
                `
                    }>
                    <a href="/register" className="text-lg font-semibold ">Register</a>
                </div>
                <Link href={'/api/auth/signin'}
                    className={
                        `flex flex-row items-center justify-center rounded-md bg-gradient-to-r from-blue-400 to-blue-600 w-24 h-10
                    hover:scale-105 hover:shadow-lg hover:from-blue-500 hover:to-blue-700 transition duration-150 ease-in-out 
                    cursor-pointer
                    font-semibold text-lg
                    `
                    }>

                     Login
                </Link>

            </div>

        </nav>

    )
}