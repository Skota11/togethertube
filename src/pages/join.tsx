import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArrowRightToBracket, faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { useState } from "react";

export default function Home() {
    const [query, setQuery] = useState("");
    return (
        <main className='max-w-screen-lg m-auto p-4'>
            <h1 className='text-lg mb-8'><FontAwesomeIcon icon={faArrowRightToBracket} className='mr-2' />部屋に参加する</h1>
            <div className='flex place-content-center my-4 h-4/5'>
                <div>
                    <input onChange={(e: any) => { setQuery(e.target.value) }} className='mr-4 p-2 rounded-md border-2 outline-0' type="text" placeholder='部屋名' />
                    <Link href={`/play/${query}`} className='p-2 rounded-lg bg-gray-800 text-white'>参加する</Link>
                </div>
            </div>
        </main>
    )
}
