'use client'

import classNames from 'classnames';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { AiFillBug } from "react-icons/ai";


const NavBar = () => {

    const currentPath = usePathname();

    const links = [
        { href: '/', label: 'Dashboard' },
        { href: '/issues', label: 'Issues' },
    ]

    return (
        <nav className='flex space-x-6 px-5 border-b mb-5 h-14 items-center'>
            <Link href="/"><AiFillBug /></Link>
            <ul className='flex space-x-6'>
                {links.map(link =>
                    <Link
                        key={link.href}
                        className={classNames({
                            'text-zinc-900': currentPath === link.href,
                            'text-zinc-500': currentPath !== link.href,
                            'hover:text-zinc-800 transition-colors': true,
                        }
                        )}
                        href={link.href} >{link.label}</Link>
                )}

            </ul>
        </nav>
    )
}

export default NavBar