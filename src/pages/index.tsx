import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArrowRightToBracket, faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

export default function Home() {
  return (
    <main className='max-w-screen-lg m-auto p-4'>
      <h1 className='text-lg mb-8'><FontAwesomeIcon icon={faArrowRightToBracket} className='mr-2' />部屋に参加する</h1>
      <Link href="join" className='my-8 rounded-full border-2 p-4 text-lg border-current' ><FontAwesomeIcon icon={faArrowRightToBracket} className='mr-2' />部屋に参加する</Link>
    </main>
  )
}
