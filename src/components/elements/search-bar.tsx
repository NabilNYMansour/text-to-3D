"use client"

import { FormEvent, useState } from "react"
import { Search } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"


export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    // Implement your search logic here
    console.log("Searching for:", searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center focus-within:ring-2 focus-within:ring-primary rounded-md">
      <Input
        type="text"
        placeholder="Search shaders"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 rounded-r-none border-r-0 focus-visible:ring-0 cu-shadow"
      />
      <Button type="submit" variant="outline" size="icon" className="cu-shadow rounded-l-none border-l-0 focus-visible:ring-2 focus-visible:ring-primary">
        <Search />
      </Button>
    </form>
  )
}

