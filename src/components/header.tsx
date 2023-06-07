import Link from "next/link";

export default function Main() {
    return <>
        <div className="w-full bg-slate-900">
            <div className="max-w-screen-lg text-white px-4 py-6 m-auto gap-x-8 flex">
                <h1 className="text-xl text-white">TogetherYoutube</h1>
                <p className="text-white underline"><Link href="/">Home</Link></p>
                <div>
                    <ul className="flex gap-x-4">
                        <li><Link className="text-white border-2 border-white rounded-full text-sm p-2" href="join">部屋に参加</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    </>
}