import { useMemo } from 'react'

interface UsePaginationProps {
  totalItems: number
  currentPage: number
  pageSize: number
}

interface UsePaginationResult {
  totalPages: number
  startIndex: number
  endIndex: number
  hasNextPage: boolean
  hasPrevPage: boolean
  pageNumbers: (number | 'ellipsis')[]
}

export function usePagination({
  totalItems,
  currentPage,
  pageSize,
}: UsePaginationProps): UsePaginationResult {
  return useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

    const startIndex = (validCurrentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalItems)

    const hasNextPage = validCurrentPage < totalPages
    const hasPrevPage = validCurrentPage > 1

    // Build page numbers array with ellipsis
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (validCurrentPage > 3) {
        pages.push('ellipsis')
      }

      const start = Math.max(2, validCurrentPage - 1)
      const end = Math.min(totalPages - 1, validCurrentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (validCurrentPage < totalPages - 2) {
        pages.push('ellipsis')
      }
      pages.push(totalPages)
    }

    return {
      totalPages,
      startIndex,
      endIndex,
      hasNextPage,
      hasPrevPage,
      pageNumbers: pages,
    }
  }, [totalItems, currentPage, pageSize])
}
