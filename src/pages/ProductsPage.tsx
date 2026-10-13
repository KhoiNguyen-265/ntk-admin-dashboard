import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ProductModal } from '@/components/products/ProductModal'
import { useProductStore } from '@/store/useProductStore'
import { useCategoryStore } from '@/store/useCategoryStore'
import { useToastStore } from '@/store/useToastStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import type { Product, ProductFormData, ProductStatus } from '@/types/product'
import { formatCurrency, formatNumber, exportToCSV } from '@/lib/utils'
import {
  Plus,
  ArrowUpDown,
  Download,
  Edit2,
  Trash2,
  Filter,
  RotateCcw,
} from 'lucide-react'

export function ProductsPage() {
  const {
    filters,
    setFilter,
    resetFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    addProduct,
    updateProduct,
    deleteProduct,
    getFilteredProducts,
  } = useProductStore()

  const { categories } = useCategoryStore()
  const { success, info } = useToastStore()
  const { t } = useLanguageStore()

  // Modal & Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

  const allFilteredProducts = getFilteredProducts()
  const totalProducts = allFilteredProducts.length

  // Paginated slice
  const startIndex = (currentPage - 1) * pageSize
  const currentProducts = allFilteredProducts.slice(startIndex, startIndex + pageSize)

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: ProductFormData, categoryName: string) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data, categoryName)
      success('Product updated', `Successfully updated "${data.name}"`)
    } else {
      addProduct(data, categoryName)
      success('Product created', `Added "${data.name}" to inventory`)
    }
  }

  const handleConfirmDelete = () => {
    if (!deletingProductId) return
    const prod = allFilteredProducts.find((p) => p.id === deletingProductId)
    deleteProduct(deletingProductId)
    setDeletingProductId(null)
    success('Product deleted', `Removed ${prod?.name || 'product'} from catalog`)
  }

  const handleExportCSV = () => {
    const exportData = allFilteredProducts.map((p) => ({
      ID: p.id,
      Name: p.name,
      SKU: p.sku,
      Category: p.categoryName,
      Price: p.price,
      Stock: p.stock,
      Status: p.status,
      Sales: p.salesCount,
      Rating: p.rating,
    }))
    exportToCSV('products-catalog', exportData)
    info('Exported products catalog to CSV')
  }

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case 'in_stock':
        return <Badge variant="emerald" dot>{t.products.inStock}</Badge>
      case 'low_stock':
        return <Badge variant="amber" dot>{t.products.lowStock}</Badge>
      case 'out_of_stock':
        return <Badge variant="rose" dot>{t.products.outOfStock}</Badge>
      case 'draft':
        return <Badge variant="slate">{t.products.draft}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.products.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.products.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {t.common.export}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {t.products.addProduct}
          </Button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <Card noPadding className="p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="w-full lg:w-72">
            <SearchInput
              value={filters.search}
              onChange={(val) => setFilter('search', val)}
              placeholder="Search product name, SKU..."
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.categoryId}
                onChange={(e) => setFilter('categoryId', e.target.value)}
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">{t.products.allCategories}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilter('status', e.target.value as ProductStatus | 'all')
                }
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">{t.products.allStatuses}</option>
                <option value="in_stock">{t.products.inStock}</option>
                <option value="low_stock">{t.products.lowStock}</option>
                <option value="out_of_stock">{t.products.outOfStock}</option>
                <option value="draft">{t.products.draft}</option>
              </select>
            </div>

            {/* Sort Field */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilter(
                    'sortBy',
                    e.target.value as 'price' | 'stock' | 'salesCount' | 'name' | 'createdAt'
                  )
                }
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="createdAt">{t.products.sortByDate}</option>
                <option value="price">{t.products.sortByPrice}</option>
                <option value="stock">{t.products.sortByStock}</option>
                <option value="salesCount">{t.products.sortBySales}</option>
                <option value="name">{t.products.sortByName}</option>
              </select>
            </div>

            {/* Sort Direction Toggle */}
            <button
              onClick={() =>
                setFilter('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc')
              }
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-xs font-semibold"
              title={`Sort direction: ${filters.sortDirection.toUpperCase()}`}
            >
              {filters.sortDirection.toUpperCase()}
            </button>

            {/* Reset Filters */}
            {(filters.search ||
              filters.categoryId !== 'all' ||
              filters.status !== 'all' ||
              filters.sortBy !== 'createdAt') && (
              <button
                onClick={resetFilters}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs inline-flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.common.reset}</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Products Table Card */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-5 sm:px-6">{t.products.productName}</th>
                <th className="py-3 px-4">{t.products.category}</th>
                <th className="py-3 px-4">{t.products.price}</th>
                <th className="py-3 px-4">{t.products.stock}</th>
                <th className="py-3 px-4">{t.common.status}</th>
                <th className="py-3 px-4">{t.products.sales}</th>
                <th className="py-3 px-5 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Product Name & Thumbnail */}
                    <td className="py-3.5 px-5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                        {product.categoryName}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-xs ${
                            product.stock === 0
                              ? 'text-rose-500'
                              : product.stock <= 10
                              ? 'text-amber-500'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {product.stock} {t.common.units}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>

                    {/* Sales */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatNumber(product.salesCount)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(product.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    {t.products.noProductsFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalItems={totalProducts}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        product={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        onConfirm={handleConfirmDelete}
        title={t.products.deleteTitle}
        message={t.products.deleteConfirm}
      />
    </div>
  )
}
