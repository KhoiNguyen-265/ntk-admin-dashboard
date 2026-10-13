import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { SearchInput } from '@/components/common/SearchInput'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { CategoryModal } from '@/components/categories/CategoryModal'
import { useCategoryStore } from '@/store/useCategoryStore'
import { useProductStore } from '@/store/useProductStore'
import { useToastStore } from '@/store/useToastStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import type { Category, CategoryFormData, CategoryStatus } from '@/types/category'
import { formatDate } from '@/lib/utils'
import { Plus, Edit2, Trash2, Layers, Package, CheckCircle2 } from 'lucide-react'

export function CategoriesPage() {
  const {
    categories,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    addCategory,
    updateCategory,
    deleteCategory,
    getFilteredCategories,
  } = useCategoryStore()

  const { products } = useProductStore()
  const { success, error } = useToastStore()
  const { t } = useLanguageStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)

  const filteredCategories = getFilteredCategories()

  // Calculate live product count for each category based on products store
  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length
  }

  const handleOpenAdd = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data)
      success('Category updated', `Successfully updated "${data.name}"`)
    } else {
      addCategory(data)
      success('Category created', `Added "${data.name}" category`)
    }
  }

  const handleConfirmDelete = () => {
    if (!deletingCategoryId) return
    const cat = categories.find((c) => c.id === deletingCategoryId)
    const count = getProductCount(deletingCategoryId)

    if (count > 0) {
      error(
        'Cannot delete category',
        `${t.categories.deleteErrorWithProducts} (${count} items)`
      )
      setDeletingCategoryId(null)
      return
    }

    deleteCategory(deletingCategoryId)
    setDeletingCategoryId(null)
    success('Category deleted', `Removed ${cat?.name || 'category'}`)
  }

  // Summary Metrics
  const totalCategories = categories.length
  const activeCount = categories.filter((c) => c.status === 'active').length
  const totalProductsMapped = products.length

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.categories.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.categories.subtitle}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {t.categories.addCategory}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.categories.totalCategories}</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{totalCategories}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.categories.activeCategories}</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeCount}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.categories.productsCategorized}</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {totalProductsMapped}
            </h3>
          </div>
        </Card>
      </div>

      {/* Controls Bar */}
      <Card noPadding className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search category name or description..."
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-400">{t.common.status}:</span>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as CategoryStatus | 'all')
                }
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer font-medium"
              >
                <option value="all">{t.common.all} ({totalCategories})</option>
                <option value="active">{t.common.active} ({activeCount})</option>
                <option value="inactive">{t.common.inactive} ({totalCategories - activeCount})</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Categories Table Card */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-5 sm:px-6">{t.categories.categoryName}</th>
                <th className="py-3 px-4">{t.categories.slug}</th>
                <th className="py-3 px-4">{t.categories.description}</th>
                <th className="py-3 px-4">{t.nav.products}</th>
                <th className="py-3 px-4">{t.common.status}</th>
                <th className="py-3 px-4">{t.common.date}</th>
                <th className="py-3 px-5 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  const productCount = getProductCount(cat.id)
                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {cat.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                        /{cat.slug}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {cat.description || '—'}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">
                          {productCount} {t.common.items}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {cat.status === 'active' ? (
                          <Badge variant="emerald" dot>
                            {t.common.active}
                          </Badge>
                        ) : (
                          <Badge variant="slate">{t.common.inactive}</Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(cat.createdAt)}
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingCategoryId(cat.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        category={editingCategory}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingCategoryId}
        onClose={() => setDeletingCategoryId(null)}
        onConfirm={handleConfirmDelete}
        title={t.categories.deleteTitle}
        message={t.categories.deleteConfirm}
      />
    </div>
  )
}
