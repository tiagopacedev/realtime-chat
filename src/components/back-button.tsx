'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type BackButtonProps = {
  href?: string
}

export default function BackButton({ href = '/' }: BackButtonProps) {
  return (
    <Link href={href} className="md:hidden">
      <Button size="icon" variant="ghost">
        <ArrowLeft />
      </Button>
    </Link>
  )
}
