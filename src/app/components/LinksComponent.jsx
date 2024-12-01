'use client'
import Link from "next/link";

export default function LinksComponent({link}) {
    return <div>
        <Link href={link}>перейти по ссылке {link}</Link>
    </div>
}